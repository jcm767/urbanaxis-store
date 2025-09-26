export type Gender = "men" | "women";
export type Category = "tops" | "bottoms" | "jackets" | "accessories";

const TOPS = ["tee","t shirt","t-shirt","shirt","button","polo","sweater","hoodie","tank","top","crewneck"];
const BOTTOMS = ["jeans","denim","pants","trouser","shorts","cargo"];
const JACKETS = ["jacket","coat","puffer","parka","windbreaker"];
const ACCESSORIES = ["cap","belt","bag","hat","scarf"];

/**
 * Normalize arbitrary category strings to one of the known values.
 */
export function normalizeCategory(input: string): Category {
  const lower = input.toLowerCase();
  if (TOPS.some(w => lower.includes(w))) return "tops";
  if (BOTTOMS.some(w => lower.includes(w))) return "bottoms";
  if (JACKETS.some(w => lower.includes(w))) return "jackets";
  return "accessories";
}

/**
 * Detect category directly from a product title.
 */
export function detectCategory(title: string): Category {
  return normalizeCategory(title);
}

/**
 * Filter a product list down by category (helper for catalog pages).
 */
export function filterProducts<T extends { title: string }>(
  products: T[],
  category: Category
): T[] {
  return products.filter(p => normalizeCategory(p.title) === category);
}
