"use client";

import { useEffect, useRef } from "react";
import { useScroll, useSpring, useAnimationFrame } from "framer-motion";

const flowersData = [
  // Top Left Cluster
  { src: "/project3-assets/burgundy_rose.png", className: "absolute left-[8%] md:left-[2%] top-[2%] w-[clamp(80px,18vw,220px)] md:drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)] z-10", rot: 15, amp: 15, k: 0.65 },
  { src: "/project3-assets/champagne_lotus.png", className: "absolute left-[15%] md:left-[12%] top-[-2%] w-[clamp(45px,11vw,120px)] opacity-80 md:blur-[1px] z-[3]", rot: -25, amp: 10, k: 0.4 },
  { src: "/project3-assets/marigold_petals.png", className: "absolute left-[20%] md:left-[18%] top-[12%] w-[clamp(30px,7vw,75px)] opacity-50 md:blur-[3px] z-[-1]", rot: 45, amp: 20, k: 0.15 },

  // Top Right Cluster
  { src: "/project3-assets/marigold_petals.png", className: "absolute right-[8%] md:right-[2%] top-[5%] w-[clamp(60px,13vw,150px)] opacity-85 md:drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)] z-10", rot: -15, amp: 12, k: 0.5 },
  { src: "/project3-assets/burgundy_rose.png", className: "absolute right-[15%] md:right-[12%] top-[1%] w-[clamp(35px,8vw,90px)] opacity-60 md:blur-[2px] z-[-1]", rot: 70, amp: 18, k: 0.25 },

  // Top Center
  { src: "/project3-assets/champagne_lotus.png", className: "absolute left-[45%] top-[10%] w-[clamp(40px,9vw,110px)] opacity-60 md:blur-[1px] z-[3]", rot: -15, amp: 10, k: 0.4 },
  { src: "/project3-assets/marigold_petals.png", className: "absolute left-[55%] top-[16%] w-[clamp(30px,7vw,85px)] opacity-45 md:blur-[3px] z-[-1]", rot: 55, amp: 15, k: 0.1 },

  // User Marker: Massive Left Swirl
  { src: "/project3-assets/burgundy_rose.png", className: "absolute left-[12%] md:left-[10%] top-[40%] w-[clamp(70px,16vw,180px)] opacity-85 md:drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)] z-10", rot: -25, amp: 20, k: 0.75 },
  { src: "/project3-assets/champagne_lotus.png", className: "absolute left-[8%] md:left-[5%] top-[32%] w-[clamp(45px,11vw,120px)] opacity-70 md:blur-[1px] z-[3]", rot: 15, amp: 12, k: 0.5 },
  { src: "/project3-assets/marigold_petals.png", className: "absolute left-[20%] md:left-[18%] top-[50%] w-[clamp(35px,8vw,90px)] opacity-50 md:blur-[2px] z-[-1]", rot: 60, amp: 25, k: 0.2 },

  // User Marker: Large Right Circle
  { src: "/project3-assets/champagne_lotus.png", className: "absolute right-[15%] md:right-[12%] top-[45%] w-[clamp(60px,14vw,150px)] opacity-80 md:drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)] z-10", rot: 35, amp: 15, k: 0.6 },
  { src: "/project3-assets/burgundy_rose.png", className: "absolute right-[10%] md:right-[6%] top-[52%] w-[clamp(40px,9vw,95px)] opacity-60 md:blur-[2px] z-[-1]", rot: -15, amp: 10, k: 0.2 },

  // Mid-Right
  { src: "/project3-assets/champagne_lotus.png", className: "absolute right-[10%] md:right-[2%] top-[22%] w-[clamp(85px,20vw,240px)] md:drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)] z-10", rot: -30, amp: 18, k: 0.7 },
  { src: "/project3-assets/marigold_petals.png", className: "absolute right-[20%] md:right-[16%] top-[26%] w-[clamp(25px,6vw,70px)] opacity-45 md:blur-[4px] z-[-1]", rot: 120, amp: 22, k: 0.15 },

  // Bottom Left
  { src: "/project3-assets/champagne_lotus.png", className: "absolute left-[10%] md:left-[2%] top-[78%] w-[clamp(90px,22vw,260px)] md:drop-shadow-[0_10px_25px_rgba(0,0,0,0.2)] z-10", rot: 50, amp: 15, k: 0.8 },
  { src: "/project3-assets/burgundy_rose.png", className: "absolute left-[20%] md:left-[16%] top-[85%] w-[clamp(35px,9vw,95px)] opacity-60 md:blur-[2px] z-[-1]", rot: -60, amp: 12, k: 0.4 },
  { src: "/project3-assets/marigold_petals.png", className: "absolute left-[12%] md:left-[6%] top-[65%] w-[clamp(50px,12vw,140px)] opacity-75 z-[3]", rot: 85, amp: 10, k: 0.6 },

  // Bottom Right
  { src: "/project3-assets/burgundy_rose.png", className: "absolute right-[10%] md:right-[2%] top-[82%] w-[clamp(75px,18vw,210px)] md:drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)] z-10", rot: -10, amp: 20, k: 0.75 },
  { src: "/project3-assets/champagne_lotus.png", className: "absolute right-[20%] md:right-[16%] top-[86%] w-[clamp(50px,12vw,130px)] opacity-80 z-[3]", rot: 35, amp: 12, k: 0.5 },
  { src: "/project3-assets/marigold_petals.png", className: "absolute right-[28%] md:right-[24%] top-[92%] w-[clamp(30px,7vw,80px)] opacity-50 md:blur-[3px] z-[-1]", rot: -80, amp: 18, k: 0.2 },
];

