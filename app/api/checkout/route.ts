import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { products } from '@/lib/products';

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

  let body: { slug: string; quantity?: number; color?: string; size?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { slug, quantity = 1, color, size } = body;
  const product = products.find((p: any) => p.slug === slug);

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
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
            name: product.name,
            metadata: {
              color: color ?? '',
              size: size ?? '',
              slug,
            },
          },
          // product.price is in dollars—convert to cents
          unit_amount: Math.round(product.price * 100),
        },
        quantity,
      },
    ],
    metadata: {
      color: color ?? '',
      size: size ?? '',
      slug,
    },
  });

  return NextResponse.json({ url: session.url });
}
