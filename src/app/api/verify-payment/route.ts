import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { rateLimit } from '@/lib/rate-limit';
import { verifyAuth, isAuthError } from '@/lib/api-auth';

const limiter = rateLimit({ interval: 60 * 1000, uniqueTokenPerInterval: 5 });

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  try {
    return new Stripe(key, { apiVersion: '2024-06-20' });
  } catch {
    return new Stripe(key) as Stripe;
  }
}

export async function POST(request: NextRequest) {
  const rateLimitResult = limiter.check(request);
  if (rateLimitResult) return rateLimitResult;

  const authResult = await verifyAuth(request);
  if (isAuthError(authResult)) return authResult;

  try {
    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe is not configured' },
        { status: 500 }
      );
    }
    const { paymentIntentId } = await request.json();

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment Intent ID is required' },
        { status: 400 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return NextResponse.json({
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      metadata: paymentIntent.metadata,
    });
  } catch (error) {
    console.error('Payment verification failed:', error);
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}
