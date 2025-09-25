// lib/catalog.ts
// Loosely-typed catalog helpers that interop with ANY product shape.

export type Gender = "men" | "women" | "unisex";
export type Category = "tops" | "bottoms" | "jackets" | "accessories";

export function normalizeCategory(input: unknown): Category | undefined {
  if (!input) return undefined;
  const s = String(input).toLowerCase().trim();

  if (
    s === "tops" ||
    s.includes("tee") ||
    s.includes("t-shirt") ||
    s.includes("shirt") ||
    s.includes("polo") ||
    s.includes("sweater") ||
    s.includes("hoodie") ||
    s.includes("tank") ||
    s === "top"
  ) return "tops";

  if (
    s === "bottoms" ||
    s.includes("jeans") ||
    s.includes("denim") ||
    s.includes("pants") ||
    s.includes("trouser") ||
    s.includes("shorts") ||
    s === "skirt"
  ) return "bottoms";

  if (s === "jackets" || s.includes("jacket") || s.includes("coat") || s.includes("puffer"))
    return "jackets";

  if (
    s === "accessories" ||
    s.includes("accessory") ||
    s.includes("belt") ||
    s.includes("bag") ||
    s.includes("cap") ||
    s.includes("hat")
  ) return "accessories";

  return undefined;
}

export function normalizeGender(input: unknown): Gender | undefined {
  if (!input) return undefined;
  const s = String(input).toLowerCase().trim();
  if (s === "men" || s === "male" || s === "m") return "men";
  if (s === "women" || s === "female" || s === "w") return "women";
  if (s === "unisex" || s === "all") return "unisex";
  return undefined;
}

type FilterOpts = { gender?: Gender; category?: Category };

/**
 * filterProducts
 * Accepts ANY array shape. We only read `.gender` and `.category`.
 */
export function filterProducts<T extends Record<string, any>>(
  list: ReadonlyArray<T>,
  opts: FilterOpts
): T[] {
  const wantGender = opts.gender ? normalizeGender(opts.gender) : undefined;
  const wantCat = opts.category ? normalizeCategory(opts.category) : undefined;

  return list.filter((item) => {
    const gotGender = normalizeGender(item?.gender);
    const gotCat = normalizeCategory(item?.category);
    const genderOk = wantGender ? gotGender === wantGender : true;
    const catOk = wantCat ? gotCat === wantCat : true;
    return genderOk && catOk;
  });
}
