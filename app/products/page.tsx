import Link from 'next/link';
import Image from 'next/image';
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
          gap: 16,
        }}
      >
        {products.map((p: any) => {
          const imgSrc = p.image ?? '/placeholder.svg';
          return (
            <div key={p.slug} style={{ border: '1px solid #eee', borderRadius: 8, padding: 12 }}>
              <Link
                href={`/products/${p.slug}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', marginBottom: 8 }}>
                  <Image
                    src={imgSrc}
                    alt={p.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    style={{ objectFit: 'cover', borderRadius: 6 }}
                  />
                </div>
                <h3 style={{ margin: '8px 0' }}>{p.name}</h3>
                <p style={{ margin: 0, color: '#555' }}>${Number(p.price).toFixed(2)}</p>
              </Link>

              <div style={{ marginTop: 10 }}>
                {/* ✅ BuyButton only needs slug (qty optional) */}
                <BuyButton slug={p.slug} quantity={1} />
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
