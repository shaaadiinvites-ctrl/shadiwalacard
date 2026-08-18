"use client";

import { useEffect, useRef } from "react";

export function Fireflies({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let dust: any[] = [];
    
    // Mouse tracking
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const resize = () => {
      canvas.width = canvas.clientWidth || window.innerWidth;
      canvas.height = canvas.clientHeight || window.innerHeight;
      
      const isMobile = window.innerWidth <= 768;
      const particleCount = isMobile ? 0 : 120;
      
      dust = Array.from({ length: particleCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        s: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.5,
        vy: Math.random() * -0.5 - 0.2,
        phase: Math.random() * Math.PI * 2
      }));
    };

    window.addEventListener("resize", resize);
    resize();

    const render = () => {
      const now = performance.now();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(255, 217, 138, 0.9)";
      
      for (let p of dust) {
        // Mouse repel
        let dx = p.x - mouseX;
        // In the original, it was offset by scroll, but since we are fixed, we don't need scroll offset
        let dy = p.y - mouseY;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
           p.x += dx * 0.03;
           p.y += dy * 0.03;
        }
        
        p.x += p.vx + Math.sin(now * 0.001 + p.phase) * 0.3;
        p.y += p.vy;
        
        // Wrap around
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        
        let alpha = 0.3 + Math.sin(now * 0.002 + p.phase) * 0.5;
        ctx.globalAlpha = Math.max(0, alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 8;
        ctx.shadowColor = "rgba(255, 217, 138, 1)";
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className={className || "fixed inset-0 z-0 pointer-events-none w-full h-full mix-blend-screen opacity-80"}
    />
  );
}
