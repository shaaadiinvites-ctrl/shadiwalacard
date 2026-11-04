'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { LiquidButton } from '@/components/ui/liquid-glass-button';
import { usePostHog } from 'posthog-js/react';

const Smooth3DSlideshow = dynamic(() => import('@/components/templates/project3/originkit/ui/coverflowgallery'), {
  ssr: false,
  loading: () => <div style={{ height: 420, width: '100%', borderRadius: 16, background: 'rgba(255,255,255,0.02)' }} />
});

const LightCurtain = dynamic(() => import('@/components/originkit/ui/light-curtain'), {
  ssr: false
});

const WaveArcs = dynamic(() => import('@/components/originkit/ui/wave-arcs'), {
  ssr: false
});

const VectorRoadGrid = dynamic(() => import('@/components/ui/vector-road-grid'), {
  ssr: false,
  loading: () => <div style={{ height: 360, width: '100%', borderRadius: 24, background: 'rgba(255,255,255,0.02)' }} />
});

const FaqSection = dynamic(() => import('@/components/ui/faq').then(mod => ({ default: mod.FaqSection })), {
  ssr: false,
  loading: () => <div style={{ minHeight: 380, width: '100%' }} />
});

const FindMyInviteModal = dynamic(() => import('@/components/FindMyInviteModal'), {
  ssr: false,
});

const laganFaqs = [
  { q: "Can I write family names and shlokas in Hindi/Devanagari?", a: "Yes! ShadiwalaCard fully supports Hindi, Sanskrit shlokas, and English. You can include Ganesh Vandana, Mangalam Bhagwan Vishnu, and traditional Nanihal & Dadihal family details." },
  { q: "How does the Google Maps venue pin work for farmhouses and banquets?", a: "When you create the invite, you pin your exact venue. Guests simply tap 'Navigate' on their smartphone and Google Maps guides them straight to your entrance gate with zero confusion." },
  { q: "Can I configure separate events like Haldi, Mehndi, Lagan Lekhan, and Barat?", a: "Yes! Every ceremony gets its own auspicious Shubh Muhurat timing, dress code, and dedicated 1-tap Google Maps pin." },
  { q: "Can I edit details after creating the Lagan Patrika?", a: "Yes! You receive a private edit link. If timings, dates, or venues change, you can update them anytime and the live link updates instantly for all guests." },
  { q: "How do I share the Lagan Patrika on WhatsApp?", a: "Instantly after ordering, you receive your unique custom link. You can share it across WhatsApp family groups or direct messages with rich couple photos and background music." },
  { q: "Is there a limit to how many family members or groups I can send it to?", a: "Zero limits. Send your link to 50 relatives or 5,000 guests across WhatsApp, Instagram, or SMS with unlimited views." }
];

const gallerySlides = [
  { image: { src: '/uploads/prewedding_sunset.webp', alt: 'Traditional wedding celebration moment' } },
  { image: { src: '/uploads/prewedding_candid.webp', alt: 'Auspicious wedding ceremony' } },
  { image: { src: '/uploads/prewedding_palace.webp', alt: 'Royal palace wedding setting' } }
];

