// components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onToggle = () => setOpen(v => !v);
    window.addEventListener('sidebar:toggle', onToggle);
    return () => window.removeEventListener('sidebar:toggle', onToggle);
  }, []);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        style={{
          position:'fixed', inset:0, background:'rgba(0,0,0,0.35)', zIndex:80
        }}
      />
      {/* Panel */}
      <aside
        style={{
          position:'fixed', top:0, left:0, height:'100vh', width:300, zIndex:81,
          background:'var(--bg)', color:'var(--text)', borderRight:'1px solid var(--border)',
          padding:'16px 12px', display:'grid', gridTemplateRows:'auto 1fr auto', gap:12
        }}
      >
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <strong style={{ fontSize:16 }}>Browse</strong>
          <button onClick={()=>setOpen(false)} style={{ background:'transparent', border:'1px solid var(--border)', borderRadius:8, padding:'6px 8px', color:'var(--text)', cursor:'pointer' }}>✕</button>
        </div>

        <nav style={{ display:'grid', gap:8, overflow:'auto', paddingRight:4 }}>
          <div style={{ fontSize:12, opacity:0.7, marginTop:8 }}>MEN</div>
          <Link href="/men/tops" style={{ color:'var(--text)', textDecoration:'none' }}>Tops</Link>
          <Link href="/men/bottoms" style={{ color:'var(--text)', textDecoration:'none' }}>Bottoms</Link>
          <Link href="/men/jackets" style={{ color:'var(--text)', textDecoration:'none' }}>Jackets</Link>
          <Link href="/men/accessories" style={{ color:'var(--text)', textDecoration:'none' }}>Accessories</Link>

          <div style={{ fontSize:12, opacity:0.7, marginTop:12 }}>WOMEN</div>
          <Link href="/women/tops" style={{ color:'var(--text)', textDecoration:'none' }}>Tops</Link>
          <Link href="/women/bottoms" style={{ color:'var(--text)', textDecoration:'none' }}>Bottoms</Link>
          <Link href="/women/jackets" style={{ color:'var(--text)', textDecoration:'none' }}>Jackets</Link>
          <Link href="/women/accessories" style={{ color:'var(--text)', textDecoration:'none' }}>Accessories</Link>

          <div style={{ fontSize:12, opacity:0.7, marginTop:12 }}>ALL</div>
          <Link href="/products" style={{ color:'var(--text)', textDecoration:'none' }}>All Products</Link>
          <Link href="/cart" style={{ color:'var(--text)', textDecoration:'none' }}>Cart</Link>
        </nav>

        <div style={{ fontSize:12, color:'var(--muted)' }}>
          © {new Date().getFullYear()} Urban Axis
        </div>
      </aside>
    </>
  );
}
