"use client";

import { useEffect, useRef } from "react";

export function Starfield({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let stars: any[] = [];

    const resize = () => {
      canvas.width = canvas.clientWidth || window.innerWidth;
      canvas.height = canvas.clientHeight || window.innerHeight;
      
      const isMobile = window.innerWidth <= 768;
      const starCount = isMobile ? 20 : 350;
      
      stars = Array.from({ length: starCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        s: Math.random() * 1.5 + 0.2,
        a: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.03 + 0.005,
        phase: Math.random() * Math.PI * 2
      }));
    };

    window.addEventListener("resize", resize);
    resize();

    const render = () => {
      const now = performance.now();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#ffffff";
      
      for (let s of stars) {
        let twinkle = Math.sin(now * s.twinkleSpeed + s.phase) * 0.4;
        ctx.globalAlpha = Math.max(0, Math.min(1, s.a + twinkle));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.s, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className={className || "fixed inset-0 z-[-2] pointer-events-none w-full h-full"}
    />
  );
}
