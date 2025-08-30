// Force Node.js runtime for Stripe SDK
export const runtime = 'nodejs';

import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';

export async function POST(req: Request) {
  const stripe = getStripe();
  const sig = (await headers()).get('stripe-signature');
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !secret) {
    return NextResponse.json({ ok: false, error: 'Missing webhook secret/signature' }, { status: 400 });
  }

  const body = await req.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: `Webhook signature verification failed: ${err.message}` }, { status: 400 });
  }

  // Minimal handler to avoid build issues; expand later to upsert in Supabase
  switch (event.type) {
    case 'checkout.session.completed':
      // TODO: upsert order as paid in Supabase
      break;
    case 'charge.refunded':
      // TODO: mark order refunded
      break;
    default:
      break;
  }

  return NextResponse.json({ received: true });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
