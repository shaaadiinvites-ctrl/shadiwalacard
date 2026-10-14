"use client";

import { motion } from "framer-motion";
import { WeddingRecord } from "@/types/wedding";
import { t } from "@/lib/i18n";

export function HeroSection({ wedding }: { wedding?: WeddingRecord }) {
  const isBrideFirst = wedding?.name_order === "bride_first";
  const firstName = isBrideFirst ? wedding?.bride_name : wedding?.groom_name;
  const secondName = isBrideFirst ? wedding?.groom_name : wedding?.bride_name;
  
  return (
    <section className="relative h-screen min-h-[620px] overflow-hidden flex items-center justify-center z-20">
      {/* Content overlay */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none p-6">
        
        {/* Names */}
        <motion.h1 
          className="font-playfair text-[40px] md:text-[72px] font-medium leading-[1.05] text-[#ffecd2] drop-shadow-[0_4px_20px_rgba(255,236,210,0.4)] tracking-[1px] flex flex-col items-center -translate-y-24 md:translate-y-0 w-full px-4 break-words text-center hyphens-auto"
        >
          <motion.span 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
            className="my-2 font-semibold"
          >
            {firstName || (isBrideFirst ? "Bride" : "Groom")}
          </motion.span>
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="font-cinzel font-normal text-xl md:text-3xl tracking-[3px] my-4 text-[#C8912A]"
          >
            {t('weds', wedding?.language)}
          </motion.span>
          <motion.span 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1.1, ease: [0.22, 0.61, 0.36, 1] }}
            className="font-semibold"
          >
            {secondName || (isBrideFirst ? "Groom" : "Bride")}
          </motion.span>
        </motion.h1>

        {/* Scroll Down Button */}
        <motion.button
          type="button"
          onClick={() => {
            const nextSection = document.getElementById("invitation") || document.querySelector("section:nth-of-type(2)");
            if (nextSection) {
              nextSection.scrollIntoView({ behavior: "smooth" });
            } else {
              window.scrollBy({ top: window.innerHeight * 0.85, behavior: "smooth" });
            }
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{
            opacity: { delay: 1.8, duration: 1 },
            y: { repeat: Infinity, duration: 2, ease: "easeInOut" }
          }}
          className="absolute bottom-8 z-30 pointer-events-auto flex flex-col items-center gap-1.5 text-white/60 hover:text-white transition-colors cursor-pointer group"
          aria-label="Scroll down"
        >
          <span className="font-montserrat text-[10px] uppercase tracking-[3px] text-[#FFD98A]/80 group-hover:text-[#FFD98A]">Scroll</span>
          <svg className="w-5 h-5 text-[#FFD98A] drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.button>
      </div>
    </section>
  );
}

