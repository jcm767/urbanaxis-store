"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  type CartItem,
  getCart,
  updateQty,
  removeItem,
  clearCart,
} from "@/lib/cart";

export default function MiniCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  function refresh() {
    setItems(getCart());
  }

  useEffect(() => {
    refresh();
    const onUpdate = () => refresh();
    window.addEventListener("cart:update", onUpdate);
    return () => window.removeEventListener("cart:update", onUpdate);
  }, []);

  const subtotal = items.reduce((sum, it) => sum + it.price * (it.quantity ?? 1), 0);

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ border: "1px solid #eee", borderRadius: 8, padding: "6px 10px", background: "transparent" }}
      >
        Cart ({items.reduce((n, it) => n + (it.quantity ?? 1), 0)})
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 8px)",
            width: 360,
            background: "var(--card, #fff)",
            border: "1px solid var(--border, #eee)",
            borderRadius: 12,
            padding: 12,
            boxShadow: "0 8px 24px rgba(0,0,0,.08)",
            zIndex: 40,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <strong>Mini Cart</strong>
            <button
              onClick={() => { clearCart(); refresh(); window.dispatchEvent(new Event("cart:update")); }}
              style={{ border: "1px solid #eee", padding: "6px 10px", borderRadius: 8, background: "transparent" }}
            >
              Clear
            </button>
          </div>

          {!items.length && <div style={{ opacity: .75 }}>Your cart is empty.</div>}

          {!!items.length && (
            <div style={{ display: "grid", gap: 10 }}>
              {items.map((it) => (
                <div
                  key={`${it.id}-${it.size ?? "nosize"}`}
                  style={{ display: "grid", gridTemplateColumns: "64px 1fr", gap: 10, alignItems: "center" }}
                >
                  <div style={{ width: 64, height: 64, overflow: "hidden", borderRadius: 8, border: "1px solid #eee" }}>
                    {it.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={it.image} alt={it.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : null}
                  </div>

                  <div>
                    <div style={{ fontWeight: 600, lineHeight: 1.2 }}>
                      <Link href={`/products/${it.id}`}>{it.title}</Link>
                    </div>
                    <div style={{ fontSize: 12, opacity: .8 }}>
                      {it.size ? <>Size: {it.size} · </> : null}${it.price.toFixed(2)}
                    </div>

                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 6 }}>
                      <input
                        type="number"
                        min={1}
                        max={99}
                        value={it.quantity}
                        onChange={(e) => {
                          const next = Math.max(1, Number(e.target.value) || 1);
                          updateQty(it.id, it.size, next);
                          refresh();
                          window.dispatchEvent(new Event("cart:update"));
                        }}
                        style={{ width: 64, padding: "6px 8px", border: "1px solid #ddd", borderRadius: 8 }}
                      />
                      <button
                        onClick={() => {
                          removeItem(it.id, it.size);
                          refresh();
                          window.dispatchEvent(new Event("cart:update"));
                        }}
                        style={{ border: "1px solid #eee", background: "transparent", borderRadius: 8, padding: "6px 8px", cursor: "pointer" }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!!items.length && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
              <div style={{ fontWeight: 700 }}>Subtotal: ${subtotal.toFixed(2)}</div>
              <Link
                href="/cart"
                onClick={() => setOpen(false)}
                style={{ border: "1px solid #111", color: "#fff", background: "#111", borderRadius: 8, padding: "8px 12px" }}
              >
                View Cart
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
