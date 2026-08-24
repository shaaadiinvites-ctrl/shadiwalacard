"use client";

import { motion } from "framer-motion";
import { WeddingRecord } from "@/types/wedding";

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
          className="font-playfair text-[40px] md:text-[72px] font-medium leading-[1.05] text-[#ffecd2] drop-shadow-[0_4px_20px_rgba(255,236,210,0.4)] tracking-[1px] flex flex-col items-center -translate-y-24 md:translate-y-0"
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
            weds
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

      </div>
    </section>
  );
}
