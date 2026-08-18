'use client';
import Link from 'next/link';
import { LiquidButton } from '@/components/ui/liquid-glass-button';

export default function ContactUsPage() {
  return (
    <main style={{ background: '#F2F4F8', color: '#1A202C', fontFamily: "'Inter', sans-serif", minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* ─────────────────── GLOBAL STYLES ─────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        input, textarea { caret-color: #ffffff; }
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; background: #F2F4F8; }
        a { text-decoration: none; color: inherit; }

        .sf-container { width: 100%; max-width: 1220px; margin: 0 auto; padding: 0 20px; }
        
        .contact-input {
          width: 100%; 
          background: rgba(255, 255, 255, 0.12); 
          border: 1.5px solid rgba(255, 255, 255, 0.25);
          color: #ffffff; 
          padding: 16px 20px; 
          border-radius: 16px; 
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem; 
          outline: none; 
          transition: all 0.3s ease;
          box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.15);
        }
        .contact-input::placeholder { color: rgba(255, 255, 255, 0.65); }
        .contact-input:focus { 
          border-color: rgba(255, 255, 255, 0.85); 
          background: rgba(255, 255, 255, 0.18);
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.25), inset 0 2px 8px rgba(0, 0, 0, 0.15);
        }
      `}</style>

      {/* HEADER */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 1000, background: 'rgba(242, 244, 248, 0.85)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(26,32,44,0.12)'
      }}>
        <div className="sf-container" style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0, userSelect: 'none' }}>
            <img 
              src="/uploads/envelope_icon_transparent.png" 
              alt="shadiwalacard.com Icon" 
              style={{ height: '32px', width: '32px', objectFit: 'contain', borderRadius: '4px' }} 
            />
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', color: '#2e1065', letterSpacing: '0.2px', fontWeight: 500 }}>
              Shadiwala<span style={{ color: '#9d174d' }}>Card</span>
            </span>
          </Link>
          <Link href="/" style={{ fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase', color: 'rgba(26,32,44,0.75)', fontWeight: 600 }}>← Back to home</Link>
        </div>
      </header>

      {/* CONTENT */}
      <section style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
        <div className="sf-container" style={{ maxWidth: 680 }}>
          <p style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '5px', color: 'rgba(157, 23, 77, 0.8)', textTransform: 'uppercase', marginBottom: 12 }}>Get in Touch</p>
          <h1 style={{ textAlign: 'center', fontFamily: "'Playfair Display', serif", fontWeight: 500, fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', color: '#2e1065', margin: '0 0 16px', letterSpacing: '-0.5px', lineHeight: 1.15 }}>
            Let's craft your <em style={{ color: '#9d174d', fontStyle: 'italic' }}>perfect</em> invitation.
          </h1>
          <p style={{ textAlign: 'center', fontSize: '1.05rem', color: 'rgba(26,32,44,0.75)', marginBottom: 48, lineHeight: 1.6 }}>
            Have a custom Shadi theme requirement? Fill out the form below and our design artisans will get back to you within hours.
          </p>

          {/* Luxury Royal Form Card */}
          <div style={{
            position: 'relative',
            background: 'linear-gradient(135deg, #2e1065 0%, #4c1d95 50%, #9d174d 100%)',
            borderRadius: 32,
            padding: '44px 36px',
            boxShadow: '0 24px 64px -12px rgba(46, 16, 101, 0.35), 0 12px 32px -8px rgba(157, 23, 77, 0.25)',
            border: '1.5px solid rgba(255, 255, 255, 0.3)',
            overflow: 'hidden'
          }}>
            {/* Ambient inner sheen */}
            <div aria-hidden style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 }} />

            <form style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'relative', zIndex: 2 }} onSubmit={(e) => { e.preventDefault(); alert('Thank you! Your inquiry has been sent to our design team.'); }}>
              <input type="text" placeholder="Your Name" className="contact-input" required />
              <input type="email" placeholder="Email Address" className="contact-input" required />
              <input type="tel" placeholder="WhatsApp Number (for instant preview link)" className="contact-input" required />
              <textarea placeholder="Tell us about your Shadi date, theme preferences and custom ideas..." className="contact-input" rows={5} required />
              <div style={{ marginTop: 8 }}>
                <LiquidButton 
                  style={{ width: '100%', height: '54px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px', color: '#3d0221', fontWeight: 800, letterSpacing: '0.4px', fontSize: '1rem', backdropFilter: 'blur(20px) saturate(180%)', background: 'rgba(255, 255, 255, 0.45)', border: '2px solid rgba(255, 255, 255, 0.85)', boxShadow: '0 16px 40px -6px rgba(0, 0, 0, 0.35)', cursor: 'pointer' }}
                >
                  Send Message
                </LiquidButton>
              </div>
            </form>
          </div>

          <div style={{ marginTop: 48, textAlign: 'center', fontSize: '0.875rem', color: 'rgba(26,32,44,0.6)' }}>
            Or email our design team directly at <br/>
            <a href="mailto:hello@shadiwalacard.com" style={{ color: '#9d174d', fontWeight: 700, fontSize: '1.05rem', display: 'inline-block', marginTop: 6, textDecoration: 'underline' }}>hello@shadiwalacard.com</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(26,32,44,0.15)', padding: '40px 0', textAlign: 'center', background: '#F2F4F8' }}>
        <div className="sf-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', color: '#2e1065' }}>
            Shadiwala<span style={{ color: '#9d174d' }}>Card</span>
          </span>
          <span style={{ fontSize: '0.719rem', color: 'rgba(26,32,44,0.4)' }}>© 2026 shadiwalacard.com — Made in India 🇮🇳</span>
        </div>
      </footer>
    </main>
  );
}
