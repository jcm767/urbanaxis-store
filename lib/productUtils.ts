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
