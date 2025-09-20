// lib/productUtils.ts
// Merge base + added products and provide robust helpers + category inference.

import baseProducts from '@/lib/products';
let extra: any[] = [];
try { extra = require('@/lib/products_added').default || []; } catch {}

export type AnyProduct = any;

const ALL: AnyProduct[] = [
  ...(Array.isArray(baseProducts) ? baseProducts : []),
  ...(Array.isArray(extra) ? extra : []),
];

// ---------- core helpers ----------
export function slugify(s: string): string {
  return String(s || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function getAllProducts(): AnyProduct[] { return ALL; }
export function getBySlug(slug: string): AnyProduct | undefined {
  const key = String(slug || '').toLowerCase();
  return ALL.find(p => getSlug(p).toLowerCase() === key);
}

export function getName(p: AnyProduct): string {
  return String(p?.title ?? p?.name ?? p?.label ?? 'Product');
}
export function getSlug(p: AnyProduct): string { return String(p?.slug ?? slugify(getName(p))); }
export function getPrice(p: AnyProduct): number {
  const raw = p?.price ?? p?.priceAmount ?? p?.price_cents ?? p?.amount ?? p?.amount_cents ?? 0;
  const n = Number(raw);
  return Number.isFinite(n) ? (String(raw).endsWith('00') && n>99 ? n/100 : n) : 0;
}
export function getDescription(p: AnyProduct): string { return String(p?.description ?? p?.desc ?? ''); }
export function getTags(p: AnyProduct): string[] { const t = p?.tags ?? p?.keywords ?? []; return Array.isArray(t) ? t : []; }
export function getGender(p: AnyProduct): string { return String(p?.gender ?? p?.sex ?? ''); }

export function getColors(p: AnyProduct): string[] {
  if (Array.isArray(p?.colors) && p.colors.length) return p.colors;
  if (p?.imagesByColor && typeof p.imagesByColor === 'object') return Object.keys(p.imagesByColor);
  return [];
}

export function getImage(p: AnyProduct): string | undefined {
  const direct = p?.image ?? p?.images?.[0];
  if (direct) return String(direct);
  const colors = getColors(p);
  if (p?.imagesByColor && colors.length) {
    const first = p.imagesByColor[colors[0]];
    if (Array.isArray(first) && first[0]) return String(first[0]);
  }
  if (p?.imagesByColor && typeof p.imagesByColor === 'object') {
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

// ---------- category inference ----------
/** Raw category if set on product */
export function getCategory(p: AnyProduct): string { return String(p?.category ?? p?.cat ?? ''); }

/** Canonical category inferred: 'tops' | 'bottoms' | 'jackets' | 'accessories' */
export function getCanonicalCategory(p: AnyProduct): 'tops'|'bottoms'|'jackets'|'accessories' {
  const explicit = String(getCategory(p)).toLowerCase();
  if (['tops','bottoms','jackets','accessories'].includes(explicit)) return explicit as any;

  const hay = [
    getName(p),
    getDescription(p),
    explicit,
    getTags(p).join(' ')
  ].join(' ').toLowerCase();

  const is = (words: string[]) => words.some(w => hay.includes(w));

  if (is(['jacket','jackets','coat','coats','outerwear','parka','puffer','windbreaker','bomber'])) return 'jackets';
  if (is(['jean','jeans','denim','pant','pants','trouser','trousers','bottom','bottoms','cargo','short','shorts','skirt'])) return 'bottoms';
  if (is(['hoodie','sweater','sweatshirt','pullover','zip','tshirt','t-shirt','tee','shirt','shirts','top','tops','blouse','tank','crop'])) return 'tops';
  if (is(['accessory','accessories','belt','hat','cap','beanie','bag','scarf','sunglasses','jewelry','ring','necklace','bracelet'])) return 'accessories';

  // default to tops if unknown
  return 'tops';
}

/** keywords used by search (adds category synonyms so "shirt" matches tops, etc.) */
export function getSearchKeywords(p: AnyProduct): string[] {
  const cat = getCanonicalCategory(p);
  const base = [
    getName(p), getDescription(p), getCategory(p), getGender(p),
    ...getTags(p), ...getColors(p)
  ].join(' ').toLowerCase();

  const add: string[] = [];
  if (cat === 'tops') add.push('shirt','shirts','tshirt','t-shirts','tee','tees','hoodie','sweatshirt','sweater','top','tops');
  if (cat === 'bottoms') add.push('jeans','denim','pants','trousers','bottom','bottoms','short','shorts','cargo');
  if (cat === 'jackets') add.push('jacket','jackets','coat','outerwear','puffer','bomber','parka','windbreaker');
  if (cat === 'accessories') add.push('accessory','accessories','belt','hat','cap','beanie','bag','scarf','sunglasses','jewelry','ring','necklace','bracelet');

  return Array.from(new Set((base + ' ' + add.join(' ')).split(/\s+/g).filter(Boolean)));
}
