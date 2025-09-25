// app/products/[slug]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { loadAllProducts, primaryImage } from "@/lib/loadProducts";
import { formatPrice } from "@/lib/productUtils";

type PageProps = { params: { slug: string } };

export const dynamicParams = true;

export async function generateStaticParams() {
  const all = await loadAllProducts();
  // Keep static params small to avoid timeouts; fallback to dynamic for the rest.
  return all.slice(0, 80).map((p) => ({ slug: p.slug! })).filter(Boolean);
}

export default async function ProductPage({ params }: PageProps) {
  const all = await loadAllProducts();
  const item = all.find((p) => p.slug === params.slug);

  if (!item) {
    return (
      <main style={{ padding: 24 }}>
        <p>Product not found.</p>
        <Link href="/">← Back to Home</Link>
      </main>
    );
  }

  const img = primaryImage(item);
  const title = item.title ?? item.name ?? "Untitled";
  const price = item.price ?? 0;
  const url = item.url ?? "/";

  return (
    <main style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <Link href="/" style={{ display: "inline-block", marginBottom: 16 }}>
        ← Back
      </Link>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div>
          {img ? (
            /* Next Image requires next.config.js remotePatterns for AliExpress/alcdn images */
            <Image
              src={img}
              alt={title}
              width={900}
              height={900}
              style={{ width: "100%", height: "auto", borderRadius: 12, objectFit: "cover" }}
              priority
            />
          ) : (
            <div style={{ width: "100%", aspectRatio: "1/1", background: "#f2f2f2", borderRadius: 12 }} />
          )}
        </div>

        <div>
          <h1 style={{ marginTop: 0 }}>{title}</h1>
          <p style={{ fontSize: 18, fontWeight: 600, margin: "8px 0 20px" }}>
            {typeof price === "number" ? formatPrice(price) : price}
          </p>

          <div style={{ display: "flex", gap: 12 }}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "12px 16px",
                borderRadius: 10,
                border: "1px solid #111",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              View Source Product
            </a>
            <Link
              href="/"
              style={{
                padding: "12px 16px",
                borderRadius: 10,
                border: "1px solid #e6e6e6",
                textDecoration: "none",
              }}
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
