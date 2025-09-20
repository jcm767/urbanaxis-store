// app/products/page.tsx
'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { addItem } from '@/lib/cart';
import {
  getAllProducts, getName, getPrice, getSlug, getImageForColor,
  getImage, getDescription, getCanonicalCategory, getTags, getGender, getColors, getSearchKeywords
} from '@/lib/productUtils';

const ALL_SIZES = ['XS','S','M','L','XL','XXL'];

export default function ProductsIndex() {
  const all = getAllProducts();
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState<Record<string, string | undefined>>({}); // slug -> color

  // Filters
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [colorFilter, setColorFilter] = useState<string>(''); // single color
  const [sizeFilter, setSizeFilter] = useState<string>('');   // simple global size filter

  const filtered = useMemo(() => {
    const terms = q.trim().toLowerCase().split(/[^a-z0-9]+/g).filter(Boolean);

    return all.filter((p: any) => {
      const price = getPrice(p);
      if (minPrice && price < Number(minPrice)) return false;
      if (maxPrice && price > Number(maxPrice)) return false;

      if (colorFilter) {
        const colors = getColors(p).map(String).map(s=>s.toLowerCase());
        if (!colors.includes(colorFilter.toLowerCase())) return false;
      }

      if (sizeFilter) {
        const sizes = Array.isArray(p?.sizes) ? p.sizes : [];
        if (sizes.length && !sizes.map((s:any)=>String(s).toUpperCase()).includes(sizeFilter.toUpperCase())) {
          return false;
        }
      }

      if (!terms.length) return true;

      // Search across name/desc/tags + canonical category synonyms
      const hay = getSearchKeywords(p);
      return terms.every(t => hay.some(h => h.includes(t)));
    });
  }, [all, q, minPrice, maxPrice, colorFilter, sizeFilter]);

  // Collect all unique colors for filter chips
  const allColors = useMemo(() => {
    const set = new Set<string>();
    for (const p of all) for (const c of getColors(p)) set.add(String(c));
    return Array.from(set).sort();
  }, [all]);

  return (
    <main style={{ maxWidth: 1200, margin: '24px auto', padding: '0 16px' }}>
      <h1 style={{ marginBottom: 12 }}>All Products</h1>

      <div style={{ display:'grid', gridTemplateColumns:'260px 1fr', gap:16 }}>
        {/* Filters */}
        <aside style={{ border:'1px solid var(--border)', borderRadius:12, padding:12, height:'fit-content' }}>
          <form onSubmit={(e)=>e.preventDefault()} style={{ display:'grid', gap:12 }}>
            <div>
              <div style={{ fontWeight:600, marginBottom:6 }}>Search</div>
              <input
                value={q}
                onChange={(e)=>setQ(e.target.value)}
                placeholder="shirts, jackets, hoodies…"
                style={{ width:'100%', padding:'10px 12px', border:'1px solid var(--border)', borderRadius:8, background:'var(--card)', color:'var(--text)' }}
              />
            </div>

            <div>
              <div style={{ fontWeight:600, marginBottom:6 }}>Price</div>
              <div style={{ display:'flex', gap:8 }}>
                <input inputMode="numeric" placeholder="Min" value={minPrice}
                  onChange={(e)=>setMinPrice(e.target.value)}
                  style={{ flex:1, padding:'8px 10px', border:'1px solid var(--border)', borderRadius:8 }}/>
                <input inputMode="numeric" placeholder="Max" value={maxPrice}
                  onChange={(e)=>setMaxPrice(e.target.value)}
                  style={{ flex:1, padding:'8px 10px', border:'1px solid var(--border)', borderRadius:8 }}/>
              </div>
            </div>

            {!!allColors.length && (
              <div>
                <div style={{ fontWeight:600, marginBottom:6 }}>Color</div>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  <button type="button" onClick={()=>setColorFilter('')}
                    style={{ padding:'6px 10px', border:'1px solid var(--border)', borderRadius:999, background: colorFilter ? 'var(--card)' : '#111', color: colorFilter ? 'var(--text)' : '#fff' }}>
                    Any
                  </button>
                  {allColors.map((c)=>(
                    <button key={String(c)} type="button" onClick={()=>setColorFilter(String(c))}
                      style={{ padding:'6px 10px', border:'1px solid var(--border)', borderRadius:999, background: (String(c)===colorFilter)?'#111':'var(--card)', color:(String(c)===colorFilter)?'#fff':'var(--text)' }}>
                      {String(c)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div style={{ fontWeight:600, marginBottom:6 }}>Size</div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {['', ...ALL_SIZES].map((s)=>(
                  <button key={s || 'any'} type="button" onClick={()=>setSizeFilter(s)}
                    style={{ padding:'6px 10px', border:'1px solid var(--border)', borderRadius:999, background: (s===sizeFilter)?'#111':'var(--card)', color:(s===sizeFilter)?'#fff':'var(--text)' }}>
                    {s || 'Any'}
                  </button>
                ))}
              </div>
            </div>

            <button type="button" onClick={()=>{ setQ(''); setMinPrice(''); setMaxPrice(''); setColorFilter(''); setSizeFilter(''); }}
              style={{ padding:'10px 12px', border:'1px solid var(--border)', borderRadius:8, background:'var(--card)' }}>
              Reset
            </button>
          </form>
        </aside>

        {/* Results grid */}
        <section>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px,1fr))', gap:16 }}>
            {filtered.map((p:any) => {
              const name = getName(p);
              const slug = getSlug(p);
              const price = getPrice(p);
              const colors = getColors(p);
              // If only one color, use it by default (no click needed)
              const chosenColor = colors.length === 1 ? colors[0] : (selected[slug]);
              const img = getImageForColor(p, chosenColor) ?? getImage(p);

              return (
                <div key={slug} style={{ border:'1px solid var(--border)', borderRadius:12, overflow:'hidden', background:'var(--card)', display:'grid' }}>
                  <Link href={`/products/${slug}`} style={{ color:'var(--text)', textDecoration:'none' }}>
                    <div style={{ aspectRatio:'1/1', background:'#f4f4f5', display:'grid', placeItems:'center' }}>
                      {img ? <img src={img} alt={name} style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : 'IMG'}
                    </div>
                  </Link>

                  <div style={{ padding:12, display:'grid', gap:10 }}>
                    <div style={{ fontWeight:700, fontSize:14, lineHeight:1.2 }}>{name}</div>
                    <div style={{ fontSize:13, color:'var(--muted)' }}>${price.toFixed(2)}</div>

                    {!!colors.length && (
                      <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
                        {colors.map((c: string) => {
                          const isSel = (chosenColor ?? '').toLowerCase() === String(c).toLowerCase();
                          return (
                            <button
                              key={c}
                              aria-label={`Color ${c}`}
                              title={String(c)}
                              onClick={() => setSelected(prev => ({ ...prev, [slug]: c }))}
                              style={{
                                width:22, height:22, borderRadius:'50%',
                                border: isSel ? '2px solid #111' : '1px solid #ccc',
                                background: String(c),
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
                          window.dispatchEvent(new Event('cart:update'));
                        }}
                        style={{ flex:1, border:'1px solid #111', background:'#111', color:'#fff', borderRadius:8, padding:'10px 12px', cursor:'pointer' }}
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={()=>{
                          addItem({ slug, title: name, price, qty: 1, size: null, image: img });
                          window.location.href = '/cart';
                        }}
                        style={{ flex:1, border:'1px solid #111', background:'var(--card)', color:'var(--text)', borderRadius:8, padding:'10px 12px', cursor:'pointer' }}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
