'use client';
import Link from 'next/link';
import { LiquidButton } from '@/components/ui/liquid-glass-button';
import { ArrowLeft } from 'lucide-react';

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
          background: #ffffff; 
          border: 1.5px solid rgba(26, 32, 44, 0.2);
          color: #1A202C; 
          padding: 16px 20px; 
          border-radius: 16px; 
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem; 
          outline: none; 
          transition: all 0.3s ease;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        .contact-input::placeholder { color: rgba(26, 32, 44, 0.45); }
        .contact-input:focus { 
          border-color: #9d174d; 
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(157, 23, 77, 0.15), inset 0 2px 4px rgba(0, 0, 0, 0.05);
        }
      `}</style>

      {/* HEADER */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 1000, background: 'rgba(242, 244, 248, 0.85)', backdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(26,32,44,0.12)'
      }}>
        <div className="sf-container" style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          {/* Back Button */}
          <Link href="/" style={{ position: 'absolute', left: '20px', display: 'flex', alignItems: 'center', color: '#2e1065', padding: '8px' }}>
            <ArrowLeft className="w-5 h-5" />
          </Link>

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
        </div>
      </header>

      {/* CONTENT */}
      <section style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
        <div className="sf-container" style={{ maxWidth: 680 }}>
          <p style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '5px', color: 'rgba(157, 23, 77, 0.8)', textTransform: 'uppercase', marginBottom: 12 }}>Get in Touch</p>
          <h1 style={{ textAlign: 'center', fontFamily: "'Playfair Display', serif", fontWeight: 500, fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', color: '#2e1065', margin: '0 0 16px', letterSpacing: '-0.5px', lineHeight: 1.15 }}>
            Let's craft your <em style={{ color: '#9d174d', fontStyle: 'italic' }}>perfect</em> web invite.
          </h1>
          <p style={{ textAlign: 'center', fontSize: '1.05rem', color: 'rgba(26,32,44,0.75)', marginBottom: 48, lineHeight: 1.6 }}>
            Have a custom Shadi theme requirement? Fill out the form below and our design artisans will get back to you within hours.
          </p>

          {/* Form */}
          <div style={{ padding: '0 16px' }}>
            <form style={{ display: 'flex', flexDirection: 'column', gap: 20 }} onSubmit={(e) => { e.preventDefault(); alert('Thank you! Your inquiry has been sent to our design team.'); }}>
              <input type="text" placeholder="Your Name" className="contact-input" required />
              <input type="email" placeholder="Email Address" className="contact-input" required />
              <input type="tel" placeholder="WhatsApp Number (for instant preview link)" className="contact-input" required />
              <textarea placeholder="Tell us about your Shadi date, theme preferences and custom ideas..." className="contact-input" rows={5} required />
              <div style={{ marginTop: 8 }}>
                <button 
                  type="submit"
                  style={{ width: '100%', height: '54px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px', color: '#ffffff', fontWeight: 'normal', letterSpacing: '0.4px', fontSize: '1rem', background: '#2e1065', borderRadius: '16px', border: 'none', cursor: 'pointer', transition: 'background 0.2s ease' }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#4c1d95'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#2e1065'}
                >
                  Send Message
                </button>
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
