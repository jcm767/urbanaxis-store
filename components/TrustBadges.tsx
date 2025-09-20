// components/TrustBadges.tsx
export default function TrustBadges(){
  return (
    <div style={{marginTop:12,display:'grid',gap:8}}>
      <div style={{fontSize:12,opacity:.8}}>Secure checkout with:</div>
      <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
        <span style={{border:'1px solid var(--border)',borderRadius:8,padding:'6px 10px'}}>🔒 SSL</span>
        <span style={{border:'1px solid var(--border)',borderRadius:8,padding:'6px 10px'}}>💳 Visa</span>
        <span style={{border:'1px solid var(--border)',borderRadius:8,padding:'6px 10px'}}>💳 MasterCard</span>
        <span style={{border:'1px solid var(--border)',borderRadius:8,padding:'6px 10px'}}>💳 Amex</span>
        <span style={{border:'1px solid var(--border)',borderRadius:8,padding:'6px 10px'}}>🌀 Stripe</span>
      </div>
    </div>
  );
}
