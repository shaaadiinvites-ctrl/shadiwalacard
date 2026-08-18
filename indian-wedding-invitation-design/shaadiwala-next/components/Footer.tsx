import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ background: 'linear-gradient(180deg,#04050f 0%,#030410 50%,#020308 100%)', color: '#8899b8', borderTop: '1px solid rgba(205,127,50,.2)', position: 'relative', overflow: 'hidden' }}>
      {/* Ambient glow */}
      <div aria-hidden style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 800, height: 300, background: 'radial-gradient(ellipse,rgba(20,60,110,0.1) 0%,transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '64px 32px 30px', display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 40, position: 'relative' }}>
        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span aria-hidden style={{ width: 8, height: 8, borderRadius: '50%', background: '#cd7f32', boxShadow: '0 0 10px rgba(205,127,50,0.6)', display: 'inline-block' }} />
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 23, color: '#eef0f8' }}>Shaadiwala <span style={{ color: '#e8a85a' }}>Card</span></span>
          </div>
          <p style={{ fontSize: 13.5, lineHeight: 1.7, maxWidth: 260, margin: '0 0 16px', color: '#7888a8' }}>Bespoke digital shaadi invitations, hand-painted for the modern Indian parivaar.</p>
          <p style={{ fontSize: 13.5, margin: '0 0 4px', color: '#e8a85a', fontWeight: 600 }}>+91 98100 12345</p>
          <p style={{ fontSize: 13, margin: 0, color: '#56637a' }}>Jaipur · Delhi · hello@shaadiwalacard.com</p>
        </div>

        {/* Explore */}
        <div>
          <p style={{ fontSize: 11, letterSpacing: '2px', color: '#e8a85a', textTransform: 'uppercase', margin: '0 0 18px' }}>Explore</p>
          {['#collection|Templates', '#venue|Venue Location', '#reviews|Reviews'].map(item => {
            const [href, label] = item.split('|');
            return <p key={label} style={{ margin: '0 0 12px' }}><Link href={href} style={{ color: '#7888a8' }}>{label}</Link></p>;
          })}
        </div>

        {/* Support */}
        <div>
          <p style={{ fontSize: 11, letterSpacing: '2px', color: '#e8a85a', textTransform: 'uppercase', margin: '0 0 18px' }}>Support</p>
          <p style={{ margin: '0 0 12px' }}><Link href="/faq-contact" style={{ color: '#7888a8' }}>FAQ &amp; Contact</Link></p>
        </div>

        {/* Legal */}
        <div>
          <p style={{ fontSize: 11, letterSpacing: '2px', color: '#e8a85a', textTransform: 'uppercase', margin: '0 0 18px' }}>Legal</p>
          {['Terms of Service', 'Privacy Policy', 'Refund Policy'].map(label => (
            <p key={label} style={{ margin: '0 0 12px' }}><Link href="#" style={{ color: '#7888a8' }}>{label}</Link></p>
          ))}
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,.05)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '22px 32px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, fontSize: 12, color: '#56637a' }}>
          <span>© 2026 shaadiwalacard.com — Crafted with love.</span>
          <span>Made in India, for the Indian parivaar.</span>
        </div>
      </div>
    </footer>
  );
}
