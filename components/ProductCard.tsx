import Link from 'next/link';
import Image from 'next/image';

type Product = {
  slug: string;
  name: string;
  price: number;
  image?: string | null;
};

export default function ProductCard({ product }: { product: Product }) {
  const imgSrc = product.image ?? '/placeholder.svg';

  return (
    <Link href={`/products/${product.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 12 }}>
        <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', marginBottom: 8 }}>
          <Image
            src={imgSrc}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            style={{ objectFit: 'cover', borderRadius: 6 }}
          />
        </div>
        <h3 style={{ margin: '8px 0' }}>{product.name}</h3>
        <p style={{ margin: 0, color: '#555' }}>${product.price.toFixed(2)}</p>
      </div>
    </Link>
  );
}
