import { NextRequest } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';

const limiter = rateLimit({ interval: 60 * 1000, uniqueTokenPerInterval: 20 });

export async function POST(req: NextRequest) {
  const rateLimitResult = limiter.check(req);
  if (rateLimitResult) return rateLimitResult;

  try {
    const { text } = await req.json();
    // Placeholder translation: echo back text to keep UI stable
    // You can integrate a real translation API here later.
    return Response.json({ translatedText: text }, { status: 200 });
  } catch (e) {
    return Response.json({ translatedText: null, error: 'invalid_request' }, { status: 400 });
  }
}

