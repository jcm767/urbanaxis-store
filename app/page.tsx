// app/page.tsx
import Link from 'next/link';
import { loadAllProducts } from '@/lib/loadProducts';
import { getSlug, productPrimaryImage } from '@/lib/productUtils';

export default async function Home() {
  const all = await loadAllProducts();

  // curated first, then legacy
  const curated = all.filter((p: any) => p.__source === 'curated');
  const legacy = all.filter((p: any) => p.__source !== 'curated');
  const showcase = [...curated, ...legacy].slice(0, 12);

  const categories = [
    { href: '/men', label: 'Men' },
    { href: '/women', label: 'Women' },
    { href: '/men/tops', label: 'Men • Tops' },
    { href: '/men/bottoms', label: 'Men • Bottoms' },
    { href: '/men/jackets', label: 'Men • Jackets' },
    { href: '/men/accessories', label: 'Men • Accessories' },
    { href: '/women/tops', label: 'Women • Tops' },
    { href: '/women/bottoms', label: 'Women • Bottoms' },
    { href: '/women/jackets', label: 'Women • Jackets' },
    { href: '/women/accessories', label: 'Women • Accessories' },
  ];

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: 16,
  };

  return (
    <main style={{ padding: 24, display: 'grid', gap: 32 }}>
      <section style={{ display: 'grid', gap: 12 }}>
        <h1 style={{ margin: 0 }}>Urban Axis</h1>
        <p style={{ margin: 0, opacity: 0.8 }}>
          Curated streetwear. Real products. Fast checkout.
        </p>
      </section>

      <section style={{ display: 'grid', gap: 12 }}>
        <h2 style={{ margin: 0 }}>Shop Categories</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: 12,
          }}
        >
          {categories.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: 12,
                padding: 12,
                textDecoration: 'none',
              }}
            >
              {c.label}
            </Link>
          ))}
        </div>
      </section>

      <section style={{ display: 'grid', gap: 12 }}>
        <h2 style={{ margin: 0 }}>New &amp; Noteworthy</h2>

        {/* Curated items first (if any) */}
        {curated.length > 0 && (
          <div style={gridStyle}>
            {curated.map((p: any, i) => {
              const key = getSlug(p) || p.id || p.url || `curated-${i}`;
              // eslint-disable-next-line @next/next/no-img-element
              return (
                <a
                  key={key}
                  href={`/products/${encodeURIComponent(getSlug(p) || String(key))}`}
                  style={{
                    textDecoration: 'none',
                    border: '1px solid #e5e7eb',
                    borderRadius: 12,
                    overflow: 'hidden',
                    display: 'grid',
                    gap: 8,
                    paddingBottom: 12,
                  }}
                >
                  {productPrimaryImage(p) ? (
                    <img
                      alt={p.title ?? 'Product image'}
                      src={productPrimaryImage(p)!}
                      style={{ width: '100%', height: 220, objectFit: 'cover' }}
                      loading="lazy"
                    />
                  ) : (
                    <div style={{ width: '100%', height: 220, background: '#f3f4f6' }} />
                  )}
                  <div style={{ padding: '0 12px' }}>
                    <div style={{ color: '#111827', marginBottom: 4 }}>
                      {p.title ?? 'Untitled product'}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}

        {/* Fill with legacy to 12 items */}
        <div style={gridStyle}>
          {showcase
            .slice(curated.length) // after curated block
            .map((p: any, i) => {
              const key = getSlug(p) || p.id || p.url || `item-${i}`;
              return (
                <a
                  key={key}
                  href={`/products/${encodeURIComponent(getSlug(p) || String(key))}`}
                  style={{
                    textDecoration: 'none',
                    border: '1px solid #e5e7eb',
                    borderRadius: 12,
                    overflow: 'hidden',
                    display: 'grid',
                    gap: 8,
                    paddingBottom: 12,
                  }}
                >
                  {productPrimaryImage(p) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      alt={p.title ?? 'Product image'}
                      src={productPrimaryImage(p)!}
                      style={{ width: '100%', height: 220, objectFit: 'cover' }}
                      loading="lazy"
                    />
                  ) : (
                    <div style={{ width: '100%', height: 220, background: '#f3f4f6' }} />
                  )}
                  <div style={{ padding: '0 12px' }}>
                    <div style={{ color: '#111827', marginBottom: 4 }}>
                      {p.title ?? 'Untitled product'}
                    </div>
                  </div>
                </a>
              );
            })}
        </div>
      </section>
    </main>
  );
}