export function FlowersOverlay() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  // A very tight spring with low mass. This eliminates the "lag/snap" feeling of a loose spring
  // while still interpolating the jagged sparse scroll events on mobile to prevent vibration.
  const smoothY = useSpring(scrollY, { stiffness: 800, damping: 100, mass: 0.1, restDelta: 0.0001 });
  
  const configsRef = useRef<any[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;
    const els = Array.from(containerRef.current.children) as HTMLElement[];
    const isMobile = window.innerWidth <= 768;

    configsRef.current = els.map((el, i) => {
      const data = flowersData[i];
      // Desktop uses original values. Mobile gets a slight boost to stick around longer, 
      // but capped at 0.85 so they still visibly move up (net scroll -0.15x to -0.35x).
      const adjustedK = isMobile ? Math.min(0.85, data.k + 0.25) : data.k; 
      
      return {
        el,
        phase: Math.random() * Math.PI * 2,
        speed: 0.0005 + Math.random() * 0.001,
        amp: data.amp,
        rot: data.rot,
        k: adjustedK
      };
    });
  }, []);

  useAnimationFrame((t) => {
    // Use the tight spring to prevent both vibration (from raw scroll) and lag/snap (from loose spring)
    const currentScrollY = smoothY.get();
    
    for (let i = 0; i < configsRef.current.length; i++) {
      const { el, phase, speed, amp, rot, k } = configsRef.current[i];
      
      const swayY = Math.sin(t * speed + phase) * amp;
      const swayX = Math.cos(t * (speed * 0.8) + phase) * (amp * 0.5);
      
      el.style.transform = `translate3d(${swayX}px, ${(currentScrollY * k) + swayY}px, 0) rotate(${rot}deg)`;
    }
  });

  return (
    <div ref={containerRef} className="absolute left-0 top-0 w-full h-[100vh] pointer-events-none z-[5]">
      {flowersData.map((f, i) => (
        <img 
          key={i}
          src={f.src}
          alt=""
          className={f.className}
          style={{ transform: `rotate(${f.rot}deg)`, willChange: 'transform' }}
        />
      ))}
    </div>
  );
}
