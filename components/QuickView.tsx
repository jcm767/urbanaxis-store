// components/QuickView.tsx
'use client';
import { useEffect, useState } from 'react';
import { addItem } from '@/lib/cart';
import { getBySlug, getImageForColor, getImage, getColors, getName, getPrice } from '@/lib/productUtils';

export default function QuickView(){
  const [slug,setSlug]=useState<string|undefined>();
  const [open,setOpen]=useState(false);
  const [color,setColor]=useState<string|''>('');
  const [qty,setQty]=useState(1);

  useEffect(()=>{
    const on=(e: any)=>{ setSlug(e.detail?.slug); setOpen(true); setColor(''); setQty(1); };
    const off=()=>setOpen(false);
    window.addEventListener('quickview:open', on as any);
    window.addEventListener('quickview:close', off);
    return ()=>{ window.removeEventListener('quickview:open', on as any); window.removeEventListener('quickview:close', off); };
  },[]);

  if(!open || !slug) return null;
  const p = getBySlug(slug);
  if(!p) return null;

  const name=getName(p); const price=getPrice(p);
  const colors=getColors(p);
  const img=getImageForColor(p, color)||getImage(p);

  return (
    <>
      <div onClick={()=>setOpen(false)} style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.45)',zIndex:98}}/>
      <div style={{position:'fixed',zIndex:99,top:'10%',left:'50%',transform:'translateX(-50%)',width:'min(900px,95vw)',background:'var(--bg)',border:'1px solid var(--border)',borderRadius:12,overflow:'hidden'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          <div style={{background:'#f4f4f5',minHeight:320,display:'grid',placeItems:'center'}}>
            {img ? <img src={img} alt={name} style={{width:'100%',height:'100%',objectFit:'cover'}}/> : 'IMG'}
          </div>
          <div style={{padding:16}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <h3 style={{margin:0}}>{name}</h3>
              <button onClick={()=>setOpen(false)} style={{border:'1px solid var(--border)',background:'var(--card)',borderRadius:8,padding:'6px 10px'}}>✕</button>
            </div>
            <div style={{marginTop:6,fontWeight:700}}>${price.toFixed(2)}</div>
            {!!colors.length && (
              <div style={{marginTop:10,display:'flex',gap:8,flexWrap:'wrap'}}>
                {colors.map((c:string)=>(
                  <button key={c} onClick={()=>setColor(c)} title={String(c)}
                    style={{width:22,height:22,borderRadius:'50%',border:(String(c)===color)?'2px solid #111':'1px solid #ccc',background:String(c)}}
                  />
                ))}
              </div>
            )}
            <div style={{marginTop:12}}>
              <label>Qty</label>
              <input type="number" min={1} max={99} value={qty} onChange={e=>setQty(Math.max(1,Math.min(99,Number(e.target.value)||1)))} style={{display:'block',marginTop:6,width:90,padding:'8px 10px',border:'1px solid var(--border)',borderRadius:8}}/>
            </div>
            <div style={{display:'flex',gap:8,marginTop:16,flexWrap:'wrap'}}>
              <button onClick={()=>{ addItem({ slug, title:name, price, qty, size:null, color: color || null, image: img }); window.dispatchEvent(new Event('cart:update')); }}
                style={{border:'1px solid #111',background:'#111',color:'#fff',borderRadius:10,padding:'10px 14px'}}>Add to Cart</button>
              <button onClick={()=>{ addItem({ slug, title:name, price, qty, size:null, color: color || null, image: img }); window.location.href='/cart'; }}
                style={{border:'1px solid #111',background:'#fff',color:'#111',borderRadius:10,padding:'10px 14px'}}>Buy Now</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
