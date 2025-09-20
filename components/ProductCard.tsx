// components/ProductCard.tsx
'use client';

import Link from 'next/link';
import { addItem } from '@/lib/cart';
import { getName, getPrice, getSlug, getImage, getColors, getImageForColor, getInventory } from '@/lib/productUtils';
import WishlistButton from '@/components/WishlistButton';

export default function ProductCard({ product }: { product: any }) {
  const name = getName(product);
  const price = getPrice(product);
  const slug = getSlug(product);
  const colors = getColors(product);
  const chosenColor = colors.length === 1 ? colors[0] : undefined;
  const img = getImageForColor(product, chosenColor) ?? getImage(product);
  const inv = getInventory(product);
  const low = inv <= 5;

  return (
    <div style={{ border:'1px solid var(--border)', borderRadius:12, overflow:'hidden', background:'var(--card)', display:'grid', position:'relative' }}>
      {low && <div style={{position:'absolute',top:8,left:8,background:'#111',color:'#fff',fontSize:12,padding:'4px 8px',borderRadius:999}}>Only {inv} left</div>}

      <Link href={`/products/${slug}`} style={{ color:'var(--text)', textDecoration:'none' }}>
        <div style={{ aspectRatio:'1/1', background:'#f4f4f5', display:'grid', placeItems:'center' }}>
          {img ? <img src={img} alt={name} style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : 'IMG'}
        </div>
      </Link>

      <div style={{ padding:12, display:'grid', gap:10 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:8 }}>
          <div style={{ fontWeight:700, fontSize:14, lineHeight:1.2 }}>{name}</div>
          <WishlistButton slug={slug} compact />
        </div>
        <div style={{ fontSize:13, opacity:.75 }}>${price.toFixed(2)}</div>

        <div style={{ display:'flex', gap:8 }}>
          <button
            onClick={()=>{
              addItem({ slug, title: name, price, qty: 1, size: null, image: img });
              window.dispatchEvent(new Event('cart:update'));
            }}
            style={{ flex:1, border:'1px solid #111', background:'#111', color:'#fff', borderRadius:8, padding:'10px 12px', cursor:'pointer' }}
          >
            Add
          </button>
          <button
            onClick={()=>{
              window.location.href='/products/'+slug;
            }}
            style={{ flex:1, border:'1px solid var(--border)', background:'var(--card)', color:'var(--text)', borderRadius:8, padding:'10px 12px', cursor:'pointer' }}
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
}
