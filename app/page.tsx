// app/page.tsx
import Link from "next/link";
import { loadAllProducts, primaryImage } from "@/lib/loadProducts";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-static";

export default async function HomePage() {
  const all = await loadAllProducts();

  // Curated appear first because loadAllProducts() returns UA first.
  const curated = all.slice(0, 8);
  const fallback = all.slice(8, 20);

  return (
    <main style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <section style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0 }}>Urban Axis</h1>
        <p style={{ opacity: 0.8, marginTop: 8 }}>
          Streetwear, elevated. Shop curated drops and everyday essentials.
        </p>
      </section>

      <nav
        aria-label="Shop Categories"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 12,
          marginBottom: 28,
        }}
      >
        <Link href="/men" style={tileStyle}>Men</Link>
        <Link href="/women" style={tileStyle}>Women</Link>
        <Link href="/men/tops" style={tileStyleSmall}>Men • Tops</Link>
        <Link href="/men/bottoms" style={tileStyleSmall}>Men • Bottoms</Link>
        <Link href="/men/jackets" style={tileStyleSmall}>Men • Jackets</Link>
        <Link href="/men/accessories" style={tileStyleSmall}>Men • Accessories</Link>
        <Link href="/women/tops" style={tileStyleSmall}>Women • Tops</Link>
        <Link href="/women/bottoms" style={tileStyleSmall}>Women • Bottoms</Link>
        <Link href="/women/jackets" style={tileStyleSmall}>Women • Jackets</Link>
        <Link href="/women/accessories" style={tileStyleSmall}>Women • Accessories</Link>
      </nav>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ margin: "0 0 12px" }}>New &amp; Noteworthy</h2>
        <div style={gridStyle}>
          {curated.map((p, i) => (
            <ProductCard key={`curated-${p.slug ?? i}`} product={p} />
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ margin: "0 0 12px" }}>Trending Now</h2>
        <div style={gridStyle}>
          {fallback.map((p, i) => (
            <ProductCard key={`fallback-${p.slug ?? i}`} product={p} />
          ))}
        </div>
      </section>
    </main>
  );
}

const tileStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 16,
  border: "1px solid #e6e6e6",
  padding: "16px 12px",
  textDecoration: "none",
  fontWeight: 600,
};

const tileStyleSmall: React.CSSProperties = {
  ...tileStyle,
  fontWeight: 500,
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
  gap: 16,
};
