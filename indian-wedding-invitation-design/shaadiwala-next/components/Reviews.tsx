const reviews = [
  { name: 'Priya & Arjun',     city: 'New Delhi',  date: 'Dec 2024', quote: 'Our guests were blown away. Everyone kept asking which designer made the card — we said it was a website and no one believed us!' },
  { name: 'Ananya & Rohan',    city: 'Mumbai',     date: 'Nov 2024', quote: 'The 1-tap Google Maps feature saved us so many calls. Our baaraat found the venue without a single hiccup.' },
  { name: 'Kavitha & Vikram',  city: 'Bengaluru',  date: 'Jan 2025', quote: 'The countdown timer made our wedding feel like a Bollywood premiere. Absolutely premium experience from start to finish.' },
];

export default function Reviews() {
  return (
    <>
      {/* Ornamental divider */}
      <div className="section-divider" aria-hidden>
        <span className="section-divider-dot">✦</span>
      </div>

      <section id="reviews" style={{ background: 'transparent', position: 'relative', overflow: 'hidden' }}>
        {/* Ambient glow */}
        <div aria-hidden style={{ position: 'absolute', top: '40%', left: '10%', width: 700, height: 500, background: 'radial-gradient(ellipse,rgba(20,60,120,0.12) 0%,transparent 70%)', pointerEvents: 'none', borderRadius: '50%' }} />

        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '80px 32px', position: 'relative' }}>
          <p style={{ textAlign: 'center', fontSize: 10, letterSpacing: '6px', color: '#e8a85a', textTransform: 'uppercase', margin: '0 0 16px', fontWeight: 700 }}>Loved By Real Couples</p>
          <h2 style={{ textAlign: 'center', fontFamily: "'Cormorant Garamond',serif", fontWeight: 400, fontSize: 46, lineHeight: 1.1, margin: '0 0 52px', color: '#eef0f8' }}>
            Blessings, in their <span className="shiny-foil-text">own words.</span>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {reviews.map(r => (
              <div key={r.name} style={{ background: 'linear-gradient(160deg,#0c1422 0%,#080d18 100%)', border: '1px solid rgba(205,127,50,.2)', borderRadius: 18, padding: '32px 30px', display: 'flex', flexDirection: 'column', gap: 18, position: 'relative', overflow: 'hidden' }}>
                {/* Inner top highlight */}
                <div aria-hidden style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 1, background: 'linear-gradient(90deg,transparent,rgba(205,127,50,0.35),transparent)' }} />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span role="img" aria-label="Rated 5 out of 5" style={{ color: '#e8a85a', fontSize: 15, letterSpacing: 2 }}>★★★★★</span>
                  <span style={{ fontSize: 11, color: '#7888a8' }}>Verified · {r.date}</span>
                </div>
                <p style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: 'italic', fontSize: 19, lineHeight: 1.55, color: '#eef0f8', margin: 0, flex: 1 }}>
                  "{r.quote}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#1a3d60,#cd7f32)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                    {r.name[0]}
                  </div>
                  <div>
                    <p style={{ fontSize: 14, color: '#eef0f8', margin: 0, fontWeight: 500 }}>{r.name}</p>
                    <p style={{ fontSize: 12, color: '#7888a8', margin: '2px 0 0' }}>{r.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
