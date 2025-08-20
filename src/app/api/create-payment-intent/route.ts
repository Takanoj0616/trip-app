import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'jpy' } = await request.json();

    // コーディネーター機能の料金: 100,000円
    const coordinatorAmount = 10000000; // Stripeは最小単位（円の場合は1円単位）

    const paymentIntent = await stripe.paymentIntents.create({
      amount: coordinatorAmount,
      currency: 'jpy',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        service: 'coordinator',
        description: 'Travel Coordinator Premium Service',
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      amount: coordinatorAmount,
    });
  } catch (error) {
    console.error('Payment Intent creation failed:', error);
    return NextResponse.json(
      { error: 'Payment Intent creation failed' },
      { status: 500 }
    );
  }
}