export const metadata = { title: 'Urban Axis', description: 'Streetwear by Urban Axis' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial' }}>
        <div style={{ maxWidth: 740, margin: '32px auto', padding: '0 16px' }}>
          {children}
        </div>
      </body>
    </html>
  );
}
