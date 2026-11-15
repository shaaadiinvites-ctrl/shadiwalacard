"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { WeddingRecord } from "@/types/wedding";
import { t } from "@/lib/i18n";

export function HeroSection({ wedding }: { wedding?: WeddingRecord }) {
  const isBrideFirst = wedding?.name_order === "bride_first";
  const firstName = isBrideFirst ? wedding?.bride_name : wedding?.groom_name;
  const secondName = isBrideFirst ? wedding?.groom_name : wedding?.bride_name;

  const [showScrollCue, setShowScrollCue] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isPagePeek, setIsPagePeek] = useState(false);
  const peekIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const triggerPagePeek = () => {
      if (window.scrollY > 40) return;
      setIsPagePeek(true);
      setTimeout(() => {
        setIsPagePeek(false);
      }, 750);
    };

    let started = false;
    let curtainFallbackTimer: NodeJS.Timeout | null = null;
    let initialPeekTimer: NodeJS.Timeout | null = null;

    const activateScrollCue = () => {
      if (started) return;
      started = true;

      // Softly awaken scroll affordance after firecrackers finish
      setShowScrollCue(true);

      // Trigger the organic page peek 1.8s after scroll cue awakens
      initialPeekTimer = setTimeout(() => {
        triggerPagePeek();
      }, 1800);

      // Periodically perform a gentle page breath if user remains completely idle at the top
      peekIntervalRef.current = setInterval(() => {
        if (window.scrollY < 40) {
          triggerPagePeek();
        }
      }, 7500);
    };

    // 1. Primary Trigger: Direct event from FirecrackerCelebration when the 8 royal sky rockets complete
    const handleFirecrackersCompleted = () => {
      activateScrollCue();
    };
    window.addEventListener("shadi:firecrackers-completed", handleFirecrackersCompleted);

    // 2. Secondary Trigger: Curtain reveal fallback in case fireworks canvas didn't fire (6.0s after curtain parted)
    const handleCurtainRevealed = () => {
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }
      curtainFallbackTimer = setTimeout(() => {
        activateScrollCue();
      }, 6000);
    };
    window.addEventListener("shadi:curtain-revealed", handleCurtainRevealed);

    // 3. Fallback: If no curtain overlay was present at all, display after 8.0s
    const fallbackTimer = setTimeout(() => {
      activateScrollCue();
    }, 8000);

    // Auto-hide when user scrolls down and disable idle peek
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setHasScrolled(true);
        setIsPagePeek(false);
        if (peekIntervalRef.current) {
          clearInterval(peekIntervalRef.current);
          peekIntervalRef.current = null;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    const handleTouchOrClick = () => {
      setIsPagePeek(false);
    };
    window.addEventListener("touchstart", handleTouchOrClick, { passive: true });
    window.addEventListener("mousedown", handleTouchOrClick, { passive: true });

    return () => {
      window.removeEventListener("shadi:firecrackers-completed", handleFirecrackersCompleted);
      window.removeEventListener("shadi:curtain-revealed", handleCurtainRevealed);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchstart", handleTouchOrClick);
      window.removeEventListener("mousedown", handleTouchOrClick);
      clearTimeout(fallbackTimer);
      if (curtainFallbackTimer) clearTimeout(curtainFallbackTimer);
      if (initialPeekTimer) clearTimeout(initialPeekTimer);
      if (peekIntervalRef.current) {
        clearInterval(peekIntervalRef.current);
      }
    };
  }, []);
  
  return (
    <section className="relative h-screen min-h-[620px] overflow-hidden flex items-center justify-center z-20">
      {/* Scoped CSS Keyframes for Indirect Royal Scroll Affordance */}
      <style>{`
        /* 1. Royal Scroll Tug Affordance: mimics the rope's magnetic downward tug */
        @keyframes royalScrollTugCycle {
          0%, 46% {
            transform: translateY(0) scale(1);
          }
          56% {
            /* Visible, inviting downward elastic stretch */
            transform: translateY(14px) scale(1.04);
          }
          65% {
            /* Elastic overshoot */
            transform: translateY(-3px) scale(0.98);
          }
          73% {
            transform: translateY(2px) scale(1.01);
          }
          80%, 100% {
            transform: translateY(0) scale(1);
          }
        }

        /* 2. Downward Golden Touch Gesture Cue (Pulsing ring + drag trail) */
        @keyframes scrollGestureSlideDown {
          0%, 48% {
            transform: translateY(-4px);
            opacity: 0;
          }
          56% {
            transform: translateY(0px);
            opacity: 0.95;
          }
          72% {
            transform: translateY(24px);
            opacity: 0.9;
          }
          84% {
            transform: translateY(32px);
            opacity: 0;
          }
          100% {
            transform: translateY(32px);
            opacity: 0;
          }
        }

        /* 3. Slender Golden Stardust Beam dropping into the depths */
        @keyframes descendingStardustBeam {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          20% {
            opacity: 0.95;
          }
          70% {
            opacity: 0.95;
          }
          100% {
            transform: translateY(220%);
            opacity: 0;
          }
        }

        /* 4. Tactile Gliding Pearl inside Capsule */
        @keyframes scrollDropletSlide {
          0% {
            transform: translateY(-5px);
            opacity: 0;
          }
          25% {
            opacity: 1;
          }
          75% {
            transform: translateY(7px);
            opacity: 1;
          }
          100% {
            transform: translateY(12px);
            opacity: 0;
          }
        }

        @keyframes chevronCascade1 {
          0%, 100% { opacity: 0.35; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(2px); }
        }

        @keyframes chevronCascade2 {
          0%, 100% { opacity: 0.25; transform: translateY(0); }
          50% { opacity: 0.85; transform: translateY(3px); }
        }

        @keyframes goldSheenScroll {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        @keyframes pulseGlowAura {
          0%, 100% {
            opacity: 0.25;
            transform: scale(0.96);
          }
          50% {
            opacity: 0.55;
            transform: scale(1.05);
          }
        }

        @keyframes gestureRipple {
          0% {
            transform: scale(0.6);
            opacity: 0.9;
          }
          60% {
            transform: scale(1.6);
            opacity: 0.3;
          }
          100% {
            transform: scale(2.4);
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          @keyframes royalScrollTugCycle {
            0%, 100% { transform: translateY(0); }
          }
          @keyframes scrollDropletSlide {
            0%, 100% { opacity: 0.6; transform: translateY(2px); }
          }
          @keyframes scrollGestureSlideDown {
            0%, 100% { opacity: 0; }
          }
        }
      `}</style>

      {/* Content overlay with Idle Organic Page Peek Physics */}
      <div 
        className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none p-6"
        style={{
          transform: isPagePeek && !hasScrolled ? "translateY(-22px)" : "translateY(0)",
          transition: "transform 750ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        
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

        {/* Indirect Royal Scroll Affordance (Awakens after curtain parts) */}
        <div
          className="absolute bottom-6 sm:bottom-8 md:bottom-10 z-30 pointer-events-auto flex flex-col items-center"
          style={{
            opacity: showScrollCue && !hasScrolled ? 1 : 0,
            transform: showScrollCue && !hasScrolled ? "translateY(0)" : "translateY(14px)",
            transition: "opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
            pointerEvents: showScrollCue && !hasScrolled ? "auto" : "none",
          }}
        >
          {/* Elastic Tug Animation Wrapper (Periodic magnetic downward dip) */}
          <button
            type="button"
            onClick={() => {
              const nextSection = document.getElementById("invitation") || document.querySelector("section:nth-of-type(2)");
              if (nextSection) {
                nextSection.scrollIntoView({ behavior: "smooth" });
              } else {
                window.scrollBy({ top: window.innerHeight * 0.85, behavior: "smooth" });
              }
            }}
            className="group relative flex flex-col items-center cursor-pointer select-none outline-none focus:outline-none"
            style={{
              animation: showScrollCue && !hasScrolled ? "royalScrollTugCycle 3.8s ease-in-out infinite" : "none",
            }}
            aria-label="Scroll down to explore wedding festivities"
          >
            {/* Ambient Gold Glow Halo behind Capsule */}
            <div
              className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#d4af37]/20 via-[#fde68a]/35 to-[#d4af37]/20 blur-md pointer-events-none"
              style={{ animation: "pulseGlowAura 3.6s ease-in-out infinite" }}
            />

            {/* Frosted Glass Royal Scroll Capsule */}
            <div className="relative flex items-center gap-2.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-black/55 backdrop-blur-md border border-[#fde68a]/35 group-hover:border-[#fde68a]/80 shadow-[0_8px_32px_rgba(0,0,0,0.8),0_0_18px_rgba(253,230,138,0.2)] group-hover:shadow-[0_8px_32px_rgba(0,0,0,0.9),0_0_28px_rgba(253,230,138,0.45)] transition-all duration-300 group-hover:scale-[1.03] group-active:scale-95">
              
              {/* Tactile Gliding Pearl Indicator */}
              <div className="w-3.5 h-6 rounded-full border border-[#fde68a]/60 flex items-center justify-center p-0.5 overflow-hidden">
                <div
                  className="w-1.5 h-2 rounded-full bg-gradient-to-b from-[#ffffff] via-[#fde68a] to-[#d4af37] shadow-[0_0_6px_#fde68a]"
                  style={{ animation: "scrollDropletSlide 1.8s ease-in-out infinite" }}
                />
              </div>

              {/* Shimmering Royal Whisper Prompt */}
              <span
                className="font-serif italic text-xs sm:text-[13px] tracking-[0.16em] uppercase text-[#fde68a] drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] whitespace-nowrap"
                style={{
                  background: "linear-gradient(90deg, #d4af37 0%, #ffffff 50%, #d4af37 100%)",
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  animation: "goldSheenScroll 3.6s linear infinite",
                }}
              >
                {wedding?.language === "hi" ? "✦ शुभ कार्यक्रम देखें ✦" : "✦ Scroll to Explore ✦"}
              </span>

              <span className="text-[10px] text-[#fde68a]/70 group-hover:text-[#fde68a] transition-colors">
                ✦
              </span>
            </div>

            {/* Cascading Golden Chevrons beneath Capsule */}
            <div className="flex flex-col items-center -space-y-1 mt-1 text-[#fde68a] opacity-80 group-hover:opacity-100 transition-opacity">
              <svg
                className="w-3.5 h-3.5 text-[#fde68a]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ animation: "chevronCascade1 1.6s ease-in-out infinite" }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
              <svg
                className="w-3.5 h-3.5 text-[#fde68a]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ animation: "chevronCascade2 1.6s ease-in-out infinite 0.2s" }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>

            {/* Animated Golden Pull Gesture Cue (Touch ring & downward drag trail) */}
            <div
              className="flex flex-col items-center pointer-events-none mt-1"
              style={{
                animation: "scrollGestureSlideDown 3.8s cubic-bezier(0.25, 1, 0.5, 1) infinite",
              }}
            >
              {/* Glowing Touch Point Ring */}
              <div className="relative flex items-center justify-center">
                <div
                  className="absolute w-5 h-5 rounded-full border border-[#fde68a]/70 pointer-events-none"
                  style={{ animation: "gestureRipple 1.9s ease-out infinite" }}
                />
                <div className="w-2 h-2 rounded-full bg-gradient-to-br from-[#ffffff] via-[#fde68a] to-[#d4af37] shadow-[0_0_8px_#fde68a]" />
              </div>
              {/* Downward Drag Trail */}
              <div className="w-[1.5px] h-3.5 bg-gradient-to-b from-[#fde68a] to-transparent mt-0.5 opacity-80" />
            </div>

            {/* Slender Golden Stardust Beam plunging into the depths below */}
            <div className="w-[1.5px] h-7 relative overflow-hidden -mt-1 opacity-70">
              <div
                className="absolute inset-x-0 w-full h-3.5"
                style={{
                  background: "linear-gradient(180deg, transparent 0%, #ffffff 50%, #fde68a 80%, transparent 100%)",
                  animation: "descendingStardustBeam 2.2s ease-in-out infinite",
                }}
              />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}

