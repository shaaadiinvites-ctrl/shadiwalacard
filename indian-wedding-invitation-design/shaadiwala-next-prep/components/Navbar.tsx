'use client';
import Link from 'next/link';

export default function Navbar() {
  return (
    <div
      style={{
        position: 'sticky', top: 0, zIndex: 1000,
        background: 'rgba(4,5,15,0.85)',
        backdropFilter: 'blur(28px) saturate(160%)',
        borderBottom: '1px solid rgba(205,127,50,.4)',
        boxShadow: '0 4px 40px rgba(0,0,0,0.5),inset 0 -1px 0 rgba(205,127,50,0.08)',
      }}
    >
      <nav style={{ maxWidth: 1180, margin: '0 auto', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'radial-gradient(circle,#f5d17e,#cd7f32)', boxShadow: '0 0 14px rgba(205,127,50,0.9)', display: 'inline-block' }} />
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, letterSpacing: '.5px', color: '#eef0f8', fontWeight: 500 }}>
            Shaadiwala <span style={{ color: '#e8a85a' }}>Card</span>
          </span>
        </div>
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 32, fontSize: 12.5, letterSpacing: '.8px', color: '#7888a8', textTransform: 'uppercase', fontWeight: 600 }}>
          <Link href="#collection" style={{ color: '#7888a8' }}>Templates</Link>
          <Link href="#venue" style={{ color: '#7888a8' }}>Venue</Link>
          <Link href="#reviews" style={{ color: '#7888a8' }}>Reviews</Link>
          <Link href="/faq-contact" style={{ color: '#e8a85a', fontWeight: 700 }}>FAQ &amp; Contact</Link>
        </div>
        <Link href="#collection" className="liquid-glass-btn" style={{ padding: '10px 22px', borderRadius: 24, fontSize: 12, letterSpacing: '.6px', textTransform: 'uppercase', textDecoration: 'none', color: '#fff' }}>
          Browse Templates
        </Link>
      </nav>
    </div>
  );
}
