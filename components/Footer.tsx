// components/Footer.tsx
export default function Footer() {
  return (
    <footer style={{
      marginTop: 48,
      borderTop: '1px solid #eee',
      padding: '24px 16px',
      background: '#fafafa',
      textAlign: 'center',
      fontSize: 13,
      color: '#555'
    }}>
      <div style={{ marginBottom: 12 }}>
        <strong>🔒 Secure & Encrypted Checkout</strong>
      </div>
      <div style={{ display:'flex', justifyContent:'center', gap:16, flexWrap:'wrap', marginBottom:12 }}>
        <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" style={{ height:28 }}/>
        <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="MasterCard" style={{ height:28 }}/>
        <img src="https://developer.apple.com/apple-pay/marketing/images/apple-pay-mark.svg" alt="Apple Pay" style={{ height:28 }}/>
      </div>
      <div>
        © {new Date().getFullYear()} Urban Axis — All Rights Reserved. <br/>
        Protected by SSL · Trusted Site
      </div>
    </footer>
  );
}
