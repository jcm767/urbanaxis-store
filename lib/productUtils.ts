// lib/productUtils.ts
// Unifies product helpers used across pages. These are intentionally
// resilient to partial/messy product shapes.
//
// Exports expected by existing pages:
// - getAllProducts
// - getName
// - getPrice
// - getSlug
// - getImage
// - getImageForColor
// - getColors
// - getSearchKeywords
// Also keep the previous names used elsewhere:
// - productPrimaryImage
// - formatPrice

import { loadAllProducts } from '@/lib/loadProducts';

type AnyRecord = Record<string, any>;

export async function getAllProducts(): Promise<AnyRecord[]> {
  return await loadAllProducts();
}

export function getName(p: AnyRecord): string {
  return String(p?.title ?? p?.name ?? 'Untitled product');
}

export function formatPrice(val: any): string {
  const n =
    typeof val === 'number'
      ? val
      : typeof val === 'string'
      ? Number(val.replace(/[^\d.]/g, ''))
      : NaN;
  if (!isFinite(n)) return typeof val === 'string' ? val : '';
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n);
}

export const getPrice = formatPrice;

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function getSlug(p: AnyRecord): string {
  return (
    p?.slug ??
    (typeof p?.url === 'string' ? p.url : undefined) ??
    (typeof p?.id === 'string' ? p.id : undefined) ??
    slugify(getName(p))
  );
}

export function productPrimaryImage(p: AnyRecord): string | undefined {
  return p?.image ?? (Array.isArray(p?.images) ? p.images[0] : undefined);
}

export const getImage = productPrimaryImage;

export function getColors(p: AnyRecord): string[] {
  // Try known fields; fall back to tags that look like colors.
  const colors = p?.colors ?? p?.variants?.colors ?? [];
  if (Array.isArray(colors) && colors.length) return colors;

  const tags: string[] = Array.isArray(p?.tags) ? p.tags : [];
  const colorish = tags.filter((t) =>
    /(black|white|gray|grey|red|blue|green|yellow|purple|pink|brown|beige|khaki|navy|teal|orange)/i.test(
      String(t),
    ),
  );
  return colorish.length ? colorish : [];
}

export function getImageForColor(p: AnyRecord, color: string): string | undefined {
  // If product has a color->image map, prefer it. Otherwise return primary image.
  const map = p?.imagesByColor ?? p?.images_by_color ?? p?.variantImages ?? null;
  if (map && typeof map === 'object') {
    const key = Object.keys(map).find((k) => k.toLowerCase() === color.toLowerCase());
    if (key) {
      const v = map[key];
      if (typeof v === 'string') return v;
      if (Array.isArray(v) && v.length) return v[0];
    }
  }
  return productPrimaryImage(p);
}

export function getSearchKeywords(p: AnyRecord): string {
  const base = [getName(p)];
  if (Array.isArray(p?.tags)) base.push(...p.tags.map(String));
  if (p?.category) base.push(String(p.category));
  if (p?.gender) base.push(String(p.gender));
  return base
    .join(' ')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}
