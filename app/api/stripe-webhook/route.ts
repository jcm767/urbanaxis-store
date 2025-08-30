// app/api/stripe-webhook/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// IMPORTANT: Stripe needs the RAW body
async function readRawBody(req: Request) {
  const buf = await req.text();
  return buf;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20' as any,
});

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature');
  const secret = process.env.STRIPE_WEBHOOK_SECRET!;
  let event: Stripe.Event;

  try {
    const rawBody = await readRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig!, secret);
  } catch (err: any) {
    console.error('Webhook signature verify failed', err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const amount = session.amount_total ?? 0;
        const payment_intent = String(session.payment_intent ?? '');
        const user_uuid = session.metadata?.user_uuid ?? null;

        // Upsert paid order in DB
        await supabaseAdmin.rpc('stripe_upsert_paid', {
          session_id: session.id,
          payment_intent,
          amount,
          user_uuid,
        });
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        const amount_refunded = charge.amount_refunded ?? 0;
        const payment_intent = String(charge.payment_intent ?? '');

        // Find session_id from payment_intent, then mark refunded
        const list = await stripe.checkout.sessions.list({ payment_intent, limit: 1 });
        const session_id = list.data?.[0]?.id;
        if (session_id) {
          await supabaseAdmin.rpc('stripe_mark_refunded', {
            session_id,
            amount: amount_refunded,
          });
        }
        break;
      }

      default:
        // ignore other events for now
        break;
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    console.error('Webhook handler error', err);
    return NextResponse.json({ error: err.message ?? 'Error' }, { status: 500 });
  }
}
