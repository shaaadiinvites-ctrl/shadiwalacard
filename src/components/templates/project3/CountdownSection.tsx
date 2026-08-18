"use client";

import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { useEffect, useState, useRef } from "react";

function AnimatedCounterBox({ value, label, progress }: { value: string; label: string; progress: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress * circumference);

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center w-[90px] h-[90px] sm:w-[120px] sm:h-[120px] md:w-[150px] md:h-[150px] bg-white/[0.02] md:backdrop-blur-md rounded-full border border-[#C8912A]/10 shadow-[0_0_30px_rgba(200,145,42,0.05)] group transition-transform hover:scale-105 duration-500">
        
        {/* SVG Progress Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-[0_0_8px_rgba(200,145,42,0.4)]" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(255, 217, 138, 0.08)" strokeWidth="2" />
          <motion.circle 
            cx="60" 
            cy="60" 
            r={radius} 
            fill="none" 
            stroke="url(#goldGradient)" 
            strokeWidth="3.5" 
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "linear" }}
          />
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE8AC" />
              <stop offset="50%" stopColor="#C8912A" />
              <stop offset="100%" stopColor="#FFD98A" />
            </linearGradient>
          </defs>
        </svg>

        {/* Slot Machine Ticker */}
        <div className="relative overflow-hidden h-[48px] md:h-[72px] w-[80%] flex justify-center items-center z-10">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={value}
              initial={{ y: "-100%", opacity: 0, filter: "blur(4px)" }}
              animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
              exit={{ y: "100%", opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-[#FFD98A] drop-shadow-[0_0_15px_rgba(200,145,42,0.6)]"
            >
              {value}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="font-montserrat text-[10px] md:text-sm tracking-[4px] uppercase text-[#FFF8DC]/70 mt-6 font-medium">
        {label}
      </div>
    </div>
  );
}

function FloralParallaxBackground() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Different parallax speeds for different depths using explicit pixels to prevent layout thrashing
  const ySlow = useTransform(smoothProgress, [0, 1], [-150, 150]);
  const yFast = useTransform(smoothProgress, [0, 1], [300, -300]);
  const yMedium = useTransform(smoothProgress, [0, 1], [-300, 100]);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none opacity-40 z-0">
      <motion.img 
        style={{ y: ySlow }} 
        src="/project3-assets/champagne_lotus.png" 
        alt="" 
        className="absolute -top-[5%] -left-[10%] w-[400px] md:w-[600px] -rotate-12 blur-[4px] opacity-70 mix-blend-screen" 
      />
      <motion.img 
        style={{ y: yFast }} 
        src="/project3-assets/burgundy_rose.png" 
        alt="" 
        className="absolute top-[60%] -right-[5%] w-[250px] md:w-[350px] rotate-45 blur-[2px] opacity-80 mix-blend-screen" 
      />
      <motion.img 
        style={{ y: yMedium }} 
        src="/project3-assets/marigold_petals.png" 
        alt="" 
        className="absolute top-[20%] right-[10%] w-[120px] md:w-[180px] rotate-[120deg] opacity-60" 
      />
      <motion.img 
        style={{ y: ySlow }} 
        src="/project3-assets/marigold_petals.png" 
        alt="" 
        className="absolute top-[70%] left-[15%] w-[150px] md:w-[220px] -rotate-45 blur-[1px] opacity-70" 
      />
    </div>
  );
}

export function CountdownSection() {
  const [timeLeft, setTimeLeft] = useState({
    days: { str: "00", progress: 1 },
    hours: { str: "00", progress: 1 },
    mins: { str: "00", progress: 1 },
    secs: { str: "00", progress: 1 },
  });

  useEffect(() => {
    const updateCountdown = () => {
      const targetDate = new Date("2026-10-15T00:00:00").getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({
          days: { str: d.toString().padStart(2, "0"), progress: Math.min(d / 365, 1) },
          hours: { str: h.toString().padStart(2, "0"), progress: h / 24 },
          mins: { str: m.toString().padStart(2, "0"), progress: m / 60 },
          secs: { str: s.toString().padStart(2, "0"), progress: s / 60 },
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-[#09202b] pt-32 pb-40 flex flex-col items-center justify-center z-20">
      <FloralParallaxBackground />
      {/* Decorative separator matching the theme */}
      <div className="absolute top-0 w-full flex justify-center mt-8">
        <svg width="200" height="20" viewBox="0 0 200 20" fill="none" className="opacity-40">
          <path d="M0 10 L80 10 M120 10 L200 10 M100 0 L105 10 L100 20 L95 10 Z" stroke="#C8912A" strokeWidth="1" fill="#FFD98A"/>
        </svg>
      </div>

      <div className="text-center px-6 text-[#f7ede2] mb-16 mt-8">
        <div className="font-montserrat text-sm md:text-base tracking-[5px] text-[#C8912A] uppercase mb-3 drop-shadow-sm">
          The Wait
        </div>
        <h2 className="font-cinzel font-bold text-3xl md:text-5xl text-white tracking-[1px] mb-4 drop-shadow-md">
          Counting Down
        </h2>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1 }}
        className="grid grid-cols-2 place-items-center gap-x-6 gap-y-10 sm:gap-x-12 md:flex md:flex-wrap md:justify-center md:gap-8 lg:gap-14 font-cinzel text-center"
      >
        <AnimatedCounterBox value={timeLeft.days.str} label="Days" progress={timeLeft.days.progress} />
        <AnimatedCounterBox value={timeLeft.hours.str} label="Hours" progress={timeLeft.hours.progress} />
        <AnimatedCounterBox value={timeLeft.mins.str} label="Mins" progress={timeLeft.mins.progress} />
        <AnimatedCounterBox value={timeLeft.secs.str} label="Secs" progress={timeLeft.secs.progress} />
      </motion.div>
    </section>
  );
}
