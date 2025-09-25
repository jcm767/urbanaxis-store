'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getName, getSlug, getImage, getPrice } from '@/lib/productUtils';

type AnyRecord = Record<string, any>;

export default function RecentlyViewed(props: { items?: AnyRecord[] }) {
  const [items, setItems] = useState<AnyRecord[]>(props.items ?? []);

  // Hydrate from localStorage if no props provided
  useEffect(() => {
    if (items.length) return;
    try {
      const raw =
        typeof window !== 'undefined'
          ? window.localStorage.getItem('recentlyViewed') ??
            window.localStorage.getItem('ua_recently_viewed')
          : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed as AnyRecord[]);
      }
    } catch {
      /* ignore */
    }
  }, [items.length]);

  if (!items.length) return null;

  return (
    <section style={{ padding: 24 }}>
      <h2 style={{ margin: '0 0 12px 0' }}>Recently Viewed</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 12,
        }}
      >
        {items.map((p: AnyRecord, i: number) => {
          const name = getName(p);
          const slug = getSlug(p) || `recent-${i}`;
          const img = getImage(p);
          const priceStr = getPrice(p?.price); // <-- formatted string (no .toFixed)

          return (
            <Link
              key={slug}
              href={`/products/${encodeURIComponent(slug)}`}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: 12,
                overflow: 'hidden',
                textDecoration: 'none',
                color: 'inherit',
              }}
            >
              {img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt={name}
                  src={img}
                  style={{ width: '100%', height: 160, objectFit: 'cover' }}
                  loading="lazy"
                />
              ) : (
                <div style={{ width: '100%', height: 160, background: '#f3f4f6' }} />
              )}
              <div style={{ padding: 10 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{name}</div>
                <div style={{ fontSize: 13, opacity: 0.75 }}>{priceStr}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
