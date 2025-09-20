// components/Footer.tsx
export default function Footer() {
  const wrap: React.CSSProperties = {
    marginTop: 48,
    borderTop: '1px solid var(--border)',
    padding: '24px 16px',
    background: 'var(--bg)',
    color: 'var(--text)',
  };
  const row: React.CSSProperties = { display:'flex', justifyContent:'center', gap:16, flexWrap:'wrap', alignItems:'center' };
  const small: React.CSSProperties = { fontSize:12, opacity:.85, textAlign:'center' };

  return (
    <footer style={wrap}>
      <div style={{ textAlign:'center', marginBottom: 10 }}>
        <strong>🔒 Secure &amp; Encrypted Checkout</strong>
        <div style={{ ...small, marginTop:6 }}>
          SSL/TLS enabled • Processed by Stripe (PCI-DSS Level 1). Card details never touch our servers.
        </div>
      </div>

      <div aria-label="Accepted payment methods" style={row}>
        <BadgeVisa />
        <BadgeMastercard />
        <BadgeApplePay />
      </div>

      <div style={{ ...small, marginTop:12, textAlign:'center' }}>
        © {new Date().getFullYear()} Urban Axis — All Rights Reserved · Protected by SSL · Trusted Site
      </div>
    </footer>
  );
}

/** Simple inline SVG badges so there’s no external image loading/CORS issues */
function BadgeWrap({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      border: '1px solid var(--border)',
      background: 'var(--card)',
      borderRadius: 12,
      padding: '6px 10px',
      display: 'inline-flex',
      alignItems: 'center',
      height: 34
    }}>
      {children}
    </div>
  );
}

function BadgeVisa() {
  return (
    <BadgeWrap>
      <svg width="56" height="18" viewBox="0 0 56 18" aria-label="Visa" role="img">
        <rect width="56" height="18" rx="3" fill="none" />
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontFamily="system-ui, -apple-system, Segoe UI, Roboto, Arial" fontWeight="700" fontSize="12" fill="var(--text)">VISA</text>
      </svg>
    </BadgeWrap>
  );
}

function BadgeMastercard() {
  return (
    <BadgeWrap>
      <svg width="56" height="18" viewBox="0 0 56 18" aria-label="Mastercard" role="img">
        <rect width="56" height="18" rx="3" fill="none" />
        <circle cx="24" cy="9" r="7" fill="#ff5f00" opacity="0.9"></circle>
        <circle cx="32" cy="9" r="7" fill="#f79e1b" opacity="0.9"></circle>
      </svg>
    </BadgeWrap>
  );
}

function BadgeApplePay() {
  return (
    <BadgeWrap>
      <svg width="80" height="18" viewBox="0 0 80 18" aria-label="Apple Pay" role="img">
        <rect width="80" height="18" rx="3" fill="none" />
        <text x="22" y="12" fontFamily="system-ui, -apple-system, Segoe UI, Roboto, Arial" fontSize="11" fill="var(--text)"><tspan></tspan></text>
        <text x="32" y="12" fontFamily="system-ui, -apple-system, Segoe UI, Roboto, Arial" fontWeight="700" fontSize="11" fill="var(--text)">Pay</text>
      </svg>
    </BadgeWrap>
  );
}
