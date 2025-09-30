"use client";

import { useState } from "react";
import { addItem } from "@/lib/cart";
import {
  getBySlug,
  getImageForColor,
  getImage,
  getColors,
  getName,
  getPrice,
} from "@/lib/productUtils";

export default function QuickView({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false);
  const product = getBySlug(slug) ?? null;

  const name = product ? getName(product) : "Untitled";
  const price = product ? Number(getPrice(product)) || 0 : 0;
  const colors = product ? getColors(product) : [];
  const [color, setColor] = useState<string | null>(colors[0] ?? null);
  const img =
    product && (color ? getImageForColor(product, color) : getImage(product));

  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => setOpen(true)} style={{ border: "1px solid var(--border)", padding: 12, borderRadius: 8, background: "transparent" }}>
        Quick View
      </button>

      {open && (
        <div style={{ border: "1px solid var(--border)", padding: 12, borderRadius: 8, marginTop: 12, background: "var(--card)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0 }}>{name}</h3>
            <button onClick={() => setOpen(false)} style={{ border: "1px solid var(--border)", background: "var(--card)", borderRadius: 8, padding: "6px 10px" }}>
              ✕
            </button>
          </div>

          {img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={img} alt={name} style={{ width: "100%", height: 240, objectFit: "cover", borderRadius: 10, marginTop: 10 }} />
          ) : null}

          <div style={{ marginTop: 6, fontWeight: 700 }}>${price.toFixed(2)}</div>

          {!!colors.length && (
            <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    border: `2px solid ${c === color ? "black" : "#ddd"}`,
                    background: c,
                    cursor: "pointer",
                  }}
                  aria-label={c}
                  title={c}
                />
              ))}
            </div>
          )}

          <button
            onClick={() => {
              const id = (product && (product as any).slug) ?? slug;
              addItem({ id, title: name, price, image: img ?? undefined, quantity: 1 });
              window.dispatchEvent(new Event("cart:update"));
              setOpen(false);
            }}
            style={{ marginTop: 12, padding: "8px 12px", borderRadius: 8, background: "black", color: "white", border: "1px solid black" }}
          >
            Add to Cart
          </button>
        </div>
      )}
    </div>
  );
}
