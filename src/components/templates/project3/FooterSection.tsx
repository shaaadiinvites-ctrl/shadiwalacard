"use client";

import { WeddingRecord } from "@/types/wedding";

export function FooterSection({ wedding }: { wedding?: WeddingRecord }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative w-full flex flex-col justify-end overflow-hidden mt-12 bg-transparent md:pt-32">
      
      {/* Content Overlay (Normal flow on mobile, Absolute on desktop) */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 pt-16 pb-8 md:absolute md:inset-0 md:justify-center md:pt-0 md:pb-0 md:min-h-0 pointer-events-none">
        
        {/* Pointer events re-enabled for interactive elements inside the overlay */}
        <div className="pointer-events-auto flex flex-col items-center w-full">
        <div className="font-playfair italic text-[#FFEBB4] text-lg md:text-xl mb-2 drop-shadow-md">
          Awaiting your benign presence at the auspicious occasion
        </div>
        <div className="font-lora text-white/70 tracking-widest text-xs uppercase mb-8">
          With the divine blessings of our elders
        </div>

        {/* Decorative Separator */}
        <div className="w-[120px] h-[1px] bg-gradient-to-r from-transparent via-[#C8912A] to-transparent mb-8"></div>

        {/* Couple Name */}
        <h2 className="font-cinzel font-bold text-4xl md:text-6xl text-white tracking-[2px] mb-4 drop-shadow-lg">
          {wedding?.groom_name || "Groom"} &amp; {wedding?.bride_name || "Bride"}
        </h2>
        
        <p className="font-lora text-[#FFD98A] tracking-widest text-sm uppercase mb-12 drop-shadow-md font-semibold">
          {wedding?.events && wedding.events.length > 0 ? new Date(wedding.events.find(e => e.isMainEvent)?.date || wedding.events[0].date).toLocaleDateString('en-GB', { month: 'long', day: 'numeric', year: 'numeric' }) : "August 15, 2026"}
        </p>

        {/* RSVP Details */}
        <div className="flex flex-col items-center border-t border-gold-primary/30 pt-8 w-[min(800px,90vw)]">
          <h3 className="font-montserrat font-bold text-xs tracking-[4px] text-[#FFD98A] uppercase mb-8">
            R.S.V.P
          </h3>
          
          <div className="flex flex-col md:flex-row gap-12 md:gap-20 items-center justify-center w-full">
            {(wedding?.rsvp1_name || wedding?.rsvp1_phone) ? (
              <div className="text-center">
                <p className="font-cinzel text-xl text-white drop-shadow-md mb-3">{wedding.rsvp1_name || "Family"}</p>
                <p className="font-lora text-[#FFD98A]/80 text-sm transition-colors duration-300 hover:text-white cursor-pointer">{wedding.rsvp1_phone}</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="font-cinzel text-xl text-white drop-shadow-md mb-3">Mr. &amp; Mrs. Sharma</p>
                <p className="font-lora text-[#FFD98A]/80 text-sm transition-colors duration-300 hover:text-white cursor-pointer">+91 98765 43210</p>
              </div>
            )}
            
            {(wedding?.rsvp2_name || wedding?.rsvp2_phone) ? (
              <div className="text-center">
                <p className="font-cinzel text-xl text-white drop-shadow-md mb-3">{wedding.rsvp2_name}</p>
                <p className="font-lora text-[#FFD98A]/80 text-sm transition-colors duration-300 hover:text-white cursor-pointer">{wedding.rsvp2_phone}</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="font-cinzel text-xl text-white drop-shadow-md mb-3">The Verma Family</p>
                <p className="font-lora text-[#FFD98A]/80 text-sm transition-colors duration-300 hover:text-white cursor-pointer">+91 87654 32109</p>
              </div>
            )}
          </div>
        </div>

        {/* Back to Top Button */}
        <button 
          onClick={scrollToTop}
          className="mt-16 w-12 h-12 rounded-full border border-[#C8912A]/40 flex items-center justify-center bg-black/20 md:backdrop-blur-sm text-[#FFD98A] transition-all duration-300 hover:bg-[#C8912A]/40 hover:scale-110 hover:shadow-[0_0_15px_rgba(200,145,42,0.4)] group"
          aria-label="Back to Top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:-translate-y-1">
            <path d="m18 15-6-6-6 6"/>
          </svg>
        </button>
        </div>
      </div>

      {/* Background Palace Image (Normal flow on mobile below text, Absolute on desktop) */}
      <img 
        src="/project3-assets/footer_Image.png"
        alt="Grand Palace"
        className="relative z-0 w-full h-auto object-contain object-bottom opacity-80 md:absolute md:inset-0 md:w-full md:h-full md:object-cover md:object-center pointer-events-none"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 100%)',
        }}
      />
    </div>
  );
}
