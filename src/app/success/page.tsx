import Link from "next/link";
import { LiquidButton } from "@/components/ui/liquid-glass-button";
import ClientTracker from "@/components/ClientTracker";
import ConfettiEffect from "@/components/ConfettiEffect";

export const metadata = {
  title: "Payment Successful | ShadiwalaCard",
  description: "Your payment was successful. Start customizing your ShadiwalaCard.",
};

interface Props {
  searchParams: Promise<{ po?: string; template?: string }>;
}

export default async function SuccessPage({ searchParams }: Props) {
  const { po, template } = await searchParams;
  const templateSlug = template || "royal-heritage";

  const imageMap: Record<string, string> = {
    'royal-heritage': '/uploads/couple_card_1.jpg',
    'modern-minimal': '/uploads/couple_card_2.jpg',
    'floral-romance': '/uploads/hero-bg-custom.png',
  };
  const templateImage = imageMap[templateSlug] || imageMap['royal-heritage'];

  if (!po) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F2F4F8] p-6 font-sans">
        <div className="bg-white rounded-3xl border border-[#2e1065]/10 shadow-xl p-8 text-center max-w-md w-full space-y-5">
          <div className="text-5xl">⚠️</div>
          <h2 className="text-2xl font-bold text-[#2e1065]" style={{ fontFamily: "'Playfair Display', serif" }}>Order Not Found</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            We couldn't verify your order. Please check your email for your payment receipt and setup link.
          </p>
          <Link
            href="/"
            className="inline-block w-full px-6 py-3 rounded-full bg-[#2e1065] hover:bg-[#3b0764] text-white text-sm font-bold shadow-md transition duration-200"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6 font-sans">
      <ClientTracker eventName="payment_success" properties={{ template_id: templateSlug, payment_order_id: po }} />
      <ConfettiEffect />
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#F2F4F8', zIndex: -2 }} />
      
      <style>{`
        @keyframes sfFadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .sf-fade-1 { animation: sfFadeUp 0.7s 0.0s ease both; }
        .sf-fade-2 { animation: sfFadeUp 0.7s 0.15s ease both; }
      `}</style>

      {/* ── Payment Successful Message (Outside the Card) ── */}
      <div className="text-center mb-8 sf-fade-1">
        <div className="text-6xl mb-3">🎉</div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2e1065]" style={{ fontFamily: "'Playfair Display', serif", marginBottom: "8px" }}>
          Payment Successful!
        </h1>
        <p className="text-[#1A202C] text-sm sm:text-base font-medium max-w-sm mx-auto px-4">
          Your beautiful template has been unlocked
        </p>
      </div>

      {/* ── Template-Style Action Card ── */}
      <div className="sf-fade-2" style={{ 
        width: '100%', 
        maxWidth: 320, 
        margin: '0 auto',
        background: '#ffffff', 
        borderRadius: 24, 
        border: '1px solid rgba(26, 32, 44, 0.1)',
        padding: 0,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', 
        display: 'flex', 
        flexDirection: 'column',
      }}>
        {/* Image Area */}
        <div style={{ position: 'relative', aspectRatio: '4/5', width: '100%', borderRadius: '24px 24px 20px 20px', overflow: 'hidden', flexShrink: 0, boxShadow: '0 12px 28px -4px rgba(0, 0, 0, 0.5), 0 6px 16px -2px rgba(0, 0, 0, 0.35)' }}>
          <img src={templateImage} alt="Template Selection" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '30%', background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, transparent 100%)', pointerEvents: 'none', zIndex: 2 }} />
        </div>
        
        {/* Card Body */}
        <div style={{ padding: '24px 16px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%', boxSizing: 'border-box' }}>
          <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '1.15rem', fontWeight: 700, color: '#2e1065', margin: '0 0 12px', letterSpacing: '-0.3px' }}>
            Customization Dashboard
          </h3>
          
          <p style={{ fontSize: '0.8rem', color: '#1A202C', lineHeight: 1.6, margin: '0 0 24px', fontWeight: 500, padding: '0 4px' }}>
            Ready to design your digital invite? If you have your photos and details ready, let's begin!
          </p>
          
          {/* Action Buttons Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px', width: '100%', alignItems: 'stretch', boxSizing: 'border-box' }}>
            <Link 
              href={`/`} 
              className="w-full flex items-center justify-center text-center px-1 h-10 text-[0.75rem] font-medium tracking-wide bg-transparent border border-gray-200 rounded-xl text-gray-900 no-underline hover:bg-gray-100 transition-colors whitespace-nowrap overflow-hidden"
            >
              I'll do it later
            </Link>
            
            <Link 
              href={`/form?po=${po}&template=${template || "royal-heritage"}`} 
              className="w-full no-underline flex min-w-0 overflow-hidden"
            >
              <button className="w-full h-10 flex items-center justify-center px-1 text-white font-medium tracking-wide text-[0.75rem] bg-[#9d174d] border-none rounded-xl cursor-pointer hover:bg-[#831843] transition-colors whitespace-nowrap overflow-hidden">
                Start Now →
              </button>
            </Link>
          </div>
          
          <p style={{ fontSize: '0.65rem', color: '#1A202C', opacity: 0.7, marginTop: '16px' }}>
            *A private link has also been sent to your email
          </p>
        </div>
      </div>
    </div>
  );
}
