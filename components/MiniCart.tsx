// components/MiniCart.tsx
'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { getCart, clearCart, removeItem, updateQty } from '@/lib/cart';

export default function MiniCart() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<any[]>([]);

  function recalc() { setItems(getCart()); }

  useEffect(() => {
    recalc();
    const onCart = () => recalc();
    const onToggle = () => setOpen((v) => !v);
    window.addEventListener('cart:update', onCart);
    window.addEventListener('minicart:toggle', onToggle);
    return () => {
      window.removeEventListener('cart:update', onCart);
      window.removeEventListener('minicart:toggle', onToggle);
    };
  }, []);

  const subtotal = useMemo(()=>items.reduce((s, it)=> s + (it.price*it.qty), 0), [items]);

  if (!open) return null;

  return (
    <div style={{
      position:'fixed', top:64, right:12, zIndex:60, width:340,
      background:'#fff', border:'1px solid #eee', borderRadius:12,
      boxShadow:'0 10px 30px rgba(0,0,0,0.12)', overflow:'hidden'
    }}>
      <div style={{ padding:12, display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid #eee' }}>
        <strong>Cart</strong>
        <button onClick={()=>setOpen(false)} style={{ background:'transparent', border:'none', fontSize:18, cursor:'pointer' }}>×</button>
      </div>
      <div style={{ maxHeight:300, overflow:'auto' }}>
        {items.length === 0 ? (
          <div style={{ padding:12, color:'#666' }}>Your cart is empty.</div>
        ) : items.map((it)=>(
          <div key={`${it.slug}-${it.size ?? 'nosize'}-${it.color ?? 'nocolor'}`} style={{ display:'grid', gridTemplateColumns:'64px 1fr', gap:10, padding:10, borderBottom:'1px solid #f3f3f3' }}>
            <div style={{ width:64, height:64, background:'#f4f4f5', display:'grid', placeItems:'center' }}>
              {it.image ? <img src={it.image} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/> : 'IMG'}
            </div>
            <div style={{ display:'grid', gap:6 }}>
              <div style={{ fontWeight:600, fontSize:13, lineHeight:1.1 }}>{it.title}</div>
              <div style={{ fontSize:12, color:'#666' }}>
                {it.size ? `Size ${it.size} · ` : ''}{it.color ? `Color ${it.color} · ` : ''}${Number(it.price).toFixed(2)}
              </div>
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                <input type="number" min={1} max={99} value={it.qty}
                  onChange={(e)=>{ updateQty(it.slug, it.size ?? null, Number(e.target.value)||1, it.color ?? null); window.dispatchEvent(new Event('cart:update')); }}
                  style={{ width:64, padding:'6px 8px', border:'1px solid #ddd', borderRadius:8 }}/>
                <button onClick={()=>{ removeItem(it.slug, it.size ?? null, it.color ?? null); window.dispatchEvent(new Event('cart:update')); }}
                  style={{ border:'1px solid #eee', background:'transparent', borderRadius:8, padding:'6px 8px', cursor:'pointer' }}>Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding:12, borderTop:'1px solid #eee' }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
          <span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <Link href="/cart" style={{ flex:1, textAlign:'center', textDecoration:'none', border:'1px solid #111', color:'#111', borderRadius:10, padding:'10px 12px' }}>
            View Cart
          </Link>
          <button onClick={()=>{
              if (confirm('Clear all items?')) { clearCart(); window.dispatchEvent(new Event('cart:update')); }
            }}
            style={{ border:'1px solid #ddd', background:'#fff', color:'#111', borderRadius:10, padding:'10px 12px', cursor:'pointer' }}>
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
