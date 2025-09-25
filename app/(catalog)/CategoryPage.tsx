// app/(catalog)/CategoryPage.tsx
import ProductCard from '@/components/ProductCard';
import { loadAllProducts } from '@/lib/loadProducts';
import { filterProducts, normalizeCategory, type Gender, type Category } from '@/lib/catalog';
import { productPrimaryImage } from '@/lib/productUtils';

type Props = {
  gender: Gender;
  category?: Category;
  title?: string;
};

// Normalize any free-form gender strings coming from legacy feeds
function normalizeGender(input: any): Gender | 'unisex' | undefined {
  if (!input) return undefined;
  const s = String(input).toLowerCase();
  if (s === 'men' || s === 'male' || s === 'm') return 'men';
  if (s === 'women' || s === 'female' || s === 'w') return 'women';
  if (s === 'unisex' || s === 'all') return 'unisex';
  return undefined;
}

export default async function CategoryPage({ gender, category, title }: Props) {
  const allRaw = await loadAllProducts();

  // Coerce product.gender to the accepted union so filterProducts' types are happy
  const all = allRaw.map((p: any) => ({
    ...p,
    gender: normalizeGender(p?.gender),
    category: p?.category, // let filterProducts + normalizeCategory handle this
  }));

  const cat = category ? normalizeCategory(category) : undefined;
  const items = filterProducts(all, { gender, category: cat });

  return (
    <main style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 16 }}>
        {title ?? `${gender.toUpperCase()}${cat ? ` • ${cat.toUpperCase()}` : ''}`}
      </h1>

      {items.length === 0 ? (
        <p>No products found for this category yet. Check back soon.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 16,
          }}
        >
          {items.map((p: any, i: number) => (
            <ProductCard
              key={p.id ?? p.slug ?? p.url ?? i}
              product={{
                ...p,
                image: p.image ?? productPrimaryImage(p),
              }}
            />
          ))}
        </div>
      )}
    </main>
  );
}
