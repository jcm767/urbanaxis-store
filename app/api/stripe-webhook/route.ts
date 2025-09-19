import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!stripeKey || !siteUrl) {
    return NextResponse.json(
      { error: 'Stripe or site URL not configured' },
      { status: 500 }
    );
  }

  const stripe = new Stripe(stripeKey, { apiVersion: '2024-06-20' });

  let body: {
    name: string;
    price: number; // USD dollars
    quantity?: number;
    color?: string;
    size?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { name, price, quantity = 1, color, size } = body;
  if (!name || !Number.isFinite(price) || price <= 0) {
    return NextResponse.json({ error: 'Invalid product/price' }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    success_url: `${siteUrl}/success`,
    cancel_url: `${siteUrl}`,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name,
            metadata: {
              color: color ?? '',
              size: size ?? '',
            },
          },
          unit_amount: Math.round(price * 100),
        },
        quantity,
      },
    ],
    metadata: {
      color: color ?? '',
      size: size ?? '',
      product_name: name,
    },
  });

  return NextResponse.json({ url: session.url });
}
