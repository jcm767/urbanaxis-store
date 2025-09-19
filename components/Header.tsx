// components/Header.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import SearchBar from '@/components/SearchBar';
import CartButton from '@/components/CartButton';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header style={{ position:'sticky', top:0, zIndex:50, background: scrolled?'#fff':'#fafafa', borderBottom:'1px solid #eee' }}>
      <div style={{ display:'flex', alignItems:'center', padding:'10px 16px', maxWidth:1200, margin:'0 auto' }}>
        <Link href="/" style={{ fontWeight:700, fontSize:18, textDecoration:'none', color:'#111' }}>URBAN AXIS</Link>
        <nav style={{ display:'flex', gap:12, marginLeft:20 }}>
          <Link href="/men/tops">Men ▾</Link>
          <Link href="/women/tops">Women ▾</Link>
          <Link href="/products">All</Link>
        </nav>
        <div style={{ flex:1 }} />
        <SearchBar />
        <CartButton />
      </div>
    </header>
  );
}
