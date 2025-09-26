export type Gender = "men" | "women";
export type Category = "tops" | "bottoms" | "jackets" | "accessories";

/** Minimal shape we filter on */
export type AnyProduct = {
  title?: string;
  gender?: Gender | "unisex" | string;
  category?: Category | string;
  [k: string]: any;
};

const TOPS = ["tee","t shirt","t-shirt","shirt","button","polo","sweater","hoodie","tank","top","crewneck"];
const BOTTOMS = ["jeans","denim","pants","trouser","shorts","cargo"];
const JACKETS = ["jacket","coat","puffer","parka","windbreaker"];
const ACCESSORIES = ["cap","belt","bag","hat","scarf"];

/** Normalize arbitrary category text to our canonical Category union */
export function normalizeCategory(input: string): Category {
  const lower = input.toLowerCase();
  if (TOPS.some(w => lower.includes(w))) return "tops";
  if (BOTTOMS.some(w => lower.includes(w))) return "bottoms";
  if (JACKETS.some(w => lower.includes(w))) return "jackets";
  return "accessories";
}

/** Optional: detect from a title (alias to normalizeCategory) */
export function detectCategory(title: string): Category {
  return normalizeCategory(title);
}

/** ORIGINAL signature used by CategoryPage: filter by optional gender/category */
export function filterProducts(
  products: AnyProduct[],
  opts: { gender?: Gender; category?: Category }
): AnyProduct[] {
  const { gender, category } = opts || {};
  return (products || []).filter((p) => {
    const g = String(p.gender ?? "").toLowerCase();
    const c = String(p.category ?? "").toLowerCase();
    const gOk = gender ? g === gender : true;
    const cOk = category ? c.includes(category) : true;
    return gOk && cOk;
  });
}
