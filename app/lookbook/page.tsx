// app/lookbook/page.tsx
// Visual-first grid that uses primary images from the unified loader.
// Eliminates missing imports from productUtils.

import Image from "next/image";
import Link from "next/link";
import { loadAllProducts, primaryImage } from "@/lib/loadProducts";

export const dynamic = "force-static";

export default async function LookbookPage() {
  const all = await loadAllProducts();
  const showcase = all.slice(0, 24); // a lightweight selection

  return (
    <main style={{ padding: 24, maxWidth: 1400, margin: "0 auto" }}>
      <header style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Lookbook</h1>
        <p style={{ opacity: 0.8 }}>
          A visual pass through curated and trending pieces.
        </p>
      </header>

      {showcase.length === 0 ? (
        <p>Nothing to show yet.</p>
      ) : (
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          {showcase.map((p, i) => {
            const img = primaryImage(p);
            const title = p.title ?? p.name ?? "Untitled";
            return (
              <Link
                key={p.slug ?? p.id ?? i}
                href={`/products/${p.slug}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div
                  style={{
                    borderRadius: 14,
                    overflow: "hidden",
                    border: "1px solid #eee",
                    background: "#fff",
                  }}
                >
                  <div style={{ aspectRatio: "1/1", position: "relative" }}>
                    {img ? (
                      <Image
                        src={img}
                        alt={title}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="(max-width: 768px) 50vw, 25vw"
                        priority={i < 6}
                      />
                    ) : (
                      <div style={{ width: "100%", height: "100%", background: "#f2f2f2" }} />
                    )}
                  </div>
                  <div style={{ padding: 12 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.3 }}>
                      {title}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </section>
      )}
    </main>
  );
}
