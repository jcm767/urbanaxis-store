// components/RecentlyViewed.tsx
'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getRecent } from '@/lib/recent';
import { getBySlug, getImage, getName, getPrice } from '@/lib/productUtils';

export default function RecentlyViewed(){
  const [slugs,setSlugs]=useState<string[]>([]);
  useEffect(()=>{ const fn=()=>setSlugs(getRecent()); fn(); window.addEventListener('recent:update',fn); return()=>window.removeEventListener('recent:update',fn); },[]);
  const items = slugs.map(s=>getBySlug(s)).filter(Boolean);
  if(!items.length) return null;
  return (
    <section style={{marginTop:24}}>
      <h3>Recently Viewed</h3>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:12}}>
        {items.map((p:any)=>{
          const name=getName(p); const price=getPrice(p);
          return (
            <Link key={p.slug||name} href={`/products/${p.slug||name}`} style={{textDecoration:'none',color:'var(--text)',border:'1px solid var(--border)',borderRadius:12,overflow:'hidden',background:'var(--card)'}}>
              <div style={{aspectRatio:'1/1',background:'#f4f4f5',display:'grid',placeItems:'center'}}>
                {getImage(p)?<img src={getImage(p)!} alt={name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:'IMG'}
              </div>
              <div style={{padding:10}}>
                <div style={{fontWeight:600,fontSize:14}}>{name}</div>
                <div style={{fontSize:13,opacity:.75}}>${price.toFixed(2)}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
