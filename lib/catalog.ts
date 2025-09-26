export type Gender = "men" | "women";
export type Category = "tops" | "bottoms" | "jackets" | "accessories";

const TOPS = ["tee","t shirt","t-shirt","shirt","button","polo","sweater","hoodie","tank","top","crewneck"];
const BOTTOMS = ["jeans","denim","pants","trouser","shorts","cargo"];
const JACKETS = ["jacket","coat","puffer","parka","windbreaker"];
const ACCESSORIES = ["cap","belt","bag","hat","scarf"];

export function detectCategory(title: string): Category {
  const lower = title.toLowerCase();
  if (TOPS.some(w => lower.includes(w))) return "tops";
  if (BOTTOMS.some(w => lower.includes(w))) return "bottoms";
  if (JACKETS.some(w => lower.includes(w))) return "jackets";
  return "accessories";
}
