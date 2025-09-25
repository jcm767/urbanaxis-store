// app/products/page.tsx
import Link from 'next/link';
import { getAllProducts, getName, getPrice, getSlug, getImage } from '@/lib/productUtils';

export default async function ProductsPage() {
  const items = await getAllProducts();

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 16 }}>All Products</h1>
      {items.length === 0 ? (
        <p>No products yet.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 16,
          }}
        >
          {items.map((p: any, i: number) => {
            const img = getImage(p);
            const slug = getSlug(p) || `item-${i}`;
            return (
              <Link
                key={p.id ?? slug}
                href={`/products/${encodeURIComponent(slug)}`}
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
                {img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img alt={getName(p)} src={img} style={{ width: '100%', height: 220, objectFit: 'cover' }} loading="lazy" />
                ) : (
                  <div style={{ width: '100%', height: 220, background: '#f3f4f6' }} />
                )}
                <div style={{ padding: '0 12px' }}>
                  <div style={{ color: '#111827', marginBottom: 4 }}>{getName(p)}</div>
                  <div style={{ color: '#6b7280', fontSize: 14 }}>{getPrice(p?.price)}</div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
