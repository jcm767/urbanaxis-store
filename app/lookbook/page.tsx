// app/lookbook/page.tsx
import { loadAllProducts } from "@/lib/loadProducts";
import ProductCard from "@/components/ProductCard";

export const revalidate = 60;

type ProductForCard = {
  id?: string;
  slug?: string;
  title?: string;
  name?: string;
  price?: number;             // ensure number for ProductCard
  image?: string | null;
  images?: any;
  gender?: string;
  category?: string;
};

function toNumber(v: unknown): number {
  if (typeof v === "number") return v;
  if (v == null) return 0;
  const n = Number(String(v).replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export default async function LookbookPage() {
  const all = await loadAllProducts();

  // pick a stable slice for the lookbook
  const showcase = all.slice(0, 16);

  // normalize price -> number to satisfy ProductCard types
  const cardItems: ProductForCard[] = showcase.map((p: any) => ({
    ...p,
    price: toNumber(p?.price),
  }));

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
        {cardItems.map((p, i) => (
          <ProductCard key={p.id ?? p.slug ?? `lookbook-${i}`} product={p as any} />
        ))}
      </div>
    </main>
  );
}
