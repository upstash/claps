import { Redis } from "@upstash/redis";
import { NextApiRequest, NextApiResponse } from "next";
import { MAX_CLAP } from "./claps";
import { createHash } from "crypto";

export default function handler() {
  const redis = Redis.fromEnv();

  return async function (req: NextApiRequest, res: NextApiResponse) {
    const method = req.method;
    const { score, key } = req.body;

    const RAW_IP = getIP(req);
    const KEY = generateKey(req, key);

    const HASH_IP = createHash("sha256").update(RAW_IP).digest("base64");

    async function getData() {
      let totalScore = 0,
        userScore = 0;

      const sortedList: Array<string | number> = await redis.zrange(
        KEY,
        0,
        -1,
        { withScores: true }
      );

      for (let i = 0; i < sortedList.length; i += 2) {
        const [key, value] = [sortedList[i], Number(sortedList[i + 1])];

        if (key === HASH_IP) userScore = value;

        totalScore = totalScore + value;
      }

      return { totalScore, userScore, totalUsers: sortedList.length / 2 };
    }

    try {
      if (method === "GET") {
        const data = await getData();
        return res.status(200).json(data);
      }

      if (method === "PATCH") {
        let addScore = Number(score) || 0;

        const { userScore } = await getData();

        if (userScore >= MAX_CLAP) {
          throw new Error("You have reached the maximum clap limit");
        }

        // if the total value is higher than the max value, we need to remove some claps
        if (userScore + addScore > MAX_CLAP) {
          addScore = addScore - (userScore + addScore - MAX_CLAP);
        }

        await redis.zincrby(KEY, addScore, HASH_IP);

        const data = await getData();
        return res.status(200).json(data);
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

function generateKey(req: NextApiRequest, key: string) {
  if (key) {
    return `CLAP:${key}`;
  }

  const referer = new URL(req.headers.referer as string);
  const url = referer.origin + referer.pathname;

  return `CLAP:${url}`;
}

function getIP(request: Request | NextApiRequest) {
  const xff =
    request instanceof Request
      ? request.headers.get("x-forwarded-for")
      : request.headers["x-forwarded-for"];

  return xff ? (Array.isArray(xff) ? xff[0] : xff.split(",")[0]) : "127.0.0.1";
}
