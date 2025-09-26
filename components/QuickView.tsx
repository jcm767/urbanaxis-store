'use client';
import { useMemo, useState } from 'react';
import { addItem } from '@/lib/cart';
import { getColors, getImageForColor } from '@/lib/productUtils';
import { getBySlug, productName, productPriceNumber, productImage, AnyProduct } from '@/lib/quickview-helpers';

export default function QuickView() {
  const [slug, setSlug] = useState<string | undefined>();
  const [open, setOpen] = useState(false);

  const product: AnyProduct | undefined = useMemo(
    () => (slug ? getBySlug(slug) : undefined),
    [slug]
  );

  const name = productName(product);
  const price = productPriceNumber(product);
  const colors: string[] = product ? (getColors?.(product) ?? []) : [];
  const img = productImage(product);

  return (
    <div style={{ padding: 20 }}>
      {/* Demo controls to set a slug; remove/replace with your trigger */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <input
          placeholder="Enter product slug"
          value={slug ?? ''}
          onChange={(e) => setSlug(e.target.value)}
          style={{ border: '1px solid var(--border)', padding: 6, borderRadius: 6 }}
        />
        <button onClick={() => setOpen(true)} style={{ padding: '8px 12px', borderRadius: 8, background: 'black', color: 'white' }}>
          Open Quick View
        </button>
      </div>

      {open && (
        <div style={{ border: '1px solid var(--border)', padding: 12, borderRadius: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0 }}>{name}</h3>
            <button onClick={() => setOpen(false)} style={{ border: '1px solid var(--border)', background: 'var(--card)', borderRadius: 8, padding: '6px 10px' }}>
              ✕
            </button>
          </div>
          <div style={{ marginTop: 6, fontWeight: 700 }}>${price.toFixed(2)}</div>

          {!!colors.length && (
            <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {colors.map((c: string) => (
                <div
                  key={c}
                  title={c}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: getImageForColor?.(product, c) ?? '#eee',
                    border: '1px solid #ccc'
                  }}
                />
              ))}
            </div>
          )}

          <button
            onClick={() =>
              addItem({
                title: name,
                price,
                image: img,
              })
            }
            style={{ marginTop: 12, padding: '8px 12px', borderRadius: 8, background: 'black', color: 'white' }}
          >
            Add to Cart
          </button>
        </div>
      )}
    </div>
  );
}