export default function LaganPatrikaPage() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1200);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [isFindModalOpen, setIsFindModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const posthog = usePostHog();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setShowStickyBar(window.scrollY > 480);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (posthog) {
      posthog.capture('lagan_patrika_page_viewed');
    }
  }, [posthog]);

  useEffect(() => {
    setIsMounted(true);
    setWindowWidth(window.innerWidth);
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setWindowWidth(window.innerWidth);
      }, 100);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <main style={{ background: '#050505', color: '#FFFFFF', fontFamily: "var(--font-body), 'Inter', sans-serif", minHeight: '100vh' }}>
      {/* ─────────────────── PAGE STYLES ─────────────────── */}
      <style>{`
        button, a, .sf-tcard, .sf-step-card { caret-color: transparent; }

        .sf-container {
          width: 100%;
          max-width: 1220px;
          margin: 0 auto;
          padding: 0 20px;
        }

        @keyframes sfShimmer  { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes sfFadeUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes sfPinBounce{ 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes sfRadar    { 0%{transform:scale(0.6);opacity:0.9} 100%{transform:scale(2.8);opacity:0} }
        @keyframes sfOrbit    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes sfMarquee  { from{transform:translate3d(0, 0, 0)} to{transform:translate3d(-50%, 0, 0)} }

        .sf-fade-1 { animation: sfFadeUp 0.7s 0.0s ease both; }
        .sf-fade-2 { animation: sfFadeUp 0.7s 0.15s ease both; }
        .sf-fade-3 { animation: sfFadeUp 0.7s 0.3s ease both; }

        .sf-tcard {
          transition: transform 0.5s ease, box-shadow 0.3s ease;
          transform: rotateY(-5deg) rotateX(5deg);
        }
        .sf-tcard:active { transform: scale(0.98); }
        @media (max-width: 767px) {
          .sf-tcard { transform: none !important; }
        }

        .sf-content-lazy {
          content-visibility: auto;
          contain-intrinsic-size: 0 700px;
        }

        .sf-wave-arcs-wrapper {
          display: block;
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          opacity: 0.55;
          mask-image: linear-gradient(to bottom, transparent 0%, transparent 25%, black 60%, black 85%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, transparent 25%, black 60%, black 85%, transparent 100%);
        }
        @media (max-width: 767px) {
          .sf-wave-arcs-wrapper { display: none !important; }
        }

        .sf-pin-bounce { animation: sfPinBounce 2s ease-in-out infinite; }
        .sf-radar { animation: sfRadar 2s ease-out infinite; }
        .sf-orbit { animation: sfOrbit 14s linear infinite; }

        @media (max-width: 767px) { .sf-mobile-demo-btn { display: inline-flex !important; } }
        .sf-hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
          padding: 12px;
          margin: -8px;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
          outline: none;
          background: transparent;
          border: none;
        }
        .sf-hamburger span { width: 22px; height: 1.5px; background: #FFFFFF; display: block; transition: all 0.3s; pointer-events: none; }
        .sf-mobile-controls { display: flex; align-items: center; gap: 12px; margin-left: auto; }
        @media (min-width: 768px) { .sf-mobile-controls { display: none !important; } }
        .sf-nav-links { display: flex; align-items: center; gap: 20px; margin-left: auto; }
        .sf-arrow-hint { display: none; }

        .sf-hero-section {
          position: relative;
          display: flex;
          background: #050505;
          width: 100%;
          padding: 8px;
          height: calc(100vh - 32px);
          height: calc(100svh - 32px);
          min-height: 520px;
          overflow: hidden;
        }

        .sf-hero-h1     { font-size: clamp(2.2rem, 7vw, 3.8rem); letter-spacing: -0.5px; line-height: 1.05; margin-bottom: clamp(32px, 5vw, 48px) !important; }
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
        .sf-sec         { padding: 120px 0 !important; }
        .sf-section-h2  { font-size: clamp(2rem, 5vw, 3.5rem); letter-spacing: -0.5px; line-height: 1.05; transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), text-shadow 0.4s ease; }
        .sf-section-h2:hover { transform: translateY(-3px); text-shadow: 0 10px 30px rgba(225, 29, 72, 0.25); }
        .sf-venue-h2    { font-size: clamp(2.2rem, 5.5vw, 3.8rem); letter-spacing: -0.5px; line-height: 1.12; }
        .sf-nav-links   { display: none !important; }
        .sf-hamburger   { display: flex !important; flex-direction: column; gap: 5px; cursor: pointer; padding: 12px; margin: -8px; user-select: none; -webkit-tap-highlight-color: transparent; outline: none; }
        
        .sf-showcase-content {
          align-items: center !important;
          text-align: center !important;
          width: 100%;
          max-width: 440px;
          margin: 0 auto;
        }
        .sf-showcase-content .sf-eyebrow {
          justify-content: center !important;
          margin-bottom: 14px;
        }
        .sf-showcase-content .sf-section-h2 {
          text-align: center !important;
          margin: 0 auto 14px auto !important;
        }
        .sf-showcase-content .sf-price-lockup {
          justify-content: center !important;
          margin: 0 auto 20px auto !important;
        }
        .sf-showcase-content .sf-showcase-p {
          text-align: center !important;
          margin: 0 auto 32px auto !important;
        }
        .sf-showcase-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
          max-width: 360px;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px auto !important;
        }
        .sf-showcase-actions > * {
          width: 100% !important;
          max-width: 360px !important;
          justify-content: center !important;
          text-align: center !important;
        }
        .sf-guarantee-wrap {
          display: flex;
          flex-direction: column;
          gap: 10px;
          width: 100%;
          max-width: 440px;
          align-items: center;
          text-align: center;
          margin: 0 auto;
        }
        .sf-guarantee-lockup {
          display: inline-flex;
          align-items: center;
          justify-content: center !important;
          text-align: center !important;
          gap: 8px;
        }
        .sf-showcase-trust {
          display: flex;
          align-items: center;
          justify-content: center !important;
          text-align: center !important;
          gap: 14px;
          flex-wrap: wrap;
        }
        .sf-step-card   { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .sf-step-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(225, 29, 72, 0.15) !important; }

        @keyframes pinFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-7px); }
        }
        @keyframes radarPulseShadow {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(0.65); opacity: 0.2; }
        }

        @media (min-width: 768px) {
          .sf-hero-section { height: calc(100vh - 32px); height: calc(100svh - 32px); }
          .sf-hero-h1     { font-size: clamp(3rem, 6.5vw, 4.8rem); line-height: 1.05; }
          .sf-hero-sub    { font-size: 1.125rem; }
          .sf-showcase-content {
            align-items: flex-start !important;
            text-align: left !important;
            max-width: 540px;
            margin: 0;
          }
          .sf-showcase-content .sf-eyebrow {
            justify-content: flex-start !important;
          }
          .sf-showcase-content .sf-section-h2 {
            text-align: left !important;
            margin: 0 0 14px 0 !important;
          }
          .sf-showcase-content .sf-price-lockup {
            justify-content: flex-start !important;
            margin: 0 0 20px 0 !important;
          }
          .sf-showcase-content .sf-showcase-p {
            text-align: left !important;
            margin: 0 0 32px 0 !important;
          }
          .sf-showcase-actions {
            flex-direction: row;
            width: auto;
            max-width: none;
            justify-content: flex-start;
            margin: 0 0 24px 0 !important;
          }
          .sf-showcase-actions > * {
            width: auto !important;
            max-width: none !important;
          }
          .sf-guarantee-wrap {
            align-items: flex-start;
            text-align: left;
            margin: 0;
          }
          .sf-guarantee-lockup {
            justify-content: flex-start !important;
            text-align: left !important;
          }
          .sf-showcase-trust {
            justify-content: flex-start !important;
            text-align: left !important;
          }
          .sf-nav-links  { display: flex !important; }
          .sf-arrow-hint { display: flex !important; }
          .sf-mobile-controls { display: none !important; }
          .sf-hamburger  { display: none !important; }
        }
      `}</style>

      {/* ─────────────────── TOP BANNER ─────────────────── */}
      <div style={{ 
        width: '100%', 
        height: '32px',
        boxSizing: 'border-box',
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
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="16" height="11" role="img" aria-label="Flag of India" style={{ display: 'inline-block', borderRadius: 2, flexShrink: 0 }}>
            <rect width="900" height="200" fill="#FF9933"/>
            <rect y="200" width="900" height="200" fill="#FFFFFF"/>
            <rect y="400" width="900" height="200" fill="#138808"/>
            <circle cx="450" cy="300" r="80" stroke="#000080" strokeWidth="15" fill="none"/>
            <circle cx="450" cy="300" r="20" fill="#000080"/>
          </svg>
          TRADITIONAL VEDIC ELEGANCE • AUSPICIOUS SHUBH VIVAH PATRIKA
        </span>
      </div>

      {/* ─────────────────── HERO ─────────────────── */}
      <section className="sf-hero-section">
        <div style={{ position: 'relative', flex: 1, borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          
          {/* Header */}
          <header style={{
            position: 'absolute', top: '10px', left: 0, right: 0, zIndex: 40,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '14px clamp(12px, 4.5vw, 36px)',
            background: 'transparent'
          }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, userSelect: 'none', textDecoration: 'none' }}>
              <img 
                src="/uploads/logo.png" 
                alt="ShadiwalaCard Logo" 
                style={{ height: '32px', width: 'auto', objectFit: 'contain' }} 
              />
              <span style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontSize: 'clamp(1.05rem, 3.8vw, 1.25rem)', color: '#FFFFFF', letterSpacing: '-0.5px', fontWeight: 600 }}>
                ShadiwalaCard
              </span>
            </Link>

            <div className="sf-nav-links" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <Link href="/contact-us" style={{ color: '#FFFFFF', fontSize: '0.875rem', fontWeight: 500, opacity: 0.9 }}>Contact Us</Link>
              <div style={{ position: 'relative' }}>
                <Link href="/demo/grand-palace" onClick={() => posthog?.capture('demo_clicked', { template_id: 'grand-palace', source: 'lagan_patrika_header' })} style={{ 
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  background: '#FFFFFF', color: '#050505', 
                  borderRadius: '999px', padding: '8px 20px', fontSize: '0.875rem', fontWeight: 500,
                  transition: 'transform 0.2s', boxShadow: '0 4px 14px rgba(0,0,0,0.3)', textDecoration: 'none'
                }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                  </svg>
                  View Sample
                </Link>
                <div className="sf-arrow-hint" style={{ 
                  position: 'absolute', top: '100%', right: '0', 
                  flexDirection: 'column', alignItems: 'center', pointerEvents: 'none', color: '#FFFFFF', 
                  transform: 'rotate(-6deg) translateX(10px)', zIndex: 50 
                }}>
                  <svg width="24" height="36" viewBox="0 0 48 72" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(-15deg) translateX(-8px)' }}>
                    <path d="M8 64c6-1 28-10 28-46" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    <path d="M25 28l11-12 11 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span style={{ 
                    fontFamily: "var(--font-handwriting), 'Caveat', cursive", 
                    fontSize: '1.25rem', fontWeight: 700, whiteSpace: 'nowrap', marginTop: '-4px', 
                    letterSpacing: '0.5px', color: '#FFFFFF', transform: 'translateX(-70px)' 
                  }}>
                    Experience the royal audio
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Controls */}
            <div className="sf-mobile-controls">
              <Link 
                href="/demo/grand-palace" 
                className="sf-mobile-demo-btn"
                onClick={() => posthog?.capture('demo_clicked', { template_id: 'grand-palace', source: 'lagan_patrika_mobile_header' })} 
                style={{ 
                  display: 'none', alignItems: 'center', gap: '5px',
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
              <button 
                type="button"
                className="sf-hamburger" 
                aria-label="Toggle navigation menu" 
                aria-expanded={isMenuOpen}
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
              >
                <span style={{ transform: isMenuOpen ? 'rotate(45deg) translate(4px, 5px)' : 'none', width: '22px', height: '1.5px', background: '#FFFFFF', display: 'block', transition: 'all 0.3s', pointerEvents: 'none' }} />
                <span style={{ opacity: isMenuOpen ? 0 : 1, width: '22px', height: '1.5px', background: '#FFFFFF', display: 'block', transition: 'all 0.3s', pointerEvents: 'none' }} />
                <span style={{ transform: isMenuOpen ? 'rotate(-45deg) translate(4px, -5px)' : 'none', width: '22px', height: '1.5px', background: '#FFFFFF', display: 'block', transition: 'all 0.3s', pointerEvents: 'none' }} />
              </button>
            </div>
          </header>

          {/* Mobile Drawer */}
          {isMenuOpen && (
            <>
              <div 
                style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 998 }}
                onClick={() => setIsMenuOpen(false)}
              />
              <div style={{
                position: 'fixed', top: '70px', left: '16px', right: '16px', zIndex: 999,
                background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.98) 0%, rgba(5, 5, 5, 0.98) 100%)',
                backdropFilter: 'blur(24px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '24px',
                padding: '24px',
                display: 'flex', flexDirection: 'column', gap: '16px',
                boxShadow: '0 24px 60px rgba(0,0,0,0.9), 0 0 40px rgba(225,29,72,0.1)'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Link 
                    href="/demo/grand-palace" 
                    onClick={() => { setIsMenuOpen(false); posthog?.capture('demo_clicked', { source: 'mobile_menu_drawer' }); }}
                    style={{ padding: '14px 18px', background: 'rgba(255,255,255,0.04)', borderRadius: '16px', color: '#FFFFFF', fontWeight: 600, fontSize: '1rem', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                  >
                    <span>View Live Sample</span>
                    <span style={{ color: '#D4AF37', fontSize: '0.85rem' }}>Demo →</span>
                  </Link>
                  <button 
                    type="button"
                    onClick={() => { setIsMenuOpen(false); setIsFindModalOpen(true); }}
                    style={{ padding: '14px 18px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', textAlign: 'left', cursor: 'pointer' }}
                  >
                    Find My Existing Invite
                  </button>
                  <Link 
                    href="/contact-us" 
                    onClick={() => setIsMenuOpen(false)}
                    style={{ padding: '14px 18px', color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', textDecoration: 'none' }}
                  >
                    Contact Us
                  </Link>
                </div>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    router.push('/cart?template=grand-palace');
                  }}
                  style={{
                    height: '52px',
                    borderRadius: '999px',
                    background: 'linear-gradient(135deg, #d4af37 0%, #aa771c 100%)',
                    color: '#050505',
                    fontWeight: 700,
                    fontSize: '1rem',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 8px 24px rgba(212,175,55,0.3)'
                  }}
                >
                  Create Lagan Patrika for ₹799
                </button>
              </div>
            </>
          )}

          {/* Background Video Wrap */}
          <div 
            suppressHydrationWarning
            style={{ position: 'absolute', inset: 0, borderRadius: '24px', overflow: 'hidden', background: '#000', pointerEvents: 'none' }}
          >
            <div 
              style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'url(/uploads/videocover.png)',
                backgroundSize: 'cover', backgroundPosition: 'center',
                opacity: isMounted ? 0 : 1, transition: 'opacity 0.6s ease'
              }}
            />
            {isMounted && (
              <video 
                src="/uploads/bg.mp4" 
                poster="/uploads/videocover.png"
                autoPlay loop muted playsInline preload="metadata"
                suppressHydrationWarning
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.65) 100%)' }} />
          </div>

          {/* Hero Content */}
          <div className="sf-container" style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: 920 }}>
            <h1 className="sf-hero-h1 sf-fade-1" style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontWeight: 500, lineHeight: 1.12, color: '#FFFFFF' }}>
              Online Lagan Patrika Maker<br />
              <span className="inline-block font-normal italic text-[#FFFFFF]">
                With 1-Tap Google Maps.
              </span>
            </h1>

            <p className="sf-hero-sub sf-fade-2" style={{ lineHeight: 1.7, color: 'rgba(255, 255, 255, 0.85)', margin: '0 auto clamp(32px, 5vw, 44px)', maxWidth: 720 }}>
              Celebrate your Shubh Vivah with traditional Devanagari Hindi typography, auspicious Shubh Muhurat ceremony timelines, sacred Ganesha blessings, and zero-lost-guest Google Maps venue pins.
            </p>

            <div className="sf-fade-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <button
                onClick={() => {
                  posthog?.capture('scroll_to_collection_clicked', { source: 'lagan_patrika_hero' });
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

      {/* ─────────────────── TEMPLATE SHOWCASE ─────────────────── */}
      <section id="sf-collection" style={{ 
        position: 'relative',
        background: 'linear-gradient(180deg, #0a0405 0%, #120608 45%, #080304 85%, #050505 100%)', 
        paddingTop: 'clamp(80px, 8vw, 120px)', 
        paddingBottom: 'clamp(60px, 7vw, 100px)', 
        overflow: 'hidden' 
      }}>
        <div style={{
          position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
          width: 'min(90vw, 800px)', height: '400px',
          background: 'radial-gradient(ellipse at center, rgba(212, 175, 55, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: 0
        }} />

        <div className="sf-container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'flex', flexDirection: windowWidth < 992 ? 'column' : 'row',
            alignItems: 'center', justifyContent: 'center',
            gap: windowWidth < 992 ? 'clamp(36px, 6vw, 48px)' : 'clamp(48px, 6vw, 84px)',
            maxWidth: 1100, margin: '0 auto'
          }}>
            {/* Left: 3D Photo Sheet Preview */}
            <div style={{ flex: '0 0 auto', width: '100%', maxWidth: windowWidth < 768 ? '310px' : '360px', perspective: '1000px' }}>
              <div 
                className="sf-tcard"
                style={{
                  position: 'relative', borderRadius: '24px', overflow: 'hidden',
                  background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.95) 0%, rgba(5, 5, 5, 0.95) 100%)',
                  boxShadow: '0 24px 60px rgba(0,0,0,0.7), 0 0 40px rgba(212, 175, 55, 0.15)',
                  border: '1px solid rgba(212, 175, 55, 0.25)',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  posthog?.capture('demo_clicked', { source: 'lagan_patrika_card_click' });
                  router.push('/demo/grand-palace');
                }}
              >
                <div style={{ position: 'relative', width: '100%', height: windowWidth < 768 ? '440px' : '480px' }}>
                  <Image
                    src="/project3-assets/cover.webp"
                    alt="The Grand Palace Lagan Patrika Preview"
                    fill
                    sizes="(max-width: 768px) 310px, 360px"
                    priority
                    style={{ objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.3) 50%, transparent 100%)' }} />
                  
                  <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      background: 'rgba(5, 5, 5, 0.75)', backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(212, 175, 55, 0.4)', borderRadius: 999,
                      padding: '6px 14px', fontSize: '0.72rem', fontWeight: 700,
                      color: '#FFD98A', letterSpacing: '0.5px'
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80' }} />
                      PLAYING SHEHNAI & SITAR
                    </span>
                  </div>

                  <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20, zIndex: 10, textAlign: 'left' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D4AF37', letterSpacing: '1px', textTransform: 'uppercase' }}>
                      SHUBH VIVAH PATRIKA
                    </span>
                    <h3 style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontSize: '1.4rem', fontWeight: 700, color: '#FFFFFF', margin: '4px 0 8px' }}>
                      The Grand Palace Patrika
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.5, margin: 0 }}>
                      Devanagari Sanskrit shlokas, Shubh Muhurat schedules & 1-tap Google Maps.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: The Text & Actions */}
            <div className="sf-showcase-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div className="sf-eyebrow" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{
                  background: 'rgba(212, 175, 55, 0.15)', border: '1px solid rgba(212, 175, 55, 0.35)',
                  color: '#FFD98A', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px',
                  textTransform: 'uppercase', padding: '6px 14px', borderRadius: 999
                }}>
                  👑 VEDIC ROYALTY • 100% MOBILE COMPATIBLE
                </span>
              </div>

              <h2 className="sf-section-h2" style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontWeight: 700, color: '#FFFFFF', margin: '0 0 14px 0' }}>
                Sacred Tradition,<br />
                Modern Elegance.
              </h2>

              <div className="sf-price-lockup" style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 20 }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-1px' }}>₹799</span>
                <span style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'line-through' }}>₹1,299</span>
                <span style={{ background: '#e11d48', color: '#FFFFFF', fontSize: '0.78rem', fontWeight: 700, padding: '4px 10px', borderRadius: 6, letterSpacing: '0.5px' }}>
                  38% OFF
                </span>
              </div>

              <p className="sf-showcase-p" style={{ fontSize: '1rem', lineHeight: 1.7, color: 'rgba(255, 255, 255, 0.8)', maxWidth: 520, margin: '0 0 28px 0' }}>
                Your complete digital Lagan Patrika website ready in under 3 minutes. Includes Hindi font rendering, auspicious ceremony timings, Nanihal/Dadihal family honors, and 1-tap Google Maps navigation.
              </p>

              <div className="sf-showcase-actions">
                <LiquidButton 
                  size="xl" 
                  style={{ pointerEvents: 'auto', padding: '0 36px', color: '#1A202C', fontWeight: 600, background: '#FFFFFF', border: 'none', boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)' }} 
                  onClick={() => {
                    posthog?.capture('create_invite_clicked', { source: 'lagan_patrika_showcase' });
                    router.push('/cart?template=grand-palace');
                  }} 
                >
                  Create My Lagan Patrika
                </LiquidButton>
                <Link
                  href="/demo/grand-palace"
                  onClick={() => posthog?.capture('demo_clicked', { source: 'lagan_patrika_secondary_cta' })}
                  style={{
                    height: '52px', padding: '0 28px', borderRadius: '999px',
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.18)',
                    color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 600,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    textDecoration: 'none', transition: 'all 0.2s', whiteSpace: 'nowrap'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                  </svg>
                  <span>View Live Sample</span>
                </Link>
              </div>

              <div className="sf-guarantee-wrap">
                <div className="sf-guarantee-lockup">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
                    100% Satisfaction or Full Refund — No Questions Asked
                  </span>
                </div>
                <div className="sf-showcase-trust">
                  <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    ✓ Zero Watermarks
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    ✓ Unlimited WhatsApp Shares
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    ✓ Free Edits Anytime
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Handwritten Founder Note */}
          <div style={{ maxWidth: 840, margin: 'clamp(50px, 6vw, 70px) auto 0 auto', position: 'relative' }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.8) 0%, rgba(5, 5, 5, 0.9) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              borderRadius: '24px',
              padding: 'clamp(28px, 4vw, 40px)',
              position: 'relative'
            }}>
              <p style={{
                fontFamily: "var(--font-handwriting), 'Caveat', cursive",
                fontSize: 'clamp(1.2rem, 2.8vw, 1.45rem)',
                lineHeight: 1.6,
                color: '#FFF8E7',
                margin: '0 0 16px 0'
              }}>
                "In Indian tradition, a Lagan Patrika is not just paper—it is the sacred first announcement of two families uniting under divine blessings. We created this digital version so no elder or relative ever gets lost on the road, and everyone on WhatsApp receives your auspicious announcement with true royal dignity."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#d4af37', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#050505', fontWeight: 800, fontSize: '0.85rem' }}>
                  ॐ
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF' }}>ShadiwalaCard Traditions Team</div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>Preserving Vedic Heritage in Modern Delhi NCR</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── MOVING MARQUEE ─────────────────── */}
      <div style={{
        width: '100%', overflow: 'hidden', background: '#0a0305',
        borderTop: '1px solid rgba(212,175,55,0.2)', borderBottom: '1px solid rgba(212,175,55,0.2)',
        padding: '14px 0', position: 'relative'
      }}>
        <div style={{ display: 'flex', width: '200%', animation: 'sfMarquee 28s linear infinite' }}>
          {[0, 1].map((key) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: '100%', flexShrink: 0, gap: '40px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1.5px', color: '#FFD98A', textTransform: 'uppercase' }}>
                AUSPICIOUS SHUBH MUHURAT TIMINGS
              </span>
              <span style={{ color: '#e11d48' }}>✦</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1.5px', color: '#FFFFFF', textTransform: 'uppercase' }}>
                1-TAP GOOGLE MAPS VENUE NAVIGATION
              </span>
              <span style={{ color: '#e11d48' }}>✦</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1.5px', color: '#FFD98A', textTransform: 'uppercase' }}>
                DEVANAGARI HINDI & SANSKRIT SHLOKAS
              </span>
              <span style={{ color: '#e11d48' }}>✦</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1.5px', color: '#FFFFFF', textTransform: 'uppercase' }}>
                UNLIMITED WHATSAPP FAMILY SHARING
              </span>
              <span style={{ color: '#e11d48' }}>✦</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1.5px', color: '#FFD98A', textTransform: 'uppercase' }}>
                ROYAL SHEHNAI & SITAR BACKGROUND MUSIC
              </span>
              <span style={{ color: '#e11d48' }}>✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─────────────────── HOW IT WORKS ─────────────────── */}
      <section id="sf-how" className="sf-content-lazy" style={{ padding: 'clamp(80px, 8vw, 120px) 0', background: '#050505', position: 'relative' }}>
        <div className="sf-container">
          <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto clamp(40px, 6vw, 64px)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D4AF37', letterSpacing: '1.5px', textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>
              EFFORTLESS 3-MINUTE SETUP
            </span>
            <h2 className="sf-section-h2" style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
              How To Create Your Lagan Patrika
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: windowWidth < 768 ? '1fr' : 'repeat(3, 1fr)', gap: '24px' }}>
            <div className="sf-step-card" style={{
              background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.6) 0%, rgba(10, 10, 10, 0.8) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '36px 28px', textAlign: 'center'
            }}>
              <div style={{ width: 56, height: 56, borderRadius: '16px', background: 'rgba(212, 175, 55, 0.15)', color: '#FFD98A', fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                1
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginBottom: 12 }}>Enter Auspicious Details</h3>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: 0 }}>
                Fill in bride & groom names, Shubh Muhurat ceremony timings, venue Google Maps pin, and traditional Nanihal/Dadihal family details.
              </p>
            </div>

            <div className="sf-step-card" style={{
              background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.6) 0%, rgba(10, 10, 10, 0.8) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '36px 28px', textAlign: 'center'
            }}>
              <div style={{ width: 56, height: 56, borderRadius: '16px', background: 'rgba(225, 29, 72, 0.15)', color: '#f43f5e', fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                2
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginBottom: 12 }}>Instant Royal Preview</h3>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: 0 }}>
                Your private website generates in seconds with royal 3D palace animations, background shehnai music, and live ceremony countdowns.
              </p>
            </div>

            <div className="sf-step-card" style={{
              background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.6) 0%, rgba(10, 10, 10, 0.8) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '24px', padding: '36px 28px', textAlign: 'center'
            }}>
              <div style={{ width: 56, height: 56, borderRadius: '16px', background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                3
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginBottom: 12 }}>Share on WhatsApp</h3>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: 0 }}>
                Share your personalized link across WhatsApp family groups. Relatives open it with 1 tap, listen to the music, and navigate straight to the venue.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── MULTI-DEVICE SHOWCASE ─────────────────── */}
      <section id="sf-devices" className="sf-content-lazy" style={{
        position: 'relative', padding: 'clamp(60px, 7vw, 100px) 0',
        background: '#050505', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 'min(92vw, 880px)', height: '420px',
          background: 'radial-gradient(ellipse at center, rgba(212, 175, 55, 0.12) 0%, rgba(225, 29, 72, 0.05) 50%, transparent 75%)',
          pointerEvents: 'none', zIndex: 0, filter: 'blur(36px)'
        }} />

        <div className="sf-container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ maxWidth: 720, margin: '0 auto 36px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D4AF37', letterSpacing: '1.5px', textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>
              RESPONSIVE PERFECTION
            </span>
            <h2 className="sf-section-h2" style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontWeight: 700, color: '#FFFFFF', margin: '0 0 14px 0' }}>
              Flawless On Every Device
            </h2>
            <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, margin: 0 }}>
              Whether your nanaji opens it on a smartphone, or relatives view it on a tablet or laptop, the layout auto-adapts with crisp typography and instant loading.
            </p>
          </div>

          <div style={{ position: 'relative', maxWidth: 940, margin: '0 auto' }}>
            <Image
              src="/uploads/multidevice.webp"
              alt="Multi device Lagan Patrika display on smartphone, tablet and laptop"
              width={940}
              height={520}
              style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '16px' }}
            />
          </div>
        </div>
      </section>

      {/* ─────────────────── VENUE SECTION ─────────────────── */}
      <section id="sf-venue" className="sf-sec sf-content-lazy" style={{
        position: 'relative', overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 50%, #0d0407 0%, #050505 100%)',
        textAlign: 'center', padding: '120px 20px'
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.35, pointerEvents: 'none' }}>
          <VectorRoadGrid />
        </div>

        <div className="sf-container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ width: 64, height: 64, margin: '0 auto 24px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="sf-radar" style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', background: 'rgba(225, 29, 72, 0.4)' }} />
            <div className="sf-pin-bounce" style={{ position: 'relative', zIndex: 2, color: '#e11d48' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
          </div>

          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D4AF37', letterSpacing: '1.5px', textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>
            ZERO-LOST-GUEST NAVIGATION
          </span>
          <h2 className="sf-venue-h2" style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontWeight: 700, color: '#FFFFFF', maxWidth: 780, margin: '0 auto 18px' }}>
            No More "Bhaiya, Location Bhejna" Calls.
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.8)', maxWidth: 620, margin: '0 auto 36px', lineHeight: 1.7 }}>
            Your guests tap once on the Lagan Patrika and turn-by-turn Google Maps navigation directs them straight to your banquet hall, farmhouse, or hotel parking gate.
          </p>

          <Link
            href="/cart?template=grand-palace"
            onClick={() => posthog?.capture('create_invite_clicked', { source: 'lagan_patrika_venue_cta' })}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#FFFFFF', color: '#050505',
              borderRadius: '999px', padding: '14px 34px', fontSize: '1rem', fontWeight: 700,
              textDecoration: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.5)', transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <span>Create For ₹799</span>
            <span>→</span>
          </Link>
        </div>
      </section>

      {/* ─────────────────── PRE-WEDDING 3D GALLERY ─────────────────── */}
      <section id="sf-gallery" className="sf-content-lazy" style={{ padding: 'clamp(80px, 8vw, 120px) 0', background: '#050505', position: 'relative' }}>
        <div className="sf-container" style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D4AF37', letterSpacing: '1.5px', textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>
            INTERACTIVE 3D PHOTO EXPERIENCE
          </span>
          <h2 className="sf-section-h2" style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontWeight: 700, color: '#FFFFFF', margin: '0 0 12px 0' }}>
            Showcase Your Pre-Wedding Portraits
          </h2>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.75)', maxWidth: 580, margin: '0 auto' }}>
            Guests can swipe through your couple portraits in a smooth, cinematic 3D carousel.
          </p>
        </div>

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
          <Smooth3DSlideshow slides={gallerySlides} />
        </div>
      </section>

      {/* ─────────────────── CLIMAX CTA ─────────────────── */}
      <section style={{
        padding: 'clamp(80px, 8vw, 120px) 20px',
        background: 'linear-gradient(180deg, #050505 0%, #17070a 50%, #050505 100%)',
        textAlign: 'center', position: 'relative'
      }}>
        <div className="sf-container" style={{ maxWidth: 780 }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D4AF37', letterSpacing: '1.5px', textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>
            JOIN HUNDREDS OF SATISFIED FAMILIES
          </span>
          <h2 className="sf-section-h2" style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontWeight: 700, color: '#FFFFFF', margin: '0 0 16px 0' }}>
            Create Your Auspicious Lagan Patrika Today
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, margin: '0 auto 36px' }}>
            Flat ₹799. Ready in 3 minutes. Zero watermarks. 100% money-back guarantee.
          </p>
          <LiquidButton 
            size="xl" 
            style={{ pointerEvents: 'auto', padding: '0 40px', color: '#1A202C', fontWeight: 600, background: '#FFFFFF', border: 'none', boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)' }} 
            onClick={() => {
              posthog?.capture('create_invite_clicked', { source: 'lagan_patrika_climax_cta' });
              router.push('/cart?template=grand-palace');
            }} 
          >
            Create Lagan Patrika (₹799)
          </LiquidButton>
        </div>
      </section>

      {/* ─────────────────── FAQ SECTION ─────────────────── */}
      <section id="sf-faq" className="sf-content-lazy" style={{ padding: 'clamp(60px, 7vw, 100px) 0', background: '#050505' }}>
        <div className="sf-container" style={{ maxWidth: 900 }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D4AF37', letterSpacing: '1.5px', textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>
              COMMON QUESTIONS
            </span>
            <h2 className="sf-section-h2" style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
              Frequently Asked Questions
            </h2>
          </div>
          <FaqSection faqs={laganFaqs} />
        </div>
      </section>

      {/* ─────────────────── FOOTER ─────────────────── */}
      <footer style={{
        background: '#030102', borderTop: '1px solid rgba(255,255,255,0.08)',
        padding: '60px 20px 40px', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem'
      }}>
        <div className="sf-container" style={{ display: 'flex', flexDirection: windowWidth < 768 ? 'column' : 'row', justifyContent: 'space-between', alignItems: windowWidth < 768 ? 'center' : 'flex-start', gap: 32, textAlign: windowWidth < 768 ? 'center' : 'left' }}>
          <div>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: '#FFFFFF', marginBottom: 12 }}>
              <img src="/uploads/logo.png" alt="ShadiwalaCard Logo" style={{ height: 28, width: 'auto' }} />
              <span style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontSize: '1.15rem', fontWeight: 700 }}>ShadiwalaCard</span>
            </Link>
            <p style={{ maxWidth: 360, lineHeight: 1.6, margin: 0, color: 'rgba(255,255,255,0.6)' }}>
              India's #1 digital wedding card & online Lagan Patrika platform with 1-tap Google Maps navigation.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', justifyContent: windowWidth < 768 ? 'center' : 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.875rem' }}>Explore</span>
              <Link href="/demo/grand-palace" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Live Sample</Link>
              <Link href="/cart?template=grand-palace" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Create Invite</Link>
              <Link href="/destination-wedding-card" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Destination Weddings</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.875rem' }}>Legal & Help</span>
              <Link href="/contact-us" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Contact Us</Link>
              <Link href="/terms" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Terms of Service</Link>
              <Link href="/privacy-policy" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Privacy Policy</Link>
              <Link href="/refund-policy" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Refund Policy</Link>
            </div>
          </div>
        </div>

        <div className="sf-container" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 40, paddingTop: 20, textAlign: 'center', fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>
          © {new Date().getFullYear()} ShadiwalaCard. All rights reserved.
        </div>
      </footer>

      {/* ─────────────────── MOBILE STICKY BAR ─────────────────── */}
      {showStickyBar && (
        <div style={{
          position: 'fixed', bottom: 16, left: 16, right: 16, zIndex: 90,
          background: 'rgba(15, 15, 15, 0.88)', backdropFilter: 'blur(16px)',
          border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: 999,
          padding: '8px 12px 8px 18px',
          display: windowWidth < 768 ? 'flex' : 'none',
          alignItems: 'center', justifyContent: 'space-between',
          boxShadow: '0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(212,175,55,0.15)'
        }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#D4AF37', fontWeight: 700, letterSpacing: '0.5px' }}>LAGAN PATRIKA</div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF' }}>₹799 <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'line-through' }}>₹1,299</span></div>
          </div>
          <button
            onClick={() => {
              posthog?.capture('create_invite_clicked', { source: 'lagan_patrika_mobile_sticky_bar' });
              router.push('/cart?template=grand-palace');
            }}
            style={{
              background: 'linear-gradient(135deg, #d4af37 0%, #aa771c 100%)',
              color: '#050505',
              fontWeight: 700,
              fontSize: '0.85rem',
              padding: '10px 20px',
              borderRadius: 999,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(212,175,55,0.3)'
            }}
          >
            Create Now →
          </button>
        </div>
      )}
      {isFindModalOpen && (
        <FindMyInviteModal isOpen={isFindModalOpen} onClose={() => setIsFindModalOpen(false)} />
      )}
    </main>
  );
}
