"use client";

type Product = {
  id?: string;
  title?: string;
  price?: number;
  url?: string;
  image?: string;
  images?: string[];
};

export default function ProductCard({ product }: { product: Product }) {
  const {
    title = "Untitled",
    price = 0,
    url = "#",
    image,
    images = [],
  } = product || {};

  // Always prefer explicit cover image, else first in array
  const cover = image ?? (Array.isArray(images) && images.length > 0 ? images[0] : undefined);

  return (
    <div style={{ padding: 12, borderRadius: 8, background: "var(--card, #111)", color: "var(--text, #fff)" }}>
      <a href={url} target="_blank" rel="noreferrer" style={{ display: "block" }}>
        <div style={{ width: "100%", aspectRatio: "1 / 1", overflow: "hidden", borderRadius: 8, background: "#111" }}>
          {cover ? (
            <img
              src={cover}
              alt={title}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              loading="lazy"
            />
          ) : (
            <div style={{ width: "100%", height: "100%", background: "#222" }} />
          )}
        </div>
      </a>

      <div style={{ marginTop: 12 }}>
        <div style={{ fontSize: 14, lineHeight: 1.35 }}>{title}</div>
        <div style={{ marginTop: 6, opacity: 0.75 }}>${price.toFixed(2)}</div>

        <div style={{ marginTop: 8 }}>
          <a href={url} target="_blank" rel="noreferrer">
            <button>Add to Cart</button>
          </a>
        </div>
      </div>
    </div>
  );
}
