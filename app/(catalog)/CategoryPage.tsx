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

function normalizeGender(input: any): Gender | 'unisex' | undefined {
  if (!input) return undefined;
  const s = String(input).toLowerCase();
  if (['men', 'male', 'm'].includes(s)) return 'men';
  if (['women', 'female', 'w'].includes(s)) return 'women';
  if (['unisex', 'all'].includes(s)) return 'unisex';
  return undefined;
}

export default async function CategoryPage({ gender, category, title }: Props) {
  const allRaw = await loadAllProducts();
  const all = allRaw.map((p: any) => ({
    ...p,
    gender: normalizeGender(p?.gender),
  }));

  const cat = category ? normalizeCategory(category) : undefined;
  const items = filterProducts(all, { gender, category: cat });

  return (
    <main style={{ padding: 24 }}>
      <h1>{title ?? `${gender.toUpperCase()}${cat ? ` • ${cat.toUpperCase()}` : ''}`}</h1>
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
    </main>
  );
}
