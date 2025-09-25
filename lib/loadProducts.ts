// lib/loadProducts.ts
// Robust loader that merges curated + legacy feed without mutating originals.
// Handles varied legacy export shapes gracefully.

import { UA_NEW_PRODUCTS } from "@/lib/ua-new-products";

export type AnyProduct = {
  id?: string;
  title?: string;
  name?: string;
  price?: number | string;
  gender?: "men" | "women" | string;
  category?: "tops" | "bottoms" | "jackets" | "accessories" | string;
  url?: string;
  images?: string[];
  image?: string;
  slug?: string;
  tags?: string[];
  // Allow extra unknown fields from legacy
  [key: string]: any;
};

// attempt to produce a slug from title or url if missing
function toSlug(p: AnyProduct): string | undefined {
  if (p.slug && typeof p.slug === "string") return p.slug;
  const base =
    (typeof p.title === "string" && p.title) ||
    (typeof p.name === "string" && p.name) ||
    (typeof p.url === "string" && p.url.split("/").filter(Boolean).pop()?.split(".")[0]) ||
    undefined;
  return base
    ?.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// normalize primary image selection: image ?? images[0]
export function primaryImage(p: AnyProduct): string | undefined {
  if (typeof p.image === "string" && p.image.length) return p.image;
  if (Array.isArray(p.images) && p.images.length) return p.images[0];
  return undefined;
}

async function loadLegacyProducts(): Promise<AnyProduct[]> {
  try {
    const mod: any = await import("@/lib/products");
    // Support common export shapes
    if (Array.isArray(mod.default)) return mod.default as AnyProduct[];
    if (Array.isArray(mod.products)) return mod.products as AnyProduct[];
    if (Array.isArray(mod.PRODUCTS)) return mod.PRODUCTS as AnyProduct[];
    if (typeof mod.getProducts === "function") {
      const out = await mod.getProducts();
      if (Array.isArray(out)) return out as AnyProduct[];
    }
    // Fallback: scan object values for arrays
    for (const k of Object.keys(mod)) {
      if (Array.isArray(mod[k])) return mod[k] as AnyProduct[];
    }
    return [];
  } catch {
    return [];
  }
}

export async function loadAllProducts(): Promise<AnyProduct[]> {
  const legacy = await loadLegacyProducts();
  const curated = UA_NEW_PRODUCTS.map((p) => ({
    ...p,
    slug: toSlug(p) ?? cryptoRandomSlug(),
  }));
  // Do not mutate legacy; just ensure it has a slug if missing
  const normalizedLegacy = legacy.map((p) => ({
    ...p,
    slug: toSlug(p) ?? cryptoRandomSlug(),
  }));
  // Curated first
  return [...curated, ...normalizedLegacy];
}

// Tiny slug helper if nothing else works
function cryptoRandomSlug() {
  // Not crypto-secure in edge runtime, but fine for static paths
  return `item-${Math.random().toString(36).slice(2, 9)}`;
}
