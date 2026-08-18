'use client';
import Link from 'next/link';

export default function Hero() {
  return (
    <header
      style={{
        position: 'relative', width: '100%', overflow: 'hidden',
        padding: '130px 20px 110px', textAlign: 'center',
        background: 'transparent',
      }}
    >
      {/* Multi-layer cinematic ambient glow */}
      <div aria-hidden style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 1200, height: 800, background: 'radial-gradient(ellipse at 50% 30%, rgba(205,127,50,0.22) 0%, rgba(130,80,20,0.1) 35%, transparent 65%)', pointerEvents: 'none', zIndex: 1 }} />
      <div aria-hidden style={{ position: 'absolute', top: '10%', left: '-5%', width: 700, height: 600, background: 'radial-gradient(ellipse, rgba(20,60,120,0.28) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 1, borderRadius: '50%' }} />
      <div aria-hidden style={{ position: 'absolute', top: '20%', right: '-8%', width: 600, height: 500, background: 'radial-gradient(ellipse, rgba(15,50,90,0.2) 0%, transparent 65%)', pointerEvents: 'none', zIndex: 1, borderRadius: '50%' }} />
      <div className="silk-aurora-bg" aria-hidden />

      {/* Floating glass shapes */}
      <div className="float-geo-1" aria-hidden style={{ position: 'absolute', top: 55, left: '7%', width: 300, height: 130, borderRadius: 32, border: '1px solid rgba(205,127,50,0.5)', background: 'linear-gradient(135deg, rgba(205,127,50,0.12) 0%, rgba(20,60,110,0.08) 100%)', backdropFilter: 'blur(20px)', pointerEvents: 'none', zIndex: 2, boxShadow: '0 0 50px rgba(205,127,50,0.18),inset 0 1px 0 rgba(255,220,160,0.25)' }} />
      <div className="float-geo-2" aria-hidden style={{ position: 'absolute', top: 80, right: '8%', width: 250, height: 115, borderRadius: 28, border: '1px solid rgba(20,60,120,0.6)', background: 'linear-gradient(135deg, rgba(20,60,120,0.16) 0%, rgba(205,127,50,0.07) 100%)', backdropFilter: 'blur(20px)', pointerEvents: 'none', zIndex: 2, boxShadow: '0 0 50px rgba(20,60,120,0.28),inset 0 1px 0 rgba(180,210,255,0.18)' }} />
      <div className="float-geo-3" aria-hidden style={{ position: 'absolute', bottom: 80, left: '9%', width: 155, height: 155, borderRadius: 28, border: '1px solid rgba(205,127,50,0.45)', background: 'linear-gradient(135deg, rgba(205,127,50,0.1) 0%, rgba(10,20,40,0.3) 100%)', backdropFilter: 'blur(18px)', pointerEvents: 'none', zIndex: 2, boxShadow: '0 0 40px rgba(205,127,50,0.18),inset 0 1px 0 rgba(255,220,160,0.2)' }} />
      <div className="float-geo-4" aria-hidden style={{ position: 'absolute', bottom: 100, right: '11%', width: 175, height: 125, borderRadius: 24, border: '1px solid rgba(20,60,120,0.5)', background: 'linear-gradient(135deg, rgba(20,60,120,0.14) 0%, rgba(205,127,50,0.07) 100%)', backdropFilter: 'blur(18px)', pointerEvents: 'none', zIndex: 2, boxShadow: '0 0 40px rgba(20,60,120,0.2),inset 0 1px 0 rgba(180,210,255,0.14)' }} />

      {/* Hero content */}
      <div style={{ maxWidth: 880, margin: '0 auto', position: 'relative', zIndex: 10 }}>

        {/* Pill badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 22px', borderRadius: 30, background: 'rgba(7,10,22,0.92)', border: '1.5px solid rgba(205,127,50,0.5)', color: '#e8a85a', fontSize: 11.5, letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 700, marginBottom: 28, boxShadow: '0 0 25px rgba(205,127,50,0.25)' }}>
          <span>✦ SHUBH VIVAH · BESPOKE DIGITAL INVITATIONS ✦</span>
        </div>

        {/* Headline */}
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: 78, lineHeight: 1.02, margin: '0 auto 24px', color: '#eef0f8', letterSpacing: '-0.5px', maxWidth: 820 }}>
          Your Love Story,<br />
          <span className="shiny-foil-text">Elegantly Digital.</span>
        </h1>

        {/* Subtitle */}
        <p style={{ fontSize: 18, lineHeight: 1.65, color: '#8899b8', maxWidth: 580, margin: '0 auto 36px', fontWeight: 400 }}>
          Hand-painted digital invitations for your whole family in one link.
        </p>

        {/* Feature chips */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 40, flexWrap: 'wrap' }}>
          {[
            { icon: '🎨', label: 'Hand-Painted Art',    border: 'rgba(205,127,50,.45)', color: '#e8a85a' },
            { icon: '⚡', label: 'Instant Live Link',   border: 'rgba(20,60,120,.5)',   color: '#a8c0e0' },
            { icon: '💍', label: 'Complete RSVP Suite', border: 'rgba(205,127,50,.45)', color: '#e8a85a' },
          ].map(chip => (
            <span key={chip.label} style={{ background: 'rgba(10,16,28,0.9)', border: `1px solid ${chip.border}`, color: chip.color, fontSize: 12.5, fontWeight: 600, padding: '8px 18px', borderRadius: 22, boxShadow: '0 6px 16px rgba(0,0,0,.5)' }}>
              {chip.icon} {chip.label}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, marginBottom: 44, flexWrap: 'wrap' }}>
          <Link href="#collection" className="liquid-glass-btn" style={{ padding: '17px 42px', borderRadius: 32, fontSize: 15.5, letterSpacing: '.5px' }}>
            Browse Templates →
          </Link>
        </div>

        {/* Stats badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 24, padding: '12px 28px', borderRadius: 30, background: 'rgba(7,10,22,0.85)', border: '1px solid rgba(205,127,50,0.3)', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span role="img" aria-label="Rated 4.9 out of 5 stars" style={{ color: '#e8a85a', fontSize: 16, letterSpacing: 1 }}>★★★★★</span>
            <span style={{ fontSize: 13.5, color: '#8899b8' }}><strong style={{ color: '#eef0f8' }}>4.9</strong> on Google</span>
          </div>
          <div style={{ width: 1, height: 22, background: 'rgba(205,127,50,.3)' }} aria-hidden />
          <span style={{ fontSize: 13.5, color: '#8899b8' }}><strong style={{ color: '#eef0f8' }}>12,400+</strong> couples served</span>
        </div>

      </div>
    </header>
  );
}
