// app/(catalog)/CategoryPage.tsx
import { loadAllProducts } from "@/lib/loadProducts";
import { filterProducts, normalizeCategory, Gender, Category } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";

type Props = {
  gender: Gender;
  category?: Category;
  title?: string;
  description?: string;
};

export default async function CategoryPage(props: Props) {
  const { gender, category, title, description } = props;

  const all = await loadAllProducts();
  const cat = category ? normalizeCategory(category) : undefined;
  const items = filterProducts(all, { gender, category: cat });

  return (
    <main style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <header style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>
          {title ?? `${gender.toUpperCase()}${cat ? ` — ${cat.toUpperCase()}` : ""}`}
        </h1>
        {description ? <p style={{ opacity: 0.8 }}>{description}</p> : null}
      </header>

      {items.length === 0 ? (
        <p>No products found for this category yet. Check back soon.</p>
      ) : (
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 16,
          }}
        >
          {items.map((p, idx) => (
            <ProductCard key={`${p.slug ?? p.id ?? idx}`} product={p} />
          ))}
        </section>
      )}
    </main>
  );
}
