'use client';
import Link from 'next/link';

export default function RefundPolicyPage() {
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
          PURCHASE GUARANTEE
        </span>
        <h1 style={{ fontFamily: "var(--font-display), 'Montserrat', sans-serif", fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, letterSpacing: '-0.5px', lineHeight: 1.15, marginBottom: '16px' }}>
          Refund & Cancellation Policy
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
            <h2 style={{ fontSize: '1.25rem', color: '#FFFFFF', fontWeight: 600, marginBottom: '12px' }}>1. Digital Nature of Service</h2>
            <p>
              ShadiwalaCard creates custom, instantly provisioned digital wedding invitations. Because web hosting and server resources are provisioned upon payment, conventional physical returns do not apply.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: '#FFFFFF', fontWeight: 600, marginBottom: '12px' }}>2. 100% Satisfaction & Unlimited Edits</h2>
            <p>
              If your invitation has any spelling mistake, venue date change, wrong photo alignment, or technical malfunction, we offer <strong style={{ color: '#FFFFFF' }}>unlimited free corrections</strong> until you are 100% pleased with your invite.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: '#FFFFFF', fontWeight: 600, marginBottom: '12px' }}>3. Eligible Refund Scenarios</h2>
            <p style={{ marginBottom: '8px' }}>You are eligible for a full 100% refund in the following cases:</p>
            <ul style={{ paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><strong>Duplicate Transaction:</strong> If you were charged twice for the same order due to a payment gateway timeout.</li>
              <li><strong>Technical Non-Delivery:</strong> If the platform fails to generate your live invite link within 24 hours of successful payment.</li>
              <li><strong>Cancellation Prior to Generation:</strong> If you request a cancellation before your invitation link is created.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', color: '#FFFFFF', fontWeight: 600, marginBottom: '12px' }}>4. How to Request a Refund</h2>
            <p>
              To claim a refund, email <a href="mailto:support@shadiwalacard.com" style={{ color: '#ffbc4b', textDecoration: 'underline' }}>support@shadiwalacard.com</a> or message us via WhatsApp with your Order ID and payment receipt. Approved refunds will be processed back to the original payment method within 5–7 business days.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
