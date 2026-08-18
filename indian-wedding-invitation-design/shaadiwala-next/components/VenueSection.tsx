import Image from 'next/image';

export default function VenueSection() {
  return (
    <section
      id="venue"
      style={{
        position: 'relative',
        backgroundImage: "url('/uploads/google_maps_parallax_bg.jpg')",
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        padding: '110px 20px',
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Deep Space dark overlay */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'rgba(4,5,15,0.88)', backdropFilter: 'blur(4px)' }} />

      <div style={{ maxWidth: 960, margin: '0 auto', position: 'relative', zIndex: 2, color: '#eef0f8' }}>
        {/* Bouncing pin */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#0a1020', border: '2px solid #cd7f32', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(205,127,50,.6)', animation: 'pinBounce 2s infinite ease-in-out' }}>
            <span style={{ fontSize: 38, lineHeight: 1 }}>📍</span>
          </div>
          <div style={{ width: 36, height: 14, borderRadius: '50%', background: 'rgba(205,127,50,.4)', marginTop: -6, animation: 'radarPulse 2s infinite ease-out' }} />
        </div>

        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 400, fontSize: 56, lineHeight: 1.06, margin: '0 0 20px', color: '#eef0f8', letterSpacing: '-0.5px' }}>
          Get your guest to <span className="shiny-foil-text">exact venue location</span>
        </h2>
        <p style={{ fontSize: 16.5, lineHeight: 1.6, color: '#8899b8', maxWidth: 540, margin: '0 auto 32px', fontWeight: 400 }}>
          Embedded 1-tap Google Maps pin directly in your invitation card. Zero phone calls, zero confusion.
        </p>
      </div>
    </section>
  );
}
