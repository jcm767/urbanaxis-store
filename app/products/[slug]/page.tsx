// app/products/[slug]/page.tsx
'use client';

import { useMemo, useState } from 'react';
import { addItem } from '@/lib/cart';
import { getBySlug, getName, getPrice, getSlug, getImage } from '@/lib/productUtils';

const DEFAULT_SIZES = ['XS','S','M','L','XL'];

export default function ProductDetail({ params }: { params: { slug: string } }) {
  const product = useMemo(()=>getBySlug(params.slug), [params.slug]);
  if (!product) {
    return (
      <main style={{ maxWidth: 900, margin:'24px auto', padding:'0 16px' }}>
        <h1>Product not found</h1>
      </main>
    );
  }

  const name = getName(product);
  const price = getPrice(product);
  const slug = getSlug(product);
  const img = getImage(product);
  // If your product already has sizes, you can read them here (e.g., product.sizes)
  const sizes: string[] = Array.isArray((product as any)?.sizes) && (product as any).sizes.length
    ? (product as any).sizes
    : DEFAULT_SIZES;

  const [size, setSize] = useState<string | ''>('');
  const [qty, setQty] = useState<number>(1);

  return (
    <main style={{ maxWidth: 1000, margin:'24px auto', padding:'0 16px' }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        {/* Image */}
        <div style={{ border:'1px solid #eee', borderRadius:12, overflow:'hidden', background:'#f4f4f5', minHeight:320, display:'grid', placeItems:'center' }}>
          {img ? <img src={img} alt={name} style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : 'IMG'}
        </div>

        {/* Content */}
        <div>
          <h1 style={{ marginTop:0 }}>{name}</h1>
          <div style={{ fontSize:18, fontWeight:700, marginBottom:12 }}>${price.toFixed(2)}</div>
          <p style={{ color:'#555' }}>{(product as any)?.description ?? '—'}</p>

          {/* Size selector */}
          <label style={{ display:'block', marginTop:12, marginBottom:8 }}>
            Size
            <select value={size} onChange={(e)=>setSize(e.target.value)} style={{ display:'block', marginTop:6, padding:'8px 10px', border:'1px solid #ddd', borderRadius:8, width:'100%', maxWidth:240 }}>
              <option value="">Select a size</option>
              {sizes.map((s)=>(
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>

          {/* Quantity */}
          <label style={{ display:'block', marginTop:12, marginBottom:8 }}>
            Quantity
            <input type="number" min={1} max={99} value={qty} onChange={(e)=>setQty(Math.max(1, Math.min(99, Number(e.target.value)||1)))} style={{ display:'block', marginTop:6, padding:'8px 10px', border:'1px solid #ddd', borderRadius:8, width:120 }} />
          </label>

          <div style={{ display:'flex', gap:8, marginTop:16 }}>
            <button
              onClick={()=>{
                addItem({ slug, title: name, price, qty, size: size || null, image: img });
                alert('Added to cart');
              }}
              style={{ border:'1px solid #111', background:'#111', color:'#fff', borderRadius:10, padding:'10px 14px', cursor:'pointer' }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
