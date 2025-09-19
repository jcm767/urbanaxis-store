// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Urban Axis — Streetwear",
  description: "Underground streetwear. Rave energy. Minimal chrome UI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="ua-header">
          <div className="ua-container">
            <h1 className="ua-logo">URBAN<span>AXIS</span></h1>
            <nav className="ua-nav">
              <a href="#new">New</a>
              <a href="#tops">Tops</a>
              <a href="#outerwear">Outerwear</a>
              <a href="#accessories">Accessories</a>
            </nav>
          </div>
        </header>
        <main className="ua-main">{children}</main>
        <footer className="ua-footer">
          <div className="ua-container">
            <p>© {new Date().getFullYear()} Urban Axis</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
