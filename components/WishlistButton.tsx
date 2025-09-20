// components/WishlistButton.tsx
'use client';
import { useEffect, useState } from 'react';
import { isWishlisted, toggleWishlist } from '@/lib/wishlist';

export default function WishlistButton({ slug, compact=false }:{ slug:string; compact?:boolean }) {
  const [on,setOn]=useState(false);
  useEffect(()=>{ setOn(isWishlisted(slug)); const fn=()=>setOn(isWishlisted(slug)); window.addEventListener('wishlist:update',fn); return()=>window.removeEventListener('wishlist:update',fn); },[slug]);
  return (
    <button
      onClick={()=>setOn(toggleWishlist(slug))}
      aria-label="Add to wishlist"
      title={on?'Remove from wishlist':'Add to wishlist'}
      style={{
        border:'1px solid var(--border)', background:'var(--card)', color:on?'crimson':'var(--text)',
        borderRadius:compact?8:999, padding:compact?'6px 8px':'6px 10px', cursor:'pointer'
      }}
    >
      {on ? '♥' : '♡'}{compact?'' : ' Wishlist'}
    </button>
  );
}
