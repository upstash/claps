import { Redis } from "@upstash/redis";
import { NextApiRequest, NextApiResponse } from "next";
import { MAX_CLAP_AT_ONE_TIME, MAX_POSSIBLE_CLAP } from "./claps";

export default function handler() {
  const redis = Redis.fromEnv();

  return async function (req: NextApiRequest, res: NextApiResponse) {
    const method = req.method;
    const { score, url } = req.body;
    const IP = getIP(req);
    const KEY = getKey(req, url);

    try {
      if (method === "GET") {
        const score = await redis.zscore(KEY, IP);
        return res.status(200).json({ score: score || 0 });
      }

      if (method === "PATCH") {
        const currentScore = await redis.zscore(KEY, IP);

        if (currentScore && currentScore >= MAX_POSSIBLE_CLAP) {
          throw new Error("You have reached the maximum clap limit");
        }

        const addScore = Number(score) || 0;

        if (addScore > MAX_CLAP_AT_ONE_TIME) {
          throw new Error("You can clap at most once per minute");
        }

        const finalScore = await redis.zincrby(KEY, addScore, IP);
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
