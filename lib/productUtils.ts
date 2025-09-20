/* UA_MERGE_PRODUCTS_ADDED */ 
import baseProducts from '@/lib/products';
let addedProducts: any[] = [];
try {
  // Try sync require (works in Next/TS bundlers); falls back harmlessly if file missing
  // @ts-ignore
  addedProducts = require('@/lib/products_added').default || [];
} catch {}
const rawProducts: any[] = (Array.isArray(baseProducts) ? baseProducts : []);
export default rawProducts;


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
  // common fields
  return p?.image_url ?? p?.image ?? p?.img ?? (Array.isArray(p?.images) ? p.images[0] : undefined);
}
export function getDescription(p: AnyProduct) {
  return p?.description ?? p?.desc ?? '';
}
export function getCategory(p: AnyProduct) {
  return p?.category ?? p?.type ?? '';
}
export function getGender(p: AnyProduct) {
  return p?.gender ?? p?.section ?? '';
}
export function getTags(p: AnyProduct): string[] {
  if (Array.isArray(p?.tags)) return p.tags;
  if (typeof p?.tags === 'string') return p.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
  return [];
}

/** Return available colors for a product if present. Looks at:
 *  - p.colors (['black','white',...])
 *  - p.variants[].color
 *  - Object.keys(p.imagesByColor)
 */
export function getColors(p: AnyProduct): string[] {
  if (Array.isArray(p?.colors) && p.colors.length) return p.colors;
  if (Array.isArray(p?.variants)) {
    const set = new Set<string>();
    for (const v of p.variants) if (v?.color) set.add(String(v.color));
    if (set.size) return Array.from(set);
  }
  if (p?.imagesByColor && typeof p.imagesByColor === 'object') {
    return Object.keys(p.imagesByColor);
  }
  return [];
}

/** Given a color, try to find the best image for that color. */
export function getImageForColor(p: AnyProduct, color?: string): string | undefined {
  if (!color) return getImage(p);
  const c = String(color).toLowerCase();
  // imagesByColor: { black: '...', beige: '...' } or { black: ['url1','url2'] }
  const map = p?.imagesByColor;
  if (map && typeof map === 'object') {
    const hit = map[color] ?? map[c];
    if (Array.isArray(hit)) return hit[0];
    if (typeof hit === 'string') return hit;
  }
  // variants fallback
  if (Array.isArray(p?.variants)) {
    const v = p.variants.find((v: any) => String(v?.color ?? '').toLowerCase() === c);
    if (v?.image_url) return v.image_url;
    if (v?.image) return v.image;
    if (Array.isArray(v?.images) && v.images[0]) return v.images[0];
  }
  // tag-based guess (e.g., p.images = ['img-black.jpg', 'img-white.jpg'])
  if (Array.isArray(p?.images)) {
    const guess = p.images.find((u: string) => typeof u === 'string' && u.toLowerCase().includes(c));
    if (guess) return guess;
  }
  return getImage(p);
}

export function getAllProducts(): AnyProduct[] { return (Array.isArray(rawProducts)?rawProducts:[]).concat(Array.isArray(addedProducts)?addedProducts:[]); }

export function getBySlug(slug: string): AnyProduct | undefined {
  const list = getAllProducts();
  return list.find((p) => getSlug(p) === slug);
}


export function getInventory(p: AnyProduct): number {
  const inv = Number(p?.inventory ?? p?.stock ?? 9999);
  return Number.isFinite(inv) ? inv : 9999;
}

export function getSizeGuide(p: AnyProduct): string | null {
  return p?.sizeGuide ?? null; // can store HTML/markdown string per product if desired
}
