// app/page.tsx
import Link from 'next/link';
import products from '@/lib/products';

function getName(p: any) {
  return p?.title ?? p?.name ?? p?.label ?? 'Product';
}
function getPrice(p: any) {
  const n = Number(p?.price ?? p?.amount ?? 0);
  return Number.isFinite(n) ? n : 0;
}
function getSlug(p: any) {
  const base = p?.slug ?? p?.id ?? p?.sku ?? getName(p);
  return String(base).trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function Home() {
  const list: any[] = Array.isArray(products) ? products : [];
  const featured = list.slice(0, 4);

  return (
    <div>
      {/* HERO */}
      <section
        style={{
          position: 'relative',
          display: 'grid',
          placeItems: 'center',
          minHeight: '52vh',
          padding: 24,
          background: 'linear-gradient(135deg, #111 0%, #222 40%, #111 100%)',
          color: '#fff',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 900 }}>
          <h1 style={{ margin: 0, fontSize: 36, lineHeight: 1.1, letterSpacing: 0.5 }}>
            Urban Axis
          </h1>
          <p style={{ opacity: 0.9, marginTop: 10, fontSize: 16 }}>
            Minimal, edgy, and engineered for movement. New drops weekly.
          </p>
          <div style={{ marginTop: 18, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/products" style={{ background: '#fff', color: '#111', borderRadius: 999, padding: '12px 18px', textDecoration: 'none', border: '1px solid #fff', fontWeight: 600 }}>
              Shop Now
            </Link>
            <Link href="/men/tops" style={{ background: 'transparent', color: '#fff', borderRadius: 999, padding: '12px 18px', textDecoration: 'none', border: '1px solid #fff' }}>
              Explore Men
            </Link>
            <Link href="/women/tops" style={{ background: 'transparent', color: '#fff', borderRadius: 999, padding: '12px 18px', textDecoration: 'none', border: '1px solid #fff' }}>
              Explore Women
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED CATEGORIES */}
      <section style={{ maxWidth: 1200, margin: '28px auto 8px', padding: '0 16px' }}>
        <h2 style={{ fontSize: 20, marginBottom: 16 }}>Featured Categories</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12 }}>
          <CategoryCard title="Men — Tops" href="/men/tops" />
          <CategoryCard title="Men — Bottoms" href="/men/bottoms" />
          <CategoryCard title="Men — Jackets" href="/men/jackets" />
          <CategoryCard title="Men — Accessories" href="/men/accessories" />
          <CategoryCard title="Women — Tops" href="/women/tops" />
          <CategoryCard title="Women — Bottoms" href="/women/bottoms" />
          <CategoryCard title="Women — Jackets" href="/women/jackets" />
          <CategoryCard title="Women — Accessories" href="/women/accessories" />
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section style={{ maxWidth: 1200, margin: '24px auto', padding: '0 16px' }}>
        <h2 style={{ fontSize: 20, marginBottom: 16 }}>New & Noteworthy</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16 }}>
          {featured.map((p) => {
            const name = getName(p);
            const price = getPrice(p);
            const slug = getSlug(p);
            return (
              <Link
                key={slug}
                href={`/products/${slug}`}
                style={{ textDecoration: 'none', color: '#111', border: '1px solid #eee', borderRadius: 12, overflow: 'hidden', background: '#fff' }}
              >
                <div style={{ aspectRatio: '1/1', background: '#f4f4f5', display: 'grid', placeItems: 'center', fontSize: 12, letterSpacing: 0.4 }}>
                  IMG
                </div>
                <div style={{ padding: 12 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.2 }}>{name}</div>
                  <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>${price.toFixed(2)}</div>
                </div>
              </Link>
            );
          })}
        </div>
        <div style={{ textAlign: 'center', marginTop: 18 }}>
          <Link href="/products" style={{ textDecoration: 'none', color: '#111', borderBottom: '1px solid #111', paddingBottom: 2 }}>
            View all products →
          </Link>
        </div>
      </section>
    </div>
  );
}

function CategoryCard({ title, href }: { title: string; href: string }) {
  return (
    <Link
      href={href}
      style={{
        display: 'block',
        textDecoration: 'none',
        color: '#111',
        border: '1px solid #eee',
        borderRadius: 12,
        overflow: 'hidden',
        background: '#fff',
      }}
    >
      <div
        style={{
          aspectRatio: '3/2',
          background: 'linear-gradient(135deg, #f4f4f5 0%, #ececee 100%)',
          display: 'grid',
          placeItems: 'center',
          fontSize: 12,
          letterSpacing: 0.4,
        }}
      >
        COVER
      </div>
      <div style={{ padding: 12, fontWeight: 600, fontSize: 14 }}>{title}</div>
    </Link>
  );
}
