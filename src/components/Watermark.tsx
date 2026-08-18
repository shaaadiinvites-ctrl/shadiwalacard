"use client";

export default function Watermark() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden select-none flex items-center justify-center"
      aria-hidden="true"
    >
      <div 
        className="absolute inset-[-100%]"
        style={{
          // Use SVG background for an ultra-light repeating watermark text that is very hard to remove 
          // without ruining the underlying graphics.
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='350' height='350'%3E%3Ctext x='50%25' y='50%25' font-size='24' fill='rgba(255,255,255,0.25)' font-family='system-ui, sans-serif' font-weight='700' letter-spacing='2px' text-anchor='middle' dominant-baseline='middle' transform='rotate(-30, 175, 175)'%3Eshadiwalacard.com%3C/text%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center',
          backgroundSize: '350px 350px',
        }}
      />
    </div>
  );
}
