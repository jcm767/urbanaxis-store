// lib/productUtils.ts
import { loadAllProducts } from '@/lib/loadProducts';

type AnyProduct = Record<string, any>;
export type { AnyProduct };

export async function getAllProducts(): Promise<AnyProduct[]> {
  return await loadAllProducts();
}

export function getName(p: AnyProduct): string {
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

export function getSlug(p: AnyProduct): string {
  return (
    p?.slug ??
    (typeof p?.url === 'string' ? p.url : undefined) ??
    (typeof p?.id === 'string' ? p.id : undefined) ??
    slugify(getName(p))
  );
}

// New: fetch a single product by slug (with url/id fallbacks)
export async function getBySlug(slug: string): Promise<AnyProduct | undefined> {
  const all = await loadAllProducts();
  return (
    all.find((p: AnyProduct) => getSlug(p) === slug) ??
    all.find((p: AnyProduct) => p?.url === slug || p?.id === slug)
  );
}

export function productPrimaryImage(p: AnyProduct): string | undefined {
  return p?.image ?? (Array.isArray(p?.images) ? p.images[0] : undefined);
}
export const getImage = productPrimaryImage;

export function getColors(p: AnyProduct): string[] {
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

export function getImageForColor(p: AnyProduct, color: string): string | undefined {
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

export function getSearchKeywords(p: AnyProduct): string {
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
