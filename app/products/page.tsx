// app/products/page.tsx
// Simple unified catalog index using the merged loader + ProductCard.
// Removes old imports that caused build errors.

import ProductCard from "@/components/ProductCard";
import { loadAllProducts } from "@/lib/loadProducts";

export const dynamic = "force-static";

export default async function AllProductsPage() {
  const all = await loadAllProducts(); // curated first, then legacy

  return (
    <main style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <header style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>All Products</h1>
        <p style={{ opacity: 0.8 }}>Curated + legacy feed combined.</p>
      </header>

      {all.length === 0 ? (
        <p>No products available yet.</p>
      ) : (
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 16,
          }}
        >
          {all.map((p, idx) => (
            <ProductCard key={`${p.slug ?? p.id ?? idx}`} product={p} />
          ))}
        </section>
      )}
    </main>
  );
}
