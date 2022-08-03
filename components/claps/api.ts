import { Redis } from "@upstash/redis";
import { NextApiRequest, NextApiResponse } from "next";
import { getData, generateKey, getIP, generateHash, MAX_CLAPS } from "./utils";

type OptionProps = { maxClaps?: number };

export default function createClapsAPI({ maxClaps = MAX_CLAPS }: OptionProps) {
  const redis = Redis.fromEnv();

  return async function (req: NextApiRequest, res: NextApiResponse) {
    const method = req.method;
    const { score, key } = req.body;

    const RAW_IP = getIP(req);
    const KEY = generateKey(req, key);
    const HASH_IP = generateHash(RAW_IP);

    try {
      if (method === "GET") {
        const data = await getData(KEY, HASH_IP);
        return res.status(200).json({ ...data, maxClaps });
      }

      if (method === "PATCH") {
        let addScore = Number(score) || 0;

        const { userScore } = await getData(KEY, HASH_IP);

        if (userScore >= maxClaps) {
          throw new Error("You have reached the maximum clap limit");
        }

        // if the total value is higher than the max value, we need to remove some claps
        if (userScore + addScore > maxClaps) {
          addScore = addScore - (userScore + addScore - maxClaps);
        }

        await redis.zincrby(KEY, addScore, HASH_IP);

        const data = await getData(KEY, HASH_IP);
        return res.status(200).json({ ...data, maxClaps });
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
