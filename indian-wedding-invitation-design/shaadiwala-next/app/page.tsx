'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Smooth3DSlideshow from '@/components/originkit/coverflowgallery';
import KlarnaCarousel from '@/components/originkit/button-carousel';
import { LiquidButton } from '@/components/ui/liquid-glass-button';

const templates = [
  { id: 1, name: 'Royal Palace Vows', desc: 'Classic Rajasthani royalty with opulent couples portrait', mrp: '₹1,299', discount: '38% OFF', price: '₹799', badge: '🔥 #1 MOST POPULAR FOR 2026',   img: '/uploads/couple_card_1.jpg' },
  { id: 2, name: 'Aarav & Priya',     desc: 'Customized golden name overlay beneath floral canopy',     mrp: '₹1,299', discount: '38% OFF', price: '₹799', badge: '👑 ROYAL PREFERENCE', img: '/uploads/couple_card_2.jpg' },
  { id: 3, name: 'Cosmic Shadi',     desc: 'Modern starry night theme for contemporary couples',       mrp: '₹1,299', discount: '38% OFF', price: '₹799', badge: '💖 INSTAGRAM FAVORITE',          img: '/uploads/hero-bg-custom.png' },
];

const reviews = [
  { name: 'Priya & Arjun',    city: 'New Delhi',  date: 'Dec 2024', quote: "Sending the invite on WhatsApp was so easy. Our relatives couldn't stop praising the beautiful design and the countdown timer!" },
  { name: 'Ananya & Rohan',   city: 'Mumbai',     date: 'Nov 2024', quote: "The Google Maps feature is a lifesaver! Not a single guest got lost finding the banquet hall. Best decision ever." },
  { name: 'Kavitha & Vikram', city: 'Bengaluru',  date: 'Jan 2025', quote: "It felt so premium! The 3D photo gallery made our pre-wedding pictures look absolutely stunning on mobile screens." },
];

