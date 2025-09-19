import Link from 'next/link';
import Image from 'next/image';
import { products } from '@/lib/products';

export default function Home() {
  return (
    <main style={{ padding: 24, display: 'grid', gap: 20 }}>
      <h1>Urban Axis Store</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
        {products.map((p) => (
          <Link key={p.slug} href={`/products/${p.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 12 }}>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', marginBottom: 8 }}>
                <Image src={p.image} alt={p.name} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: 'cover', borderRadius: 6 }} />
              </div>
              <h3 style={{ margin: '8px 0' }}>{p.name}</h3>
              <p style={{ margin: 0, color: '#555' }}>${p.price.toFixed(2)}</p>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: 8 }}>
        <Link href="/products">View all products →</Link>
      </div>
    </main>
  );
}
