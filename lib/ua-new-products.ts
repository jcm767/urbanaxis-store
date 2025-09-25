// lib/ua-new-products.ts
// Stub curated overlay. Replace with real items when ready.
// Example shape:
// export const UA_NEW_PRODUCTS = [
//   { title: '...', price: 59.99, gender: 'men', category: 'tops', url: 'https://...', images: ['https://...'] },
// ];
export const UA_NEW_PRODUCTS: Array<{
  id?: string;
  title: string;
  price: number | string;
  gender: 'men' | 'women';
  category: 'tops' | 'bottoms' | 'jackets' | 'accessories';
  url: string;
  images: string[];
  tags?: string[];
}> = [];
