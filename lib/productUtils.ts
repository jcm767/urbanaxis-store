export function productPrimaryImage(p: any): string | null {
  if (!p) return null;
  if (Array.isArray(p.images) && p.images.length) return p.images[0];
  if (typeof p.image === "string") return p.image;
  if (p.media?.[0]?.url) return p.media[0].url;
  if (typeof p.thumbnail === "string") return p.thumbnail;
  return null;
}
export function formatPrice(price: number | string): string {
  const n = typeof price === "string" ? Number(price) : (price ?? 0);
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n || 0);
  } catch {
    return `$${(n || 0).toFixed(2)}`;
  }
}
