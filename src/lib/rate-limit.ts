import { NextRequest } from "next/server";
import { Redis } from "@upstash/redis";

const WINDOW_SECONDS = 24 * 60 * 60;
const MAX_REQUESTS_PER_IP = 3;
const GLOBAL_DAILY_LIMIT = 10_000;

const VIP_KEYS = new Set(
  (process.env.VIP_API_KEYS ?? "").split(",").filter(Boolean)
);

function isVip(req: NextRequest): boolean {
  const key =
    req.headers.get("x-api-key") ??
    req.nextUrl.searchParams.get("api_key");
  return !!key && VIP_KEYS.has(key);
}

let redis: Redis | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

const memoryMap = new Map<string, { count: number; resetAt: number }>();
let globalMemory = { count: 0, resetAt: Date.now() + WINDOW_SECONDS * 1000 };

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

function todayKey(): string {
  const d = new Date();
  return `global:${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;
}

async function checkGlobalWithRedis(): Promise<boolean> {
  const key = todayKey();
  const count = await redis!.incr(key);
  if (count === 1) {
    await redis!.expire(key, WINDOW_SECONDS);
  }
  return count <= GLOBAL_DAILY_LIMIT;
}

function checkGlobalMemory(): boolean {
  const now = Date.now();
  if (now > globalMemory.resetAt) {
    globalMemory = { count: 1, resetAt: now + WINDOW_SECONDS * 1000 };
    return true;
  }
  globalMemory.count++;
  return globalMemory.count <= GLOBAL_DAILY_LIMIT;
}

async function checkIpWithRedis(ip: string): Promise<{ allowed: boolean; remaining: number }> {
  const key = `rate:${ip}`;
  const count = await redis!.incr(key);
  if (count === 1) {
    await redis!.expire(key, WINDOW_SECONDS);
  }
  if (count > MAX_REQUESTS_PER_IP) {
    return { allowed: false, remaining: 0 };
  }
  return { allowed: true, remaining: MAX_REQUESTS_PER_IP - count };
}

function checkIpMemory(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = memoryMap.get(ip);

  if (!entry || now > entry.resetAt) {
    memoryMap.set(ip, { count: 1, resetAt: now + WINDOW_SECONDS * 1000 });
    return { allowed: true, remaining: MAX_REQUESTS_PER_IP - 1 };
  }

  if (entry.count >= MAX_REQUESTS_PER_IP) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: MAX_REQUESTS_PER_IP - entry.count };
}

export async function checkRateLimit(
  req: NextRequest
): Promise<{ allowed: boolean; remaining: number }> {
  if (isVip(req)) {
    return { allowed: true, remaining: 999 };
  }

  const ip = getIp(req);

  if (redis) {
    try {
      const globalOk = await checkGlobalWithRedis();
      if (!globalOk) {
        return { allowed: false, remaining: 0 };
      }
      return await checkIpWithRedis(ip);
    } catch {
      const globalOk = checkGlobalMemory();
      if (!globalOk) return { allowed: false, remaining: 0 };
      return checkIpMemory(ip);
    }
  }

  const globalOk = checkGlobalMemory();
  if (!globalOk) return { allowed: false, remaining: 0 };
  return checkIpMemory(ip);
}

if (typeof globalThis !== "undefined" && !redis) {
  setInterval(() => {
    const now = Date.now();
    for (const [key, val] of memoryMap) {
      if (now > val.resetAt) memoryMap.delete(key);
    }
  }, 60 * 60 * 1000);
}
