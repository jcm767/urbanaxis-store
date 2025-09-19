// components/BuyButton.tsx
"use client";
import { useState } from "react";

type Props = {
  slug: string;
  defaultSize?: string;
  defaultColor?: string;
};

export default function BuyButton({ slug, defaultSize = "M", defaultColor = "Black" }: Props) {
  const [loading, setLoading] = useState(false);

  async function goCheckout() {
    try {
      setLoading(true);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          size: defaultSize,
          color: defaultColor,
          quantity: 1,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");

      window.location.href = data.url; // Go to Stripe Checkout
    } catch (e: any) {
      alert(e.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={goCheckout}
      disabled={loading}
      style={{ padding: "8px 12px", border: "1px solid #ccc", borderRadius: 6 }}
    >
      {loading ? "Loading..." : "Buy"}
    </button>
  );
}
