set -euo pipefail

echo "➡️  Restoring curated overlay, loader, helpers, pages, and image domains…"

# 1) Curated overlay
mkdir -p lib
cat > lib/ua-new-products.ts <<'TS'
export type UACategory = "tops"|"bottoms"|"jackets"|"accessories";
export type UAGender = "men"|"women";
export type Curated = { id?: string; title: string; price: number|string; gender: UAGender; category: UACategory; url: string; images: string[]; tags?: string[]; };
export const UA_NEW_PRODUCTS: Curated[] = [
  { id:"ua-denim-1", title:"Street Patch Denim", price:49.99, gender:"men", category:"bottoms",
    url:"https://www.aliexpress.us/item/1005006311399558.html",
    images:["https://ae01.alicdn.com/kf/S9b9a9a70fb3a4f21b8b6b8b7d613a7b2G.jpg"], tags:["denim","streetwear"] },
  { id:"ua-knit-1", title:"Striped Knit Pullover", price:32, gender:"women", category:"tops",
    url:"https://www.aliexpress.us/item/3256806078260897.html",
    images:["https://ae01.alicdn.com/kf/Sb1c1b0d2c0a14cd6a335c5f2a0f8e75do.jpg"], tags:["knit","cozy"] },
  { id:"ua-hoodie-1", title:"Oversized Knit Hoodie", price:39, gender:"men", category:"tops",
    url:"https://www.aliexpress.us/item/3256806160734708.html",
    images:["https://ae01.alicdn.com/kf/Sd3d9c1a0bb8c4f1e8c1b516bd97f4f89B.jpg"], tags:["hoodie","oversized"] },
  { id:"ua-puffer-1", title:"Oversized Puffer Jacket", price:69, gender:"women", category:"jackets",
    url:"https://www.aliexpress.us/item/1005006391331906.html",
    images:["https://ae01.alicdn.com/kf/Sb9a5ad6b4b4143f2a4a2d9e1e6e6b8f72.jpg"], tags:["puffer","winter"] },
  { id:"ua-shell-1", title:"Utility Wind Jacket", price:59, gender:"men", category:"jackets",
    url:"https://www.aliexpress.us/item/1005006163236272.html",
    images:["https://ae01.alicdn.com/kf/Sb7c8e9f0123848b39d4ce5a0562a0b28F.jpg"], tags:["windbreaker","utility"] },
  { id:"ua-cap-1", title:"Washed Canvas Cap", price:14.5, gender:"women", category:"accessories",
    url:"https://www.aliexpress.us/item/1005006228601900.html",
    images:["https://ae01.alicdn.com/kf/S2c3c6d2bb4a04666ab2b3e9a74a30ff9C.jpg"], tags:["cap","accessory"] }
];
TS

# 2) Loader (merge curated + legacy)
cat > lib/loadProducts.ts <<'TS'
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
TS

# 3) productUtils with compatibility helpers
cat > lib/productUtils.ts <<'TS'
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
TS

# 4) catalog with filter + client shim
cat > lib/catalog.ts <<'TS'
export type Gender = "men"|"women";
export type Category = "tops"|"bottoms"|"jackets"|"accessories";
export function normalizeCategory(c?:string|null){ if(!c) return undefined; const k=c.toLowerCase(); if(k.startsWith("top")) return "tops"; if(k.startsWith("bottom")||k==="pants"||k==="jeans") return "bottoms"; if(k.startsWith("jack")) return "jackets"; if(k.startsWith("access")) return "accessories"; return undefined; }
export type AnyProduct = { id?:string; title?:string; price?:number|string; gender?: Gender|"unisex"|string; category?: Category|string; url?:string; image?:string; images?:string[]; slug?:string; tags?:string[]; [k:string]:any; };
export function filterProducts(products:AnyProduct[], opts:{gender?:Gender; category?:Category}){ const {gender,category}=opts||{}; return (products||[]).filter(p=>{ const g=String(p.gender??"").toLowerCase(); const c=String(p.category??"").toLowerCase(); const gOk=gender? g===gender: true; const cOk=category? c.includes(category): true; return gOk&&cOk; }); }
export async function getMergedProductsClient(){ const { loadAllProducts } = await import("./loadProducts"); return loadAllProducts(); }
TS

