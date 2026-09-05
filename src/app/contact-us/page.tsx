'use client';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ContactUsPage() {
  return (
    <main style={{ background: '#050505', color: '#FFFFFF', fontFamily: "var(--font-body), 'Inter', sans-serif", minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* GLOBAL STYLES */}
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        input, textarea { caret-color: #e11d48; }
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; background: #050505; color: #FFFFFF; }
        a { text-decoration: none; color: inherit; }

        .sf-container { width: 100%; max-width: 1220px; margin: 0 auto; padding: 0 20px; }
        
        .contact-input {
          width: 100%; 
          background: rgba(255, 255, 255, 0.03); 
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #FFFFFF; 
          padding: 16px 20px; 
          border-radius: 14px; 
          font-family: var(--font-body), 'Inter', sans-serif;
          font-size: 0.95rem; 
          outline: none; 
          transition: all 0.3s ease;
          box-sizing: border-box;
        }
        .contact-input::placeholder { color: rgba(255, 255, 255, 0.35); }
        .contact-input:focus { 
          border-color: #e11d48; 
          background: rgba(255, 255, 255, 0.05);
          box-shadow: 0 0 0 3px rgba(225, 29, 72, 0.15);
        }
      `}</style>

      {/* HEADER */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(5, 5, 5, 0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '16px 24px'
      }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <img 
              src="/uploads/logo.png" 
              alt="ShadiwalaCard Logo" 
              style={{ height: '28px', width: 'auto' }} 
            />
            <span style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontSize: '1.2rem', color: '#FFFFFF', fontWeight: 600 }}>
              ShadiwalaCard
            </span>
          </Link>
          <Link 
            href="/" 
            style={{ 
              fontSize: '0.875rem', 
              color: 'rgba(255,255,255,0.75)', 
              textDecoration: 'none', 
              border: '1px solid rgba(255,255,255,0.2)', 
              padding: '6px 14px', 
              borderRadius: '999px', 
              transition: 'all 0.2s ease', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px' 
            }}
          >
            <ArrowLeft style={{ width: '16px', height: '16px' }} />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* CONTENT */}
      <section style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 0 100px' }}>
        <div className="sf-container" style={{ maxWidth: 680 }}>
          <p style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '3px', color: '#e11d48', textTransform: 'uppercase', marginBottom: 12 }}>
            Get in Touch
          </p>
          <h1 style={{ textAlign: 'center', fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontWeight: 700, fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', color: '#FFFFFF', margin: '0 0 16px', letterSpacing: '-0.5px', lineHeight: 1.15 }}>
            Let's craft your <em style={{ color: '#e11d48', fontStyle: 'italic' }}>perfect</em> web invite.
          </h1>
          <p style={{ textAlign: 'center', fontSize: '1.05rem', color: 'rgba(255, 255, 255, 0.65)', marginBottom: 40, lineHeight: 1.6 }}>
            Have a custom Shadi theme requirement? Fill out the form below and our design artisans will get back to you within hours.
          </p>

          {/* Form */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
            padding: 'clamp(24px, 5vw, 40px)',
            backdropFilter: 'blur(20px)',
          }}>
            <form style={{ display: 'flex', flexDirection: 'column', gap: 20 }} onSubmit={(e) => { e.preventDefault(); alert('Thank you! Your inquiry has been sent to our design team.'); }}>
              <input type="text" placeholder="Your Name" className="contact-input" required />
              <input type="email" placeholder="Email Address" className="contact-input" required />
              <input type="tel" placeholder="WhatsApp Number (for instant preview link)" className="contact-input" required />
              <textarea placeholder="Tell us about your Shadi date, theme preferences and custom ideas..." className="contact-input" rows={5} required />
              <div style={{ marginTop: 8 }}>
                <button 
                  type="submit"
                  style={{ 
                    width: '100%', 
                    height: '52px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    padding: '0 20px', 
                    color: '#ffffff', 
                    fontWeight: 600, 
                    letterSpacing: '0.3px', 
                    fontSize: '1rem', 
                    background: '#e11d48', 
                    borderRadius: '14px', 
                    border: 'none', 
                    cursor: 'pointer', 
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 20px rgba(225, 29, 72, 0.35)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.opacity = '0.9';
                    e.currentTarget.style.transform = 'scale(1.01)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>

          <div style={{ marginTop: 40, textAlign: 'center', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.5)' }}>
            Or email our design team directly at <br/>
            <a href="mailto:hello@shadiwalacard.com" style={{ color: '#e11d48', fontWeight: 600, fontSize: '1.05rem', display: 'inline-block', marginTop: 8, textDecoration: 'underline' }}>
              hello@shadiwalacard.com
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '40px 0', textAlign: 'center', background: '#050505' }}>
        <div className="sf-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src="/uploads/logo.png" alt="ShadiwalaCard Logo" style={{ height: '24px', width: 'auto' }} />
            <span style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontSize: '1.1rem', color: '#FFFFFF', fontWeight: 600 }}>
              ShadiwalaCard
            </span>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.4)' }}>© 2026 shadiwalacard.com — Made in India 🇮🇳</span>
        </div>
      </footer>
    </main>
  );
}
