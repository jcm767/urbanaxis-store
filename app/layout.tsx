// app/layout.tsx
import type { ReactNode } from "react";

export const metadata = {
  title: "Urban Axis",
  description: "Streetwear, elevated.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  // SSR-safe: no window usage here. Light inline theming only.
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"',
          background: "#fff",
          color: "#111",
        }}
      >
        {children}
      </body>
    </html>
  );
}
