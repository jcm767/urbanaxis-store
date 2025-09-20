// app/products/page.tsx
'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { addItem } from '@/lib/cart';
import QuickView from '@/components/QuickView';
import RecentlyViewed from '@/components/RecentlyViewed';
import {
  getAllProducts, getName, getPrice, getSlug, getImageForColor,
  getImage, getDescription, getCategory, getTags, getGender, getColors
} from '@/lib/productUtils';

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

const ALL_SIZES = ['XS','S','M','L','XL','XXL'];

export default function ProductsIndex() {
  const all = getAllProducts();
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState<Record<string, string | undefined>>({}); // slug -> color

  // Filters
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [colorFilter, setColorFilter] = useState<string>(''); // single color
  const [sizeFilter, setSizeFilter] = useState<string>('');   // simple global size filter (detail pages still have per-product sizes)

  const filtered = useMemo(() => {
    const base = q.trim();
    const terms = base ? expandQuery(base) : [];

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
      const hay = [
        getName(p), getDescription(p), getCategory(p), getGender(p),
        ...getTags(p), ...getColors(p)
      ].join(' ').toLowerCase();
      return terms.every(t => hay.includes(t));
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
        <aside style={{ border:'1px solid #eee', borderRadius:12, padding:12, height:'fit-content' }}>
          <form onSubmit={(e)=>e.preventDefault()} style={{ display:'grid', gap:12 }}>
            <div>
              <div style={{ fontWeight:600, marginBottom:6 }}>Search</div>
              <input
                value={q}
                onChange={(e)=>setQ(e.target.value)}
                placeholder="shirts, jackets, hoodies…"
                style={{ width:'100%', padding:'10px 12px', border:'1px solid #ddd', borderRadius:8 }}
              />
            </div>

            <div>
              <div style={{ fontWeight:600, marginBottom:6 }}>Price</div>
              <div style={{ display:'flex', gap:8 }}>
                <input inputMode="numeric" placeholder="Min" value={minPrice}
                  onChange={(e)=>setMinPrice(e.target.value)}
                  style={{ flex:1, padding:'8px 10px', border:'1px solid #ddd', borderRadius:8 }}/>
                <input inputMode="numeric" placeholder="Max" value={maxPrice}
                  onChange={(e)=>setMaxPrice(e.target.value)}
                  style={{ flex:1, padding:'8px 10px', border:'1px solid #ddd', borderRadius:8 }}/>
              </div>
            </div>

            {!!allColors.length && (
              <div>
                <div style={{ fontWeight:600, marginBottom:6 }}>Color</div>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  <button type="button" onClick={()=>setColorFilter('')}
                    style={{ padding:'6px 10px', border:'1px solid #ddd', borderRadius:999, background: colorFilter ? '#fff' : '#111', color: colorFilter ? '#111' : '#fff' }}>
                    Any
                  </button>
                  {allColors.map((c)=>(
                    <button key={String(c)} type="button" onClick={()=>setColorFilter(String(c))}
                      style={{ padding:'6px 10px', border:'1px solid #ddd', borderRadius:999, background: (String(c)===colorFilter)?'#111':'#fff', color:(String(c)===colorFilter)?'#fff':'#111' }}>
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
                    style={{ padding:'6px 10px', border:'1px solid #ddd', borderRadius:999, background: (s===sizeFilter)?'#111':'#fff', color:(s===sizeFilter)?'#fff':'#111' }}>
                    {s || 'Any'}
                  </button>
                ))}
              </div>
            </div>

            <button type="button" onClick={()=>{ setQ(''); setMinPrice(''); setMaxPrice(''); setColorFilter(''); setSizeFilter(''); }}
              style={{ padding:'10px 12px', border:'1px solid #ddd', borderRadius:8, background:'#fafafa' }}>
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
                        style={{ flex:1, border:'1px solid #111', background:'#fff', color:'#111', borderRadius:8, padding:'10px 12px', cursor:'pointer' }}
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
    <RecentlyViewed />
      <QuickView />
    </main>
  );
}

function colorToCss(c: any): string {
  if (!c) return '#eee';
  const s = String(c).toLowerCase();
  const map: Record<string, string> = {
    black:'#111', white:'#fff', offwhite:'#f7f7f7', ivory:'#f5f5ed', cream:'#f5f1e6',
    gray:'#888', grey:'#888', silver:'#bbb', charcoal:'#333',
    beige:'#d8c8a8', tan:'#d2b48c', brown:'#7b5e57',
    red:'#d33', maroon:'#800000', burgundy:'#800020',
    blue:'#005fdd', navy:'#001f3f', sky:'#87ceeb', teal:'#008080',
    green:'#2a8f2a', olive:'#556b2f',
    yellow:'#ffd400', gold:'#d4af37', orange:'#ff7f00',
    purple:'#6a0dad', lavender:'#b57edc', pink:'#ff69b4',
  };
  return map[s] ?? s;
}
