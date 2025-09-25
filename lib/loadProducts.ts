// lib/loadProducts.ts
// Combines curated overlay (if present) with the legacy feed from '@/lib/products'.
// Safe even if 'ua-new-products' is missing; it falls back to legacy only.

import type { Gender, Category } from '@/lib/catalog';

// Legacy feed shape is flexible; ensure we handle common keys.
type LegacyProduct = {
  id?: string;
  title?: string;
  price?: number | string;
  gender?: Gender | string;
  category?: Category | string;
  url?: string;
  image?: string;
  images?: string[];
  tags?: string[];
  slug?: string;
  [key: string]: any;
};

type CuratedProduct = {
  id?: string;
  title: string;
  price: number | string;
  gender: Gender;
  category: Category;
  url: string;
  images: string[];
  tags?: string[];
};

export type UnifiedProduct = (LegacyProduct | CuratedProduct) & {
  __source?: 'curated' | 'legacy';
};

export async function loadAllProducts(): Promise<UnifiedProduct[]> {
  // 1) Load legacy feed (required)
  const legacyModule = await import('@/lib/products');
  const legacyRaw: any =
    legacyModule.default ??
    legacyModule.products ??
    legacyModule.PRODUCTS ??
    [];

  const legacy: UnifiedProduct[] = Array.isArray(legacyRaw)
    ? legacyRaw.map((p: any) => ({ ...p, __source: 'legacy' as const }))
    : [];

  // 2) Try to load curated overlay (optional, safe if missing)
  let curated: UnifiedProduct[] = [];
  try {
    // @ts-ignore - file may not exist yet; we intentionally try/catch
    const curatedModule = await import('@/lib/ua-new-products');
    const arr =
      curatedModule?.UA_NEW_PRODUCTS && Array.isArray(curatedModule.UA_NEW_PRODUCTS)
        ? curatedModule.UA_NEW_PRODUCTS
        : [];
    curated = arr.map((p: any) => ({
      ...p,
      __source: 'curated' as const,
      // ensure images array exists
      images: Array.isArray(p.images) ? p.images : (p.image ? [p.image] : []),
    }));
  } catch {
    // no curated overlay present — that's fine
    curated = [];
  }

  // 3) Merge: curated first, then legacy.
  // If an ID or URL matches, keep curated (assume curated takes precedence).
  const seen = new Set<string>();
  const merged: UnifiedProduct[] = [];

  for (const p of curated) {
    const key = (p.id ?? p.url ?? p.title ?? JSON.stringify(p)).toString();
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(p);
    }
  }
  for (const p of legacy) {
    const key = (p.id ?? p.url ?? p.title ?? JSON.stringify(p)).toString();
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(p);
    }
  }

  return merged;
}
