"use client";

import { WeddingRecord } from "@/types/wedding";
import { clsx } from "clsx";
import { t } from "@/lib/i18n";

export function FooterSection({ wedding }: { wedding?: WeddingRecord }) {
  const isBrideFirst = wedding?.name_order === "bride_first";
  const firstName = isBrideFirst ? wedding?.bride_name : wedding?.groom_name;
  const secondName = isBrideFirst ? wedding?.groom_name : wedding?.bride_name;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative w-full flex flex-col justify-end overflow-hidden mt-12 bg-transparent min-h-[600px] md:min-h-[800px]">
      
      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 pt-16 pb-8 pointer-events-none w-full flex-grow justify-center">
        
        {/* Pointer events re-enabled for interactive elements inside the overlay */}
        <div className="pointer-events-auto flex flex-col items-center w-full">
        <div className="font-playfair italic text-[#FFEBB4] text-lg md:text-xl mb-2 drop-shadow-md">
          {t("awaitingPresence", wedding?.language)}
        </div>
        <div className="font-lora text-white/70 tracking-widest text-xs uppercase mb-8">
          {t("withBlessings", wedding?.language)}
        </div>

        {/* Decorative Separator */}
        <div className="flex items-center gap-4 mb-8">
          <span className="w-16 h-[1px] bg-gradient-to-r from-transparent to-[#FFD98A]/40"></span>
          <div className="w-2 h-2 rotate-45 border border-[#FFD98A]/60"></div>
          <span className="w-16 h-[1px] bg-gradient-to-r from-[#FFD98A]/40 to-transparent"></span>
        </div>

        <div className="flex items-center justify-center gap-4 md:gap-8 mb-16">
          <h2 className="font-playfair text-3xl md:text-5xl text-white drop-shadow-lg">{firstName || (isBrideFirst ? "Bride" : "Groom")}</h2>
          <span className="font-playfair italic text-2xl md:text-4xl text-[#FFD98A]">&amp;</span>
          <h2 className="font-playfair text-3xl md:text-5xl text-white drop-shadow-lg">{secondName || (isBrideFirst ? "Groom" : "Bride")}</h2>
        </div>

        {/* RSVP Details */}
        <div className="w-full flex justify-center pb-24 md:pb-32">
          {(!wedding || wedding.rsvp1_name || wedding.rsvp1_phone || wedding.rsvp2_name || wedding.rsvp2_phone) && (
            <div className="flex flex-col items-center border-t border-gold-primary/30 pt-8 w-[min(800px,90vw)]">
              <h3 className="font-montserrat font-bold text-xs tracking-[4px] text-[#FFD98A] uppercase mb-8">
                {t("rsvp", wedding?.language)}
              </h3>
            
            <div className="flex flex-col md:flex-row gap-12 md:gap-20 items-center justify-center w-full">
              {(wedding ? (wedding.rsvp1_name || wedding.rsvp1_phone) : true) && (
                <div className="text-center">
                  <p className={clsx("font-cinzel text-xl text-white drop-shadow-md", (wedding?.rsvp1_phone || (!wedding)) ? "mb-3" : "")}>{wedding?.rsvp1_name || (!wedding ? "Mr. & Mrs. Sharma" : "Family")}</p>
                  {(wedding?.rsvp1_phone || (!wedding)) && (
                    <p className="font-lora text-[#FFD98A]/80 text-sm transition-colors duration-300 hover:text-white cursor-pointer">
                      {wedding?.rsvp1_phone || (!wedding ? "+91 98765 43210" : "")}
                    </p>
                  )}
                </div>
              )}
              
              {(wedding ? (wedding.rsvp2_name || wedding.rsvp2_phone) : true) && (
                <div className="text-center">
                  <p className={clsx("font-cinzel text-xl text-white drop-shadow-md", (wedding?.rsvp2_phone || (!wedding)) ? "mb-3" : "")}>{wedding?.rsvp2_name || (!wedding ? "The Verma Family" : "")}</p>
                  {(wedding?.rsvp2_phone || (!wedding)) && (
                    <p className="font-lora text-[#FFD98A]/80 text-sm transition-colors duration-300 hover:text-white cursor-pointer">
                      {wedding?.rsvp2_phone || (!wedding ? "+91 87654 32109" : "")}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
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
