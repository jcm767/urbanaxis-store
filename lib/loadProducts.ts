// lib/loadProducts.ts
// Robust loader that merges curated + legacy feed without mutating originals.

import { UA_NEW_PRODUCTS } from "@/lib/ua-new-products";

// Align with catalog expectations: Gender | "unisex" | undefined
export type UA_Gender = "men" | "women" | "unisex" | undefined;

export type AnyProduct = {
  id?: string;
  title?: string;
  name?: string;
  price?: number | string;
  gender?: UA_Gender | string; // accept loose input, normalize below
  category?: "tops" | "bottoms" | "jackets" | "accessories" | string;
  url?: string;
  images?: string[];
  image?: string;
  slug?: string;
  tags?: string[];
  [key: string]: any;
};

function toSlug(p: AnyProduct): string | undefined {
  if (p.slug && typeof p.slug === "string") return p.slug;
  const base =
    (typeof p.title === "string" && p.title) ||
    (typeof p.name === "string" && p.name) ||
    (typeof p.url === "string" &&
      p.url.split("/").filter(Boolean).pop()?.split(".")[0]) ||
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

function normalizeGender(g: unknown): UA_Gender {
  if (!g) return undefined;
  const s = String(g).toLowerCase();
  if (s === "men" || s === "male" || s === "m") return "men";
  if (s === "women" || s === "female" || s === "w") return "women";
  if (s === "unisex" || s === "all") return "unisex";
  return undefined; // anything else becomes undefined
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
    gender: normalizeGender(p.gender),
  }));

  const normalizedLegacy = legacy.map((p) => ({
    ...p,
    slug: toSlug(p) ?? cryptoRandomSlug(),
    gender: normalizeGender(p.gender),
  }));

  // Curated first
  return [...curated, ...normalizedLegacy];
}

function cryptoRandomSlug() {
  return `item-${Math.random().toString(36).slice(2, 9)}`;
}
