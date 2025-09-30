// app/products/[slug]/page.tsx
// Robust product page that derives slugs via helper; no direct p.slug access.
import { loadAllProducts } from '@/lib/loadProducts';
import { getSlug, productPrimaryImage, formatPrice } from '@/lib/productUtils';

type PageProps = { params: { slug: string } };

export async function generateStaticParams() {
  const all = await loadAllProducts();
  // Keep list short to avoid long builds; rest will be dynamic.
  const take = all.slice(0, 80);

  const slugs = take
    .map((p: any) => getSlug(p))
    .filter((s): s is string => Boolean(s));

  // Deduplicate
  const seen = new Set<string>();
  const unique = slugs.filter((s) => (seen.has(s) ? false : (seen.add(s), true)));

  return unique.map((slug) => ({ slug }));
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = params;
  const all = await loadAllProducts();

  // Find by computed slug (primary), then fallbacks to url/id equality.
  const product =
    all.find((p: any) => getSlug(p) === slug) ??
    all.find((p: any) => p?.url === slug || p?.id === slug);

  if (!product) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Product not found</h1>
        <p>We couldn&apos;t find that item. Try browsing the catalog.</p>
        <a href="/" style={{ color: '#2563eb', textDecoration: 'underline' }}>
          Back to Home
        </a>
      </main>
    );
  }

  const img = productPrimaryImage(product);
  const price = formatPrice((product as any)?.price);

  return (
    <main style={{ padding: 24, display: 'grid', gap: 16, maxWidth: 1000, margin: '0 auto' }}>
      <a href="/" style={{ textDecoration: 'none', color: '#2563eb' }}>← Back</a>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          {img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={(product as any)?.title ?? 'Product image'}
              src={img}
              style={{ width: '100%', height: 480, objectFit: 'cover', borderRadius: 12 }}
            />
          ) : (
            <div style={{ width: '100%', height: 480, background: '#f3f4f6', borderRadius: 12 }} />
          )}
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          <h1 style={{ margin: 0 }}>{(product as any)?.title ?? 'Untitled product'}</h1>
          {price && <div style={{ fontSize: 18, color: '#6b7280' }}>{price}</div>}
          {(product as any)?.tags?.length ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {(product as any).tags.map((t: string, i: number) => (
                <span key={i} style={{ border: '1px solid #e5e7eb', borderRadius: 999, padding: '4px 10px' }}>
                  {t}
                </span>
              ))}
            </div>
          ) : null}
          {(product as any)?.url ? (
            <a
              href={(product as any).url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                background: '#111827',
                color: 'white',
                padding: '10px 14px',
                borderRadius: 8,
                textDecoration: 'none',
                width: 'fit-content',
                marginTop: 8,
              }}
            >
            </a>
          ) : null}
        </div>
      </div>
    </main>
  );
}
