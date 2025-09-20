// components/SizeGuide.tsx
'use client';
import { useState } from 'react';

export default function SizeGuide({ html }: { html?: string | null }) {
  const [open,setOpen]=useState(false);
  return (
    <>
      <button
        onClick={()=>setOpen(true)}
        style={{ border:'1px solid var(--border)', background:'var(--card)', borderRadius:10, padding:'8px 12px', cursor:'pointer' }}
      >
        📏 Size Guide
      </button>

      {open && (
        <>
          <div
            onClick={()=>setOpen(false)}
            style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', zIndex:90 }}
          />
          <div
            style={{
              position:'fixed', zIndex:91, top:'10%', left:'50%', transform:'translateX(-50%)',
              width:'min(860px,95vw)', background:'var(--bg)', border:'1px solid var(--border)',
              borderRadius:12, padding:16
            }}
          >
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <strong>Size Guide</strong>
              <button
                onClick={()=>setOpen(false)}
                style={{ border:'1px solid var(--border)', background:'var(--card)', borderRadius:8, padding:'6px 10px' }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginTop:12 }}>
              {html ? (
                <div dangerouslySetInnerHTML={{ __html: html }} />
              ) : (
                <table style={{ width:'100%', borderCollapse:'collapse', fontSize:14 }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign:'left', borderBottom:'1px solid var(--border)', padding:'8px' }}>Size</th>
                      <th style={{ textAlign:'left', borderBottom:'1px solid var(--border)', padding:'8px' }}>Chest</th>
                      <th style={{ textAlign:'left', borderBottom:'1px solid var(--border)', padding:'8px' }}>Waist</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['XS','S','M','L','XL'].map((s,i)=>(
                      <tr key={s}>
                        <td style={{ padding:'8px', borderBottom:'1px solid var(--border)' }}>{s}</td>
                        <td style={{ padding:'8px', borderBottom:'1px solid var(--border)' }}>{34+i*2}-{36+i*2} in</td>
                        <td style={{ padding:'8px', borderBottom:'1px solid var(--border)' }}>{27+i*2}-{29+i*2} in</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
