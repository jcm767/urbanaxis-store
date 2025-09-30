export type AnyProduct = {
  id?: string;
  title?: string;
  name?: string;
  price?: number | string;
  image?: string | null;
  images?: string[] | any;     // tolerate jsonb or text[] shapes
  primary_image?: string | null;
};

function firstFromUnknownImages(images: any): string | undefined {
  if (!images) return undefined;
  // If already string[]
  if (Array.isArray(images)) {
    return images.length ? String(images[0]) : undefined;
  }
  // If jsonb/object that behaves like an array
  if (typeof images === "object" && images !== null) {
    // try common shapes
    if (Array.isArray((images as any))) {
      const arr = images as unknown as any[];
      return arr.length ? String(arr[0]) : undefined;
    }
    // try numeric keys: {"0": "..."}
    if (images["0"]) return String(images["0"]);
  }
  return undefined;
}

/**
 * Returns the safest possible primary image for a product.
 * Priority: product.image -> product.images[0] (any shape) -> product.primary_image -> /placeholder.svg
 */
export function productPrimaryImage(p: AnyProduct | undefined | null): string {
  if (!p) return "/placeholder.svg";
  const fromDirect = p.image && String(p.image).trim();
  const fromArrayish = firstFromUnknownImages(p.images);
  const fromPrimary = p.primary_image && String(p.primary_image).trim();

  return (
    (fromDirect && String(fromDirect)) ||
    (fromArrayish && String(fromArrayish)) ||
    (fromPrimary && String(fromPrimary)) ||
    "/placeholder.svg"
  );
}

/**
 * Formats a price that may come as number or string (e.g., "29.99", "$29.99").
 * Always returns a "$12.34" style USD string.
 */
export function formatPrice(value: number | string | undefined | null): string {
  if (value == null) return "$0.00";
  const num = typeof value === "number"
    ? value
    : Number(String(value).replace(/[^\d.]/g, "")) || 0;
  return `$${num.toFixed(2)}`;
}
