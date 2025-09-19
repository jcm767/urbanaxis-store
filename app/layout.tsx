// app/layout.tsx
import type { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = { title: 'Urban Axis — Streetwear' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial, sans-serif', color: '#111' }}>
        <Header />
        <main style={{ minHeight: '70vh' }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
