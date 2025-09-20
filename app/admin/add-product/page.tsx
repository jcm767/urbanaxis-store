// app/admin/add-product/page.tsx
'use client';
import { useState } from 'react';

export default function AdminAddProduct() {
  const [url,setUrl]=useState('');
  const [title,setTitle]=useState('');
  const [price,setPrice]=useState('');
  const [gender,setGender]=useState<'men'|'women'|'unisex'|''>('');
  const [category,setCategory]=useState<'tops'|'bottoms'|'jackets'|'accessories'|''>('');
  const [tags,setTags]=useState('');
  const [busy,setBusy]=useState(false);
  const [out,setOut]=useState<any>(null);

  async function submit(e:any){
    e.preventDefault();
    setBusy(true); setOut(null);
    const res = await fetch('/api/ingest/ali', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        url, title, price: Number(price),
        gender: gender||undefined,
        category: category||undefined,
        tags: tags.split(',').map(s=>s.trim()).filter(Boolean)
      })
    });
    const data = await res.json();
    setOut(data);
    setBusy(false);
  }

  return (
    <main style={{ maxWidth: 800, margin:'24px auto', padding:'0 16px' }}>
      <h1>Add Product from AliExpress</h1>
      <form onSubmit={submit} style={{ display:'grid', gap:12, border:'1px solid var(--border)', borderRadius:12, padding:16 }}>
        <input required placeholder="AliExpress URL" value={url} onChange={e=>setUrl(e.target.value)} style={field()} />
        <input required placeholder="Product title" value={title} onChange={e=>setTitle(e.target.value)} style={field()} />
        <input required inputMode="decimal" placeholder="Price (USD)" value={price} onChange={e=>setPrice(e.target.value)} style={field()} />

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
          <select value={gender} onChange={e=>setGender(e.target.value as any)} style={field()}>
            <option value="">Gender (optional)</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="unisex">Unisex</option>
          </select>
          <select value={category} onChange={e=>setCategory(e.target.value as any)} style={field()}>
            <option value="">Category (auto if blank)</option>
            <option value="tops">Tops</option>
            <option value="bottoms">Bottoms</option>
            <option value="jackets">Jackets</option>
            <option value="accessories">Accessories</option>
          </select>
          <input placeholder="tags (comma separated)" value={tags} onChange={e=>setTags(e.target.value)} style={field()} />
        </div>

        <button disabled={busy} type="submit" style={{ border:'1px solid #111', background:'#111', color:'#fff', padding:'10px 14px', borderRadius:10 }}>
          {busy ? 'Adding…' : 'Add Product'}
        </button>
      </form>

      {out && (
        <div style={{ marginTop:16, border:'1px solid var(--border)', borderRadius:12, padding:16 }}>
          <pre style={{ whiteSpace:'pre-wrap' }}>{JSON.stringify(out, null, 2)}</pre>
        </div>
      )}
    </main>
  );
}

function field(): React.CSSProperties {
  return { padding:'10px 12px', border:'1px solid var(--border)', borderRadius:8, background:'var(--card)', color:'var(--text)' };
}
