import { products } from "@/lib/products";
import BuyButton from "@/components/BuyButton";

export default function Home() {
  return (
    <main style={{ padding: 24, display: "grid", gap: 20 }}>
      <h1>Urban Axis Store</h1>
      {products.map((p) => (
        <div key={p.slug} style={{ border: "1px solid #ccc", padding: 16 }}>
          <h2>{p.name}</h2>
          <p>{p.description}</p>
          <p>${p.price}</p>
          <img src={p.image} alt={p.name} style={{ maxWidth: 200 }} />
          <BuyButton slug={p.slug} name={p.name} price={p.price} />
        </div>
      ))}
    </main>
  );
}
