import Image from 'next/image';
import Link from 'next/link';

const templates = [
  { id: 1, name: 'Royal Rajputana', desc: 'Majestic red & gold with hand-painted motifs', price: '₹2,999', badge: 'Bestseller', badgeBg: '#cd7f32', badgeFg: '#04050f', img: '/uploads/indian_card_foil.jpg' },
  { id: 2, name: 'Mughal Garden',   desc: 'Floral arches & intricate lattice patterns',     price: '₹2,499', badge: 'Popular',    badgeBg: '#1a3d60',   badgeFg: '#eef0f8', img: '/uploads/indian_envelope_new.jpg' },
  { id: 3, name: 'Cosmic Shaadi',   desc: 'Deep space backdrop with star constellation art', price: '₹3,499', badge: 'New',        badgeBg: '#2a1a60',   badgeFg: '#eef0f8', img: '/uploads/laptop_website_new.jpg' },
];

export default function Collection() {
  return (
    <section id="collection" style={{ position: 'relative', background: 'transparent', overflow: 'hidden' }}>
      {/* Ambient glow */}
      <div aria-hidden style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 900, height: 700, background: 'radial-gradient(ellipse,rgba(20,60,110,0.1) 0%,transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '80px 32px', position: 'relative' }}>
        {/* Watermark */}
        <div aria-hidden style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontFamily: "'Cormorant Garamond',serif", fontSize: '20vw', color: 'rgba(205,127,50,0.03)', whiteSpace: 'nowrap', pointerEvents: 'none', userSelect: 'none', fontWeight: 700, lineHeight: 1, zIndex: 0 }}>VIVAH</div>

        <div style={{ textAlign: 'center', marginBottom: 18, position: 'relative', zIndex: 1 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12, fontSize: 10, letterSpacing: '6px', color: '#e8a85a', textTransform: 'uppercase', fontWeight: 700 }}>✦ The Collection ✦</span>
        </div>
        <h2 style={{ textAlign: 'center', fontFamily: "'Cormorant Garamond',serif", fontWeight: 400, fontSize: 62, lineHeight: 1.04, margin: '0 auto 16px', color: '#eef0f8', maxWidth: 760, position: 'relative', zIndex: 1 }}>
          A gallery of <span className="shiny-foil-text">living</span> invitations.
        </h2>
        <p style={{ textAlign: 'center', fontSize: 15, lineHeight: 1.65, color: '#7888a8', maxWidth: 500, margin: '0 auto 10px', position: 'relative', zIndex: 1 }}>Hand-painted templates with instant RSVP, venue maps &amp; countdown clock.</p>
        <p className="italic-serif" style={{ textAlign: 'center', fontSize: 18, color: 'rgba(205,127,50,0.65)', margin: '0 0 42px', letterSpacing: 2, position: 'relative', zIndex: 1 }}>✦ Choose Your Story ✦</p>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
          {templates.map(t => (
            <div key={t.id} className="template-card-container spotlight-card" style={{ background: 'linear-gradient(160deg,#0c1422 0%,#080d18 60%,#0a1020 100%)', border: '1px solid rgba(205,127,50,.4)', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 0 rgba(255,255,255,0.03) inset,0 20px 60px rgba(0,0,0,0.5),0 0 25px rgba(205,127,50,0.08)', transition: 'transform .3s cubic-bezier(0.2,0.8,0.2,1), box-shadow .3s ease' }}>
              <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}>
                <div aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '35%', background: 'linear-gradient(180deg,rgba(255,220,160,0.07) 0%,transparent 100%)', pointerEvents: 'none', zIndex: 5 }} />
                <Image src={t.img} alt={t.name} fill style={{ objectFit: 'cover' }} sizes="(max-width:768px) 100vw, 33vw" />
                <span style={{ position: 'absolute', top: 14, left: 14, background: t.badgeBg, color: t.badgeFg, fontSize: 10.5, letterSpacing: '1.5px', textTransform: 'uppercase', padding: '6px 12px', borderRadius: 14 }}>{t.badge}</span>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 18 }}>
                  <span style={{ background: '#cd7f32', color: '#04050f', fontWeight: 700, padding: '9px 18px', borderRadius: 20, letterSpacing: '.4px', fontSize: 13 }}>Quick Preview</span>
                </div>
              </div>
              <div style={{ padding: '24px 24px 26px' }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 600, fontSize: 27, margin: '0 0 6px', color: '#eef0f8' }}>{t.name}</h3>
                <p style={{ fontSize: 13.5, color: '#8899b8', margin: '0 0 20px', lineHeight: 1.55 }}>{t.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, color: '#e8a85a' }}>{t.price}</span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button style={{ border: '1px solid rgba(205,127,50,.5)', background: 'transparent', color: '#e8a85a', padding: '10px 16px', borderRadius: 22, fontSize: 12.5, fontFamily: "'Jost',sans-serif", cursor: 'pointer' }}>View Demo</button>
                    <Link href="/faq-contact" style={{ background: '#0c1422', color: '#eef0f8', padding: '10px 18px', borderRadius: 22, fontSize: 12.5, border: '1.5px solid #cd7f32', textDecoration: 'none' }}>Buy Now</Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
