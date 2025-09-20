// lib/reviews.ts
export type Review = { slug: string; name: string; rating: number; text?: string; photo?: string; ts: number };
const KEY='reviews_v1';
function read(): Review[] {
  if (typeof window==='undefined') return [];
  try { const a=JSON.parse(localStorage.getItem(KEY)||'[]'); return Array.isArray(a)?a:[]; } catch { return []; }
}
function write(a: Review[]) { if (typeof window==='undefined') return; localStorage.setItem(KEY, JSON.stringify(a)); }
export function listReviews(slug: string): Review[] { return read().filter(r=>r.slug===slug).sort((a,b)=>b.ts-a.ts); }
export function addReview(r: Omit<Review,'ts'>) {
  const a=read(); a.push({ ...r, ts: Date.now() }); write(a);
  window.dispatchEvent(new Event('reviews:update'));
}
export function avgRating(slug: string): number {
  const rs=listReviews(slug); if(!rs.length) return 0;
  return Math.round((rs.reduce((s,r)=>s+r.rating,0)/rs.length)*10)/10;
}
