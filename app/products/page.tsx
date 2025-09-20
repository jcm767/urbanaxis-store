// app/products/page.tsx
'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { addItem } from '@/lib/cart';
import { getAllProducts, getName, getPrice, getSlug, getImage } from '@/lib/productUtils';

export default function ProductsIndex() {
  const [q, setQ] = useState('');
  const products = getAllProducts();

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return products;
    return products.filter((p: any) => {
      const hay = (getName(p) + ' ' + (p?.description ?? '')).toLowerCase();
      return hay.includes(query);
    });
  }, [q, products]);

  return (
    <main style={{ maxWidth: 1200, margin: '24px auto', padding: '0 16px' }}>
      <h1 style={{ marginBottom: 12 }}>All Products</h1>

      <form onSubmit={(e)=>e.preventDefault()} style={{ marginBottom: 16 }}>
        <input
          value={q}
          onChange={(e)=>setQ(e.target.value)}
          placeholder="Search products"
          style={{ padding:'8px 12px', border:'1px solid #ddd', borderRadius:8, width:'100%', maxWidth:420 }}
        />
      </form>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px,1fr))', gap:16 }}>
        {filtered.map((p:any) => {
          const name = getName(p);
          const slug = getSlug(p);
          const price = getPrice(p);
          const img = getImage(p);

          return (
            <div key={slug} style={{ border:'1px solid #eee', borderRadius:12, overflow:'hidden', background:'#fff' }}>
              <Link href={`/products/${slug}`} style={{ color:'#111', textDecoration:'none' }}>
                <div style={{ aspectRatio:'1/1', background:'#f4f4f5', display:'grid', placeItems:'center' }}>
                  {img ? <img src={img} alt={name} style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : 'IMG'}
                </div>
              </Link>
              <div style={{ padding:12 }}>
                <div style={{ fontWeight:700, fontSize:14, lineHeight:1.2, marginBottom:6 }}>{name}</div>
                <div style={{ fontSize:13, color:'#666', marginBottom:10 }}>${price.toFixed(2)}</div>
                <div style={{ display:'flex', gap:8 }}>
                  <Link href={`/products/${slug}`} style={{ flex:1, textAlign:'center', textDecoration:'none', border:'1px solid #111', borderRadius:8, padding:'8px 10px', color:'#111' }}>
                    View
                  </Link>
                  <button
                    onClick={()=>{
                      addItem({ slug, title: name, price, qty: 1 });
                      alert('Added to cart');
                    }}
                    style={{ flex:1, border:'1px solid #111', background:'#111', color:'#fff', borderRadius:8, padding:'8px 10px', cursor:'pointer' }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
