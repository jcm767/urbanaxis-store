// app/products/[slug]/page.tsx
'use client';

import { useMemo, useState } from 'react';
import { addItem } from '@/lib/cart';
import { getBySlug, getName, getPrice, getSlug, getImageForColor, getImage, getColors } from '@/lib/productUtils';

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
  const colors = getColors(product);
  const [color, setColor] = useState<string | ''>(colors[0] ?? '');
  const [size, setSize] = useState<string | ''>('');
  const [qty, setQty] = useState<number>(1);

  const img = getImageForColor(product, color) ?? getImage(product);
  const sizes: string[] =
    Array.isArray((product as any)?.sizes) && (product as any).sizes.length
      ? (product as any).sizes
      : DEFAULT_SIZES;

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

          {/* Color swatches */}
          {!!colors.length && (
            <div style={{ marginTop:12, marginBottom:8 }}>
              <div style={{ fontWeight:600, marginBottom:8 }}>Color</div>
              <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                {colors.map((c)=>(
                  <button
                    key={String(c)}
                    aria-label={`Color ${c}`}
                    title={String(c)}
                    onClick={()=>setColor(String(c))}
                    style={{
                      width:26, height:26, borderRadius:'50%',
                      border: (String(c).toLowerCase() === String(color).toLowerCase()) ? '2px solid #111' : '1px solid #ccc',
                      background: colorToCss(c),
                      cursor:'pointer'
                    }}
                  />
                ))}
              </div>
            </div>
          )}

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

          <div style={{ display:'flex', gap:8, marginTop:16, flexWrap:'wrap' }}>
            <button
              onClick={()=>{
                addItem({ slug, title: name, price, qty, size: size || null, color: color || null, image: img });
                alert('Added to cart');
              }}
              style={{ border:'1px solid #111', background:'#111', color:'#fff', borderRadius:10, padding:'10px 14px', cursor:'pointer' }}
            >
              Add to Cart
            </button>
            <button
              onClick={()=>{
                addItem({ slug, title: name, price, qty, size: size || null, color: color || null, image: img });
                window.location.href = '/cart';
              }}
              style={{ border:'1px solid #111', background:'#fff', color:'#111', borderRadius:10, padding:'10px 14px', cursor:'pointer' }}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function colorToCss(c: any): string {
  if (!c) return '#eee';
  const s = String(c).toLowerCase();
  const map: Record<string, string> = {
    black:'#111', white:'#fff', offwhite:'#f7f7f7', ivory:'#f5f5ed', cream:'#f5f1e6',
    gray:'#888', grey:'#888', silver:'#bbb', charcoal:'#333',
    beige:'#d8c8a8', tan:'#d2b48c', brown:'#7b5e57',
    red:'#d33', maroon:'#800000', burgundy:'#800020',
    blue:'#005fdd', navy:'#001f3f', sky:'#87ceeb', teal:'#008080',
    green:'#2a8f2a', olive:'#556b2f',
    yellow:'#ffd400', gold:'#d4af37', orange:'#ff7f00',
    purple:'#6a0dad', lavender:'#b57edc', pink:'#ff69b4',
  };
  return map[s] ?? s;
}
