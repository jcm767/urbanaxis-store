// lib/recent.ts
const KEY='recently_viewed';
export function pushRecent(slug: string, limit=12) {
  if (typeof window==='undefined') return;
  try {
    const a: string[] = JSON.parse(localStorage.getItem(KEY)||'[]') || [];
    const i=a.indexOf(slug); if(i>=0) a.splice(i,1);
    a.unshift(slug);
    localStorage.setItem(KEY, JSON.stringify(a.slice(0, limit)));
  } catch {}
  window.dispatchEvent(new Event('recent:update'));
}
export function getRecent(): string[] {
  if (typeof window==='undefined') return [];
  try { const a=JSON.parse(localStorage.getItem(KEY)||'[]'); return Array.isArray(a)?a:[]; } catch { return []; }
}