# 5) Category page (server) – relies on loader + filter
mkdir -p "app/(catalog)"
cat > app/(catalog)/CategoryPage.tsx <<'TSX'
import { filterProducts, normalizeCategory, type Gender, type Category } from "@/lib/catalog";
import { loadAllProducts } from "@/lib/loadProducts";
import ProductCard from "@/components/ProductCard";
export default async function CategoryPage({ gender, category }: { gender?: Gender; category?: Category }) {
  const all = await loadAllProducts();
  const cat = category ? normalizeCategory(category) : undefined;
  const items = filterProducts(all as any, { gender, category: cat });
  return (
    <main style={{ padding:24, maxWidth:1200, margin:"0 auto" }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(220px, 1fr))", gap:16 }}>
        {items.map((p:any,i:number)=>(<ProductCard key={p?.slug ?? p?.id ?? i} product={p}/>))}
      </div>
    </main>
  );
}
TSX

# 6) Home page – uses merged products (curated first)
cat > app/page.tsx <<'TSX'
import ProductCard from "@/components/ProductCard";
import { loadAllProducts } from "@/lib/loadProducts";
export default async function Home() {
  const all = await loadAllProducts();
  return (
    <main style={{ padding:24, maxWidth:1200, margin:"0 auto" }}>
      <h1>Urban Axis</h1>
      <h2>New &amp; Noteworthy</h2>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(220px, 1fr))", gap:16 }}>
        {all.slice(0,8).map((p:any,i:number)=>(<ProductCard key={p?.slug ?? p?.id ?? i} product={p}/>))}
      </div>
    </main>
  );
}
TSX

# 7) Product page – robust param/gen
mkdir -p app/products/[slug]
cat > app/products/[slug]/page.tsx <<'TSX'
import { loadAllProducts, primaryImage } from "@/lib/loadProducts";
import { formatPrice } from "@/lib/productUtils";
function toSlug(v:string){ return v.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,""); }
export async function generateStaticParams(){
  const all = await loadAllProducts();
  return all.map((p:any)=>({ slug: p?.slug ?? toSlug(String(p?.title ?? p?.name ?? ""))})).filter(Boolean).slice(0,80);
}
export default async function ProductPage({ params }:{ params:{ slug:string }}) {
  const all = await loadAllProducts();
  const p = all.find((x:any)=> (x?.slug && x.slug===params.slug) || toSlug(String(x?.title ?? x?.name ?? ""))===params.slug);
  if(!p) return <main style={{padding:24}}><h1>Not found</h1></main>;
  const img = primaryImage(p);
  return (
    <main style={{ padding:24, maxWidth:900, margin:"0 auto" }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
        <div>{img ? <img src={img} alt={p?.title ?? "Product"} style={{ width:"100%", borderRadius:12 }}/> : <div style={{height:360,background:"#f3f4f6"}}/>}</div>
        <div>
          <h1>{String(p?.title ?? p?.name ?? "Untitled product")}</h1>
          <div style={{fontWeight:700, marginBottom:12}}>{formatPrice(p?.price)}</div>
          {p?.url && <a href={p.url} target="_blank" rel="noreferrer" style={{padding:"10px 14px", border:"1px solid #111", borderRadius:8}}>View Source</a>}
        </div>
      </div>
    </main>
  );
}
TSX

# 8) next.config.js — allow AliExpress/alicdn images
cat > next.config.js <<'JS'
/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "*.alicdn.com" },
      { protocol: "https", hostname: "*.aliexpress-media.com" },
      { protocol: "https", hostname: "ae01.alicdn.com" },
      { protocol: "https", hostname: "i.alicdn.com" }
    ]
  }
};
module.exports = nextConfig;
JS

# 9) Optional HTML no-store header to avoid stale pages
cat > vercel.json <<'JSON'
{
  "headers": [
    {
      "source": "/((?!_next/|favicon.ico|robots.txt|sitemap.xml).*)",
      "headers": [{ "key": "Cache-Control", "value": "no-store" }]
    }
  ]
}
JSON

# 10) Cache-bust file so build is fresh
echo "// redeploy: $(date -u +%Y-%m-%dT%H:%M:%SZ)" > lib/redeploy.ts

# Commit & push
git add -A
git commit -m "feat: restore curated overlay + loader + helpers + pages + image domains"
git push origin main

echo "✅ Files written & pushed. If you want to redeploy now from CLI:"
echo "   npx vercel --prod --confirm || true"
