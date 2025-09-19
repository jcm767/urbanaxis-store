import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function readRawBody(req: Request) {
  return await req.text();
}

export async function POST(req: Request) {
  // Graceful no-op if not configured
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!secret || !stripeKey) {
    return NextResponse.json({ ok: true, note: 'Webhook not configured' });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: '2024-06-20' });

  let event: Stripe.Event;
  try {
    const sig = req.headers.get('stripe-signature')!;
    const rawBody = await readRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch (err: any) {
    console.error('Webhook signature error', err?.message);
    return new NextResponse('Bad signature', { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const s = event.data.object as Stripe.Checkout.Session;
        console.log('Payment complete:', {
          id: s.id,
          amount_total: s.amount_total,
          metadata: s.metadata
        });
        break;
      }
      default:
        break;
    }
  } catch (e) {
    console.error('Webhook handler error', e);
    return new NextResponse('Webhook error', { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
