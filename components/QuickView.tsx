'use client';
import { useState } from 'react';
import { addItem } from '@/lib/cart';
import { getSlug, getImageForColor, getImage, getColors, getName, getPrice } from '@/lib/productUtils';

export default function QuickView() {
  const [slug, setSlug] = useState<string|undefined>();
  const [open, setOpen] = useState(false);

  const product = slug ? getSlug(slug) : null;
  const name = product ? getName(product) : 'Untitled';
  const price = product ? Number(getPrice(product)) : 0;
  const colors = product ? getColors(product) : [];
  const img = product ? getImage(product) : '';

  return (
    <div style={{padding:20}}>
      {open && (
        <div style={{border:'1px solid var(--border)', padding:12, borderRadius:8}}>
          <div style={{display:'flex', justifyContent:'space-between'}}>
            <h3>{name}</h3>
            <button onClick={()=>setOpen(false)} style={{border:'1px solid var(--border)', background:'var(--card)', borderRadius:8, padding:'6px 10px'}}>✕</button>
          </div>
          <div style={{marginTop:6, fontWeight:700}}>${price.toFixed(2)}</div>
          {!!colors.length && (
            <div style={{marginTop:10, display:'flex', gap:8, flexWrap:'wrap'}}>
              {colors.map((c:string)=>(
                <div key={c} style={{width:24, height:24, borderRadius:'50%', background:getImageForColor(product,c), border:'1px solid #ccc'}} />
              ))}
            </div>
          )}
          <button
            onClick={() => addItem({
              title: name,
              price,
              image: img,
            })}
            style={{marginTop:12, padding:'8px 12px', borderRadius:8, background:'black', color:'white'}}
          >
            Add to Cart
          </button>
        </div>
      )}
      <button onClick={()=>setOpen(true)} style={{marginTop:12, padding:'8px 12px', borderRadius:8, background:'black', color:'white'}}>Quick View</button>
    </div>
  );
}
