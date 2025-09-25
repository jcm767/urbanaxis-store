// app/layout.tsx
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Urban Axis',
  description: 'Curated streetwear. Real products. Fast checkout.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily:
            'system-ui, -apple-system, Segoe UI, Roboto, Inter, Helvetica, Arial, sans-serif',
          background: '#fff',
          color: '#111827',
        }}
      >
        {children}
      </body>
    </html>
  );
}
