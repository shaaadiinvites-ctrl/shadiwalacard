import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Plane, Hotel, CalendarDays, Music, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Destination Wedding Digital Invitations & Resort Guide | ShadiwalaCard',
  description: 'Design luxury digital invitations for destination weddings in Udaipur, Jaipur, Goa & international resorts. Includes 1-tap Google Maps, multi-day itinerary, dress codes & hotel details for ₹799.',
  keywords: [
    'destination wedding digital invite',
    'destination wedding website india',
    'royal palace wedding invitation',
    'udaipur wedding digital card',
    'jaipur destination wedding invite',
    'goa beach wedding e-card',
    'multi-day wedding itinerary website',
    'wedding card with hotel and maps'
  ],
  alternates: {
    canonical: 'https://shadiwalacard.com/destination-wedding-card',
  },
  openGraph: {
    title: 'Destination Wedding Digital Invitations & Resort Guide | ShadiwalaCard',
    description: 'Design luxury digital invitations for destination weddings with 1-tap Google Maps, multi-day itineraries & dress codes for ₹799.',
    url: 'https://shadiwalacard.com/destination-wedding-card',
    siteName: 'ShadiwalaCard',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Destination Wedding Digital Invitations' }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Product',
      name: 'Destination Wedding Digital Invitation & Multi-Day Itinerary',
      image: 'https://shadiwalacard.com/project3-assets/cover.jpg',
      description: 'Luxury interactive wedding website tailored for destination weddings with resort maps, multi-day events, and dress codes.',
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
        { '@type': 'ListItem', position: 2, name: 'Destination Wedding Digital Card', item: 'https://shadiwalacard.com/destination-wedding-card' },
      ],
    },
  ],
};

export default function DestinationWeddingPage() {
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
          <Hotel size={16} />
          <span>Engineered for Destination & Palace Weddings</span>
        </div>

        <h1 style={{
          fontFamily: "var(--font-display), 'Montserrat', sans-serif",
          fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
          fontWeight: 700,
          lineHeight: 1.15,
          color: '#FFFFFF',
          marginBottom: '20px'
        }}>
          Luxury Destination Wedding<br />
          <span style={{ background: 'linear-gradient(135deg, #F3D179 0%, #D4AF37 50%, #AA771C 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Invitations & Multi-Day Guide
          </span>
        </h1>

        <p style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, maxWidth: 720, margin: '0 auto 36px' }}>
          Flying guests to Udaipur, Jaipur, Goa, or abroad? Give them an ultra-luxurious mobile guide with 1-tap resort navigation, multi-day timelines, dress codes, and flight details.
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
            <span>Create Destination Invite (₹799)</span>
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
            View Live Palace Demo
          </Link>
        </div>
      </section>

      {/* DESTINATION FEATURES */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 20px 80px' }}>
        <h2 style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontSize: '2rem', textAlign: 'center', marginBottom: '48px', color: '#FFFFFF' }}>
          Built Specifically for Multi-Day Wedding Celebrations
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '32px' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(212,175,55,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e5c058', marginBottom: '20px' }}>
              <CalendarDays size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '12px', color: '#FFFFFF' }}>Multi-Day Event Schedules</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
              Organize 3–4 days of festivities: Welcome Dinner, Pool Party, Sangeet Night, Shobhayatra, and Reception. Each with custom date, time, and dress code tags.
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '32px' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(225,29,72,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f43f5e', marginBottom: '20px' }}>
              <MapPin size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '12px', color: '#FFFFFF' }}>Exact Resort & Lawn Coordinates</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
              Huge resorts can be confusing. Provide precise pins for the main palace gate, lakefront lawn, or poolside cabana so out-of-town guests arrive smoothly.
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '32px' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa', marginBottom: '20px' }}>
              <Plane size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '12px', color: '#FFFFFF' }}>Travel, Airport & Stay Details</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
              Share airport shuttle pickup timings, nearest railway junctions, hotel check-in protocols, and coordinator contact numbers in one organized link.
            </p>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section style={{ padding: '60px 20px 100px', textAlign: 'center', background: 'radial-gradient(circle at center, rgba(212,175,55,0.15) 0%, transparent 70%)' }}>
        <h2 style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontSize: '2.4rem', fontWeight: 700, marginBottom: '16px' }}>
          Create Your Destination Wedding Invite Today
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', marginBottom: '32px' }}>
          Flat ₹799. Instant setup. Unlimited guests on WhatsApp.
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
