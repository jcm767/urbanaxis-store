// lib/catalog.ts
// Helpers for gender/category typing + filtering

export type Gender = "men" | "women";
export type Category = "tops" | "bottoms" | "jackets" | "accessories";

const TOPS = ["tee","t shirt","t-shirt","shirt","button","polo","sweater","hoodie","tank","top","crewneck"];
const BOTTOMS = ["jeans","denim","pants","trouser","trousers","shorts","cargo","jogger"];
const JACKETS = ["jacket","coat","bomber","puffer","parka","trench","windbreaker","blazer","shell"];
const ACCESSORIES = ["hat","cap","beanie","belt","bag","crossbody","necklace","chain","bracelet","ring","socks","wallet","glasses","sunglasses","scarf"];

export function normalizeCategory(input?: string | null): Category | undefined {
  if (!input) return undefined;
  const v = String(input).toLowerCase();
  if (["top","tops"].includes(v)) return "tops";
  if (["bottom","bottoms","pants","jeans","shorts"].includes(v)) return "bottoms";
  if (["jacket","jackets","outerwear","coat","coats","bomber","puffer","parka"].includes(v)) return "jackets";
  if (["accessory","accessories","acc"].includes(v)) return "accessories";
  return undefined;
}

export function isValidGender(x: any): x is Gender { return x === "men" || x === "women"; }
export function isValidCategory(x: any): x is Category {
  return x === "tops" || x === "bottoms" || x === "jackets" || x === "accessories";
}

function hasAny(text: string, words: string[]) {
  const t = text.toLowerCase();
  return words.some(w => t.includes(w));
}
function inferCategoryFromText(text: string): Category | undefined {
  if (hasAny(text, TOPS)) return "tops";
  if (hasAny(text, BOTTOMS)) return "bottoms";
  if (hasAny(text, JACKETS)) return "jackets";
  if (hasAny(text, ACCESSORIES)) return "accessories";
  return undefined;
}
function inferGenderFromText(text: string): Gender | "unisex" | undefined {
  const t = text.toLowerCase();
  const menHits = /(men|mens|men's|male|guys|man)\b/.test(t);
  const womenHits = /(women|womens|women's|female|ladies|woman)\b/.test(t);
  if (menHits && !womenHits) return "men";
  if (womenHits && !menHits) return "women";
  if (menHits && womenHits) return "unisex";
  return undefined;
}

type AnyProduct = {
  id?: string|number;
  title?: string;
  name?: string;
  price?: number|string;
  images?: string[];
  image?: string;
  thumbnail?: string;
  url?: string;
  href?: string;
  permalink?: string;
  tags?: string[];
  gender?: Gender | "unisex";
  category?: Category | string;
};

export function matchProduct(p: AnyProduct, gender: Gender, category?: Category): boolean {
  const title = (p.title ?? p.name ?? "").toString();
  const tags = (Array.isArray(p.tags) ? p.tags : []).join(" ");
  const blob = `${title} ${tags}`.trim();

  // Gender logic
  const g = (p.gender as Gender | "unisex") ?? inferGenderFromText(blob) ?? "unisex";
  const genderOk = g === "unisex" || g === gender;

  // Category logic
  const explicitCat = normalizeCategory((p.category as string) ?? undefined);
  const inferredCat = explicitCat ?? inferCategoryFromText(blob);
  const catOk = category ? inferredCat === category : true;

  return genderOk && catOk;
}

export function filterProducts(all: AnyProduct[], gender: Gender, category?: Category): AnyProduct[] {
  return (all ?? []).filter(p => matchProduct(p, gender, category));
}