export default function StarfallPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(1200);
  const scrollRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

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
    // Defer attaching listener slightly so Opening taps during momentum/bounce don't close it immediately
    const timer = setTimeout(() => {
      window.addEventListener('scroll', handleScrollMenuClose, { passive: true });
    }, 150);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScrollMenuClose);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current || !stickyRef.current) return;
      
      const { top: sectionTop } = scrollRef.current.getBoundingClientRect();
      const { top: stickyTop } = stickyRef.current.getBoundingClientRect();
      
      let index = 0;
      
      // On mobile browsers, stickyTop might sit at 0.5 or 1 due to URL bars or retina sub-pixels.
      // Checking <= 2 guarantees we only start when it's visually pinned to the top.
      if (stickyTop <= 2) {
        // How far we've scrolled past the start of the section
        const scrolled = Math.max(0, -sectionTop);
        
        // Use 500px per card to prevent trackpad "double skipping"
        index = Math.floor(scrolled / 500);
        index = Math.max(0, Math.min(2, index));
      }
      
      setActiveIndex(index);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main style={{ background: '#F2F4F8', color: '#1A202C', fontFamily: "'Inter', sans-serif", minHeight: '100vh' }}>

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
        .sf-divider::before { background: linear-gradient(to right, transparent, rgba(157, 23, 77,0.25)); }
        .sf-divider::after  { background: linear-gradient(to left,  transparent, rgba(157, 23, 77,0.25)); }
        .sf-divider span { padding: 0 16px; color: rgba(157, 23, 77,0.4); font-size: 1rem; }

        /* ── Template card hover ── */
        .sf-tcard { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .sf-tcard:active { transform: scale(0.98); }

        /* ── Review card ── */
        .sf-rcard { border: 1px solid rgba(26,32,44,0.15); border-radius: 18px; }

        /* ── Venue pin ── */
        .sf-pin-bounce { animation: sfPinBounce 2s ease-in-out infinite; }
        .sf-radar { animation: sfRadar 2s ease-out infinite; }
        .sf-orbit { animation: sfOrbit 14s linear infinite; }

        /* ── CTA buttons ── */
        .sf-cta-btn {
          display: inline-flex; align-items: center; justify-content: center;
          background: #ffffff; color: #2e1065; font-weight: 600;
          border-radius: 40px; border: 2px solid #2e1065; cursor: pointer;
          transition: transform 0.2s ease, background 0.2s ease;
          text-decoration: none;
          -webkit-tap-highlight-color: transparent;
        }
        .sf-cta-btn:active { transform: scale(0.96); }
        .sf-cta-btn:hover { background: #2e1065; color: #ffffff; }

        .sf-ghost-btn {
          display: inline-flex; align-items: center; justify-content: center;
          border: 1px solid rgba(46,16,101,0.25); color: #2e1065;
          border-radius: 40px; background: transparent;
          transition: all 0.2s ease;
          text-decoration: none;
          -webkit-tap-highlight-color: transparent;
        }
        .sf-ghost-btn:hover { background: rgba(46,16,101,0.05); }
        .sf-ghost-btn:active { transform: scale(0.96); }

        /* ── Mobile nav menu toggle ── */
        .sf-hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; padding: 4px; user-select: none; -webkit-tap-highlight-color: transparent; outline: none; }
        .sf-hamburger span { width: 22px; height: 1.5px; background: #1A202C; display: block; transition: all 0.3s; pointer-events: none; }
        .sf-nav-links { display: flex; }

        /* ── RESPONSIVE BREAKPOINTS — mobile-first ── */

        /* Base: 412px (Pixel 7) */
        h2              { font-size: 2rem; }
        .sf-hero-h1     { font-size: 3.5rem; letter-spacing: -0.5px; line-height: 1.0; margin-bottom: 24px !important; }
        .sf-hero-sub    { font-size: 0.875rem; }
        .sf-section-pad { padding: 120px 0 !important; }
        .sf-sec         { padding: 120px 0 !important; }
        .sf-sec-split-b { padding-top: 120px !important; padding-bottom: 60px !important; }
        .sf-sec-split-t { padding-top: 60px !important; padding-bottom: 60px !important; }
        .sf-section-h2  { font-size: 2rem; letter-spacing: -0.5px; line-height: 1.05; }
        .sf-nav-links   { display: none !important; }
        .sf-hamburger   { display: flex !important; }
        .sf-venue-h2    { font-size: 2rem; line-height: 1.05; }
        .sf-review-grid { grid-template-columns: 1fr; }
        .sf-cta-pair    { flex-direction: column; gap: 12px; align-items: center; justify-content: center; }
        .sf-cta-pair a  { text-align: center; }

        /* sm: 540px+ */
        @media (min-width: 540px) {
          .sf-hero-h1 { font-size: 3.5rem; }
          .sf-cta-pair   { flex-direction: row; align-items: center; justify-content: center; }
        }

        /* md: 768px+ tablet */
        @media (min-width: 768px) {
          .sf-hero-h1 { font-size: 3.5rem; }
          .sf-hero-sub   { font-size: 1.125rem; max-width: 540px !important; }
          .sf-cta-btn    { font-size: 1rem !important; padding: 16px 36px !important; }
          .sf-section-h2 { font-size: 3.25rem; }
          .sf-nav-links  { display: flex !important; }
          .sf-hamburger  { display: none !important; }
          .sf-venue-h2   { font-size: 3.5rem; }
          .sf-review-grid { grid-template-columns: repeat(2, 1fr); }
        }

        /* lg: 1024px+ desktop */
        @media (min-width: 1024px) {
          .sf-hero-h1 { font-size: 3.5rem; }
          .sf-section-h2 { font-size: 3.5rem; }
          .sf-review-grid { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>

      {/* ─────────────────── TOP STRIP (Not Sticky) ─────────────────── */}
      <div style={{
        background: 'linear-gradient(90deg, #2e1065, #9d174d)',
        color: '#fff', fontSize: '0.688rem', fontWeight: 700,
        minHeight: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px 12px', textAlign: 'center',
        letterSpacing: '1.5px', textTransform: 'uppercase', flexWrap: 'wrap', gap: '8px'
      }}>
        <span>⭐ RATED 4.9/5 BY INDIAN COUPLES</span>
        <span style={{ opacity: 0.6 }}>•</span>
        <span>🇮🇳 TAILORED FOR BIG FAT INDIAN WEDDINGS</span>
      </div>

      {/* ─────────────────── STICKY HEADER ─────────────────── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 1000,
        background: isMenuOpen ? '#F2F4F8' : 'rgba(242,244,248,0.85)',
        backdropFilter: isMenuOpen ? 'none' : 'blur(24px) saturate(160%)',
        WebkitBackdropFilter: isMenuOpen ? 'none' : 'blur(24px) saturate(160%)',
        borderBottom: '1px solid rgba(26,32,44,0.15)',
        boxShadow: '0 4px 32px rgba(0,0,0,0.06)',
        transition: 'background-color 0.2s ease, backdrop-filter 0.2s ease',
      }}>
        <div className="sf-container" style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0, userSelect: 'none' }}>
            <img 
              src="/uploads/envelope_icon_transparent.png" 
              alt="shadiwalacard.com Icon" 
              style={{ height: '32px', width: '32px', objectFit: 'contain', borderRadius: '4px' }} 
            />
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.25rem', color: '#2e1065', letterSpacing: '0.2px' }}>
              Shadiwala<span style={{ color: '#9d174d' }}>Card</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="sf-nav-links" style={{ alignItems: 'center', gap: 28, fontSize: '0.719rem', letterSpacing: '1.2px', textTransform: 'uppercase', color: 'rgba(26,32,44,0.75)', fontWeight: 500 }}>
            <Link href="#sf-collection" style={{ color: 'rgba(26,32,44,0.75)' }}>Our web invites</Link>
            <Link href="#sf-reviews"    style={{ color: 'rgba(26,32,44,0.75)' }}>Reviews</Link>
            <Link href="/contact-us"    style={{ color: 'rgba(26,32,44,0.75)' }}>Contact Us</Link>
          </nav>

          {/* Mobile hamburger */}
          <div className="sf-hamburger" aria-label="Menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span style={{ transform: isMenuOpen ? 'rotate(45deg) translate(4px, 5px)' : 'none' }} />
            <span style={{ opacity: isMenuOpen ? 0 : 1 }} />
            <span style={{ transform: isMenuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
          </div>
        </div>

        {/* Mobile Dropdown Menu (Attached to header so it respects sticky) */}
        {isMenuOpen && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0,
            background: '#F2F4F8', zIndex: 999,
            borderBottom: '1px solid rgba(26,32,44,0.15)',
            display: 'flex', flexDirection: 'column', padding: '32px 20px', gap: 28, textAlign: 'center'
          }}>
            <Link href="#sf-collection" onClick={() => setIsMenuOpen(false)} style={{ color: '#1A202C', fontSize: '0.875rem', letterSpacing: '2px', textTransform: 'uppercase' }}>Our web invites</Link>
            <Link href="#sf-reviews"    onClick={() => setIsMenuOpen(false)} style={{ color: '#1A202C', fontSize: '0.875rem', letterSpacing: '2px', textTransform: 'uppercase' }}>Reviews</Link>
            <Link href="/contact-us"    onClick={() => setIsMenuOpen(false)} style={{ color: '#1A202C', fontSize: '0.875rem', letterSpacing: '2px', textTransform: 'uppercase' }}>Contact Us</Link>
          </div>
        )}
      </header>

      {/* ─────────────────── HERO ─────────────────── */}
      <section style={{ position: 'relative', minHeight: 'calc(100svh - 92px)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#F2F4F8' }}>

        {/* Background Image */}
        <img 
          src="/uploads/hero-bg-custom.png" 
          alt="Hero Background"
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            zIndex: 1,
            opacity: 1
          }}
        />

        {/* Wavy Bottom Divider */}
        <div style={{ position: 'absolute', bottom: -1, left: 0, width: '100%', overflow: 'hidden', lineHeight: 0, zIndex: 3 }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" style={{ position: 'relative', display: 'block', width: '100%', height: '8vw', minHeight: '60px', maxHeight: '120px' }} preserveAspectRatio="none">
            <path fill="#F2F4F8" d="M0,50 C300,120 1000,-20 1440,50 L1440,120 L0,120 Z"></path>
          </svg>
        </div>

        {/* Content */}
        <div className="sf-container" style={{ position: 'relative', zIndex: 10, textAlign: 'center', paddingBottom: '40px', maxWidth: 900 }}>

          {/* H1 */}
          <h1 className="sf-hero-h1 sf-fade-1" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, lineHeight: 1.0, color: '#2e1065' }}>
            India's Most Premium<br />
            <span style={{ fontStyle: 'italic', color: '#2e1065' }}>
              Digital Wedding Cards.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="sf-hero-sub sf-fade-2" style={{ lineHeight: 1.7, color: 'rgba(26, 32, 44, 0.85)', maxWidth: 440, margin: '0 auto 36px' }}>
            Wow your guests with stunning digital cards featuring 1-tap Google Maps and Live Countdowns.
          </p>

          {/* CTAs */}
          <div className="sf-cta-pair sf-fade-3" style={{ display: 'flex' }}>
            <LiquidButton 
              size="xl" 
              style={{ padding: '0 28px', color: '#2e1065', fontWeight: 600, backdropFilter: 'blur(20px) saturate(180%)', background: 'rgba(255, 255, 255, 0.35)', border: '1.5px solid rgba(255, 255, 255, 0.7)', boxShadow: '0 12px 36px -4px rgba(157, 23, 77, 0.2), 0 4px 16px -2px rgba(46, 16, 101, 0.12)' }}
              onClick={() => {
                const el = document.getElementById('sf-collection');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              View Web Invites
            </LiquidButton>
          </div>
        </div>
      </section>

      {/* ─────────────────── TEMPLATES (STICKY SCROLL) ─────────────────── */}
      <section id="sf-collection" ref={scrollRef} style={{ background: '#F2F4F8', position: 'relative', height: 'calc(100vh + 1500px)' }}>
        


        {/* Sticky Visual Content */}
        <div ref={stickyRef} style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div className="sf-container" style={{ flexShrink: 0, paddingTop: '80px', paddingBottom: '12px' }}>
          <h2 className="sf-section-h2" style={{ textAlign: 'center', fontFamily: "'Playfair Display', serif", fontWeight: 300, color: '#2e1065', margin: 0, letterSpacing: '-0.5px' }}>
            Choose the perfect theme for your <em style={{ color: '#9d174d' }}>Shadi.</em>
          </h2>
        </div>

        {/* Sliding Track Wrapper & Mobile Pagination */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
          <div style={{ 
            display: 'flex', 
            width: 'max-content',
            paddingLeft: 'calc(50vw - (min(75vw, 310px) / 2))',
            paddingRight: 'calc(50vw - (min(75vw, 310px) / 2))',
            transform: `translateX(calc(-${activeIndex} * min(75vw, 310px)))`,
            transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)', 
            willChange: 'transform'
          }}>
            {templates.map(t => (
              <div key={t.id} style={{ width: 'min(75vw, 310px)', display: 'flex', justifyContent: 'center', padding: '0 10px', flexShrink: 0 }}>
                <div className="sf-tcard" style={{ 
                  width: '100%', 
                  maxWidth: 290, 
                  background: 'linear-gradient(135deg, rgba(46, 16, 101, 0.92) 0%, rgba(88, 28, 135, 0.88) 50%, rgba(157, 23, 77, 0.92) 100%)', 
                  backdropFilter: 'blur(24px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                  borderRadius: 24, 
                  border: 'none',
                  padding: 0,
                  boxShadow: 'inset 0 -2px 5px rgba(255, 255, 255, 0.35), 0 20px 45px -8px rgba(157, 23, 77, 0.35), 0 10px 25px -5px rgba(46, 16, 101, 0.25)', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}>
                  {/* 3D Photo Sheet: borderless at top half, fading side borders starting halfway down, resting on platform with 3D shadow */}
                  <div style={{ 
                    position: 'relative', 
                    aspectRatio: '4/5', 
                    width: '100%', 
                    borderRadius: '24px 24px 20px 20px', 
                    overflow: 'hidden', 
                    flexShrink: 0,
                    boxShadow: '0 12px 28px -4px rgba(0, 0, 0, 0.5), 0 6px 16px -2px rgba(0, 0, 0, 0.35)'
                  }}>
                    <Image src={t.img} alt={t.name} fill style={{ objectFit: 'cover' }} sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 33vw" />
                    <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.35)', color: '#FFFFFF', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', padding: '5px 12px', borderRadius: 20, zIndex: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.25)' }}>{t.badge}</div>
                    <div aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '30%', background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, transparent 100%)', pointerEvents: 'none', zIndex: 2 }} />

                    {/* Left side border: invisible at top half, starts fading in halfway down towards bottom corner */}
                    <div aria-hidden style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '6px', background: 'linear-gradient(180deg, transparent 0%, transparent 45%, rgba(68, 22, 125, 0.45) 70%, rgba(95, 25, 120, 0.85) 100%)', pointerEvents: 'none', zIndex: 2 }} />

                    {/* Right side border: invisible at top half, starts fading in halfway down towards bottom corner */}
                    <div aria-hidden style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '6px', background: 'linear-gradient(180deg, transparent 0%, transparent 45%, rgba(68, 22, 125, 0.45) 70%, rgba(95, 25, 120, 0.85) 100%)', pointerEvents: 'none', zIndex: 2 }} />
                  </div>
                  
                  {/* Card body with centered white typography */}
                  <div style={{ padding: '16px 14px 20px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%', boxSizing: 'border-box' }}>
                    <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', margin: '0 0 10px', letterSpacing: '-0.3px', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>{t.name}</h3>
                    
                    {/* Centered Price & Discount Row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 18, width: '100%', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', textDecoration: 'line-through', fontWeight: 500 }}>{t.mrp}</span>
                      <span style={{ fontSize: '0.625rem', color: '#FFFFFF', background: 'rgba(255, 255, 255, 0.25)', border: '1px solid rgba(255,255,255,0.35)', padding: '2px 6px', borderRadius: 6, fontWeight: 700, letterSpacing: '0.3px', backdropFilter: 'blur(6px)', boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.4)' }}>{t.discount}</span>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.4rem', color: '#FFFFFF', fontWeight: 800, lineHeight: 1.1, textShadow: '0 2px 4px rgba(0,0,0,0.25)' }}>{t.price}</span>
                    </div>

                    {/* Action Buttons Row with strictly contained minmax(0, 1fr) columns for mobile */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px', width: '100%', alignItems: 'stretch', boxSizing: 'border-box' }}>
                      <Link href={`/templates/${t.id}`} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 4px', height: '40px', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.2px', background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: 9999, color: '#FFFFFF', textDecoration: 'none', backdropFilter: 'blur(8px)', boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.4)', transition: 'all 0.2s ease', minWidth: 0, overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        View Demo
                      </Link>
                      <Link href="/contact-us" style={{ width: '100%', textDecoration: 'none', display: 'flex', minWidth: 0, overflow: 'hidden' }}>
                        <LiquidButton 
                          size="sm" 
                          style={{ width: '100%', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', color: '#3d0221', fontWeight: 800, letterSpacing: '0.3px', fontSize: '0.75rem', backdropFilter: 'blur(20px) saturate(180%)', background: 'rgba(255, 255, 255, 0.45)', border: '2px solid rgba(255, 255, 255, 0.85)', boxShadow: '0 16px 40px -6px rgba(0, 0, 0, 0.35)', minWidth: 0, overflow: 'hidden', whiteSpace: 'nowrap' }}
                        >
                          Buy Now
                        </LiquidButton>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Pagination with Next & Previous controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 14, padding: '0 20px 16px' }}>
            {/* Previous Button */}
            <button 
              onClick={() => {
                if (activeIndex > 0 && scrollRef.current) {
                  const targetScroll = scrollRef.current.offsetTop + ((activeIndex - 1) * 500) + 50;
                  window.scrollTo({ top: targetScroll, behavior: 'smooth' });
                }
              }}
              disabled={activeIndex === 0}
              style={{ 
                width: 38, 
                height: 38, 
                borderRadius: '50%', 
                border: '1px solid rgba(157, 23, 77, 0.4)', 
                background: '#ffffff', 
                color: '#9d174d', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                cursor: 'pointer', 
                opacity: activeIndex === 0 ? 0.35 : 1, 
                pointerEvents: activeIndex === 0 ? 'none' : 'auto',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}
              aria-label="Previous template"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            {/* Interactive Dots */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {templates.map((_, idx) => (
                <button 
                  key={idx} 
                  onClick={() => {
                    if (scrollRef.current) {
                      const targetScroll = scrollRef.current.offsetTop + (idx * 500) + 50;
                      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
                    }
                  }}
                  style={{ 
                    width: activeIndex === idx ? 24 : 8, 
                    height: 8, 
                    borderRadius: 4, 
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    background: activeIndex === idx ? '#9d174d' : 'rgba(157, 23, 77, 0.25)', 
                    transition: 'all 0.35s cubic-bezier(0.25, 1, 0.5, 1)' 
                  }} 
                  aria-label={`Go to template ${idx + 1}`}
                />
              ))}
            </div>

            {/* Next Button */}
            <button 
              onClick={() => {
                if (activeIndex < templates.length - 1 && scrollRef.current) {
                  const targetScroll = scrollRef.current.offsetTop + ((activeIndex + 1) * 500) + 50;
                  window.scrollTo({ top: targetScroll, behavior: 'smooth' });
                }
              }}
              disabled={activeIndex === templates.length - 1}
              style={{ 
                width: 38, 
                height: 38, 
                borderRadius: '50%', 
                border: '1px solid rgba(157, 23, 77, 0.4)', 
                background: '#ffffff', 
                color: '#9d174d', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                cursor: 'pointer', 
                opacity: activeIndex === templates.length - 1 ? 0.35 : 1, 
                pointerEvents: activeIndex === templates.length - 1 ? 'none' : 'auto',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}
              aria-label="Next template"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
        </div>
      </section>

      {/* ─────────────────── VENUE SECTION (PARALLAX BACKGROUND) ─────────────────── */}
      <section id="sf-venue" className="sf-sec" style={{ 
        position: 'relative', textAlign: 'center', overflow: 'hidden',
        backgroundImage: 'url(/uploads/bold_white_theme_map.jpg)',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
        {/* Luminous overlay for theme radiance and seamless edge blending */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.75)', zIndex: 1 }} />
        <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgb(242, 244, 248) 0%, transparent 15%, transparent 85%, rgb(242, 244, 248) 100%)', zIndex: 1 }} />
        <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgb(242, 244, 248) 0%, transparent 15%, transparent 1, rgb(242, 244, 248) 100%)', zIndex: 1 }} />

        {/* Content */}
        <div className="sf-container" style={{ position: 'relative', zIndex: 2, maxWidth: 720 }}>
          {/* Bouncing pin icon */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}>
            <div className="sf-pin-bounce" style={{ position: 'relative', width: 72, height: 72, borderRadius: '50%', background: '#fff', border: '2px solid #9d174d', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(157, 23, 77,0.55)', zIndex: 2 }}>
              <span style={{ fontSize: '2.125rem', lineHeight: 1 }}>📍</span>
              {/* Orbit ring */}
              <div className="sf-orbit" aria-hidden style={{ position: 'absolute', inset: -10, borderRadius: '50%', border: '1.5px dashed rgba(157, 23, 77,0.6)', pointerEvents: 'none' }} />
            </div>
            {/* Radar pulse shadow */}
            <div className="sf-radar" style={{ width: 32, height: 12, borderRadius: '50%', background: 'rgba(157, 23, 77,0.4)', marginTop: -6 }} />
          </div>

          <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '5px', color: 'rgba(157, 23, 77,0.85)', textTransform: 'uppercase', marginBottom: 16 }}>No More &quot;Kahan Pahuncha?&quot; Calls</p>

          <h2 className="sf-venue-h2" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, color: '#2e1065', margin: '0 0 18px', letterSpacing: '-0.5px', lineHeight: 1.0 }}>
            Guide your guests directly to the{' '}
            <span style={{ fontStyle: 'italic', color: '#9d174d' }}>
              Mandap.
            </span>
          </h2>

          <p style={{ fontSize: '1.125rem', lineHeight: 1.7, color: 'rgba(26,32,44,0.85)', fontWeight: 500, maxWidth: 540, margin: '0 auto 0' }}>
            &quot;Save up to 15+ hours of frustrating phone calls and navigation directions on your wedding day. Give your VIP guests live GPS tracking directly to the venue.&quot;
          </p>
        </div>
      </section>

      {/* ─────────────────── MOVING MARQUEE BANNER ─────────────────── */}
      <div style={{ background: 'linear-gradient(90deg, #2e1065, #581c87, #9d174d, #2e1065)', overflow: 'hidden', padding: '16px 0', borderTop: '1px solid rgba(255,255,255,0.15)', borderBottom: '1px solid rgba(255,255,255,0.15)', display: 'flex' }}>
        <div style={{ display: 'flex', width: 'max-content', animation: 'sfMarquee 25s linear infinite', color: '#FFFFFF', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
          {[...Array(2)].map((_, i) => (
            <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '32px', paddingRight: '32px' }}>
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
        </div>
      </div>

      {/* ─────────────────── PRE-WEDDING GALLERY (ORIGINKIT 3D SLIDESHOW) ─────────────────── */}
      <section id="sf-gallery" className="sf-sec-split-b" style={{ background: '#F2F4F8', overflow: 'hidden' }}>
        <div className="sf-container" style={{ marginBottom: '40px' }}>
          <p style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '5px', color: 'rgba(157, 23, 77,0.8)', textTransform: 'uppercase', marginBottom: 12 }}>Show off your Magic</p>
          <h2 className="sf-section-h2" style={{ textAlign: 'center', fontFamily: "'Playfair Display', serif", fontWeight: 300, color: '#2e1065', margin: 0, letterSpacing: '-0.5px' }}>
            Showcase your favorite <em style={{ color: '#9d174d' }}>couple portraits.</em>
          </h2>
        </div>
        
        {/* 3D Slideshow Component */}
        <div style={{ height: windowWidth < 768 ? '360px' : '500px', width: '100%', maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
           <Smooth3DSlideshow 
              autoplay={true} 
              showTitle={false}
              cardWidth={windowWidth < 768 ? windowWidth * 0.75 : 557}
              cardHeight={windowWidth < 768 ? windowWidth * 0.9 : 420}
              gap={windowWidth < 768 ? 4 : 7}
              slides={[
                { image: { src: '/uploads/prewedding_sunset.jpg' } },
                { image: { src: '/uploads/prewedding_candid.jpg' } },
                { image: { src: '/uploads/prewedding_palace.jpg' } }
              ]}
           />
        </div>
      </section>

      {/* ─────────────────── REVIEWS ─────────────────── */}
      <section id="sf-reviews" className="sf-sec-split-t" style={{ background: '#F2F4F8' }}>
        <div className="sf-container">
          <p style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '5px', color: 'rgba(157, 23, 77,0.8)', textTransform: 'uppercase', marginBottom: 12 }}>Happy Couples</p>
          <h2 className="sf-section-h2" style={{ textAlign: 'center', fontFamily: "'Playfair Display', serif", fontWeight: 300, color: '#2e1065', margin: '0 0 48px', letterSpacing: '-0.5px' }}>
            What other couples say about <em style={{ color: '#9d174d' }}>ShadiwalaCard.</em>
          </h2>

          {/* Carousel */}
          <div style={{ height: '450px', width: '100%', maxWidth: '800px', margin: '0 auto', position: 'relative', overflow: 'hidden' }}>
            <KlarnaCarousel
              backgroundColor="transparent"
              quoteColor="#1A202C"
              autoplay={true}
              autoplayInterval={4000}
              imageWidth={windowWidth < 768 ? windowWidth * 0.9 : 600}
              imageHeight={280}
              labelColor="#9d174d"
              labelFont={{ fontFamily: "'Playfair Display', serif", fontSize: '1.375rem', fontStyle: 'italic', fontWeight: 400 } as any}
              items={reviews.map((r, i) => ({
                label: r.name,
                quote: r.quote,
                buttonImage: { 
                  src: i === 0 ? '/uploads/avatar_priya.jpg' : 
                       i === 1 ? '/uploads/avatar_rohan.jpg' : 
                       '/uploads/avatar_kavitha.jpg' 
                }
              }))}
            />
          </div>
        </div>
      </section>

      {/* ─────────────────── FINAL CONVERSION (CLIMAX CTA) SECTION ─────────────────── */}
      <section style={{ background: '#F2F4F8', padding: '60px 20px 120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="sf-container" style={{ maxWidth: 960 }}>
          <div style={{
            position: 'relative',
            background: 'linear-gradient(135deg, rgba(46, 16, 101, 0.92) 0%, rgba(88, 28, 135, 0.88) 50%, rgba(157, 23, 77, 0.92) 100%)',
            backdropFilter: 'blur(32px) saturate(180%)',
            WebkitBackdropFilter: 'blur(32px) saturate(180%)',
            borderRadius: 32,
            padding: '64px 28px',
            textAlign: 'center',
            boxShadow: '0 24px 64px -12px rgba(46, 16, 101, 0.35), 0 12px 32px -8px rgba(157, 23, 77, 0.25)',
            overflow: 'hidden',
            border: '1.5px solid rgba(255, 255, 255, 0.3)'
          }}>
            {/* Ambient inner sheen */}
            <div aria-hidden style={{ position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%', background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 }} />

            <div style={{ position: 'relative', zIndex: 2 }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', fontWeight: 600, color: '#FFFFFF', margin: '0 auto 20px', lineHeight: 1.15, maxWidth: 720, textShadow: '0 2px 10px rgba(0,0,0,0.25)' }}>
                Ready to give your Shadi the royal invite it deserves?
              </h2>

              <p style={{ fontSize: '1.15rem', color: 'rgba(255, 255, 255, 0.92)', maxWidth: 620, margin: '0 auto 42px', lineHeight: 1.6, fontWeight: 400 }}>
                Join thousands of smart couples. Get your personalized, interactive web invitation live with zero hassle.
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                <LiquidButton
                  style={{ width: 'auto', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px', height: '52px', color: '#3d0221', fontWeight: 800, letterSpacing: '0.3px', fontSize: '1rem', backdropFilter: 'blur(20px) saturate(180%)', background: 'rgba(255, 255, 255, 0.45)', border: '2px solid rgba(255, 255, 255, 0.85)', boxShadow: '0 16px 40px -6px rgba(0, 0, 0, 0.35)' }}
                  onClick={() => {
                    const el = document.getElementById('sf-collection');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Get web invite now
                </LiquidButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── FOOTER ─────────────────── */}
      <footer style={{ borderTop: '1px solid rgba(26,32,44,0.15)', padding: '40px 0', background: '#F2F4F8' }}>
        <div className="sf-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.375rem', color: '#2e1065' }}>
            Shadiwala<span style={{ color: '#9d174d' }}>Card</span>
          </span>
          <div style={{ display: 'flex', gap: 24, fontSize: '0.688rem', color: 'rgba(26,32,44,0.75)', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href="#sf-collection" style={{ color: 'rgba(26,32,44,0.75)' }}>Our web invites</Link>
            <Link href="#sf-reviews"    style={{ color: 'rgba(26,32,44,0.75)' }}>Reviews</Link>
            <Link href="/contact-us"    style={{ color: 'rgba(26,32,44,0.75)' }}>Contact Us</Link>
          </div>
          <span style={{ fontSize: '0.688rem', color: 'rgba(26,32,44,0.3)' }}>© 2026 shadiwalacard.com — Made in India 🇮🇳</span>
        </div>
      </footer>

    </main>
  );
}
