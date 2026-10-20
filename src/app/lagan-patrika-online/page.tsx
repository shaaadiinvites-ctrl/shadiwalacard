import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, PhoneCall, Sparkles, Clock, Share2, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Online Lagan Patrika Maker with 1-Tap Google Maps | ShadiwalaCard',
  description: 'Create traditional digital Lagan Patrika & shadi cards online. Features Devanagari Hindi font support, auspicious Shubh Muhurat timings, 1-tap Google Maps venue navigation & WhatsApp delivery for ₹799.',
  keywords: [
    'online lagan patrika maker',
    'digital lagan patrika',
    'lagan patrika online',
    'shadi card online hindi',
    'digital wedding card with google maps',
    'online lagan patrika format',
    'shubh vivah lagan patrika maker',
    'whatsapp lagan patrika'
  ],
  alternates: {
    canonical: 'https://shadiwalacard.com/lagan-patrika-online',
  },
  openGraph: {
    title: 'Online Lagan Patrika Maker with 1-Tap Google Maps | ShadiwalaCard',
    description: 'Create traditional digital Lagan Patrika with Devanagari Hindi fonts, Shubh Muhurat timings & 1-tap Google Maps for ₹799.',
    url: 'https://shadiwalacard.com/lagan-patrika-online',
    siteName: 'ShadiwalaCard',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Online Lagan Patrika Maker' }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Product',
      name: 'Digital Lagan Patrika & Traditional Shadi Card Maker',
      image: 'https://shadiwalacard.com/project3-assets/cover.jpg',
      description: 'Traditional Indian Lagan Patrika with Devanagari Hindi typography, Shubh Muhurat schedule, and modern 1-tap Google Maps navigation.',
      brand: { '@type': 'Brand', name: 'ShadiwalaCard' },
      offers: {
        '@type': 'Offer',
        price: '799',
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
        url: 'https://shadiwalacard.com/cart?template=grand-palace',
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://shadiwalacard.com' },
        { '@type': 'ListItem', position: 2, name: 'Online Lagan Patrika Maker', item: 'https://shadiwalacard.com/lagan-patrika-online' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Can I write family names and shlokas in Hindi/Devanagari?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! ShadiwalaCard fully supports Hindi, Sanskrit shlokas, and English. You can include Ganesh Vandana, Mangalam Bhagwan Vishnu, and traditional Nanihal/Dadihal family details.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does the Google Maps venue pin work for rural or resort venues?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'When you create the invite, you pin your exact venue on Google Maps. Guests simply tap "Navigate" on their smartphone and turn-by-turn navigation opens directly to your venue entrance gate.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I send the Lagan Patrika to relatives on WhatsApp?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Instantly after ordering, you receive a custom wedding link. You can share this link across WhatsApp groups or direct messages with rich couple photos and music preview.',
          },
        },
      ],
    },
  ],
};

