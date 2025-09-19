// app/products/[slug]/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { products } from '@/lib/products';
import { notFound } from 'next/navigation';
import { use } from 'react';

type Props = { params: { slug: string } };

// Next.js (app router) can be async; keep it simple here:
export default function ProductPage({ params }: Props) {
  const product = products.find(p => p.slug === params.slug);
  if (!product) return notFound();

  // default selections
  const sizes = Array.from(new Set(product.variants.map(v => v.size)));
  const colors = Array.from(new Set(product.variants.map(v => v.color)));

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
      <h1 style={{ marginBottom: 8 }}>{product.name}</h1>
      <p style={{ marginBottom: 16 }}>{product.description}</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            style={{ objectFit: 'cover', borderRadius: 8 }}
          />
        </div>

        {/* Simple client component for selection */}
        <VariantPicker productSlug={product.slug} sizes={sizes} colors={colors} />
      </div>

      <div style={{ marginTop: 24 }}>
        <Link href="/">← Back to catalog</Link>
      </div>
    </main>
  );
}

// --- Client component: allow choosing size/color and go to /checkout ---
'use client';
import { useMemo, useState } from 'react';

function VariantPicker({
  productSlug,
  sizes,
  colors,
}: {
  productSlug: string;
  sizes: string[];
  colors: string[];
}) {
  const [size, setSize] = useState(sizes[0]);
  const [color, setColor] = useState(colors[0]);
  const [qty, setQty] = useState(1);

  const checkoutHref = useMemo(() => {
    const params = new URLSearchParams({
      slug: productSlug,
      size,
      color,
      qty: String(qty),
    });
    return `/checkout?${params.toString()}`;
  }, [productSlug, size, color, qty]);

  return (
    <div>
      <label>
        Size:
        <select value={size} onChange={e => setSize(e.target.value)} style={{ marginLeft: 8 }}>
          {sizes.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </label>

      <div style={{ height: 12 }} />

      <label>
        Color:
        <select value={color} onChange={e => setColor(e.target.value)} style={{ marginLeft: 8 }}>
          {colors.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </label>

      <div style={{ height: 12 }} />

      <label>
        Qty:
        <input
          type="number"
          min={1}
          value={qty}
          onChange={e => setQty(Math.max(1, Number(e.target.value)))}
          style={{ marginLeft: 8, width: 80 }}
        />
      </label>

      <div style={{ height: 16 }} />
      <a href={checkoutHref} style={{
        display: 'inline-block',
        padding: '10px 16px',
        border: '1px solid #fff',
        borderRadius: 6,
        textDecoration: 'none'
      }}>
        Checkout on this page
      </a>
    </div>
  );
}
