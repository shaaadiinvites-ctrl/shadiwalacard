export default function Marquee() {
  const items = ['Handcrafted', 'Eternal Love', 'Timeless', 'Bespoke', 'Elegance'];
  const repeated = [...items, ...items]; // duplicate for seamless scroll

  return (
    <section
      aria-hidden
      style={{
        background: 'linear-gradient(90deg,#04060e,#080d18,#060a14,#080d18,#04060e)',
        color: '#eef0f8',
        borderTop: '1px solid rgba(205,127,50,.3)',
        borderBottom: '1px solid rgba(205,127,50,.3)',
        overflow: 'hidden',
        width: '100%',
        padding: '30px 0',
        marginTop: 50,
        boxShadow: '0 0 50px rgba(20,60,110,0.15)',
      }}
    >
      <div
        style={{
          display: 'flex',
          width: 'max-content',
          animation: 'marq 28s linear infinite',
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 34,
          letterSpacing: 1,
        }}
      >
        {[0, 1].map(copy => (
          <span key={copy} style={{ display: 'flex', alignItems: 'center' }}>
            {items.map(item => (
              <span key={item} style={{ display: 'inline-flex', alignItems: 'center' }}>
                <span style={{ padding: '0 30px' }}>{item}</span>
                <span style={{ color: '#e8a85a' }}>✦</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </section>
  );
}