export default function LaganPatrikaPage() {
  return (
    <main style={{ background: '#050505', color: '#FFFFFF', fontFamily: "var(--font-body), 'Inter', sans-serif", minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* HEADER */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(5, 5, 5, 0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '16px 24px'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <img src="/uploads/logo.png" alt="ShadiwalaCard Logo" style={{ height: '30px', width: 'auto' }} />
            <span style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontSize: '1.25rem', color: '#FFFFFF', fontWeight: 600 }}>
              ShadiwalaCard
            </span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/demo/grand-palace" style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}>
              Live Demo
            </Link>
            <Link
              href="/cart?template=grand-palace"
              style={{
                background: 'linear-gradient(135deg, #d4af37 0%, #aa771c 100%)',
                color: '#050505',
                padding: '10px 22px',
                borderRadius: '999px',
                fontWeight: 600,
                fontSize: '0.875rem',
                textDecoration: 'none',
              }}
            >
              Create for ₹799
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section style={{ padding: '80px 20px 60px', textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(212, 175, 55, 0.12)', border: '1px solid rgba(212, 175, 55, 0.3)',
          padding: '8px 18px', borderRadius: '999px', fontSize: '0.85rem', color: '#e5c058', marginBottom: '24px'
        }}>
          <Sparkles size={16} />
          <span>Traditional Vedic Elegance Meets Modern Technology</span>
        </div>

        <h1 style={{
          fontFamily: "var(--font-display), 'Montserrat', sans-serif",
          fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
          fontWeight: 700,
          lineHeight: 1.15,
          color: '#FFFFFF',
          marginBottom: '20px'
        }}>
          Online Lagan Patrika Maker<br />
          <span style={{ background: 'linear-gradient(135deg, #F3D179 0%, #D4AF37 50%, #AA771C 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            With 1-Tap Google Maps Navigation
          </span>
        </h1>

        <p style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, maxWidth: 720, margin: '0 auto 36px' }}>
          Honor your sacred traditions with full Hindi and Sanskrit typography, auspicious Shubh Muhurat ceremony schedules, and zero-lost-guest Google Maps venue pins.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/cart?template=grand-palace"
            style={{
              background: 'linear-gradient(135deg, #d4af37 0%, #aa771c 100%)',
              color: '#050505',
              padding: '16px 36px',
              borderRadius: '999px',
              fontWeight: 700,
              fontSize: '1rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 10px 30px rgba(212, 175, 55, 0.25)'
            }}
          >
            <span>Create Lagan Patrika (₹799)</span>
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/demo/grand-palace"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.18)',
              color: '#FFFFFF',
              padding: '16px 32px',
              borderRadius: '999px',
              fontWeight: 600,
              fontSize: '1rem',
              textDecoration: 'none',
            }}
          >
            View Live Sample
          </Link>
        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 20px 80px' }}>
        <h2 style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontSize: '2rem', textAlign: 'center', marginBottom: '48px', color: '#FFFFFF' }}>
          Everything Required for a Traditional & Modern Shadi
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '32px' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(212,175,55,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e5c058', marginBottom: '20px' }}>
              <Sparkles size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '12px', color: '#FFFFFF' }}>Devanagari & Hindi Font Support</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
              Seamlessly write in Hindi or English. Perfect for Vedic shlokas, manglik dosh nivaran timings, and traditional grandfather, father, and family listings.
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '32px' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(225,29,72,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f43f5e', marginBottom: '20px' }}>
              <MapPin size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '12px', color: '#FFFFFF' }}>1-Tap Google Maps Venue Pin</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
              Eliminate 100% of guest confusion. Your guests tap once and Google Maps guides them straight to your lawn, farmhouse, or banquet hall parking gate.
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '32px' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa', marginBottom: '20px' }}>
              <Clock size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '12px', color: '#FFFFFF' }}>Multi-Ceremony Vedic Timeline</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
              Dedicated cards for Haldi, Mehndi, Lagan Patrika Lekhan, Sangeet, Barat Prasthan, and Varmala with live countdown timers.
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '32px' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4ade80', marginBottom: '20px' }}>
              <Share2 size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '12px', color: '#FFFFFF' }}>Instant WhatsApp Delivery</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
              Share your beautiful Lagan Patrika across WhatsApp family groups. Includes automatic couple portrait preview and background shehnai/sitar music.
            </p>
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section style={{ maxWidth: 960, margin: '0 auto', padding: '0 20px 80px' }}>
        <h2 style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontSize: '2rem', textAlign: 'center', marginBottom: '36px', color: '#FFFFFF' }}>
          Paper Patrika vs. ShadiwalaCard Digital Patrika
        </h2>

        <div style={{ overflowX: 'auto', borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 600 }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th style={{ padding: '18px 24px', color: 'rgba(255,255,255,0.7)' }}>Feature</th>
                <th style={{ padding: '18px 24px', color: '#f87171' }}>Printed Paper Patrika</th>
                <th style={{ padding: '18px 24px', color: '#e5c058' }}>ShadiwalaCard Digital Patrika</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <td style={{ padding: '16px 24px', fontWeight: 500 }}>Total Cost</td>
                <td style={{ padding: '16px 24px', color: 'rgba(255,255,255,0.6)' }}>₹8,000 – ₹25,000+</td>
                <td style={{ padding: '16px 24px', color: '#4ade80', fontWeight: 600 }}>Flat ₹799 (One-time)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <td style={{ padding: '16px 24px', fontWeight: 500 }}>Delivery Time</td>
                <td style={{ padding: '16px 24px', color: 'rgba(255,255,255,0.6)' }}>7–14 days printing & courier</td>
                <td style={{ padding: '16px 24px', color: '#4ade80', fontWeight: 600 }}>Instant (Under 3 minutes)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <td style={{ padding: '16px 24px', fontWeight: 500 }}>Venue Location Directions</td>
                <td style={{ padding: '16px 24px', color: 'rgba(255,255,255,0.6)' }}>Tiny printed map (Guests get lost)</td>
                <td style={{ padding: '16px 24px', color: '#4ade80', fontWeight: 600 }}>1-Tap Live Google Maps Navigation</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <td style={{ padding: '16px 24px', fontWeight: 500 }}>Editing after Sending</td>
                <td style={{ padding: '16px 24px', color: 'rgba(255,255,255,0.6)' }}>Impossible (Requires re-printing)</td>
                <td style={{ padding: '16px 24px', color: '#4ade80', fontWeight: 600 }}>Free instant live updates anytime</td>
              </tr>
              <tr>
                <td style={{ padding: '16px 24px', fontWeight: 500 }}>Guest Capacity</td>
                <td style={{ padding: '16px 24px', color: 'rgba(255,255,255,0.6)' }}>Limited by printed count</td>
                <td style={{ padding: '16px 24px', color: '#4ade80', fontWeight: 600 }}>Unlimited WhatsApp shares</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section style={{ padding: '60px 20px 100px', textAlign: 'center', background: 'radial-gradient(circle at center, rgba(212,175,55,0.15) 0%, transparent 70%)' }}>
        <h2 style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontSize: '2.4rem', fontWeight: 700, marginBottom: '16px' }}>
          Ready to Create Your Digital Lagan Patrika?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', marginBottom: '32px' }}>
          Backed by our 100% money-back guarantee. Zero risk.
        </p>
        <Link
          href="/cart?template=grand-palace"
          style={{
            background: 'linear-gradient(135deg, #d4af37 0%, #aa771c 100%)',
            color: '#050505',
            padding: '18px 42px',
            borderRadius: '999px',
            fontWeight: 700,
            fontSize: '1.1rem',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 12px 35px rgba(212, 175, 55, 0.3)'
          }}
        >
          <span>Get Started for ₹799</span>
          <ArrowRight size={20} />
        </Link>
      </section>
    </main>
  );
}
