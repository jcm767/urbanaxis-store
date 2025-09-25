'use client';

import { useEffect, useMemo, useState } from 'react';
import { addItem } from '@/lib/cart';
import {
  getBySlug,
  getImageForColor,
  getImage,
  getColors,
  getName,
  getPrice,
  getSlug,
} from '@/lib/productUtils';

type Prod = Record<string, any>;

export default function QuickView() {
  const [slug, setSlug] = useState<string | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState<Prod | null>(null);
  const [color, setColor] = useState<string | undefined>(undefined);

  useEffect(() => {
    try {
      const u = new URL(window.location.href);
      const s = u.searchParams.get('qv') ?? undefined;
      if (s) {
        setSlug(s);
        setOpen(true);
      }
    } catch {
      /* no-op */
    }
  }, []);

  useEffect(() => {
    if (!slug) return;
    let mounted = true;
    (async () => {
      const p = await getBySlug(slug);
      if (mounted) setProduct(p ?? null);
    })();
    return () => {
      mounted = false;
    };
  }, [slug]);

  const colors = useMemo(() => (product ? getColors(product) : []), [product]);
  const img = useMemo(() => {
    if (!product) return undefined;
    if (color) return getImageForColor(product, color);
    return getImage(product);
  }, [product, color]);

  if (!open || !product) return null;

  const name = getName(product);
  const priceStr = getPrice(product?.price);
  const numericPrice =
    Number(String(product?.price ?? '').replace(/[^\d.]/g, '')) || 0;
  const itemSlug = getSlug(product) || slug || name;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.35)',
        display: 'grid',
        placeItems: 'center',
        zIndex: 50,
      }}
      onClick={() => setOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(92vw, 720px)',
          background: 'var(--card, #fff)',
          color: 'var(--foreground, #111827)',
          borderRadius: 12,
          border: '1px solid var(--border, #e5e7eb)',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: 12 }}>
          <div style={{ fontWeight: 700 }}>{name}</div>
          <button
            onClick={() => setOpen(false)}
            style={{
              border: '1px solid var(--border, #e5e7eb)',
              background: 'var(--card, #fff)',
              borderRadius: 8,
              padding: '6px 10px',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: 16 }}>
          <div>
            {img ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt={name}
                src={img}
                style={{ width: '100%', height: 360, objectFit: 'cover', borderRadius: 8 }}
              />
            ) : (
              <div style={{ width: '100%', height: 360, background: '#f3f4f6', borderRadius: 8 }} />
            )}
          </div>

          <div style={{ display: 'grid', gap: 10 }}>
            <div style={{ marginTop: 6, fontWeight: 700 }}>{priceStr}</div>

            {!!colors.length && (
              <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {colors.map((c: string) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    style={{
                      border: '1px solid #e5e7eb',
                      background: color === c ? '#111827' : '#fff',
                      color: color === c ? '#fff' : '#111827',
                      borderRadius: 999,
                      padding: '6px 10px',
                      cursor: 'pointer',
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={() =>
                addItem({
                  // IMPORTANT: align with CartItem type in '@/lib/cart' (no 'id' field)
                  slug: String(itemSlug),
                  title: name,
                  price: numericPrice,
                  image: img,
                } as any)
              }
              style={{
                marginTop: 12,
                background: '#111827',
                color: '#fff',
                padding: '10px 14px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Add to Cart
            </button>

            {(product as any)?.url ? (
              <a
                href={(product as any).url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#2563eb', textDecoration: 'underline', marginTop: 6 }}
              >
                View Source Product
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
