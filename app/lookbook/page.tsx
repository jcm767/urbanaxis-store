// app/lookbook/page.tsx
'use client';
import Link from 'next/link';
import { getAllProducts, getImage, getName, getPrice, getSlug } from '@/lib/productUtils';

export default function Lookbook(){
  const all = getAllProducts();
  // Simple curated looks: pick 3 random outfits of 3 items
  const groups: any[] = [];
  for(let i=0;i<Math.min(3, Math.floor(all.length/3));i++){
    groups.push([all[(i*3)%all.length], all[(i*3+1)%all.length], all[(i*3+2)%all.length]]);
  }
  return (
    <main style={{maxWidth:1200,margin:'24px auto',padding:'0 16px'}}>
      <h1>Lookbook — Shop the Look</h1>
      <p>Complete outfits curated from our latest drops.</p>
      <div style={{display:'grid',gap:16}}>
        {groups.map((g,idx)=>(
          <div key={idx} style={{border:'1px solid var(--border)',borderRadius:12,padding:12,background:'var(--card)'}}>
            <h3 style={{marginTop:0}}>Look #{idx+1}</h3>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:12}}>
              {g.map((p:any)=>{
                const name=getName(p); const price=getPrice(p); const slug=getSlug(p);
                return (
                  <Link key={slug} href={`/products/${slug}`} style={{textDecoration:'none',color:'var(--text)',border:'1px solid var(--border)',borderRadius:12,overflow:'hidden',background:'var(--card)'}}>
                    <div style={{aspectRatio:'1/1',background:'#f4f4f5',display:'grid',placeItems:'center'}}>
                      {getImage(p)?<img src={getImage(p)!} alt={name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:'IMG'}
                    </div>
                    <div style={{padding:10}}>
                      <div style={{fontWeight:700,fontSize:14,marginBottom:4}}>{name}</div>
                      <div style={{fontSize:13,opacity:.75}}>${price.toFixed(2)}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
