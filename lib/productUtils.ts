// lib/productUtils.ts
// Unified utilities for products. Merges lib/products.ts with lib/products_added.ts (if present).

import baseProducts from '@/lib/products';
// If products_added.ts exists, import; otherwise fall back to empty.
let extra: any[] = [];
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  extra = require('@/lib/products_added').default || [];
} catch {}

export type AnyProduct = any;

const ALL: AnyProduct[] = [
  ...(Array.isArray(baseProducts) ? baseProducts : []),
  ...(Array.isArray(extra) ? extra : []),
];

// ---------- helpers ----------
export function slugify(s: string): string {
  return String(s || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function getAllProducts(): AnyProduct[] {
  return ALL;
}

export function getBySlug(slug: string): AnyProduct | undefined {
  const key = String(slug || '').toLowerCase();
  return ALL.find(p => getSlug(p).toLowerCase() === key);
}

export function getName(p: AnyProduct): string {
  return String(p?.title ?? p?.name ?? p?.label ?? 'Product');
}

export function getSlug(p: AnyProduct): string {
  return String(p?.slug ?? slugify(getName(p)));
}

export function getPrice(p: AnyProduct): number {
  const raw =
    p?.price ??
    p?.priceAmount ??
    p?.price_cents ??
    p?.amount ??
    p?.amount_cents ??
    0;
  const n = Number(raw);
  // if cents
  if (n > 0 && n <= 1000 && String(raw).includes('00') && n % 1 === 0) return n / 100;
  return Number.isFinite(n) ? n : 0;
}

export function getDescription(p: AnyProduct): string {
  return String(p?.description ?? p?.desc ?? '');
}

export function getCategory(p: AnyProduct): string {
  return String(p?.category ?? p?.cat ?? '');
}

export function getGender(p: AnyProduct): string {
  return String(p?.gender ?? p?.sex ?? '');
}

export function getTags(p: AnyProduct): string[] {
  const t = p?.tags ?? p?.keywords ?? [];
  return Array.isArray(t) ? t : [];
}

export function getColors(p: AnyProduct): string[] {
  // support `colors` list or the keys of imagesByColor
  if (Array.isArray(p?.colors) && p.colors.length) return p.colors;
  if (p?.imagesByColor && typeof p.imagesByColor === 'object') {
    return Object.keys(p.imagesByColor);
  }
  return [];
}

export function getImage(p: AnyProduct): string | undefined {
  // Preferred: explicit 'image'
  const direct = p?.image ?? p?.images?.[0];
  if (direct) return String(direct);

  // Fallback: first image from first color in imagesByColor
  if (p?.imagesByColor && typeof p.imagesByColor === 'object') {
    const firstColor = getColors(p)[0];
    const list = firstColor ? p.imagesByColor[firstColor] : undefined;
    if (Array.isArray(list) && list[0]) return String(list[0]);
    // otherwise pick any array in the map
    for (const k of Object.keys(p.imagesByColor)) {
      const arr = p.imagesByColor[k];
      if (Array.isArray(arr) && arr[0]) return String(arr[0]);
    }
  }
  return undefined;
}

export function getImageForColor(p: AnyProduct, color?: string | null): string | undefined {
  if (!color) return getImage(p);
  if (p?.imagesByColor && typeof p.imagesByColor === 'object') {
    const arr = p.imagesByColor[String(color)];
    if (Array.isArray(arr) && arr[0]) return String(arr[0]);
  }
  return getImage(p);
}

export function getInventory(p: AnyProduct): number {
  const inv = Number(p?.inventory ?? p?.stock ?? 9999);
  return Number.isFinite(inv) ? inv : 9999;
}
