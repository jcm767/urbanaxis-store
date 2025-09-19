// app/page.tsx
import Image from "next/image";
import { products } from "@/lib/products";
import BuyButton from "@/components/BuyButton";

export default function Home() {
  return (
    <main style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>Urban Axis Store</h1>

      <div style={{ display: "grid", gap: 24 }}>
        {products.map((p) => (
          <div key={p.slug} style={{ border: "1px solid #eee", padding: 16 }}>
            <h2 style={{ margin: "0 0 8px", fontSize: 20 }}>{p.name}</h2>
            <p style={{ margin: "0 0 8px" }}>${p.price.toFixed(2)}</p>
            <p style={{ margin: "0 0 12px", color: "#555" }}>{p.description}</p>

            {p.image ? (
              <Image
                src={p.image}
                alt={p.name}
                width={320}
                height={320}
                style={{ objectFit: "cover", borderRadius: 8 }}
              />
            ) : null}

            <div style={{ marginTop: 12 }}>
              <BuyButton slug={p.slug} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
