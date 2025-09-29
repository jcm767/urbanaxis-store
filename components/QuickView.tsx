cat > components/QuickView.tsx <<'TSX'
'use client';
import { useState } from 'react';
import { addItem } from '@/lib/cart';
import { getSlug, getImageForColor, getName, getPrice, getColors } from '@/lib/productUtils';

export default function QuickView({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false);

  const product = slug ? getSlug(slug) : null;
  const name = product ? getName(product) : 'Untitled';
  const price = product ? Number(getPrice(product)) : 0;
  const colors = product ? getColors(product) : [];
  const img = product ? getImageForColor(product, colors[0]) : '';

  return (
    <div style={{ padding: 20 }}>
      <button onClick={() => setOpen(true)}>Quick View</button>
      {open && (
        <div style={{ border: '1px solid #ddd', padding: 12 }}>
          <h3>{name}</h3>
          <div>${price.toFixed(2)}</div>
          <button
            onClick={() =>
              addItem({ title: name, price, image: img, quantity: 1 })
            }
            style={{
              marginTop: 12,
              padding: '8px 12px',
              borderRadius: 4,
              background: 'black',
              color: 'white',
            }}
          >
            Add to Cart
          </button>
        </div>
      )}
    </div>
  );
}
TSX
