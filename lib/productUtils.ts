import rawProducts from '@/lib/products';

export type AnyProduct = any;

export function slugify(s: string) {
  return String(s || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function getName(p: AnyProduct) {
  return p?.title ?? p?.name ?? p?.label ?? 'Product';
}
export function getPrice(p: AnyProduct) {
  const n = Number(p?.price ?? p?.amount ?? 0);
  return Number.isFinite(n) ? n : 0;
}
export function getSlug(p: AnyProduct) {
  const base = p?.slug ?? p?.id ?? p?.sku ?? getName(p);
  return slugify(base);
}
export function getImage(p: AnyProduct): string | undefined {
  return p?.image_url ?? p?.image ?? p?.img ?? undefined;
}

export function getAllProducts(): AnyProduct[] {
  return Array.isArray(rawProducts) ? rawProducts : [];
}

export function getBySlug(slug: string): AnyProduct | undefined {
  const list = getAllProducts();
  return list.find((p) => getSlug(p) === slug);
}
