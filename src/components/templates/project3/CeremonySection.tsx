"use client";

import { motion, useScroll, useTransform, useMotionValueEvent, useSpring, animate } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const sparkles = [
  { left: "15%", top: "20%", delay: "0s", duration: "2.5s", char: "✦" },
  { left: "75%", top: "15%", delay: "1s", duration: "3s", char: "✧" },
  { left: "25%", top: "75%", delay: "0.5s", duration: "2.2s", char: "✦" },
  { left: "80%", top: "65%", delay: "1.5s", duration: "2.8s", char: "✧" },
  { left: "50%", top: "85%", delay: "2s", duration: "3.5s", char: "✦" },
];

const ceremonies = [
  {
    id: "mehendi",
    title: "Mehendi & Haldi",
    subtitle: "The Colors of Joy",
    date: "✦ FRI, 14 FEB 2026 • 10:00 AM ✦",
    venueName: "The Garden Pavilion",
    venueAddress: "Orchid Greens, Sector 56, Gurugram, Haryana",
    mapLink: "https://maps.google.com/?q=Orchid+Greens+Sector+56+Gurugram",
    theme: "card-marigold",
    icon: (
      <svg width="60" height="60" viewBox="0 0 100 100" fill="none" stroke="#FFD98A" className="drop-shadow-md">
        <circle cx="50" cy="50" r="42" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.6"/>
        <path d="M50 20 C60 40 70 50 50 80 C30 50 40 40 50 20 Z" fill="#C8912A" opacity="0.2" strokeWidth="2"/>
        <path d="M20 50 C40 40 50 30 80 50 C50 70 40 60 20 50 Z" fill="#C8912A" opacity="0.2" strokeWidth="2"/>
        <circle cx="50" cy="50" r="10" fill="#FFD98A" opacity="0.8"/>
      </svg>
    )
  },
  {
    id: "engagement",
    title: "Engagement",
    subtitle: "When Two Souls Dance",
    date: "✦ FRI, 14 FEB 2026 • 7:00 PM ✦",
    venueName: "The Crystal Ballroom",
    venueAddress: "Le Meridien, MG Road, Gurugram, Haryana",
    mapLink: "https://maps.google.com/?q=Le+Meridien+MG+Road+Gurugram",
    theme: "card-sapphire",
    icon: (
      <svg width="60" height="60" viewBox="0 0 100 100" fill="none" stroke="#FFD98A" className="drop-shadow-md">
        <circle cx="50" cy="50" r="42" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.6"/>
        <circle cx="40" cy="55" r="18" strokeWidth="2" />
        <circle cx="60" cy="55" r="18" strokeWidth="2" />
        <path d="M40 37 L50 25 L60 37 L50 48 Z" fill="#C8912A" opacity="0.8" strokeWidth="1.5"/>
        <path d="M35 37 L65 37" strokeWidth="1.5"/>
      </svg>
    )
  },
  {
    id: "shaadi",
    title: "Shaadi",
    subtitle: "Forever Begins Today",
    date: "✦ SAT, 15 FEB 2026 • 11:00 AM ✦",
    venueName: "The Lotus Garden",
    venueAddress: "The Leela Ambience, Ambience Island, Gurugram",
    mapLink: "https://maps.google.com/?q=The+Leela+Ambience+Gurugram",
    theme: "card-crimson",
    icon: (
      <svg width="60" height="60" viewBox="0 0 100 100" fill="none" stroke="#FFD98A" className="drop-shadow-md">
        <circle cx="50" cy="50" r="42" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.6"/>
        <path d="M50 20 C65 45 70 65 50 75 C30 65 35 45 50 20 Z" strokeWidth="2" />
        <path d="M50 35 C58 50 60 65 50 75 C40 65 42 50 50 35 Z" fill="#C8912A" opacity="0.4" strokeWidth="1.5"/>
        <path d="M50 50 C54 60 55 70 50 75 C45 70 46 60 50 50 Z" fill="#FFD98A" strokeWidth="1"/>
      </svg>
    )
  },
  {
    id: "reception",
    title: "The Reception",
    subtitle: "A Grand Celebration",
    date: "✦ SUN, 16 FEB 2026 • 7:00 PM ✦",
    venueName: "The Grand Ballroom",
    venueAddress: "The Oberoi, Udyog Vihar, Gurugram, Haryana",
    mapLink: "https://maps.google.com/?q=The+Oberoi+Gurugram",
    theme: "card-emerald",
    icon: (
      <svg width="60" height="60" viewBox="0 0 100 100" fill="none" stroke="#FFD98A" className="drop-shadow-md">
        <circle cx="50" cy="50" r="42" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.6"/>
        <path d="M35 30 L45 55 L45 75 M40 75 L50 75" strokeWidth="2"/>
        <path d="M65 30 L55 55 L55 75 M50 75 L60 75" strokeWidth="2"/>
        <path d="M38 38 L43 38 M57 38 L62 38" strokeWidth="1.5" opacity="0.5"/>
        <path d="M50 20 L52 25 L57 27 L52 29 L50 34 L48 29 L43 27 L48 25 Z" fill="#FFD98A" strokeWidth="1"/>
      </svg>
    )
  },
];

