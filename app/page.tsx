import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { loadAllProducts } from "@/lib/loadProducts";

export const revalidate = 60;

function toNumber(v: unknown): number {
  if (typeof v === "number") return v;
  if (v == null) return 0;
  const n = Number(String(v).replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export default async function Home() {
  const all = await loadAllProducts();
  const featured = all.slice(0, 12).map((p: any) => ({
    ...p,
    price: toNumber(p?.price),
  }));

  return (
    <main style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}>
        Urban Axis
      </h1>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 16 }}>
        {featured.map((p: any, i: number) => (
          <ProductCard key={p.id ?? p.slug ?? \`home-\${i}\`} product={p} />
        ))}
      </section>

      <div style={{ marginTop: 24, textAlign: "center" }}>
        <Link href="/products" style={{ textDecoration: "underline" }}>
          Browse all products →
        </Link>
      </div>
    </main>
  );
}
