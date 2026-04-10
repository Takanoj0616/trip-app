import { NextResponse } from 'next/server';

interface RateLimitConfig {
  interval: number; // ミリ秒単位のウィンドウ期間
  uniqueTokenPerInterval: number; // ウィンドウあたりの最大リクエスト数
}

interface TokenBucket {
  tokens: number;
  lastRefill: number;
}

const buckets = new Map<string, TokenBucket>();

// 古いエントリのクリーンアップ（5分ごと）
let lastCleanup = Date.now();
const CLEANUP_INTERVAL = 5 * 60 * 1000;

function cleanup(interval: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, bucket] of buckets) {
    if (now - bucket.lastRefill > interval * 2) {
      buckets.delete(key);
    }
  }
}

export function rateLimit(config: RateLimitConfig) {
  const { interval, uniqueTokenPerInterval } = config;

  return {
    check(request: Request): NextResponse | null {
      const forwarded = request.headers.get('x-forwarded-for');
      const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
      const key = `${ip}`;

      cleanup(interval);

      const now = Date.now();
      const bucket = buckets.get(key);

      if (!bucket) {
        buckets.set(key, { tokens: uniqueTokenPerInterval - 1, lastRefill: now });
        return null;
      }

      // トークンを補充
      const elapsed = now - bucket.lastRefill;
      const refillRate = uniqueTokenPerInterval / interval;
      const newTokens = Math.min(
        uniqueTokenPerInterval,
        bucket.tokens + elapsed * refillRate
      );

      bucket.lastRefill = now;
      bucket.tokens = newTokens;

      if (bucket.tokens < 1) {
        return NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          {
            status: 429,
            headers: {
              'Retry-After': String(Math.ceil(interval / 1000)),
              'X-RateLimit-Limit': String(uniqueTokenPerInterval),
            },
          }
        );
      }

      bucket.tokens -= 1;
      return null;
    },
  };
}
