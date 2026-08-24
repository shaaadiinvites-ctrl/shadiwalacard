"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

export default function ConfettiEffect() {
  useEffect(() => {
    // A massive "realistic popper" explosion from the center-top (where the heading is)
    const count = 300;
    const defaults = {
      origin: { y: 0.3 }, // Near the "Payment Successful" heading
      zIndex: 1000,
      colors: ['#2e1065', '#9d174d', '#F59E0B', '#38bdf8', '#f5d0fe', '#ffffff', '#FFD700']
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti(Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio)
      }));
    }

    const timeout = setTimeout(() => {
      // Fire a combination of different shapes/speeds for a realistic spill
      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    }, 300); // 300ms delay to ensure page is visible
    
    // Optional: Follow up with a side-cannon shower
    const timeout2 = setTimeout(() => {
      confetti({
        particleCount: 100,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: defaults.colors,
        zIndex: 1000
      });
      confetti({
        particleCount: 100,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: defaults.colors,
        zIndex: 1000
      });
    }, 1800);

    return () => {
      clearTimeout(timeout);
      clearTimeout(timeout2);
    };
  }, []);

  return null;
}
