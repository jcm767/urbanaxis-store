// app/layout.tsx
import type { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = { title: 'Urban Axis — Streetwear' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <style>{`
          :root {
            --bg: #ffffff;
            --text: #111111;
            --muted: #666666;
            --card: #ffffff;
            --border: #eaeaea;
            --accent: #111111;
          }
          html[data-theme="dark"] {
            --bg: #0f0f11;
            --text: #f8f8f8;
            --muted: #b0b0b0;
            --card: #141417;
            --border: #2a2a2e;
            --accent: #ffffff;
          }
          html, body { height:100%; }
          body {
            margin:0; background:var(--bg); color:var(--text);
            font-family: system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial, sans-serif;
          }
          a { color: var(--text); }
          input, select, button {
            color: var(--text);
          }
        `}</style>
        <script dangerouslySetInnerHTML={{__html:`
          (function(){
            try{
              var saved = localStorage.getItem('theme') || 'light';
              document.documentElement.setAttribute('data-theme', saved);
            }catch(e){}
          })();
        `}} />
      </head>
      <body>
        <Header />
        <main style={{ minHeight: '70vh' }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
