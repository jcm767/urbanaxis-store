'use client';
import { useState } from 'react';
import { addItem } from '@/lib/cart';
import { getSlug, getImageForColor, getName, getPrice, getColors, getGender, getCategory } from '@/lib/productUtils';

export default function QuickView({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false);

  const product = slug ? getSlug(slug) : null;
  const name = product ? getName(product) : 'Untitled';
  const price = product ? Number(getPrice(product)) : 0;
  const colors = product ? getColors(product) : [];
  const img = product ? getImageForColor(product) : '';
  const gender = product ? getGender(product) : 'unisex';
  const category = product ? getCategory(product) : 'misc';

  return (
    <div style={{ padding: 20 }}>
      {open && (
        <div style={{ border: '1px solid var(--border)', padding: 12 }}>
          <h3>{name}</h3>
          <p>${price.toFixed(2)}</p>
          <button
            style={{ padding: '8px 12px', background: 'black', color: 'white', borderRadius: 4 }}
            onClick={() =>
              addItem({
                id: slug,
                title: name,
                price,
                image: img,
                gender,
                category,
                quantity: 1,
              })
            }
          >
            Add to Cart
          </button>
        </div>
      )}
      <button onClick={() => setOpen(!open)}>Quick View</button>
    </div>
  );
}
