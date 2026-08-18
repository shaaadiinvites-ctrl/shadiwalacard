const events = [
  { icon: '🪔', name: 'Pooja',      hi: 'शुभारम्भ' },
  { icon: '💛', name: 'Haldi',      hi: 'हल्दी' },
  { icon: '💃', name: 'Sangeet',    hi: 'संगीत' },
  { icon: '💍', name: 'Wedding',    hi: 'विवाह' },
  { icon: '🌹', name: 'Reception',  hi: 'स्वागत' },
];

export default function Timeline() {
  return (
    <section style={{ position: 'relative', background: 'transparent' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '64px 32px 40px', textAlign: 'center' }}>
        <p style={{ fontSize: 11, letterSpacing: '4px', color: '#e8a85a', textTransform: 'uppercase', margin: '0 0 16px' }}>One Invite, Every Function</p>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 400, fontSize: 42, margin: '0 0 32px', color: '#eef0f8' }}>
          From the first shagun to the last vidaai.
        </h2>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: 'italic', fontSize: 13, color: '#e8a85a', margin: '-16px 0 24px', fontWeight: 600 }}>
          (👈 Swipe to view all 5 wedding functions 👉)
        </p>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, position: 'relative', flexWrap: 'wrap' }}>
          {/* Connecting line */}
          <div aria-hidden style={{ position: 'absolute', top: 26, left: '8%', right: '8%', height: 1, background: 'linear-gradient(90deg,transparent,#cd7f32,transparent)' }} />

          {events.map(e => (
            <div key={e.name} style={{ flex: 1, minWidth: 120, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <div className="orbital-ring-wrap">
                <div style={{ width: 54, height: 54, borderRadius: '50%', background: '#0a1020', border: '1.5px solid #cd7f32', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#e8a85a' }}>
                  {e.icon}
                </div>
              </div>
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 21, color: '#eef0f8' }}>{e.name}</span>
              <span className="italic-serif" style={{ fontSize: 14, color: '#e8a85a' }}>{e.hi}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
