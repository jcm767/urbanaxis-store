// components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ borderTop:'1px solid #eee', padding:'20px 16px', marginTop:40 }}>
      <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', gap:16, flexWrap:'wrap' }}>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/refunds">Refunds</Link>
        <Link href="/privacy">Privacy</Link>
      </div>
      <div style={{ fontSize:12, color:'#666', marginTop:12 }}>
        Secure checkout • 30-day returns • Fast shipping
      </div>
    </footer>
  );
}
