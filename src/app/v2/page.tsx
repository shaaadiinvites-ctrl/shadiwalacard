'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Smooth3DSlideshow from '@/components/originkit/coverflowgallery';
import { LiquidButton } from '@/components/ui/liquid-glass-button';
import { FaqSection } from '@/components/ui/faq';
import LightCurtain from '@/components/originkit/ui/light-curtain';
import WaveArcs from '@/components/originkit/ui/wave-arcs';
import { usePostHog } from 'posthog-js/react';

import { TEMPLATES as templates } from '@/lib/templates';


const faqs = [
  { q: "Can I edit my details after buying?", a: "Yes! You get a private link to update your venue, dates, or photos anytime before the wedding. The live link updates instantly for all your guests." },
  { q: "How long does it take to get my invite?", a: "Instantly. Once you complete the checkout and upload your photos, your custom web invite is generated and ready to share in seconds." },
  { q: "Can I send this on WhatsApp?", a: "Absolutely. You can share your unique invite link on WhatsApp, Instagram, SMS, or anywhere else. It opens perfectly on any smartphone." },
  { q: "Are there any hidden hosting fees?", a: "No hidden fees. You pay a one-time flat price, and we host your digital invite securely for 6 months after your wedding date." }
];

export default function StarfallPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1200);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const posthog = usePostHog();

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 480);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (posthog) {
      posthog.capture('homepage_viewed');
    }
  }, [posthog]);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleScrollMenuClose = () => {
      setIsMenuOpen(false);
    };
    const timer = setTimeout(() => {
      window.addEventListener('scroll', handleScrollMenuClose, { passive: true });
    }, 150);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScrollMenuClose);
    };
  }, [isMenuOpen]);



  return (
    <main style={{ background: '#050505', color: '#FFFFFF', fontFamily: "var(--font-body), 'Inter', sans-serif", minHeight: '100vh' }}>

      {/* ─────────────────── PAGE STYLES ─────────────────── */}
      <style>{`
        /* caret-color: transparent completely hides the blinking text cursor on mobile when tapping */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; caret-color: transparent; }
        html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
        body { overflow-x: clip; }
        a { text-decoration: none; color: inherit; }
        img { max-width: 100%; display: block; }

        /* ── Container for uniform grid alignment ── */
        .sf-container {
          width: 100%;
          max-width: 1220px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* ── Keyframes ── */
        @keyframes sfShimmer  { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes sfFadeUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes sfPinBounce{ 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes sfRadar    { 0%{transform:scale(0.6);opacity:0.9} 100%{transform:scale(2.8);opacity:0} }
        @keyframes sfOrbit    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes sfMarquee  { from{transform:translate3d(0, 0, 0)} to{transform:translate3d(-50%, 0, 0)} }

        /* ── Utility: animations ── */
        .sf-fade-1 { animation: sfFadeUp 0.7s 0.0s ease both; }
        .sf-fade-2 { animation: sfFadeUp 0.7s 0.15s ease both; }
        .sf-fade-3 { animation: sfFadeUp 0.7s 0.3s ease both; }
        .sf-fade-4 { animation: sfFadeUp 0.7s 0.45s ease both; }

        /* ── Section divider ── */
        .sf-divider {
          display: flex; align-items: center; justify-content: center;
          padding: 0 20px;
        }
        .sf-divider::before, .sf-divider::after {
          content: ''; flex: 1; height: 1px;
        }
        .sf-divider::before { background: linear-gradient(to right, transparent, rgba(225, 29, 72,0.25)); }
        .sf-divider::after  { background: linear-gradient(to left,  transparent, rgba(225, 29, 72,0.25)); }
        .sf-divider span { padding: 0 16px; color: rgba(225, 29, 72,0.6); font-size: 1rem; }

        /* ── Template card hover ── */
        .sf-tcard { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .sf-tcard:active { transform: scale(0.98); }

        /* ── Review card ── */
        .sf-rcard { border: 1px solid rgba(255,255,255,0.1); border-radius: 18px; background: rgba(255,255,255,0.03); }

        /* ── Venue pin ── */
        .sf-pin-bounce { animation: sfPinBounce 2s ease-in-out infinite; }
        .sf-radar { animation: sfRadar 2s ease-out infinite; }
        .sf-orbit { animation: sfOrbit 14s linear infinite; }

        /* ── CTA buttons ── */
        .sf-cta-btn {
          display: inline-flex; align-items: center; justify-content: center;
          background: #e11d48; color: #050505; font-weight: 600;
          border-radius: 40px; border: none; cursor: pointer;
          transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
          text-decoration: none;
          -webkit-tap-highlight-color: transparent;
        }
        .sf-cta-btn:active { transform: scale(0.96); }
        .sf-cta-btn:hover { background: #ffbc4b; box-shadow: 0 4px 14px rgba(225, 29, 72, 0.4); }

        .sf-ghost-btn {
          display: inline-flex; align-items: center; justify-content: center;
          border: 1px solid rgba(255,255,255,0.3); color: #ffffff;
          border-radius: 40px; background: transparent;
          transition: all 0.2s ease;
          text-decoration: none;
          -webkit-tap-highlight-color: transparent;
        }
        .sf-ghost-btn:hover { background: rgba(255,255,255,0.1); }
        .sf-ghost-btn:active { transform: scale(0.96); }

        /* ── Mobile nav menu toggle ── */
        @media (max-width: 767px) { .sf-mobile-demo-btn { display: inline-flex !important; } }
        .sf-hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; padding: 12px; margin: -8px; user-select: none; -webkit-tap-highlight-color: transparent; outline: none; }
        .sf-hamburger span { width: 22px; height: 1.5px; background: #1A202C; display: block; transition: all 0.3s; pointer-events: none; }
        .sf-mobile-controls { display: flex; align-items: center; gap: 12px; margin-left: auto; }
        @media (min-width: 768px) { .sf-mobile-controls { display: none !important; } }
        .sf-nav-links { display: flex; align-items: center; gap: 20px; margin-left: auto; }

        /* ── RESPONSIVE BREAKPOINTS — mobile-first ── */

        /* Base: 412px (Pixel 7) */
        h2              { font-size: 2rem; }
        .sf-hero-h1     { font-size: clamp(2.3rem, 7.5vw, 4rem); letter-spacing: -0.5px; line-height: 1.05; margin-bottom: clamp(38px, 5.5vw, 54px) !important; }
        .sf-hero-sub    { font-size: 0.875rem; }
        .sf-hero-cta    {
          height: 54px;
          padding: 0 36px;
          border-radius: 999px;
          background: #FFFFFF;
          color: #050505;
          font-size: 1.063rem;
          font-weight: 600;
          letter-spacing: -0.2px;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          white-space: nowrap;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4), 0 0 32px rgba(255, 188, 75, 0.28);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }
        .sf-hero-cta:hover {
          transform: scale(1.03);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5), 0 0 44px rgba(255, 188, 75, 0.45);
        }
        .sf-hero-cta:active {
          transform: scale(0.97);
        }
        .sf-section-pad { padding: 120px 0 !important; }
        .sf-sec         { padding: 120px 0 !important; }
        .sf-sec-split-b { padding: 120px 0 !important; }
        .sf-sec-split-t { padding: 120px 0 !important; }
        .sf-section-h2  { font-size: clamp(2rem, 5vw, 3.5rem); letter-spacing: -0.5px; line-height: 1.05; transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), text-shadow 0.4s ease; }
        .sf-section-h2:hover { transform: translateY(-3px); text-shadow: 0 10px 30px rgba(225, 29, 72, 0.25); }
        .sf-nav-links   { display: none !important; }
        .sf-hamburger   { display: flex !important; flex-direction: column; gap: 5px; cursor: pointer; padding: 12px; margin: -8px; user-select: none; -webkit-tap-highlight-color: transparent; outline: none; }
        .sf-venue-h2    { font-size: clamp(2rem, 5vw, 3.5rem); line-height: 1.05; }
        .sf-review-grid { grid-template-columns: 1fr; }
        .sf-cta-pair    { flex-direction: column; gap: 12px; align-items: center; justify-content: center; width: 100%; }
        .sf-cta-pair > * { width: 100% !important; max-width: 320px !important; justify-content: center !important; text-align: center !important; }
        .sf-showcase-actions { flex-direction: column; gap: 12px; width: 100%; align-items: center; justify-content: center; }
        .sf-showcase-actions > * { width: 100% !important; max-width: 320px !important; justify-content: center !important; text-align: center !important; }
        
        .sf-step-card   { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .sf-step-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(225, 29, 72, 0.15) !important; }

        /* iOS Safari fixed-background override & mobile performance */
        @media (max-width: 767px) {
          #sf-venue {
            background-attachment: scroll !important;
            background-position: center center !important;
          }
          .sf-top-banner-hide-mobile { display: none !important; }
          .sf-top-banner-dot { display: none !important; }
        }

        /* Floating Sticky Bar on Mobile */
        .sf-sticky-mobile-bar { display: none; }
        @media (max-width: 767px) {
          .sf-sticky-mobile-bar {
            display: flex;
            position: fixed;
            bottom: 16px;
            left: 16px;
            right: 16px;
            z-index: 900;
            background: rgba(18, 10, 14, 0.92);
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            border: 1px solid rgba(255, 255, 255, 0.14);
            border-radius: 999px;
            padding: 8px 14px;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 16px 40px rgba(0, 0, 0, 0.75), 0 0 20px rgba(225, 29, 72, 0.2);
            transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease;
          }
        }

        /* sm: 540px+ */
        @media (min-width: 540px) {
          .sf-cta-pair   { flex-direction: row; align-items: center; justify-content: center; width: auto; }
          .sf-cta-pair > * { width: auto !important; max-width: none !important; }
          .sf-showcase-actions { flex-direction: row; align-items: center; justify-content: flex-start; width: auto; gap: 20px; }
          .sf-showcase-actions > * { width: auto !important; max-width: none !important; }
        }

        /* md: 768px+ tablet */
        @media (min-width: 768px) {
          .sf-hero-sub   { font-size: 1.125rem; }
          .sf-cta-btn    { font-size: 1rem !important; padding: 16px 36px !important; }
          .sf-nav-links  { display: flex !important; }
          .sf-mobile-controls { display: none !important; }
          .sf-hamburger  { display: none !important; }
          .sf-review-grid { grid-template-columns: repeat(2, 1fr); }
        }

        /* lg: 1024px+ desktop */
        @media (min-width: 1024px) {
          .sf-review-grid { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>

      {/* ─────────────────── TOP BANNER ─────────────────── */}
      <div style={{ 
        width: '100%', 
        background: 'linear-gradient(90deg, #17070a, #4a0e1b)', 
        color: '#FFFFFF', 
        fontSize: '0.688rem', 
        fontWeight: 700, 
        letterSpacing: '1.2px', 
        textTransform: 'uppercase', 
        padding: '8px 16px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        whiteSpace: 'nowrap',
        overflow: 'hidden'
      }}>
        <span className="sf-top-banner-hide-mobile" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: '#e11d48', fontSize: '0.85rem' }}>★</span> 100% UNLIMITED FREE REVISIONS
        </span>
        <span className="sf-top-banner-dot" style={{ opacity: 0.5 }}>•</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="16" height="11" style={{ display: 'inline-block', borderRadius: 2, flexShrink: 0 }}>
            <rect width="900" height="200" fill="#FF9933"/>
            <rect y="200" width="900" height="200" fill="#FFFFFF"/>
            <rect y="400" width="900" height="200" fill="#138808"/>
            <circle cx="450" cy="300" r="80" stroke="#000080" strokeWidth="15" fill="none"/>
            <circle cx="450" cy="300" r="20" fill="#000080"/>
          </svg>
          TAILORED FOR BIG FAT INDIAN WEDDINGS
        </span>
      </div>

      {/* ─────────────────── HERO (Exactly like getdesign.ai) ─────────────────── */}
      <section style={{ position: 'relative', height: '100dvh', minHeight: '620px', padding: '12px', display: 'flex', background: '#050505' }}>
        
        {/* Floating rounded hero card */}
        <div style={{ position: 'relative', flex: 1, borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          
          {/* Header over video */}
          <header style={{
            position: 'absolute', top: '10px', left: 0, right: 0, zIndex: 40,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '14px clamp(16px, 5vw, 36px)',
            background: 'transparent'
          }}>
            {/* Logo */}
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, userSelect: 'none', textDecoration: 'none' }}>
              <img 
                src="/uploads/logo.png" 
                alt="ShadiwalaCard Logo" 
                style={{ height: '32px', width: 'auto', objectFit: 'contain' }} 
              />
              <span style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontSize: '1.25rem', color: '#FFFFFF', letterSpacing: '-0.5px', fontWeight: 600 }}>
                ShadiwalaCard
              </span>
            </Link>

            {/* Desktop Nav / Buttons like getdesign.ai */}
            <div className="sf-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <Link href="/contact-us" style={{ color: '#FFFFFF', fontSize: '0.875rem', fontWeight: 500, opacity: 0.9 }}>Contact Us</Link>
              <div style={{ position: 'relative' }}>
                <Link href="/demo/grand-palace" onClick={() => posthog?.capture('demo_clicked', { template_id: 'grand-palace' })} style={{ 
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  background: '#FFFFFF', color: '#050505', 
                  borderRadius: '999px', padding: '8px 20px', fontSize: '0.875rem', fontWeight: 500,
                  transition: 'transform 0.2s', boxShadow: '0 4px 14px rgba(0,0,0,0.3)'
                }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                  </svg>
                  View Demo
                </Link>
                {/* Hand-drawn arrow hint */}
                <div className="sf-nav-links" style={{ 
                  position: 'absolute', 
                  top: '100%', 
                  right: '0', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  pointerEvents: 'none',
                  color: '#FFFFFF',
                  transform: 'rotate(-6deg) translateX(10px)',
                  zIndex: 50
                }}>
                  <svg width="24" height="36" viewBox="0 0 48 72" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(-15deg) translateX(-8px)' }}>
                    <path d="M8 64c6-1 28-10 28-46" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    <path d="M25 28l11-12 11 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span style={{ 
                    fontFamily: "var(--font-handwriting), 'Caveat', cursive", 
                    fontSize: '1.25rem', 
                    fontWeight: 700, 
                    whiteSpace: 'nowrap',
                    marginTop: '-4px',
                    letterSpacing: '0.5px',
                    color: '#FFFFFF',
                    transform: 'translateX(-70px)'
                  }}>
                    Get the full experience
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile hamburger */}
            <div className="sf-mobile-controls">
              <Link 
                href="/demo/grand-palace" 
                className="sf-mobile-demo-btn"
                onClick={() => posthog?.capture('demo_clicked', { template_id: 'grand-palace', source: 'mobile_header' })} 
                style={{ 
                  display: 'none',
                  alignItems: 'center', gap: '5px',
                  background: '#FFFFFF', color: '#050505', 
                  borderRadius: '999px', padding: '6px 14px', fontSize: '0.75rem', fontWeight: 600,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)', textDecoration: 'none'
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                </svg>
                Demo
              </Link>
              <div 
                className="sf-hamburger" 
                role="button"
                tabIndex={0}
                aria-label="Toggle navigation menu" 
                aria-expanded={isMenuOpen}
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsMenuOpen(!isMenuOpen); } }}
                style={{ cursor: 'pointer' }}
              >
              <span style={{ transform: isMenuOpen ? 'rotate(45deg) translate(4px, 5px)' : 'none', width: '22px', height: '1.5px', background: '#FFFFFF', display: 'block', transition: 'all 0.3s', pointerEvents: 'none' }} />
              <span style={{ opacity: isMenuOpen ? 0 : 1, width: '22px', height: '1.5px', background: '#FFFFFF', display: 'block', margin: '5px 0', transition: 'all 0.3s', pointerEvents: 'none' }} />
              <span style={{ transform: isMenuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none', width: '22px', height: '1.5px', background: '#FFFFFF', display: 'block', transition: 'all 0.3s', pointerEvents: 'none' }} />
            </div>
          </div>
          </header>

          {/* Backdrop Dismiss Overlay */}
          {isMenuOpen && (
            <div 
              aria-hidden
              onClick={() => setIsMenuOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                zIndex: 998
              }}
            />
          )}

          {/* Mobile Dropdown Menu */}
          {isMenuOpen && (
            <div style={{
              position: 'fixed', top: '76px', left: '16px', right: '16px',
              background: 'linear-gradient(145deg, rgba(24, 12, 18, 0.98) 0%, rgba(10, 5, 8, 0.98) 100%)',
              backdropFilter: 'blur(28px) saturate(180%)',
              WebkitBackdropFilter: 'blur(28px) saturate(180%)',
              borderRadius: '24px', zIndex: 999,
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 24px 64px rgba(0, 0, 0, 0.9), 0 0 40px rgba(225, 29, 72, 0.2)',
              display: 'flex', flexDirection: 'column', padding: '24px 20px', gap: '8px'
            }}>
              <Link 
                href="/demo/grand-palace" 
                onClick={() => setIsMenuOpen(false)} 
                style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 18px', borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#FFFFFF', fontSize: '0.938rem', fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffbc4b"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                  Explore Live Demo
                </span>
                <span style={{ fontSize: '0.75rem', background: '#ffbc4b', color: '#050505', padding: '3px 8px', borderRadius: '6px', fontWeight: 800 }}>LIVE</span>
              </Link>

              <Link 
                href="#sf-collection" 
                onClick={() => setIsMenuOpen(false)} 
                style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 18px', borderRadius: '14px',
                  color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.938rem', fontWeight: 500,
                  textDecoration: 'none'
                }}
              >
                <span>The Grand Palace & Inclusions</span>
                <span style={{ color: '#ffbc4b', fontWeight: 700 }}>₹799</span>
              </Link>

              <Link 
                href="#sf-devices" 
                onClick={() => setIsMenuOpen(false)} 
                style={{ 
                  display: 'flex', alignItems: 'center',
                  padding: '14px 18px', borderRadius: '14px',
                  color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.938rem', fontWeight: 500,
                  textDecoration: 'none'
                }}
              >
                Mobile Experience
              </Link>

              <Link 
                href="/contact-us" 
                onClick={() => setIsMenuOpen(false)} 
                style={{ 
                  display: 'flex', alignItems: 'center',
                  padding: '14px 18px', borderRadius: '14px',
                  color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.938rem', fontWeight: 500,
                  textDecoration: 'none'
                }}
              >
                Contact Us
              </Link>

              <div style={{ marginTop: '8px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <Link 
                  href="/cart?template=grand-palace" 
                  onClick={() => setIsMenuOpen(false)} 
                  style={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    width: '100%', padding: '14px 20px', borderRadius: '999px',
                    background: '#FFFFFF', color: '#050505',
                    fontSize: '0.938rem', fontWeight: 700,
                    textDecoration: 'none', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  Get Yours Now · ₹799
                </Link>
              </div>
            </div>
          )}

          {/* Background Video Wrap */}
          <div style={{ position: 'absolute', inset: 0, borderRadius: '24px', overflow: 'hidden', background: '#000', pointerEvents: 'none' }}>
            <video 
              src="/uploads/bg.mp4" 
              autoPlay 
              loop 
              muted 
              playsInline
              style={{ 
                position: 'absolute', 
                inset: 0, 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover'
              }}
            />
            {/* Subtle dark vignette overlay for high contrast text readability */}
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.65) 100%)' }} />
          </div>

          {/* Content */}
          <div className="sf-container" style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: 900 }}>
            <h1 className="sf-hero-h1 sf-fade-1" style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontWeight: 500, lineHeight: 1.0, color: '#FFFFFF' }}>
              India's Most Premium<br />
              <span className="relative inline-block font-normal italic text-[#FFFFFF]" style={{ paddingBottom: '4px' }}>
                Digital Wedding Card.
                <svg 
                  style={{ 
                    position: 'absolute', 
                    bottom: '-0.32em', 
                    left: 0, 
                    width: '100%', 
                    height: '14px', 
                    overflow: 'visible',
                    pointerEvents: 'none'
                  }} 
                  viewBox="0 0 320 14" 
                  fill="none" 
                  preserveAspectRatio="none" 
                  aria-hidden="true"
                >
                  <path d="M4 11 C 70 4 240 4 316 10" stroke="#ffbc4b" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
                </svg>
              </span>
            </h1>

            <p className="sf-hero-sub sf-fade-2" style={{ lineHeight: 1.7, color: 'rgba(255, 255, 255, 0.85)', margin: '0 auto clamp(32px, 5vw, 44px)', maxWidth: 680 }}>
              Wow your guests with a stunning digital card featuring 1-tap Google Maps, Live Countdowns, and seamless itineraries for multiple events.
            </p>

            <div className="sf-fade-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <button
                onClick={() => {
                  posthog?.capture('scroll_to_collection_clicked', { source: 'hero_single_cta' });
                  const el = document.getElementById('sf-collection');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="sf-hero-cta"
              >
                <span>See What's Included</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '1px' }}>
                  <path d="M12 5v14M19 12l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* ─────────────────── TEMPLATE SHOWCASE (SINGLE TEMPLATE) ─────────────────── */}
      <section id="sf-collection" style={{ 
        position: 'relative',
        background: 'linear-gradient(180deg, #0a0405 0%, #120608 45%, #080304 85%, #050505 100%)', 
        paddingTop: '120px', 
        paddingBottom: '80px', 
        paddingLeft: '20px',
        paddingRight: '20px',
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        <div className="sf-container" style={{ maxWidth: 1100, width: '100%', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 'clamp(40px, 6vw, 80px)' }}>
          
          {/* Left: The Card */}
          <div style={{ flex: '1 1 350px', display: 'flex', justifyContent: 'center', maxWidth: 420 }}>
            <div className="sf-tcard" style={{ 
              width: '100%', 
              background: 'linear-gradient(135deg, rgba(225, 140, 20, 0.9) 0%, rgba(180, 15, 50, 0.9) 50%, rgba(10, 2, 5, 0.95) 100%)', 
              backdropFilter: 'blur(24px) saturate(180%)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 24, 
              padding: 0,
              boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.8), 0 0 40px -10px rgba(225, 140, 20, 0.25), inset 0 1px 0 rgba(255,255,255,0.2)', 
              display: 'flex', 
              flexDirection: 'column',
              transform: windowWidth < 768 ? 'none' : 'rotateY(-5deg) rotateX(5deg)',
              transformStyle: 'preserve-3d',
              transition: 'transform 0.5s ease',
            }}>
              {/* 3D Photo Sheet */}
              <div style={{ 
                position: 'relative', 
                aspectRatio: '4/5', 
                width: '100%', 
                borderRadius: '24px 24px 20px 20px', 
                overflow: 'hidden', 
                boxShadow: '0 12px 28px -4px rgba(0, 0, 0, 0.5), 0 6px 16px -2px rgba(0, 0, 0, 0.35)'
              }}>
                <Image src="/project3-assets/cover.jpg" alt="The Grand Palace" fill style={{ objectFit: 'cover', objectPosition: 'top' }} sizes="(max-width:768px) 100vw, 400px" />
                <div style={{ 
                  position: 'absolute', top: 16, left: 16, 
                  background: 'rgba(10, 5, 8, 0.8)', 
                  backdropFilter: 'blur(16px)', 
                  border: '1px solid rgba(255, 188, 75, 0.4)', 
                  color: '#FFFFFF', 
                  fontSize: '0.688rem', 
                  fontWeight: 700, 
                  letterSpacing: '1px', 
                  textTransform: 'uppercase', 
                  padding: '6px 14px', 
                  borderRadius: 20, 
                  zIndex: 3,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#ffbc4b">
                    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
                  </svg>
                  SIGNATURE EDITION · THE GRAND PALACE
                </div>
                <div aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '30%', background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 100%)', pointerEvents: 'none', zIndex: 2 }} />
              </div>
              
              <div style={{ padding: '24px 20px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <h3 style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontSize: '1.6rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 12px', letterSpacing: '-0.3px' }}>The Grand Palace</h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 0 }}>
                  <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', textDecoration: 'line-through', fontWeight: 500 }}>₹1,299</span>
                  <span style={{ fontSize: '0.7rem', color: '#050505', background: '#ffbc4b', border: 'none', padding: '3px 8px', borderRadius: 6, fontWeight: 800, letterSpacing: '0.3px' }}>38% OFF</span>
                  <span style={{ fontFamily: "var(--font-body), 'Inter', sans-serif", fontSize: '1.6rem', color: '#FFFFFF', fontWeight: 800, lineHeight: 1.1 }}>₹799</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: The Text & Actions */}
          <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h2 className="sf-section-h2" style={{ 
              fontFamily: "var(--font-display), 'Montserrat', sans-serif", 
              fontWeight: 700, color: '#FFFFFF', margin: '0 0 24px', 
              letterSpacing: '-0.5px', lineHeight: 1.15
            }}>
              Your dream Shadi deserves a <br/>
              <em style={{ 
                fontStyle: 'normal',
                background: 'linear-gradient(90deg, #e11d48 0%, #f43f5e 50%, #e11d48 100%)',
                backgroundSize: '200% auto',
                color: '#e11d48',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                animation: 'sfShimmer 4s linear infinite'
              }}>stunning</em> invite.
            </h2>
            <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: 28, maxWidth: 480 }}>
              The Grand Palace is our ultra-premium digital invitation. Add your photos, venue map, and live countdown in just a few taps.
            </p>

            {/* What's Included Glass Checklist */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '22px 24px',
              marginBottom: '36px',
              maxWidth: 480,
              backdropFilter: 'blur(16px)',
              boxShadow: '0 12px 32px -8px rgba(0, 0, 0, 0.5)'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: '#ffbc4b', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#ffbc4b', flexShrink: 0 }}><path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" /></svg>
                <span>EVERYTHING INCLUDED</span>
                <svg width="4" height="4" viewBox="0 0 10 10" fill="currentColor" style={{ opacity: 0.4, margin: "0 6px", flexShrink: 0 }}><circle cx="5" cy="5" r="5" /></svg>
                <span>ZERO SUBSCRIPTIONS</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.875rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.4 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}><polyline points="20 6 9 17 4 12" /></svg>
                  <span><strong>1-Tap Google Maps:</strong> No more 'location bhejna' calls</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.875rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.4 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}><polyline points="20 6 9 17 4 12" /></svg>
                  <span><strong>Live Countdown & Timeline:</strong> Haldi, Sangeet & Shadi</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.875rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.4 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}><polyline points="20 6 9 17 4 12" /></svg>
                  <span><strong>HD Couple Gallery:</strong> Flaunt your pre-wedding portraits</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.875rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.4 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}><polyline points="20 6 9 17 4 12" /></svg>
                  <span><strong>Unlimited Shares:</strong> WhatsApp, Instagram, or direct web link</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: '0.875rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.4 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}><polyline points="20 6 9 17 4 12" /></svg>
                  <span><strong>6 Months Cloud Hosting:</strong> Ad-free & guaranteed fast loading</span>
                </div>
              </div>
            </div>

            {/* 3-Badge Guarantee Reassurance Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.813rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '8px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffbc4b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                Instant Link Delivery
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.813rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '8px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffbc4b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                Free Unlimited Edits
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.813rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '8px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffbc4b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>
                Zero Watermarks
              </div>
            </div>

            <div className="sf-showcase-actions" style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              <LiquidButton size="xl" style={{ pointerEvents: 'auto', padding: '0 36px', color: '#1A202C', fontWeight: 600, background: '#FFFFFF', border: 'none', boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)' }} onClick={() => { posthog?.capture('customize_clicked', { template_id: 'grand-palace' }); window.location.href = '/cart?template=grand-palace'; }}>
                    Get Yours Now
                  </LiquidButton>
              
              <Link href="/demo/grand-palace" onClick={() => posthog?.capture('demo_clicked', { template_id: 'grand-palace' })} style={{ 
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                background: 'transparent', color: '#FFFFFF', 
                borderRadius: '999px', padding: '12px 32px', fontSize: '1rem', fontWeight: 500,
                border: '1px solid rgba(255,255,255,0.3)',
                transition: 'background 0.2s', textDecoration: 'none'
              }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                </svg>
                View Demo
              </Link>
            </div>
          </div>
          
        </div>
      
        {/* ------------------- HANDWRITTEN NOTE (INSIDE SECTION) ------------------- */}
        <div style={{ width: '100%', textAlign: 'center', paddingTop: '40px', paddingBottom: '20px', position: 'relative', zIndex: 10 }}>
          <span style={{ 
            fontFamily: "var(--font-handwriting), 'Caveat', cursive", 
            fontSize: '1.5rem', 
            fontWeight: 600, 
            color: 'rgba(255,255,255,0.7)',
            letterSpacing: '0.5px',
            display: 'inline-block'
          }}>
            ..and more beautiful cards coming soon
          </span>
        </div>
      </section>

      {/* ─────────────────── MOVING MARQUEE BANNER ─────────────────── */}
      <div style={{ background: 'linear-gradient(90deg, #050505, #17070a, #4a0e1b, #050505)', overflow: 'hidden', padding: '16px 0', borderTop: '1px solid rgba(255,255,255,0.15)', borderBottom: '1px solid rgba(255,255,255,0.15)', display: 'flex' }}>
        <div style={{ display: 'flex', width: 'max-content', animation: 'sfMarquee 100s linear infinite', color: '#FFFFFF', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
          {[...Array(4)].map((_, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '32px', paddingRight: '32px' }}>
              {[...Array(5)].map((_, j) => (
                <span key={j} style={{ display: 'inline-flex', alignItems: 'center', gap: '32px' }}>
                  <span>✓ ZERO WHATSAPP SPAM</span>
                  <span style={{ opacity: 0.5 }}>•</span>
                  <span>✓ INSTANT DELIVERY</span>
                  <span style={{ opacity: 0.5 }}>•</span>
                  <span>✓ SEAMLESS MOBILE VIEW</span>
                  <span style={{ opacity: 0.5 }}>•</span>
                  <span>✓ UNLIMITED GUEST SHARES</span>
                  <span style={{ opacity: 0.5 }}>•</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ------------------- MULTI-DEVICE RESPONSIVE SHOWCASE ------------------- */}
      <section id="sf-devices" style={{ 
        position: 'relative', 
        background: '#050505',
        padding: '120px 20px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {/* Dynamic Wave Arcs background canvas representing mobile connectivity & guest sharing */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.65 }}>
          <WaveArcs 
            backgroundColor="#050505"
            lineColor="#ffbc4b"
            lineWidth={1.2}
            lineCount={windowWidth < 768 ? 26 : 56}
            speed={3.5}
            glow={14}
            interactive={true}
          />
        </div>

        {/* Feathered edge masks for seamless transition */}
        <div aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100px', background: 'linear-gradient(to bottom, #050505 0%, transparent 100%)', zIndex: 1, pointerEvents: 'none' }} />
        <div aria-hidden style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '100px', background: 'linear-gradient(to top, #050505 0%, transparent 100%)', zIndex: 1, pointerEvents: 'none' }} />

        <div className="sf-container" style={{ maxWidth: 1100, width: '100%', textAlign: 'center' }}>
          <div style={{ marginBottom: 48 }}>
            <div style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '8px', 
              background: 'rgba(255, 188, 75, 0.08)', border: '1px solid rgba(255, 188, 75, 0.22)', 
              color: '#ffbc4b', padding: '6px 16px', borderRadius: '999px', 
              fontSize: '0.813rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 16 
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
              </svg>
              UNIVERSAL COMPATIBILITY
            </div>
            <h2 className="sf-section-h2" style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontWeight: 600, color: '#FFFFFF', margin: '0 auto 16px', letterSpacing: '-0.5px', maxWidth: 720, lineHeight: 1.15 }}>
              Flawless on every screen your <em style={{ color: '#e11d48', fontStyle: 'italic' }}>guests hold.</em>
            </h2>
            <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, maxWidth: 640, margin: '0 auto' }}>
              From your chacha's iPad to your college friends' iPhones — crystal clear typography, zero awkward pinching, and instant 1-tap navigation across every device.
            </p>
          </div>

          <div style={{ 
            position: 'relative', 
            width: '100%', 
            maxWidth: 960, 
            margin: '0 auto' 
          }}>
            <Image 
              src="/uploads/multidevice.png" 
              alt="ShadiwalaCard responsive multi-device preview on iPhone, Tablet and Laptop" 
              width={1200} 
              height={675} 
              style={{ width: '100%', height: 'auto', display: 'block' }} 
              sizes="(max-width: 1024px) 100vw, 960px"
            />
          </div>
        </div>
      </section>

      {/* ─────────────────── HOW IT WORKS ─────────────────── */}
      <section style={{ 
        position: 'relative',
        background: 'linear-gradient(180deg, #0a0405 0%, #120608 45%, #080304 85%, #050505 100%)', 
        padding: '120px 20px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        <div className="sf-container" style={{ maxWidth: 1000, width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 className="sf-section-h2" style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontWeight: 600, color: '#FFFFFF', margin: 0, letterSpacing: '-0.5px' }}>
              How it <em style={{ color: '#e11d48', fontStyle: 'italic' }}>Works.</em>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {/* Step 1 */}
            <div className="sf-step-card" style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(145deg, rgba(20,20,20,0.95) 0%, rgba(5,5,5,0.95) 100%)', backdropFilter: 'blur(10px)', borderRadius: 24, padding: '56px 32px', textAlign: 'left', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ position: 'absolute', right: '-10px', bottom: '-20px', fontSize: '8rem', fontWeight: 900, color: 'rgba(255,255,255,0.08)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none', fontFamily: "var(--font-display), 'Montserrat', sans-serif" }}>01</div>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(225, 29, 72, 0.1)', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ fillOpacity: 0.15 }}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              </div>
              <h3 style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontSize: '1.375rem', color: '#FFFFFF', marginBottom: 12, fontWeight: 600 }}>Buy The Invite</h3>
              <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, position: 'relative', zIndex: 2 }}>Make the Grand Palace design yours in seconds with a simple, secure checkout.</p>
            </div>
            
            {/* Step 2 */}
            <div className="sf-step-card" style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(145deg, rgba(20,20,20,0.95) 0%, rgba(5,5,5,0.95) 100%)', backdropFilter: 'blur(10px)', borderRadius: 24, padding: '56px 32px', textAlign: 'left', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ position: 'absolute', right: '-10px', bottom: '-20px', fontSize: '8rem', fontWeight: 900, color: 'rgba(255,255,255,0.08)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none', fontFamily: "var(--font-display), 'Montserrat', sans-serif" }}>02</div>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(225, 29, 72, 0.1)', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ fillOpacity: 0.15 }}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
              </div>
              <h3 style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontSize: '1.375rem', color: '#FFFFFF', marginBottom: 12, fontWeight: 600 }}>Add Your Magic</h3>
              <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, position: 'relative', zIndex: 2 }}>Upload couple photos, add all the events and functions with timings, and location.</p>
            </div>

            {/* Step 3 */}
            <div className="sf-step-card" style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(145deg, rgba(20,20,20,0.95) 0%, rgba(5,5,5,0.95) 100%)', backdropFilter: 'blur(10px)', borderRadius: 24, padding: '56px 32px', textAlign: 'left', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ position: 'absolute', right: '-10px', bottom: '-20px', fontSize: '8rem', fontWeight: 900, color: 'rgba(255,255,255,0.08)', lineHeight: 1, userSelect: 'none', pointerEvents: 'none', fontFamily: "var(--font-display), 'Montserrat', sans-serif" }}>03</div>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(225, 29, 72, 0.1)', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ fillOpacity: 0.15 }}><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
              </div>
              <h3 style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontSize: '1.375rem', color: '#FFFFFF', marginBottom: 12, fontWeight: 600 }}>Share The Link</h3>
              <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, position: 'relative', zIndex: 2 }}>No more basic PDFs or videos! Send your interactive web link to family and friends anywhere.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── VENUE SECTION (PARALLAX BACKGROUND) ─────────────────── */}
      <section id="sf-venue" className="sf-sec" style={{ 
        position: 'relative', textAlign: 'center', overflow: 'hidden',
        backgroundImage: 'url(/uploads/royal_venue_map.jpg)',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        {/* Luminous overlay for theme radiance and seamless edge blending */}
        {/* Rich cinematic color grade letting gold roads shine while blending edges */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(30, 8, 12, 0.6) 0%, rgba(5, 5, 5, 0.85) 65%, #050505 100%)', zIndex: 1 }} />
        <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, #050505 0%, transparent 25%, transparent 75%, #050505 100%)', zIndex: 1 }} />
        <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #050505 0%, transparent 20%, transparent 80%, #050505 100%)', zIndex: 1 }} />

        {/* Content */}
        <div className="sf-container" style={{ position: 'relative', zIndex: 2, maxWidth: 720 }}>
          {/* Bouncing pin icon */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: 0 }}>
            <div className="sf-pin-bounce" style={{ position: 'relative', width: 72, height: 72, borderRadius: '50%', background: '#0a0b10', border: '2px solid #e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(225, 29, 72, 0.55)', zIndex: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e11d48' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z" />
                </svg>
              </div>
              {/* Orbit ring */}
              <div className="sf-orbit" aria-hidden style={{ position: 'absolute', inset: -10, borderRadius: '50%', border: '1.5px dashed rgba(225, 29, 72, 0.6)', pointerEvents: 'none' }} />
            </div>
            {/* Radar pulse shadow */}
            <div className="sf-radar" style={{ width: 32, height: 12, borderRadius: '50%', background: 'rgba(225, 29, 72, 0.4)', marginTop: -6 }} />
          </div>

          <h2 className="sf-venue-h2" style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontWeight: 600, color: '#FFFFFF', margin: '0 0 18px', letterSpacing: '-0.5px', lineHeight: 1.15 }}>
            No more <br/>
            <span style={{ fontStyle: 'italic', color: '#e11d48' }}>
              "location bhejna"
            </span>
          </h2>

          <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: '0 auto 0' }}>
            Your digital invite includes integrated Google Maps, giving guests instant, 1-tap navigation straight to the venue.
          </p>
        </div>
      </section>

      {/* ─────────────────── PRE-WEDDING GALLERY (ORIGINKIT 3D SLIDESHOW) ─────────────────── */}
      <section id="sf-gallery" style={{ 
        position: 'relative',
        background: 'radial-gradient(circle at 50% 40%, rgba(225, 29, 72, 0.14) 0%, rgba(30, 5, 10, 0.4) 50%, #050505 80%)', 
        overflow: 'hidden', 
        paddingTop: '120px', 
        paddingBottom: '0px' 
      }}>
        <div className="sf-container" style={{ marginBottom: '40px' }}>
          <h2 className="sf-section-h2" style={{ textAlign: 'center', fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontWeight: 600, color: '#FFFFFF', margin: '0 auto', letterSpacing: '-0.5px', maxWidth: 720, lineHeight: 1.15 }}>
              Flaunt those gorgeous <em style={{ color: '#e11d48', fontStyle: 'italic' }}>couple shots</em> in style.
          </h2>
        </div>
        
        {/* 3D Slideshow Component */}
        <div style={{ height: windowWidth < 768 ? '360px' : '500px', width: '100%', maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
           <Smooth3DSlideshow 
              autoplay={true} 
              showTitle={false}
              cardWidth={windowWidth < 768 ? Math.min(windowWidth * 0.75, 340) : 557}
              cardHeight={windowWidth < 768 ? Math.min(windowWidth * 0.88, 390) : 420}
              gap={windowWidth < 768 ? 4 : 7}
              slides={[
                { image: { src: '/uploads/prewedding_sunset.jpg' } },
                { image: { src: '/uploads/prewedding_candid.jpg' } },
                { image: { src: '/uploads/prewedding_palace.jpg' } }
              ]}
           />
        </div>
      
        {/* ------------------- HANDWRITTEN NOTE 2 (INSIDE GALLERY) ------------------- */}
        <div style={{ width: '100%', textAlign: 'center', paddingTop: '80px', paddingBottom: '120px', position: 'relative', zIndex: 10 }}>
          <span style={{ 
            fontFamily: "var(--font-handwriting), 'Caveat', cursive", 
            fontSize: '1.5rem', 
            fontWeight: 600, 
            color: 'rgba(255,255,255,0.7)',
            letterSpacing: '0.5px',
            display: 'inline-block'
          }}>
            ..because your story deserves to be celebrated
          </span>
        </div>
      </section>

            {/* ------------------- FINAL CONVERSION (CLIMAX CTA) SECTION ------------------- */}
      <section style={{ 
            position: 'relative',
            background: '#050505',
          padding: 'clamp(100px, 14vw, 200px) 20px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'auto' }}>
            <LightCurtain 
              background="#050505"
              baseColor="#17070a" 
              accentColor="#e11d48" 
              highlight="#ffbc4b" 
            />
          </div>
          {/* Ambient inner sheen */}
          <div aria-hidden style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle at 50% 50%, rgba(225, 29, 72, 0.05) 0%, transparent 50%)', pointerEvents: 'none', zIndex: 1 }} />

        <div className="sf-container" style={{ maxWidth: 1200, position: 'relative', zIndex: 2, textAlign: 'center', pointerEvents: 'none' }}>
          <h2 style={{ position: 'relative', zIndex: 10, fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', fontWeight: 600, color: '#FFFFFF', margin: '0 auto 40px', lineHeight: 1.15, maxWidth: 720, textShadow: '0 2px 10px rgba(0,0,0,0.5)', pointerEvents: 'none' }}>
              <span style={{ pointerEvents: 'auto' }}>Ready to create your perfect Shadi invite?</span>
            </h2>

          

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', pointerEvents: 'none' }}>
                <LiquidButton size="xl" style={{ pointerEvents: 'auto', padding: '0 36px', color: '#1A202C', fontWeight: 600, background: '#FFFFFF', border: 'none', boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)' }} onClick={() => { posthog?.capture('customize_clicked', { template_id: 'grand-palace', source: 'climax_cta' }); window.location.href = '/cart?template=grand-palace'; }}>
                    Get Yours Now
                  </LiquidButton>
            </div>
        </div>
      </section>


      {/* ─────────────────── FOOTER ─────────────────── */}
      {/* ------------------- FAQ SECTION ------------------- */}
      <section style={{ 
        position: 'relative',
        background: 'radial-gradient(circle at 50% 25%, rgba(240, 125, 20, 0.2) 0%, rgba(130, 45, 15, 0.28) 45%, rgba(35, 10, 10, 0.4) 65%, #050505 80%)', 
        padding: '120px 20px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {/* Ambient warm amber crown halo */}
        <div aria-hidden style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '800px', height: '350px', background: 'radial-gradient(ellipse at top center, rgba(240, 125, 20, 0.2) 0%, rgba(140, 45, 15, 0.08) 45%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />
        <div className="sf-container" style={{ maxWidth: 800, width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 className="sf-section-h2" style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontWeight: 600, color: '#FFFFFF', margin: '0 0 16px', letterSpacing: '-0.5px' }}>
              Common Questions
            </h2>
            <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: 0 }}>
              Everything you need to know about your digital invite.
            </p>
          </div>
          <FaqSection faqs={faqs} />
        </div>
      </section>

      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '40px 0', background: '#050505' }}>
        <div className="sf-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, userSelect: 'none' }}>
            <img 
              src="/uploads/logo.png" 
              alt="ShadiwalaCard Logo" 
              style={{ height: '28px', width: 'auto', objectFit: 'contain' }} 
            />
            <span style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontSize: '1.375rem', color: '#FFFFFF', letterSpacing: '-0.5px', fontWeight: 600 }}>
              ShadiwalaCard
            </span>
          </div>
          <div style={{ display: 'flex', gap: 24, fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="/contact-us" style={{ color: 'rgba(255,255,255,0.7)', padding: '8px 12px', margin: '-8px -12px', transition: 'color 0.2s' }}>Contact Us</Link>
            <Link href="/privacy-policy" style={{ color: 'rgba(255,255,255,0.7)', padding: '8px 12px', margin: '-8px -12px', transition: 'color 0.2s' }}>Privacy Policy</Link>
            <Link href="/terms" style={{ color: 'rgba(255,255,255,0.7)', padding: '8px 12px', margin: '-8px -12px', transition: 'color 0.2s' }}>Terms of Service</Link>
            <Link href="/refund-policy" style={{ color: 'rgba(255,255,255,0.7)', padding: '8px 12px', margin: '-8px -12px', transition: 'color 0.2s' }}>Refund Policy</Link>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            © 2026 shadiwalacard.com — Made in India 
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="16" height="11" style={{ display: 'inline-block', borderRadius: 2 }}>
              <rect width="900" height="200" fill="#FF9933"/>
              <rect y="200" width="900" height="200" fill="#FFFFFF"/>
              <rect y="400" width="900" height="200" fill="#138808"/>
              <circle cx="450" cy="300" r="80" stroke="#000080" strokeWidth="15" fill="none"/>
              <circle cx="450" cy="300" r="20" fill="#000080"/>
            </svg>
          </span>
        </div>
      </footer>

      {/* ─────────────────── MOBILE FLOATING STICKY ACTION BAR ─────────────────── */}
      <div 
        className="sf-sticky-mobile-bar"
        style={{
          transform: showStickyBar ? 'translateY(0)' : 'translateY(140%)',
          opacity: showStickyBar ? 1 : 0,
          pointerEvents: showStickyBar ? 'auto' : 'none',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', textAlign: 'left', minWidth: 0 }}>
          <span style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontSize: '0.813rem', fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            The Grand Palace
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'line-through' }}>₹1,299</span>
            <span style={{ fontSize: '0.813rem', fontWeight: 800, color: '#ffbc4b' }}>₹799</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <Link
            href="/demo/grand-palace"
            onClick={() => posthog?.capture('demo_clicked', { template_id: 'grand-palace', source: 'mobile_sticky_bar' })}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF', textDecoration: 'none'
            }}
            aria-label="View demo"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
            </svg>
          </Link>
          <Link
            href="/cart?template=grand-palace"
            onClick={() => posthog?.capture('customize_clicked', { template_id: 'grand-palace', source: 'mobile_sticky_bar' })}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              background: '#FFFFFF', color: '#050505',
              fontSize: '0.813rem', fontWeight: 700,
              padding: '9px 18px', borderRadius: '999px',
              textDecoration: 'none', boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)'
            }}
          >
            Get Yours Now
          </Link>
        </div>
      </div>

    </main>
  );
}





























































