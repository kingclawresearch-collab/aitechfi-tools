import { NextRequest } from "next/server";
import { Redis } from "@upstash/redis";

const WINDOW_SECONDS = 24 * 60 * 60; // 24 hours
const MAX_REQUESTS = 3;

let redis: Redis | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

const memoryMap = new Map<string, { count: number; resetAt: number }>();

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

async function checkWithRedis(ip: string): Promise<{ allowed: boolean; remaining: number }> {
  const key = `rate:${ip}`;
  const count = await redis!.incr(key);

  if (count === 1) {
    await redis!.expire(key, WINDOW_SECONDS);
  }

  if (count > MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: MAX_REQUESTS - count };
}

function checkWithMemory(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = memoryMap.get(ip);

  if (!entry || now > entry.resetAt) {
    memoryMap.set(ip, { count: 1, resetAt: now + WINDOW_SECONDS * 1000 });
    return { allowed: true, remaining: MAX_REQUESTS - 1 };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: MAX_REQUESTS - entry.count };
}

export async function checkRateLimit(
  req: NextRequest
): Promise<{ allowed: boolean; remaining: number }> {
  const ip = getIp(req);

  if (redis) {
    try {
      return await checkWithRedis(ip);
    } catch {
      return checkWithMemory(ip);
    }
  }

  return checkWithMemory(ip);
}

if (typeof globalThis !== "undefined" && !redis) {
  setInterval(() => {
    const now = Date.now();
    for (const [key, val] of memoryMap) {
      if (now > val.resetAt) memoryMap.delete(key);
    }
  }, 60 * 60 * 1000);
}
