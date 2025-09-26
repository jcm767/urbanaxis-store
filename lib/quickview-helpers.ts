export type AnyProduct = {
  id?: string;
  slug?: string;
  title?: string;
  price?: number | string;
  url?: string;
  images?: string[];
  image?: string;
  gender?: "men" | "women" | "unisex" | string;
  category?: "tops" | "bottoms" | "jackets" | "accessories" | string;
  [k: string]: any;
};

// Pull in curated (if present) and the legacy feed in a way that works in the client.
let curated: AnyProduct[] = [];
try {
  // Optional curated overlay
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require('./ua-new-products');
  curated = (mod?.UA_NEW_PRODUCTS ?? []) as AnyProduct[];
} catch (_) { /* no curated overlay, fine */ }

let legacy: AnyProduct[] = [];
try {
  // Legacy feed may export default, products, or PRODUCTS
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const legacyModule = require('./products');
  const raw = legacyModule?.default ?? legacyModule?.products ?? legacyModule?.PRODUCTS ?? [];
  legacy = Array.isArray(raw) ? raw : [];
} catch (_) { /* no legacy, fine */ }

const ALL: AnyProduct[] = [...curated, ...legacy];

/** Find a product by slug (fallback to matching url tail if slug missing). */
export function getBySlug(slug: string): AnyProduct | undefined {
  if (!slug) return undefined;
  const s = String(slug).toLowerCase();
  return ALL.find(p => {
    const ps = String(p.slug ?? '').toLowerCase();
    const pu = String(p.url ?? '').toLowerCase();
    return (!!ps && ps === s) || (!!pu && (pu.endsWith(`/${s}`) || pu.includes(s)));
  });
}

/** Safe selectors (thin wrappers around existing utils when available) */
export function productName(p?: AnyProduct): string {
  if (!p) return 'Untitled product';
  try {
    // Prefer existing util if present
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const u = require('./productUtils');
    return u.getName ? u.getName(p) : (p.title ?? 'Untitled product');
  } catch { return p.title ?? 'Untitled product'; }
}

export function productPriceNumber(p?: AnyProduct): number {
  if (!p) return 0;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const u = require('./productUtils');
    const val = u.getPrice ? u.getPrice(p) : p.price;
    const n = Number(String(val).replace(/[^\d.]/g, ''));
    return isFinite(n) ? n : 0;
  } catch {
    const n = Number(String(p.price ?? '').replace(/[^\d.]/g, ''));
    return isFinite(n) ? n : 0;
  }
}

export function productImage(p?: AnyProduct): string {
  if (!p) return '';
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const u = require('./productUtils');
    if (u.getImage) return u.getImage(p);
  } catch { /* ignore */ }
  return (p.image as string) ?? (p.images?.[0] ?? '');
}
