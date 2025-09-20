// components/ThemeToggle.tsx
'use client';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const saved = (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  function toggle() {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.setAttribute('data-theme', next);
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      title="Toggle theme"
      style={{
        border:'1px solid var(--border)',
        background:'var(--card)',
        color:'var(--text)',
        borderRadius:10,
        padding:'6px 10px',
        cursor:'pointer'
      }}
    >
      {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
