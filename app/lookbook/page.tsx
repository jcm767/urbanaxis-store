// app/lookbook/page.tsx
import { loadAllProducts } from "@/lib/loadProducts";
import ProductCard from "@/components/ProductCard";

export const revalidate = 60; // cache a bit, keep it fresh

export default async function LookbookPage() {
  const items = await loadAllProducts();

  // pick a nice curated slice for the lookbook (no redirects, just our own PDP)
  const showcase = items.slice(0, 16);

  return (
    <main style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>
        Lookbook
      </h1>
      <p style={{ color: "var(--muted-foreground)", marginBottom: 20 }}>
        Fresh fits from Urban Axis. Tap any product to view details.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        {showcase.map((p, i) => (
          <ProductCard key={p.id ?? `lookbook-${i}`} product={p} />
        ))}
      </div>
    </main>
  );
}
