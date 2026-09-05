'use client';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <main style={{ background: '#050505', color: '#FFFFFF', fontFamily: "var(--font-body), 'Inter', sans-serif", minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* HEADER */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(5, 5, 5, 0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '16px 24px'
      }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/v2" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <img src="/uploads/logo.png" alt="ShadiwalaCard Logo" style={{ height: '28px', width: 'auto' }} />
            <span style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontSize: '1.2rem', color: '#FFFFFF', fontWeight: 600 }}>
              ShadiwalaCard
            </span>
          </Link>
          <Link href="/v2" style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: '999px', transition: 'all 0.2s' }}>
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* CONTENT */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '60px 24px 100px', width: '100%' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#e11d48', display: 'block', marginBottom: '12px' }}>
          SERVICE AGREEMENT
        </span>
        <h1 style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, letterSpacing: '-0.5px', lineHeight: 1.15, marginBottom: '16px' }}>
          Terms of Service
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', marginBottom: '40px' }}>
          Last updated: September 2026
        </p>

        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '24px',
          padding: 'clamp(24px, 5vw, 48px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
          lineHeight: 1.7,
          color: 'rgba(255, 255, 255, 0.85)',
          fontSize: '0.95rem'
        }}>
          <section>
            <h2 style={{ fontSize: '1.25rem', color: '#FFFFFF', fontWeight: 600, marginBottom: '12px' }}>1. Agreement to Terms</h2>
            <p>
              By purchasing or using ShadiwalaCard (<strong style={{ color: '#FFFFFF' }}>shadiwalacard.com</strong>), you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: '#FFFFFF', fontWeight: 600, marginBottom: '12px' }}>2. Digital Invitation Service</h2>
            <p>
              ShadiwalaCard provides web-based digital wedding invitation pages. Upon payment of the one-time ₹799 fee, the customer receives an ad-free, unbranded digital invitation web page with 6 months of cloud hosting, unlimited guest views, and 1-tap Google Maps integration.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: '#FFFFFF', fontWeight: 600, marginBottom: '12px' }}>3. Content Ownership & Rights</h2>
            <p>
              You retain 100% ownership of all images, text, and details uploaded to your invitation. You confirm that you hold the legal right or permission to use any photographs uploaded. ShadiwalaCard reserves the right to remove any content violating local laws or containing inappropriate material.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: '#FFFFFF', fontWeight: 600, marginBottom: '12px' }}>4. Edits & Revisions</h2>
            <p>
              We provide free revisions for event dates, typos, times, and venue map link updates. Edits can be performed directly through the self-serve editor or by contacting customer support.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: '#FFFFFF', fontWeight: 600, marginBottom: '12px' }}>5. Contact Information</h2>
            <p>
              Questions regarding these Terms should be directed to <a href="mailto:support@shadiwalacard.com" style={{ color: '#ffbc4b', textDecoration: 'underline' }}>support@shadiwalacard.com</a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
