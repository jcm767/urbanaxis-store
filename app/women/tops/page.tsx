// app/women/tops/page.tsx
'use client';

import { getAllProducts, getCanonicalCategory, getName, getSlug, getPrice, getImage, getImageForColor, getColors } from '@/lib/productUtils';
import Link from 'next/link';

export default function WomenTopsPage() {
  const all = getAllProducts();
  const filtered = all.filter(p => getCanonicalCategory(p) === 'tops');
  return (
    <main style={{ maxWidth:1200, margin:'24px auto', padding:'0 16px' }}>
      <h1 style={{ marginBottom:12 }}>Women — Tops</h1>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:16 }}>
        {filtered.map((p:any)=>{
          const slug=getSlug(p);
          const name=getName(p);
          const price=getPrice(p);
          const colors=getColors(p);
          const img=getImageForColor(p,colors.length===1?colors[0]:undefined)??getImage(p);
          return (
            <Link key={slug} href={`/products/${slug}`} style={{border:'1px solid var(--border)',borderRadius:12,overflow:'hidden',background:'var(--card)',color:'var(--text)',textDecoration:'none'}}>
              <div style={{aspectRatio:'1/1',background:'#f4f4f5',display:'grid',placeItems:'center'}}>
                {img?<img src={img} alt={name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:'IMG'}
              </div>
              <div style={{padding:12}}>
                <div style={{fontWeight:700,fontSize:14}}>{name}</div>
                <div style={{fontSize:13,opacity:.75}}>${price.toFixed(2)}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
