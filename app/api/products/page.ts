// app/products/page.tsx
import { products } from '@/lib/products';
import BuyButton from '@/components/BuyButton';

export default function ProductsPage() {
  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 24 }}>Products</h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 24,
        }}
      >
        {products.map((p) => (
          <article
            key={p.slug}
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              padding: 16,
              background: 'white',
            }}
          >
            {/* Using plain <img> so we don't need Next image config right now */}
            <img
              src={p.image}
              alt={p.name}
              style={{
                width: '100%',
                height: 220,
                objectFit: 'cover',
                borderRadius: 6,
                marginBottom: 12,
              }}
            />

            <h2 style={{ margin: '6px 0 4px' }}>{p.name}</h2>
            <p style={{ color: '#6b7280', fontSize: 14, margin: '0 0 8px' }}>
              {p.description}
            </p>
            <div style={{ fontWeight: 600, marginBottom: 12 }}>
              ${p.price.toFixed(2)}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <BuyButton />
              {p.sourceUrl && (
                <a
                  href={p.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: 6,
                    textDecoration: 'none',
                  }}
                >
                  Supplier
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
