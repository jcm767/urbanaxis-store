// app/api/checkout/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20' as any,
});

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const quantity = Math.max(1, Number(body?.quantity || 1));
    const user_uuid = typeof body?.user_uuid === 'string' ? body.user_uuid : '';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!, // set in Vercel env
          quantity,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: process.env.NEXT_PUBLIC_SITE_URL!,
      metadata: { user_uuid },
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err: any) {
    console.error('checkout error', err);
    return NextResponse.json({ error: err.message ?? 'Error' }, { status: 500 });
  }
}
