// app/products/page.tsx
'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { addItem } from '@/lib/cart';
import {
  getAllProducts, getName, getPrice, getSlug, getImageForColor,
  getImage, getDescription, getCategory, getTags, getGender, getColors
} from '@/lib/productUtils';

// Synonym groups to expand search queries
const SYNONYMS: Record<string, string[]> = {
  tshirt: ['t-shirt','tee','tees','tshirt','shirt','shirts','top','tops','graphic tee','graphic tees'],
  shirt:  ['tshirt','t-shirt','tee','tees','shirt','shirts','top','tops'],
  top:    ['tops','tshirt','t-shirt','tee','tees','shirt','shirts','blouse','crop','tank'],
  jacket: ['jacket','jackets','coat','coats','outerwear','windbreaker','parka','puffer','hooded'],
  pant:   ['pant','pants','trouser','trousers','bottom','bottoms','cargo','jeans','denim','jogger','sweatpants'],
  short:  ['short','shorts'],
  hoodie: ['hoodie','hoodies','sweatshirt','sweater','pullover','zip'],
  accessory: ['accessory','accessories','belt','hat','cap','beanie','bag','scarf','sunglasses','jewelry','ring','necklace','bracelet'],
  women:  ['women','womens','female','ladies','woman'],
  men:    ['men','mens','male','man'],
};

function expandQuery(q: string): string[] {
  const parts = q.toLowerCase().split(/[^a-z0-9]+/g).filter(Boolean);
  const out = new Set<string>();
  for (const token of parts) {
    out.add(token);
    for (const [root, syns] of Object.entries(SYNONYMS)) {
      if (token === root || syns.includes(token)) {
        out.add(root);
        syns.forEach(s => out.add(s));
      }
    }
  }
  return Array.from(out);
}

export default function ProductsIndex() {
  const all = getAllProducts();
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState<Record<string, string | undefined>>({}); // slug -> color

  const filtered = useMemo(() => {
    const base = q.trim();
    if (!base) return all;
    const terms = expandQuery(base);

    return all.filter((p: any) => {
      const hay = [
        getName(p),
        getDescription(p),
        getCategory(p),
        getGender(p),
        ...getTags(p),
        ...getColors(p)
      ].join(' ').toLowerCase();

      // match if EVERY term is found somewhere
      return terms.every(t => hay.includes(t));
    });
  }, [all, q]);

  return (
    <main style={{ maxWidth: 1200, margin: '24px auto', padding: '0 16px' }}>
      <h1 style={{ marginBottom: 12 }}>All Products</h1>

      <form onSubmit={(e)=>e.preventDefault()} style={{ marginBottom: 16, display:'flex', gap:8, flexWrap:'wrap' }}>
        <input
          value={q}
          onChange={(e)=>setQ(e.target.value)}
          placeholder="Search shirts, jackets, hoodies, pants…"
          style={{ padding:'10px 12px', border:'1px solid #ddd', borderRadius:8, flex: '1 1 320px' }}
        />
        <button
          onClick={()=>setQ('')}
          type="button"
          style={{ padding:'10px 14px', border:'1px solid #ddd', borderRadius:8, background:'#fafafa', cursor:'pointer' }}
        >
          Clear
        </button>
      </form>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px,1fr))', gap:16 }}>
        {filtered.map((p:any) => {
          const name = getName(p);
          const slug = getSlug(p);
          const price = getPrice(p);
          const colors = getColors(p);
          const color = selected[slug]; // may be undefined
          const img = getImageForColor(p, color) ?? getImage(p);

          return (
            <div key={slug} style={{ border:'1px solid #eee', borderRadius:12, overflow:'hidden', background:'#fff', display:'grid' }}>
              <Link href={`/products/${slug}`} style={{ color:'#111', textDecoration:'none' }}>
                <div style={{ aspectRatio:'1/1', background:'#f4f4f5', display:'grid', placeItems:'center' }}>
                  {img ? <img src={img} alt={name} style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : 'IMG'}
                </div>
              </Link>

              <div style={{ padding:12, display:'grid', gap:10 }}>
                <div style={{ fontWeight:700, fontSize:14, lineHeight:1.2 }}>{name}</div>
                <div style={{ fontSize:13, color:'#666' }}>${price.toFixed(2)}</div>

                {/* Color swatches */}
                {!!colors.length && (
                  <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
                    {colors.map((c) => {
                      const isSel = (selected[slug] ?? '').toLowerCase() === String(c).toLowerCase();
                      return (
                        <button
                          key={c}
                          aria-label={`Color ${c}`}
                          title={String(c)}
                          onClick={() => setSelected(prev => ({ ...prev, [slug]: c }))}
                          style={{
                            width:22, height:22, borderRadius:'50%',
                            border: isSel ? '2px solid #111' : '1px solid #ccc',
                            background: colorToCss(c),
                            cursor:'pointer'
                          }}
                        />
                      );
                    })}
                  </div>
                )}

                <div style={{ display:'flex', gap:8 }}>
                  <button
                    onClick={()=>{
                      addItem({ slug, title: name, price, qty: 1, size: null, image: img });
                      // stay on page so they can keep shopping
                      window.dispatchEvent(new Event('cart:update'));
                    }}
                    style={{ flex:1, border:'1px solid #111', background:'#111', color:'#fff', borderRadius:8, padding:'10px 12px', cursor:'pointer' }}
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={()=>{
                      addItem({ slug, title: name, price, qty: 1, size: null, image: img });
                      window.location.href = '/cart'; // "Buy Now" -> goes straight to cart for review/checkout
                    }}
                    style={{ flex:1, border:'1px solid #111', background:'#fff', color:'#111', borderRadius:8, padding:'10px 12px', cursor:'pointer' }}
                  >
                    Buy Now
                  </button>
                </div>

                <div style={{ display:'flex', gap:8 }}>
                  <Link href={`/products/${slug}`} style={{ flex:1, textAlign:'center', textDecoration:'none', border:'1px solid #ddd', borderRadius:8, padding:'8px 10px', color:'#111' }}>
                    View
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

/** Try to map common color names to CSS; otherwise return the raw string (browsers handle many names) */
function colorToCss(c: any): string {
  if (!c) return '#eee';
  const s = String(c).toLowerCase();
  const map: Record<string, string> = {
    black: '#111', white: '#fff', offwhite: '#f7f7f7', ivory: '#f5f5ed', cream: '#f5f1e6',
    gray: '#888', grey: '#888', silver: '#bbb', charcoal: '#333',
    beige: '#d8c8a8', tan: '#d2b48c', brown:'#7b5e57',
    red:'#d33', maroon:'#800000', burgundy:'#800020',
    blue:'#2a6', navy:'#001f3f', sky:'#87ceeb', teal:'#008080',
    green:'#2a8f2a', olive:'#556b2f',
    yellow:'#ffd400', gold:'#d4af37', orange:'#ff7f00',
    purple:'#6a0dad', lavender:'#b57edc', pink:'#ff69b4',
  };
  return map[s] ?? s;
}
