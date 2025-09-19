// app/checkout/page.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { products } from '@/lib/products';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage() {
  const params = useSearchParams();
  const slug = params.get('slug') || '';
  const size = params.get('size') || '';
  const color = params.get('color') || '';
  const qty = Number(params.get('qty') || 1);

  const product = products.find(p => p.slug === slug);
  const variant = product?.variants.find(v => v.size === size && v.color === color);
  const unit = variant?.price ?? product?.defaultPrice ?? 0;
  const total = unit * qty;

  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    if (!slug || !size || !color) return;
    (async () => {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ slug, size, color, qty }),
      });
      const data = await res.json();
      setClientSecret(data.clientSecret);
    })();
  }, [slug, size, color, qty]);

  const options = useMemo(() => ({
    clientSecret: clientSecret || undefined,
    appearance: { theme: 'night' as const },
  }), [clientSecret]);

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: 24 }}>
      <h1>Checkout</h1>
      {product && (
        <p style={{ marginBottom: 16 }}>
          {product.name} — {size} / {color} × {qty} <br />
          Total: ${(total / 100).toFixed(2)}
        </p>
      )}

      {clientSecret && (
        <Elements stripe={stripePromise} options={options}>
          <PayForm />
        </Elements>
      )}
    </main>
  );
}

function PayForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setMsg(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/success',
      },
      redirect: 'if_required', // stays on page if not needed
    });

    if (error) setMsg(error.message || 'Payment failed');
    else if (paymentIntent && paymentIntent.status === 'succeeded') router.push('/success');
    else setMsg('Payment processing…');

    setLoading(false);
  };

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 16 }}>
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || loading}
        style={{ padding: '10px 16px', border: '1px solid #fff', borderRadius: 6 }}
      >
        {loading ? 'Processing…' : 'Pay now'}
      </button>
      {msg && <p>{msg}</p>}
    </form>
  );
}
