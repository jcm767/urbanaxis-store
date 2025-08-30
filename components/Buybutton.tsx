// components/BuyButton.tsx
'use client';
import { useState } from 'react';

export default function BuyButton() {
  const [loading, setLoading] = useState(false);

  async function goCheckout() {
    try {
      setLoading(true);
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: 1 }),
      });
      const data = await res.json();
      if (data?.url) window.location.href = data.url;
      else alert('Checkout error');
    } catch (e: any) {
      alert(e?.message ?? 'Error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={goCheckout} disabled={loading} style={{ padding: 12 }}>
      {loading ? 'Loading…' : 'Buy Now'}
    </button>
  );
}
