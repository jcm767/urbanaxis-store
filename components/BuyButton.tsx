'use client';

import { useState } from 'react';

type BuyButtonProps = {
  name: string;
  price: number;            // in USD (e.g., 19.99)
  color?: string | null;
  size?: string | null;
  quantity?: number;        // defaults to 1
  label?: string;           // button text
};

export default function BuyButton(props: BuyButtonProps) {
  const {
    name,
    price,
    color = undefined,
    size = undefined,
    quantity = 1,
    label = 'Buy Now',
  } = props;

  const [loading, setLoading] = useState(false);
  const disabled = loading || !name || !Number.isFinite(price);

  async function onClick() {
    try {
      setLoading(true);
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          price,
          quantity,
          color: color ?? undefined,
          size: size ?? undefined,
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Checkout failed (${res.status}) ${text}`);
      }

      const data: { url?: string } = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Stripe session URL missing.');
      }
    } catch (err: any) {
      console.error(err);
      alert(err?.message ?? 'Checkout error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '12px 16px',
        borderRadius: 8,
        border: '1px solid #111',
        background: disabled ? '#ddd' : '#111',
        color: '#fff',
        cursor: disabled ? 'not-allowed' : 'pointer',
        width: '100%',
      }}
      aria-busy={loading}
    >
      {loading ? 'Processing…' : label}
    </button>
  );
}
