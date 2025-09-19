// components/SearchBar.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SearchBar() {
  const [q, setQ] = useState('');
  const router = useRouter();

  return (
    <form onSubmit={(e)=>{e.preventDefault();router.push(q?`/products?search=${encodeURIComponent(q)}`:'/products')}}>
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search" style={{padding:'6px 10px', border:'1px solid #ccc', borderRadius:6}}/>
    </form>
  );
}
