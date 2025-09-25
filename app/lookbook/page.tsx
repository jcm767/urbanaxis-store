// app/lookbook/page.tsx
import { getAllProducts, getName, getImage, getSlug } from '@/lib/productUtils';

export default async function LookbookPage() {
  const items = await getAllProducts();

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 16 }}>Lookbook</h1>
      {items.length === 0 ? (
        <p>No products to showcase yet.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 16,
          }}
        >
          {items.map((p: any, i: number) => {
            const img = getImage(p);
            const slug = getSlug(p) || `item-${i}`;
            return (
              <a
                key={p.id ?? slug}
                href={`/products/${encodeURIComponent(slug)}`}
                style={{
                  display: 'block',
                  borderRadius: 12,
                  overflow: 'hidden',
                  border: '1px solid #e5e7eb',
                  textDecoration: 'none',
                }}
              >
                {img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img alt={getName(p)} src={img} style={{ width: '100%', height: 280, objectFit: 'cover' }} loading="lazy" />
                ) : (
                  <div style={{ width: '100%', height: 280, background: '#f3f4f6' }} />
                )}
                <div style={{ padding: 12, color: '#111827' }}>{getName(p)}</div>
              </a>
            );
          })}
        </div>
      )}
    </main>
  );
}
