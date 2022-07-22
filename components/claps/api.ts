import { Redis } from "@upstash/redis";
import { NextApiRequest, NextApiResponse } from "next";
import { MAX_CLAP_AT_ONE_TIME, MAX_POSSIBLE_CLAP } from "./claps";
import { createHash } from "crypto";

export default function handler() {
  const redis = Redis.fromEnv();

  return async function (req: NextApiRequest, res: NextApiResponse) {
    const method = req.method;
    const { score, url } = req.body;
    const RAW_IP = getIP(req);
    const KEY = getKey(req, url);

    const HASH_IP = createHash("sha256").update(RAW_IP).digest("base64");

    try {
      if (method === "GET") {
        const score = await redis.zscore(KEY, HASH_IP);
        return res.status(200).json({ score: score || 0 });
      }

      if (method === "PATCH") {
        let currentScore = await redis.zscore(KEY, HASH_IP);

        if (currentScore === null) {
          currentScore = 0;
        }

        if (currentScore && currentScore >= MAX_POSSIBLE_CLAP) {
          throw new Error("You have reached the maximum clap limit");
        }

        let addScore = Number(score) || 0;

        if (addScore > MAX_CLAP_AT_ONE_TIME) {
          throw new Error(
            "You can clap up to " + MAX_CLAP_AT_ONE_TIME + " times at once"
          );
        }

        // if the total value is higher than the max value, we need to remove some claps
        if (currentScore + addScore > MAX_POSSIBLE_CLAP) {
          addScore = addScore - (currentScore + addScore - MAX_POSSIBLE_CLAP);
        }

        const finalScore = await redis.zincrby(KEY, addScore, HASH_IP);
        return res.status(200).json({ score: finalScore });
      }

      return res.status(405).json({ message: "Method not allowed" });
    } catch (err) {
      let message = err;

      if (err instanceof Error) {
        message = err.message;
      }

      return res.status(500).json({ message });
    }
  };
}

function getKey(req: NextApiRequest, url: string) {
  const clientUrl = new URL(req.headers.referer!);
  const clientClearUrl = clientUrl.origin + clientUrl.pathname;

  return `CLAP:${url || clientClearUrl}`;
}

function getIP(request: Request | NextApiRequest) {
  const xff =
    request instanceof Request
      ? request.headers.get("x-forwarded-for")
      : request.headers["x-forwarded-for"];

  return xff ? (Array.isArray(xff) ? xff[0] : xff.split(",")[0]) : "127.0.0.1";
}
