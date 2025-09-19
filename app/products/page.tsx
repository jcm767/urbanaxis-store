import Image from 'next/image';
import { notFound } from 'next/navigation';
import { products } from '@/lib/products';
import BuyButton from '@/components/BuyButton';

type PageProps = { params: { slug: string } };

export default function ProductDetail({ params }: PageProps) {
  const product = products.find((p: any) => p.slug === params.slug);
  if (!product) return notFound();

  // Allow catalogs without variants
  const anyProduct = product as any;
  const color: string | undefined = anyProduct?.colors?.[0];
  const size: string | undefined = anyProduct?.sizes?.[0];

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}>
          <Image
            src={product.image ?? '/placeholder.svg'}
            alt={product.name}
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
            style={{ objectFit: 'cover', borderRadius: 8 }}
          />
        </div>

        <div>
          <h1 style={{ marginBottom: 8 }}>{product.name}</h1>
          <p style={{ marginBottom: 16, color: '#555' }}>{product.description}</p>
          <strong style={{ display: 'block', marginBottom: 16 }}>
            ${product.price.toFixed(2)}
          </strong>

          <BuyButton
            name={product.name}
            price={product.price}
            color={color}
            size={size}
            quantity={1}
          />

          <div style={{ marginTop: 12 }}>
            <a href={product.sourceUrl} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#555' }}>
              View on AliExpress
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
