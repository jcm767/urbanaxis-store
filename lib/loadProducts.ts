import type { Gender, Category } from "./catalog";
export type AnyProduct = { id?: string; title?: string; price?: number|string; gender?: Gender|string; category?: Category|string; url?: string; slug?: string; image?: string; images?: string[]; tags?: string[]; [k:string]: any; __source?: "curated"|"legacy" };
export async function loadAllProducts(): Promise<AnyProduct[]> {
  const legacyModule: any = await import("./products");
  const legacyRaw: any = legacyModule?.default ?? legacyModule?.products ?? legacyModule?.PRODUCTS ?? [];
  const legacy = Array.isArray(legacyRaw) ? legacyRaw.map((p:any)=>({ ...p, __source:"legacy" as const })) : [];
  let curated: AnyProduct[] = [];
  try {
    const curatedModule: any = await import("./ua-new-products");
    const arr = curatedModule?.UA_NEW_PRODUCTS ?? [];
    curated = Array.isArray(arr) ? arr.map((p:any)=>({ ...p, __source:"curated" as const, images: Array.isArray(p.images) ? p.images : (p.image ? [p.image] : []) })) : [];
  } catch {}
  const seen = new Set<string>();
  return [...curated, ...legacy].filter((p:any)=>{ const k = String(p.id ?? p.url ?? p.title ?? JSON.stringify(p)); if(seen.has(k)) return false; seen.add(k); return true; });
}
export function primaryImage(p:any){ return p?.image ?? (Array.isArray(p?.images) ? p.images[0] : undefined); }
