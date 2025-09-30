import { loadAllProducts } from "./loadProducts";
export function productPrimaryImage(p:any){ return p?.image ?? (Array.isArray(p?.images)?p.images[0]:undefined); }
export function formatPrice(v:number|string|undefined){ const n = typeof v==="string"? Number(String(v).replace(/[^\d.]/g,"")): (v??0); return `$${(isFinite(n)?n:0).toFixed(2)}`; }
export async function getAllProducts(){ return loadAllProducts(); }
export function getName(p:any){ return String(p?.title ?? p?.name ?? "Untitled product"); }
export function getSlug(p:any){ if(p?.slug) return String(p.slug); const b = String(p?.title ?? p?.name ?? ""); return b? b.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,""):undefined; }
export function getPrice(x:any){ return formatPrice(x?.price ?? x); }
export function getColors(p:any){ const c = p?.colors ?? p?.colorOptions ?? []; return Array.isArray(c)? c.map(String):[]; }
export function getSearchKeywords(p:any){ const tags = Array.isArray(p?.tags)? p.tags:[]; const name = (p?.title ?? p?.name ?? "").toString(); return [...tags, name].filter(Boolean); }
export function getImage(p:any){ return productPrimaryImage(p); }
export function getImageForColor(p:any,color:string){ const by = p?.imagesByColor?.[color]; return Array.isArray(by)&&by[0]? by[0]: getImage(p); }
//
// --- Client helpers: getAllProductsClient / getBySlug -----------------------
type AnyProductLike = any; // stays flexible for curated/legacy merge

let __UA_ALL_CLIENT: AnyProductLike[] | null = null;

/**
 * Build a client-side merged list of products (curated + legacy).
 * Works in the browser because these modules are simple arrays.
 */
export function getAllProductsClient(): AnyProductLike[] {
  if (__UA_ALL_CLIENT) return __UA_ALL_CLIENT;

  // Curated (new) feed
  let curated: AnyProductLike[] = [];
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const curatedMod = require("./ua-new-products");
    curated =
      curatedMod?.UA_NEW_PRODUCTS ??
      curatedMod?.default ??
      [];
  } catch {}

  // Legacy feed (accepts several shapes: default / products / PRODUCTS)
  let legacy: AnyProductLike[] = [];
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const legacyMod = require("./products");
    const raw =
      legacyMod?.default ??
      legacyMod?.products ??
      legacyMod?.PRODUCTS ??
      [];
    if (Array.isArray(raw)) legacy = raw;
  } catch {}

  __UA_ALL_CLIENT = [...curated, ...legacy];
  return __UA_ALL_CLIENT;
}

/** Find a product by slug from the merged client list. */
export function getBySlug(slug: string): AnyProductLike | null {
  if (!slug) return null;
  const all = getAllProductsClient();
  return all.find((p: any) => p?.slug === slug) ?? null;
}