const bgFireflies = [
  { left: "70.27%", animDuration: "14.24s", animDelay: "-6.86s", drift: "20px", glowDuration: "3.98s" },
  { left: "91.28%", animDuration: "18.58s", animDelay: "-17.18s", drift: "19px", glowDuration: "4.75s" },
  { left: "97.31%", animDuration: "20.24s", animDelay: "-15.29s", drift: "-43px", glowDuration: "4.11s" },
  { left: "12.44%", animDuration: "17.38s", animDelay: "-11.87s", drift: "31px", glowDuration: "3.00s" },
  { left: "61.61%", animDuration: "12.98s", animDelay: "-3.76s", drift: "54px", glowDuration: "2.18s" },
  { left: "47.35%", animDuration: "21.70s", animDelay: "-6.95s", drift: "-39px", glowDuration: "4.63s" },
  { left: "56.97%", animDuration: "22.23s", animDelay: "-13.08s", drift: "-40px", glowDuration: "2.72s" },
  { left: "35.28%", animDuration: "19.89s", animDelay: "-8.14s", drift: "-50px", glowDuration: "4.17s" },
  { left: "77.13%", animDuration: "14.31s", animDelay: "-13.21s", drift: "40px", glowDuration: "2.57s" },
  { left: "29.93%", animDuration: "12.49s", animDelay: "-11.74s", drift: "45px", glowDuration: "4.75s" },
  { left: "51.38%", animDuration: "14.39s", animDelay: "-12.59s", drift: "-37px", glowDuration: "2.77s" },
  { left: "45.19%", animDuration: "14.23s", animDelay: "-8.74s", drift: "-34px", glowDuration: "2.96s" },
  { left: "87.68%", animDuration: "11.89s", animDelay: "-11.34s", drift: "12px", glowDuration: "4.96s" },
  { left: "59.37%", animDuration: "12.68s", animDelay: "-4.06s", drift: "29px", glowDuration: "2.63s" },
  { left: "16.95%", animDuration: "17.89s", animDelay: "-10.29s", drift: "-22px", glowDuration: "3.59s" },
  { left: "4.74%", animDuration: "13.89s", animDelay: "-7.54s", drift: "-62px", glowDuration: "2.38s" },
  { left: "12.19%", animDuration: "23.99s", animDelay: "-4.93s", drift: "36px", glowDuration: "2.35s" },
  { left: "21.55%", animDuration: "20.97s", animDelay: "-9.22s", drift: "66px", glowDuration: "3.23s" },
  { left: "4.66%", animDuration: "20.08s", animDelay: "-4.90s", drift: "-37px", glowDuration: "4.56s" },
  { left: "35.64%", animDuration: "13.98s", animDelay: "-15.21s", drift: "-24px", glowDuration: "3.11s" },
  { left: "69.30%", animDuration: "23.27s", animDelay: "-8.95s", drift: "-63px", glowDuration: "4.07s" },
  { left: "6.04%", animDuration: "20.69s", animDelay: "-2.08s", drift: "-65px", glowDuration: "2.37s" },
  { left: "77.01%", animDuration: "11.73s", animDelay: "-2.09s", drift: "-69px", glowDuration: "3.14s" },
  { left: "4.75%", animDuration: "13.66s", animDelay: "-18.92s", drift: "65px", glowDuration: "3.02s" },
  { left: "70.34%", animDuration: "12.42s", animDelay: "-16.75s", drift: "16px", glowDuration: "3.42s" },
  { left: "40.66%", animDuration: "10.63s", animDelay: "-18.29s", drift: "37px", glowDuration: "2.14s" },
  { left: "25.22%", animDuration: "18.19s", animDelay: "-8.86s", drift: "50px", glowDuration: "2.55s" },
  { left: "5.72%", animDuration: "16.34s", animDelay: "-2.08s", drift: "19px", glowDuration: "3.30s" },
  { left: "28.63%", animDuration: "17.73s", animDelay: "-6.42s", drift: "-33px", glowDuration: "3.68s" },
  { left: "62.44%", animDuration: "10.90s", animDelay: "-11.51s", drift: "-70px", glowDuration: "2.26s" },
];

