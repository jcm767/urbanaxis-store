// components/CartButton.tsx
'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CartButton() {
  const [count,setCount]=useState(0);
  useEffect(()=>{
    const raw=localStorage.getItem('cart');
    const arr=raw?JSON.parse(raw):[];
    setCount(arr.length||0);
  },[]);
  return (
    <Link href="/cart" style={{marginLeft:12,textDecoration:'none',color:'#111'}}>
      🛒 {count}
    </Link>
  );
}
