// components/ProductCard.tsx
'use client';

import Link from 'next/link';
import { addItem } from '@/lib/cart';
import { getName, getPrice, getSlug, getImage } from '@/lib/productUtils';

export default function ProductCard({ product }: { product: any }) {
  const name = getName(product);
  const price = getPrice(product);
  const slug = getSlug(product);
  const img = getImage(product);

  return (
    <div style={{ border:'1px solid #eee', borderRadius:12, overflow:'hidden', background:'#fff' }}>
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
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
