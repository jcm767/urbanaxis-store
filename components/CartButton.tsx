// components/CartButton.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CartButton() {
  const [count, setCount] = useState(0);

  function recalc() {
    try {
      const raw = localStorage.getItem('cart');
      const arr = raw ? JSON.parse(raw) : [];
      const total = Array.isArray(arr) ? arr.reduce((s: number, it: any) => s + (it?.qty ?? 0), 0) : 0;
      setCount(total);
    } catch {
      setCount(0);
    }
  }

  useEffect(() => {
    recalc();
    const onChange = () => recalc();
    window.addEventListener('cart:update', onChange);
    return () => window.removeEventListener('cart:update', onChange);
  }, []);

  return (
    <Link
      href="/cart"
      aria-label="Cart"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        textDecoration: 'none',
        color: '#111',
        border: '1px solid #eee',
        borderRadius: 10,
        padding: '6px 10px',
      }}
    >
      <span>🛒</span>
      <span style={{ fontSize: 14 }}>{count}</span>
    </Link>
  );
}
