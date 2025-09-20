// components/Reviews.tsx
'use client';
import { useEffect, useState } from 'react';
import { addReview, listReviews, avgRating } from '@/lib/reviews';

export default function Reviews({ slug }:{ slug:string }) {
  const [name,setName]=useState(''); const [rating,setRating]=useState(5);
  const [text,setText]=useState(''); const [photo,setPhoto]=useState('');
  const [rows,setRows]=useState<any[]>([]); const [avg,setAvg]=useState(0);

  function refresh(){ setRows(listReviews(slug)); setAvg(avgRating(slug)); }

  useEffect(()=>{ refresh(); const fn=()=>refresh(); window.addEventListener('reviews:update',fn); return()=>window.removeEventListener('reviews:update',fn); },[slug]);

  return (
    <section style={{marginTop:24}}>
      <h3>Customer Reviews {avg?`(${avg}★)`:''}</h3>
      <form onSubmit={(e)=>{ e.preventDefault(); addReview({ slug, name: name||'Anonymous', rating, text, photo }); setName(''); setRating(5); setText(''); setPhoto(''); }} style={{display:'grid',gap:8,margin:'8px 0 16px'}}>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name (optional)" style={{padding:'8px 10px',border:'1px solid var(--border)',borderRadius:8}}/>
        <select value={rating} onChange={e=>setRating(Number(e.target.value))} style={{padding:'8px 10px',border:'1px solid var(--border)',borderRadius:8,width:140}}>
          {[5,4,3,2,1].map(n=><option key={n} value={n}>{n} ★</option>)}
        </select>
        <input value={photo} onChange={e=>setPhoto(e.target.value)} placeholder="Photo URL (optional)" style={{padding:'8px 10px',border:'1px solid var(--border)',borderRadius:8}}/>
        <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Write your review…" rows={3} style={{padding:'8px 10px',border:'1px solid var(--border)',borderRadius:8}}/>
        <button type="submit" style={{border:'1px solid #111',background:'#111',color:'#fff',borderRadius:10,padding:'10px 14px',width:160}}>Submit</button>
      </form>

      <div style={{display:'grid',gap:12}}>
        {rows.length===0 && <div style={{fontSize:14,opacity:.75}}>No reviews yet. Be the first!</div>}
        {rows.map((r,i)=>(
          <div key={i} style={{border:'1px solid var(--border)',borderRadius:12,padding:12,background:'var(--card)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <strong>{r.name}</strong><span>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</span>
            </div>
            {r.photo && <div style={{marginTop:8}}><img src={r.photo} alt="" style={{maxWidth:'100%',borderRadius:8}}/></div>}
            {r.text && <p style={{marginTop:8}}>{r.text}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
