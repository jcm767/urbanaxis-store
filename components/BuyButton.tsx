'use client';
import { useState } from 'react';

export default function BuyButton() {
  const [loading, setLoading] = useState(false);

  async function goCheckout() {
    try {
      setLoading(true);
      const res = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' } });
      const data = await res.json();
      if (data?.url) window.location.href = data.url;
      else alert('Checkout error');
    } catch (e: any) {
      alert(e?.message ?? 'Checkout failed');
    } finally {
      setLoading(false);
    }
  }

  return <button onClick={goCheckout} disabled={loading}>{loading ? 'Loading…' : 'Buy Now'}</button>;
}