export function CeremonySection({ events = [] }: { events?: any[] }) {
  // Use DB events if provided, otherwise fallback to hardcoded ceremonies
  const activeCeremonies = events && events.length > 0 
    ? [...events]
        .sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time || '00:00'}`);
          const dateB = new Date(`${b.date}T${b.time || '00:00'}`);
          return dateA.getTime() - dateB.getTime();
        })
        .map((e, idx) => ({
          id: `event-${idx}`,
          title: (e.name === "Other" || e.name === "Others" || !e.name) ? (e.customName || "Special Event") : (e.name || "Wedding Event"),
          date: `✦ ${new Date(e.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()} • ${
            e.time ? new Date(`2000-01-01T${e.time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) : ''
          } ✦`,
          venueName: e.venue || "",
          venueAddress: "",
          mapLink: e.mapsLink || "",
          theme: ["card-marigold", "card-sapphire", "card-crimson", "card-emerald"][idx % 4],
          icon: ceremonies[idx % ceremonies.length].icon
        }))
    : ceremonies;
  const targetRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  // We use "end start" so the internal scroll percentage calculation uses exactly targetRef.offsetHeight.
  // This completely eliminates the mobile address bar jumping bug which affects window.innerHeight!
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"]
  });

  useEffect(() => {
    const measure = () => {
      if (trackRef.current) {
        setTrackWidth(trackRef.current.scrollWidth - window.innerWidth);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const activeIndexRef = useRef(activeIndex);
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  const isScrollingProgrammatically = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const progScrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 800,
    damping: 100,
    mass: 0.1,
    restDelta: 0.0001
  });

  // Calculate dynamic progress values that are strictly immune to volatile address bar viewport changes
  const getStableProgress = (p: number) => {
    if (!targetRef.current || trackWidth <= 0) return 0;
    
    // The sticky container is the first child. Its height is ALWAYS exactly 100svh or 100vh.
    const stickyContainer = targetRef.current.children[0] as HTMLElement;
    const viewportHeight = stickyContainer.offsetHeight;
    const sectionHeight = targetRef.current.offsetHeight;
    
    // Unpin happens when the bottom of the scrolling section hits the bottom of the sticky container
    const unpinProgress = (sectionHeight - viewportHeight) / sectionHeight;
    
    // Calculate our 5% start buffer and 15% end buffer relative to the unpin point
    const startP = unpinProgress * 0.05;
    const endP = unpinProgress * 0.85;
    
    if (p <= startP) return 0;
    if (p >= endP) return 1;
    
    return (p - startP) / (endP - startP);
  };

  const x = useTransform(smoothProgress, (p) => getStableProgress(p) * -trackWidth);
  const progressWidth = useTransform(smoothProgress, (p) => `${5 + getStableProgress(p) * 95}%`);

  useMotionValueEvent(x, "change", (latestX) => {
    if (trackRef.current) {
      const cards = Array.from(trackRef.current.children) as HTMLElement[];
      const center = window.innerWidth / 2;
      let closestIdx = 0;
      let minDistance = Infinity;

      cards.forEach((card, idx) => {
        // Exclude the navigation buttons which might be caught if they are in the track? 
        // No, buttons are outside the track.
        const cardCenterOnScreen = card.offsetLeft + latestX + (card.offsetWidth / 2);
        const distance = Math.abs(cardCenterOnScreen - center);
        if (distance < minDistance) {
          minDistance = distance;
          closestIdx = idx;
        }
      });
      setActiveIndex(closestIdx);
    }
  });

  const scrollToCard = (index: number) => {
    if (!targetRef.current || !trackRef.current || trackWidth <= 0) return;
    const cards = Array.from(trackRef.current.children) as HTMLElement[];
    if (!cards[index]) return;
    
    // Calculate the target X translation needed to center this card
    const center = window.innerWidth / 2;
    const card = cards[index];
    const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
    
    let targetX = center - cardCenter;
    // Bound it
    targetX = Math.max(-trackWidth, Math.min(0, targetX));
    
    // Find what internal progress [0, 1] gives this targetX
    const internalProgress = targetX / -trackWidth;
    
    const stickyContainer = targetRef.current.children[0] as HTMLElement;
    const viewportHeight = stickyContainer.offsetHeight;
    const sectionHeight = targetRef.current.offsetHeight;
    const unpinProgress = (sectionHeight - viewportHeight) / sectionHeight;
    
    const startP = unpinProgress * 0.05;
    const endP = unpinProgress * 0.85;
    
    // Map the internal progress back to the actual stable scrollYProgress
    const stableProgress = startP + (internalProgress * (endP - startP));
    
    // Calculate absolute scroll position completely immune to window.innerHeight changes!
    const rect = targetRef.current.getBoundingClientRect();
    const sectionTop = rect.top + window.scrollY;
    const targetScrollY = sectionTop + (stableProgress * sectionHeight);
    
    isScrollingProgrammatically.current = true;
    if (progScrollTimeout.current) clearTimeout(progScrollTimeout.current);
    
    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth'
    });
    
    progScrollTimeout.current = setTimeout(() => {
      isScrollingProgrammatically.current = false;
    }, 1200); // 1.2s to be absolutely safe that the smooth scroll has finished
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isScrollingProgrammatically.current) return;
      
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      
      scrollTimeout.current = setTimeout(() => {
        if (!targetRef.current) return;
        const rect = targetRef.current.getBoundingClientRect();
        const sectionHeight = targetRef.current.offsetHeight;
        
        // Calculate where we are relative to the entire ceremony scroll section
        const stickyContainer = targetRef.current.children[0] as HTMLElement;
        const viewportHeight = stickyContainer.offsetHeight;
        const unpinProgress = (sectionHeight - viewportHeight) / sectionHeight;
        
        const startP = unpinProgress * 0.05;
        const endP = unpinProgress * 0.85;
        
        // current scroll progress in the targetRef
        const currentP = -rect.top / sectionHeight;
        
        // If the user has stopped scrolling WHILE inside the active card track area
        if (currentP > startP && currentP < endP) {
          scrollToCard(activeIndexRef.current);
        }
      }, 150); // 150ms debounce
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [trackWidth]); // Dependencies include trackWidth so it updates if layout changes

  // Touch Swipe Handlers
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    
    // 50px threshold for a swipe
    const isLeftSwipe = distance > 50; 
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && activeIndex < ceremonies.length - 1) {
      scrollToCard(activeIndex + 1);
    } else if (isRightSwipe && activeIndex > 0) {
      scrollToCard(activeIndex - 1);
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <section 
      id="cer" 
      className="relative z-20 w-full mt-[-200px]"
      style={{
        background: 'linear-gradient(180deg, var(--cer-bg-transparent, rgba(9,32,43,0)) 0%, var(--cer-bg-color, #09202b) var(--cer-bg-stop, 200px), var(--cer-bg-color, #09202b) 100%)'
      }}
    >
      {/* Background Fireflies Layer (Sticky) */}
      <div className="hidden md:block sticky top-0 left-0 w-full h-screen mb-[-100vh] pointer-events-none z-0 overflow-hidden">
        {bgFireflies.map((ff, i) => (
          <div 
            key={i} 
            className="firefly-wrapper" 
            style={{
              left: ff.left, 
              animation: `fireflyFloat ${ff.animDuration} linear ${ff.animDelay} infinite`,
              '--drift': ff.drift
            } as React.CSSProperties}
          >
            <div className="firefly-glow" style={{ animation: `glowPulse ${ff.glowDuration} alternate infinite ease-in-out` }}></div>
          </div>
        ))}
      </div>

      <div className="pt-4 pb-20 md:pb-[15vh] px-4 w-full relative z-20">
        {/* GRAND FLORAL MANDALA TRANSITION */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
          className="relative w-full h-[220px] flex items-center justify-center mb-6 overflow-visible"
        >
          {/* Glowing aura */}
          <div className="absolute w-[350px] h-[350px] rounded-full bg-[radial-gradient(circle,rgba(200,145,42,0.2)_0%,transparent_60%)] animate-[pulse_4s_ease-in-out_infinite]"></div>
          
          {/* Rotating rings */}
          <div className="absolute w-[180px] h-[180px] border-2 border-dashed border-[#C8912A]/40 rounded-full animate-[spin_30s_linear_infinite]"></div>
          <div className="absolute w-[240px] h-[240px] border border-[#C8912A]/20 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
          
          {/* Center Lotus */}
          <img loading="lazy" src="/project3-assets/champagne_lotus.png" alt="Lotus" className="absolute w-[clamp(80px,12vw,110px)] z-[2] md:drop-shadow-[0_0_25px_rgba(200,145,42,0.6)] animate-bob" />
          
          {/* Orbiting Roses */}
          <div className="absolute w-[180px] h-[180px] animate-[spin_25s_linear_infinite]">
            <img loading="lazy" src="/project3-assets/burgundy_rose.png" className="absolute top-[-15px] left-[calc(50%-15px)] w-[30px] rotate-0 md:drop-shadow-md" />
            <img loading="lazy" src="/project3-assets/burgundy_rose.png" className="absolute bottom-[-15px] left-[calc(50%-15px)] w-[30px] rotate-180 md:drop-shadow-md" />
          </div>
          
          {/* Outer Orbiting Marigolds */}
          <div className="absolute w-[280px] h-[280px] animate-[spin_35s_linear_infinite_reverse]">
            <img loading="lazy" src="/project3-assets/marigold_petals.png" className="absolute top-[10%] right-[10%] w-[45px] opacity-80 md:drop-shadow-sm" />
            <img loading="lazy" src="/project3-assets/marigold_petals.png" className="absolute bottom-[10%] left-[10%] w-[45px] opacity-80 rotate-180 md:drop-shadow-sm" />
          </div>

          {/* Elegant single line passing behind the lotus */}
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[min(85vw,800px)] h-[1px] bg-gradient-to-r from-transparent via-[#C8912A]/70 to-transparent z-[-1]"></div>
        </motion.div>
      </div>

      {/* Scroll track for useScroll animation. Taller on mobile to slow down the scroll speed.
          Using svh (small viewport height) prevents violent layout jumps when mobile address bar hides/shows! */}
      <div ref={targetRef} className="relative w-full" style={{ height: activeCeremonies.length > 1 ? `${Math.max(120, activeCeremonies.length * 80)}svh` : 'auto' }}>
        
        {/* STICKY CONTAINER FOR PINNED HORIZONTAL SCROLL */}
        <div className={activeCeremonies.length > 1 ? "sticky top-0 h-[100svh] md:h-screen w-full flex flex-col justify-center overflow-hidden z-10" : "relative min-h-[100svh] w-full flex flex-col justify-center overflow-hidden z-10 py-10"}>
        
        {/* Fixed Title inside Sticky Container */}
        <div className="text-center px-6 flex-shrink-0 text-[#f7ede2] mb-4 md:mb-12">
          <div className="font-montserrat text-sm md:text-base tracking-[5px] text-[#C8912A] uppercase mb-3 drop-shadow-sm">
            The Festivities
          </div>
          <h2 className="font-cinzel font-bold text-3xl md:text-5xl text-white tracking-[1px] mb-4 drop-shadow-md">
            Days of Celebration
          </h2>
          {activeCeremonies.length > 1 && (
            <>
              <div className="font-playfair italic text-sm md:text-base text-[#FFF8DC]/60 mb-6">
                Scroll to move through the ceremonies &nbsp;&rarr;
              </div>
              <div className="w-[min(280px,60vw)] h-[3px] rounded bg-white/10 mx-auto overflow-hidden">
                <motion.div 
                  style={{ width: progressWidth }} 
                  className="h-full bg-gradient-to-r from-[#C8912A] to-[#FFD98A] rounded"
                />
              </div>
            </>
          )}
        </div>
        
        {/* Dedicated Mobile Navigation Bar (Moved above cards) */}
        {activeCeremonies.length > 1 && (
          <div className="cer-mobile-nav-bar">
            <button 
              className="cer-mobile-nav-btn" 
              disabled={activeIndex === 0}
              onClick={() => scrollToCard(activeIndex - 1)}
              aria-label="Previous Ceremony"
            >
              {"<"} PREV
            </button>
            <span className="cer-mobile-counter">{activeIndex + 1} / {activeCeremonies.length}</span>
            <button 
              className="cer-mobile-nav-btn" 
              disabled={activeIndex === activeCeremonies.length - 1}
              onClick={() => scrollToCard(activeIndex + 1)}
              aria-label="Next Ceremony"
            >
              NEXT {">"}
            </button>
          </div>
        )}

        {/* Horizontal Track */}
        <motion.div 
          ref={trackRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ 
            x: activeCeremonies.length > 1 ? x : 0,
          }}  
          className="flex gap-[60px] w-max items-stretch px-[calc(50vw-min(42.5vw,210px))]"
        >
          {activeCeremonies.map((ceremony, idx) => {
            const isActive = idx === activeIndex;
            return (
              <div
                key={ceremony.id}
                className={`gem-wrapper w-[85vw] max-w-[420px] relative shrink-0 ${isActive ? 'is-active' : ''}`}
              >
                <article
                  className={`palace-card ${ceremony.theme} w-full h-full p-5 py-6 md:p-10 md:backdrop-blur-xl shadow-2xl relative overflow-hidden`}
                  style={{
                    clipPath: "polygon(30px 0, calc(100% - 30px) 0, 100% 30px, 100% calc(100% - 30px), calc(100% - 30px) 100%, 30px 100%, 0 calc(100% - 30px), 0 30px)",
                  }}
                >
                  {/* Border Beam Burst Animation */}
                  <svg className="border-beam-svg" viewBox="0 0 320 480" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id={`goldGrad-${ceremony.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFE8AC" />
                        <stop offset="50%" stopColor="#C8912A" />
                        <stop offset="100%" stopColor="#FFD98A" />
                      </linearGradient>
                    </defs>
                    <rect x="1" y="1" width="318" height="478" fill="none" stroke={`url(#goldGrad-${ceremony.id})`} strokeWidth="3.5" className="border-beam-path" />
                  </svg>

                  {/* Sparkles */}
                  {sparkles.map((s, i) => (
                    <span 
                      key={i} 
                      className="card-sparkle" 
                      style={{ left: s.left, top: s.top, animationDelay: s.delay, animationDuration: s.duration }}
                    >
                      {s.char}
                    </span>
                  ))}

                  <div className="ceremony-emblem flex justify-center mb-4 md:mb-6 opacity-80">
                    {ceremony.icon}
                  </div>

                  <h3 className="text-center font-cinzel font-bold text-2xl md:text-3xl text-white tracking-wider drop-shadow-md mb-2">
                    {ceremony.title}
                  </h3>

                  <div className="flex justify-center mb-5 md:mb-8">
                    <div className="text-center px-4 py-2 rounded-full bg-gold-primary/10 border border-gold-primary/30 font-montserrat font-bold text-xs tracking-wider text-[#FFE8AC] shadow-inner relative z-10">
                      {ceremony.date}
                    </div>
                  </div>

                  <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-gold-secondary/70 to-transparent mx-auto mb-4 md:mb-6"></div>

                  <div className="text-center flex flex-col gap-1 mb-5 md:mb-8">
                    <div className="font-montserrat font-bold text-[10px] tracking-widest text-[#FFD98A] uppercase mb-1">
                      The Venue
                    </div>
                    <div className="font-playfair font-bold text-lg text-white drop-shadow-md relative z-10">
                      {ceremony.venueName}
                    </div>
                    <div className="font-lora text-sm text-white/90 leading-relaxed relative z-10">
                      {ceremony.venueAddress}
                    </div>
                  </div>

                  <div className="flex justify-center relative z-10">
                    <a
                      href={ceremony.mapLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-full bg-gradient-to-br from-[#FFE8AC] via-[#E7B75F] to-[#C8912A] border border-[#FFF2C6] font-montserrat font-bold text-xs tracking-[1.5px] text-[#061622] shadow-[0_4px_15px_rgba(200,145,42,0.4)] transition-transform hover:scale-105 active:scale-95"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      GET DIRECTIONS
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                        <line x1="5" y1="19" x2="19" y2="5"></line>
                        <polyline points="9 5 19 5 19 15"></polyline>
                      </svg>
                    </a>
                  </div>
                </article>
              </div>
            );
          })}

          {/* Spacer to replace paddingRight. WebKit drops right padding on overflowing flex containers. 
              marginLeft cancels out the flex gap so it perfectly mirrors paddingLeft. */}
          <div style={{ paddingRight: "calc(50vw - min(42.5vw, 210px))", marginLeft: "-60px" }} className="shrink-0" />
        </motion.div>

        {/* Nav Buttons */}
        <button 
          className="cer-nav-btn cer-prev-btn" 
          disabled={activeIndex === 0}
          onClick={() => scrollToCard(activeIndex - 1)}
          aria-label="Previous Ceremony"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: 2}}><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <button 
          className="cer-nav-btn cer-next-btn" 
          disabled={activeIndex === ceremonies.length - 1}
          onClick={() => scrollToCard(activeIndex + 1)}
          aria-label="Next Ceremony"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: 2}}><path d="m9 18 6-6-6-6"/></svg>
        </button>


      </div>
      </div>
    </section>
  );
}
