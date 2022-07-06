import { Redis } from "@upstash/redis";
import { NextApiRequest, NextApiResponse } from "next";
import { MAX_CLAP } from "./claps";

export default function handler() {
  const redis = Redis.fromEnv();

  return async function (req: NextApiRequest, res: NextApiResponse) {
    const method = req.method;
    const { id } = req.query;

    try {
      if (method === "GET") {
        const count = await redis.get(`post:${id}`);
        return res.status(200).json({ count: count || 0 });
      }

      if (method === "PATCH") {
        const initialCount = Number(req.body.count) || 0;

        const count = await redis.incrby(
          `post:${id}`,
          initialCount > MAX_CLAP ? MAX_CLAP : initialCount
        );
        return res.status(200).json({ count });
      }

      return res.status(405).json({ message: "Method not allowed" });
    } catch (err) {
      let message = err;

      if (err instanceof TypeError) {
        message = err.message;
      }

      return res.status(500).json({ message });
    }
  };
}
