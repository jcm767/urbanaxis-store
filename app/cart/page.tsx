"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  type CartItem,
  getCart,
  updateQty,
  updateSize,
  removeItem,
  clearCart,
} from "@/lib/cart";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(getCart());
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + it.price * (it.quantity ?? 1), 0),
    [items]
  );

  function refresh() {
    setItems(getCart());
  }

  function handleQty(id: string, size: string | undefined, qty: number) {
    updateQty(id, size, qty);
    refresh();
  }

  function handleSize(id: string, newSize: string | undefined) {
    updateSize(id, newSize);
    refresh();
  }

  function handleRemove(id: string, size?: string) {
    removeItem(id, size);
    refresh();
  }

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>Cart</h1>

      {!items.length && <p>Your cart is empty.</p>}

      {!!items.length && (
        <>
          <div style={{ display: "grid", gap: 12 }}>
            {items.map((it) => (
              <div
                key={`${it.id}-${it.size ?? "nosize"}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "96px 1fr",
                  gap: 12,
                  border: "1px solid var(--border, #eee)",
                  borderRadius: 8,
                  padding: 12,
                }}
              >
                <div style={{ width: 96, height: 96, overflow: "hidden" }}>
                  {it.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={it.image}
                      alt={it.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : null}
                </div>

                <div>
                  <div style={{ fontWeight: 600 }}>
                    <Link href={`/products/${it.id}`}>{it.title}</Link>
                  </div>

                  <div style={{ opacity: 0.8, fontSize: 13 }}>
                    ${it.price.toFixed(2)}
                  </div>

                  <div style={{ display: "flex", gap: 10, marginTop: 8, alignItems: "center", flexWrap: "wrap" }}>
                    <label>
                      Qty:&nbsp;
                      <input
                        type="number"
                        min={1}
                        value={it.quantity}
                        onChange={(e) =>
                          handleQty(it.id, it.size, Number(e.target.value))
                        }
                        style={{ width: 64 }}
                      />
                    </label>

                    <label>
                      Size:&nbsp;
                      <input
                        type="text"
                        placeholder="(optional)"
                        value={it.size ?? ""}
                        onChange={(e) =>
                          handleSize(it.id, e.target.value || undefined)
                        }
                        style={{ width: 96 }}
                      />
                    </label>

                    <button
                      onClick={() => handleRemove(it.id, it.size)}
                      style={{
                        border: "1px solid var(--border, #ddd)",
                        background: "var(--card, #fff)",
                        borderRadius: 8,
                        padding: "6px 10px",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between" }}>
            <button
              onClick={() => { clearCart(); refresh(); }}
              style={{
                border: "1px solid var(--border, #ddd)",
                background: "var(--card, #fff)",
                borderRadius: 8,
                padding: "8px 12px",
              }}
            >
              Clear cart
            </button>

            <div style={{ fontWeight: 700, fontSize: 18 }}>
              Subtotal: ${subtotal.toFixed(2)}
            </div>
          </div>
        </>
      )}
    </main>
  );
}
