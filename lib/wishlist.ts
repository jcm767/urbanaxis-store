// lib/wishlist.ts
const KEY='wishlist';
export function getWishlist(): string[] {
  if (typeof window==='undefined') return [];
  try { const a=JSON.parse(localStorage.getItem(KEY)||'[]'); return Array.isArray(a)?a:[]; } catch { return []; }
}
export function toggleWishlist(slug: string): boolean {
  if (typeof window==='undefined') return false;
  const a=getWishlist(); const i=a.indexOf(slug);
  if(i>=0) a.splice(i,1); else a.push(slug);
  localStorage.setItem(KEY, JSON.stringify(a));
  window.dispatchEvent(new Event('wishlist:update'));
  return i<0;
}
export function isWishlisted(slug: string): boolean {
  return getWishlist().includes(slug);
}
