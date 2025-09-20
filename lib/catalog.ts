// lib/catalog.ts
import baseProducts from '@/lib/products';

export type DynProduct = {
  id: string;
  title: string;
  slug: string;
  price: number;
  category: 'tops'|'bottoms'|'jackets'|'accessories';
  gender?: 'men'|'women'|'unisex'|null;
  tags?: string[]|null;
  colors?: string[]|null;
  imagesByColor?: Record<string,string[]>;
  image?: string|null;
  description?: string|null;
  source_url?: string|null;
};

export async function fetchDynamicProducts(): Promise<DynProduct[]> {
  try {
    const res = await fetch('/api/products', { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch { return []; }
}

// Combine static + dynamic for client pages
export async function getMergedProductsClient() {
  const dyn = await fetchDynamicProducts();
  return [
    ...(Array.isArray(baseProducts) ? baseProducts : []),
    ...dyn
  ];
}
