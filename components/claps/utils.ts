import { NextApiRequest } from "next";
import { Redis } from "@upstash/redis";
import { createHash } from "crypto";

const redis = Redis.fromEnv();

export const MAX_CLAPS = 30;

export function generateHash(ip: string) {
  return createHash("sha256").update(ip).digest("base64");
}

export function generateKey(req: NextApiRequest, key: string) {
  if (key) {
    return `CLAP:${key}`;
  }

  const referer = new URL(req.headers.referer as string);
  const url = referer.origin + referer.pathname;

  return `CLAP:${url}`;
}

export function getIP(req: Request | NextApiRequest) {
  const xff =
    req instanceof Request
      ? req.headers.get("x-forwarded-for")
      : req.headers["x-forwarded-for"];

  return xff ? (Array.isArray(xff) ? xff[0] : xff.split(",")[0]) : "127.0.0.1";
}

export async function getData(
  key: string,
  ip: string
): Promise<{
  totalScore: number;
  userScore: number;
  totalUsers: number;
}> {
  return new Promise(async (resolve) => {
    let totalScore = 0,
      userScore = 0;

    const sortedList: Array<string | number> = await redis.zrange(key, 0, -1, {
      withScores: true,
    });

    for (let i = 0; i < sortedList.length; i += 2) {
      const [key, value] = [sortedList[i], Number(sortedList[i + 1])];
      if (key === ip) userScore = value;
      totalScore = totalScore + value;
    }

    resolve({
      totalScore,
      userScore,
      totalUsers: sortedList.length / 2,
    });
  });
}
