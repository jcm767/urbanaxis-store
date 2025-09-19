// components/ProductCard.tsx
import Image from "next/image";
import type { Product } from "@/lib/products";

export default function ProductCard({ p }: { p: Product }) {
  return (
    <article className="ua-card">
      <div className="ua-card-media">
        {/* Product images should remain in color — no grayscale filter here */}
        <Image
          src={p.image}
          alt={p.name}
          width={800}
          height={800}
          sizes="(max-width: 600px) 50vw, (max-width: 900px) 33vw, 25vw"
          priority
        />
      </div>
      <div className="ua-card-body">
        <h3 className="ua-title">{p.name}</h3>
        <p className="ua-price">${p.price.toFixed(2)}</p>
        <p className="ua-desc">{p.description}</p>
        <a className="ua-buy" href={p.sourceUrl} target="_blank" rel="noreferrer">
          View / Buy
        </a>
      </div>
    </article>
  );
}
