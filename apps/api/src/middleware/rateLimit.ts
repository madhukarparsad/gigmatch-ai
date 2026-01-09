import { Request, Response, NextFunction } from "express";
import { redis } from "@gigmatch/utils/src/redis";

const WINDOW_SEC = 60;
const MAX_REQUESTS = 100;

export async function rateLimit(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = (req as any).user?.userId || "anon";
  const ip = req.ip;

  const key = `rate:${userId}:${ip}`;

  const current = await redis.incr(key);

  if (current === 1) {
    await redis.expire(key, WINDOW_SEC);
  }

  if (current > MAX_REQUESTS) {
    return res.status(429).json({
      message: "Too many requests. Slow down."
    });
  }

  next();
}
