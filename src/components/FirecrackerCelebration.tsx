"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";

// Fixed-size pools to achieve 0-garbage-collection at 60fps
const MAX_ROCKETS = 30;
const MAX_SPARKS = 2500;
const MAX_FLASHES = 10;
const MAX_FLOWERS = 400;

const BLESSING_SALVO_DELAYS = [0, 180, 360, 550, 750]; // 5 staggered blessing rockets
const PALACE_SALVO_DELAYS = [0, 350, 750, 1200, 1700, 2250, 2800, 3200]; // 8 royal intro rockets
const LEGACY_PROTOTYPE_SLUG = "vishal-yadav-weds-pooja-2026";
const LEGACY_PROTOTYPE_COUNT = 1284;

const BOTANICAL_ASSETS = [
  "/project3-assets/burgundy_rose.png",
  "/project3-assets/champagne_lotus.png",
  "/project3-assets/marigold_petals.png",
];

interface Palette {
  name: string;
  coreColors: string[];
  willowSprite: string;
  willowHex: string;
  strobeSprite: string;
}

const PALETTES: Palette[] = [
  // 1. 24K Crown Gold & Diamond White
  {
    name: "crown-gold",
    coreColors: ["gold", "amber", "white"],
    willowSprite: "gold",
    willowHex: "#fde68a",
    strobeSprite: "white",
  },
  // 2. Ruby Rose & Champagne
  {
    name: "ruby-rose",
    coreColors: ["ruby", "rose", "gold"],
    willowSprite: "rose",
    willowHex: "#fda4af",
    strobeSprite: "gold",
  },
  // 3. Royal Emerald & Gold
  {
    name: "royal-emerald",
    coreColors: ["emerald", "mint", "gold"],
    willowSprite: "emerald",
    willowHex: "#a7f3d0",
    strobeSprite: "white",
  },
  // 4. Starlight Sapphire & Silver-Gold
  {
    name: "starlight-sapphire",
    coreColors: ["sapphire", "sky", "gold"],
    willowSprite: "sapphire",
    willowHex: "#93c5fd",
    strobeSprite: "white",
  },
];

interface RocketParticle {
  active: boolean;
  x: number;
  y: number;
  targetY: number;
  vx: number;
  vy: number;
  gravity: number;
  age: number;
  phase: number;
  paletteIndex: number;
  mode: "sparks" | "flowers";
}

interface SparkParticle {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  drag: number;
  gravity: number;
  alpha: number;
  decay: number;
  size: number;
  spriteKey: string;
  type: "willow" | "core" | "strobe" | "propellant" | "pollen";
  trailX: Float32Array; // length 5 circular buffer
  trailY: Float32Array;
  trailIndex: number;
  trailCount: number;
  age: number;
  id: number;
  colorHex: string;
}

interface FloralParticle {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  terminalVy: number;
  uniqueFreq: number;
  uniquePhase: number;
  size: number;
  scale: number;
  alpha: number;
  rotation: number;
  rotSpeed: number;
  age: number;
  maxAge: number;
  progress: number;
  hasPoppedSparkles: boolean;
  spriteIndex: number; // 0: rose, 1: lotus, 2: marigold
}

interface SkyFlashParticle {
  active: boolean;
  x: number;
  y: number;
  alpha: number;
  decay: number;
}

// Generate pre-rendered radial glow sprites (32x32) for zero shadowBlur GPU cost
function createGlowSprite(core: string, mid: string, outer: string): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = 32;
  c.height = 32;
  const ctx = c.getContext("2d");
  if (!ctx) return c;
  const rad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  rad.addColorStop(0, core);
  rad.addColorStop(0.35, mid);
  rad.addColorStop(0.7, outer);
  rad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = rad;
  ctx.fillRect(0, 0, 32, 32);
  return c;
}

// Generate large atmospheric sky flash sprite (440x440)
function createFlashSprite(): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = 440;
  c.height = 440;
  const ctx = c.getContext("2d");
  if (!ctx) return c;
  const rad = ctx.createRadialGradient(220, 220, 0, 220, 220, 220);
  rad.addColorStop(0, "rgba(255, 255, 245, 0.95)");
  rad.addColorStop(0.25, "rgba(253, 230, 138, 0.45)");
  rad.addColorStop(0.65, "rgba(245, 158, 11, 0.12)");
  rad.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = rad;
  ctx.fillRect(0, 0, 440, 440);
  return c;
}

export interface FirecrackerCelebrationProps {
  weddingSlug?: string;
  initialCount?: number;
}

export default function FirecrackerCelebration({
  weddingSlug,
  initialCount,
}: FirecrackerCelebrationProps = {}) {
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Every newly created template starts with 0. The legacy prototype invite ("vishal-yadav-weds-pooja-2026") retains 1284.
  const initialBaseCount = typeof initialCount === "number"
    ? initialCount
    : (weddingSlug === LEGACY_PROTOTYPE_SLUG ? LEGACY_PROTOTYPE_COUNT : 0);

  const storageKey = weddingSlug
    ? `shadi_blessings_${weddingSlug}`
    : "shadi_blessings_default";

  // Blessing counter state & persistence
  const [blessings, setBlessings] = useState(initialBaseCount);
  const [isCounterPopped, setIsCounterPopped] = useState(false);

  // Animation and pool references (stable across renders)
  const isSleepingRef = useRef(true);
  const animFrameIdRef = useRef<number | null>(null);
  const spritesRef = useRef<Record<string, HTMLCanvasElement>>({});
  const flashSpriteRef = useRef<HTMLCanvasElement | null>(null);
  const flowerSpritesRef = useRef<HTMLCanvasElement[]>([]);

  // Pre-allocated object pools
  const rocketsRef = useRef<RocketParticle[]>([]);
  const sparksRef = useRef<SparkParticle[]>([]);
  const flowersRef = useRef<FloralParticle[]>([]);
  const flashesRef = useRef<SkyFlashParticle[]>([]);

  // Timeouts for staggered salvos
  const salvoTimeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Load persisted blessings on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored !== null) {
        const val = parseInt(stored, 10);
        if (!isNaN(val) && val >= 0) {
          setBlessings(val);
          return;
        }
      }
      // Check legacy global key for the prototype invite if not yet migrated
      if (weddingSlug === LEGACY_PROTOTYPE_SLUG) {
        const legacy = localStorage.getItem("shadi_blessings_count");
        if (legacy !== null) {
          const val = parseInt(legacy, 10);
          if (!isNaN(val) && val >= LEGACY_PROTOTYPE_COUNT) {
            setBlessings(val);
            return;
          }
        }
      }
      setBlessings(initialBaseCount);
    } catch {
      // LocalStorage fallback
      setBlessings(initialBaseCount);
    }
  }, [storageKey, initialBaseCount, weddingSlug]);

  // Initialize pools, sprite atlas, and botanical offscreen canvases once on mount
  useEffect(() => {
    setMounted(true);

    // 1. Build Pre-Rendered Sprite Atlas (Zero ctx.shadowBlur in main loop)
    spritesRef.current = {
      white: createGlowSprite("#ffffff", "rgba(255, 255, 255, 0.9)", "rgba(255, 255, 255, 0.2)"),
      gold: createGlowSprite("#ffffff", "#fde68a", "#d4af37"),
      amber: createGlowSprite("#fffbeb", "#f59e0b", "#b45309"),
      ruby: createGlowSprite("#fff1f2", "#ff2a55", "#9f1239"),
      rose: createGlowSprite("#fff1f2", "#fda4af", "#e11d48"),
      emerald: createGlowSprite("#ecfdf5", "#34d399", "#047857"),
      mint: createGlowSprite("#f0fdf4", "#a7f3d0", "#10b981"),
      sapphire: createGlowSprite("#eff6ff", "#60a5fa", "#1d4ed8"),
      sky: createGlowSprite("#f0f9ff", "#e0f2fe", "#0284c7"),
    };
    flashSpriteRef.current = createFlashSprite();

    // 2. Pre-cache 48x48px offscreen canvases for the 3 botanical assets (Zero decoding lag)
    flowerSpritesRef.current = BOTANICAL_ASSETS.map((src) => {
      const offCanvas = document.createElement("canvas");
      offCanvas.width = 48;
      offCanvas.height = 48;
      const ctx = offCanvas.getContext("2d");
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;
      img.onload = () => {
        if (ctx) {
          ctx.clearRect(0, 0, 48, 48);
          ctx.drawImage(img, 0, 0, 48, 48);
        }
      };
      return offCanvas;
    });

    // 3. Pre-allocate Rockets Pool
    rocketsRef.current = Array.from({ length: MAX_ROCKETS }, () => ({
      active: false,
      x: 0,
      y: 0,
      targetY: 0,
      vx: 0,
      vy: 0,
      gravity: 0.15,
      age: 0,
      phase: 0,
      paletteIndex: 0,
      mode: "flowers",
    }));

    // 4. Pre-allocate Sparks Pool with flat Float32Array circular trail buffers
    sparksRef.current = Array.from({ length: MAX_SPARKS }, (_, i) => ({
      active: false,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      drag: 0.958,
      gravity: 0.085,
      alpha: 1,
      decay: 0.012,
      size: 14,
      spriteKey: "gold",
      type: "willow",
      trailX: new Float32Array(5),
      trailY: new Float32Array(5),
      trailIndex: 0,
      trailCount: 0,
      age: 0,
      id: i,
      colorHex: "#fde68a",
    }));

    // 5. Pre-allocate Floral Pool for Pushpavarsha with 3-Stage Rainfall Physics (Zero GC)
    flowersRef.current = Array.from({ length: MAX_FLOWERS }, () => ({
      active: false,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      terminalVy: 2.0,
      uniqueFreq: 0.03,
      uniquePhase: 0,
      size: 24,
      scale: 1.0,
      alpha: 1.0,
      rotation: 0,
      rotSpeed: 0.005,
      age: 0,
      maxAge: 250,
      progress: 0,
      hasPoppedSparkles: false,
      spriteIndex: 0,
    }));

    // 6. Pre-allocate Sky Flashes Pool
    flashesRef.current = Array.from({ length: MAX_FLASHES }, () => ({
      active: false,
      x: 0,
      y: 0,
      alpha: 0,
      decay: 0.032,
    }));

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      salvoTimeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  // Update canvas size with devicePixelRatio cap (max 1.75 for mobile battery/GPU efficiency)
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [mounted, resizeCanvas]);

  // Adjust canvas z-index when scrolling past hero
  useEffect(() => {
    const handleScroll = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      if (window.scrollY > 200 && canvas.style.zIndex !== "60") {
        canvas.style.zIndex = "60";
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Find next inactive spark in pre-allocated pool (0 GC)
  const getInactiveSpark = useCallback((): SparkParticle | null => {
    const sparks = sparksRef.current;
    for (let i = 0; i < MAX_SPARKS; i++) {
      if (!sparks[i].active) return sparks[i];
    }
    return null;
  }, []);

  // Find next inactive floral particle in pre-allocated pool (0 GC)
  const getInactiveFlower = useCallback((): FloralParticle | null => {
    const flowers = flowersRef.current;
    for (let i = 0; i < MAX_FLOWERS; i++) {
      if (!flowers[i].active) return flowers[i];
    }
    return null;
  }, []);

  // Detonate a rocket at its apex into Mode A (Sparks) or Mode B (Flowers / Pushpavarsha)
  const detonateRocket = useCallback((rocket: RocketParticle) => {
    rocket.active = false;
    const isMobile = window.innerWidth < 768;

    // Atmospheric Sky Flash
    const flashes = flashesRef.current;
    for (let i = 0; i < MAX_FLASHES; i++) {
      if (!flashes[i].active) {
        flashes[i].active = true;
        flashes[i].x = rocket.x;
        flashes[i].y = rocket.y;
        flashes[i].alpha = rocket.mode === "flowers" ? 0.22 : 0.28;
        flashes[i].decay = 0.032;
        break;
      }
    }

    if (rocket.mode === "flowers") {
      // ==============================================================
      // MODE B: PUSHPAVARSHA (FLOWER BURST WITH 3-STAGE LIFECYCLE)
      // ==============================================================
      // Stage 1: Wide Canopy Spread (32 to 40 blooming flowers per rocket)
      const flowerCount = Math.floor(32 + Math.random() * 9);
      for (let i = 0; i < flowerCount; i++) {
        const flower = getInactiveFlower();
        if (!flower) break;

        flower.active = true;
        flower.x = rocket.x;
        flower.y = rocket.y;

        // Wide Horizontal Umbrella Spread:
        flower.vx = (Math.random() - 0.5) * 14;
        flower.vy = -2 - Math.random() * 6;
        flower.terminalVy = 1.6 + Math.random() * 1.4; // 1.6 to 3.0 px/frame randomized terminal speed
        flower.uniqueFreq = 0.025 + Math.random() * 0.035;
        flower.uniquePhase = Math.random() * Math.PI * 2;

        flower.size = 20 + Math.random() * 16; // 20px to 36px
        flower.scale = 1.0;
        flower.alpha = 1.0;

        // Completely independent, very slow drift rotation (half clockwise, half counter-clockwise)
        flower.rotSpeed = (Math.random() - 0.5) * 0.015;
        flower.rotation = Math.random() * Math.PI * 2;

        flower.age = 0;
        flower.maxAge = 230 + Math.floor(Math.random() * 50); // ~3.8s to 4.7s of steady fall
        flower.progress = 0;
        flower.hasPoppedSparkles = false;
        flower.spriteIndex = Math.floor(Math.random() * BOTANICAL_ASSETS.length);
      }

      // Plus 20 warm golden pollen sparkles for magical shimmer
      for (let p = 0; p < 20; p++) {
        const pollen = getInactiveSpark();
        if (!pollen) break;

        pollen.active = true;
        pollen.x = rocket.x;
        pollen.y = rocket.y;
        pollen.type = "pollen";
        pollen.spriteKey = Math.random() > 0.3 ? "gold" : "amber";
        pollen.colorHex = "#fde68a";
        pollen.size = isMobile ? 8 : 10;
        pollen.alpha = 0.95;
        pollen.decay = 0.016 + Math.random() * 0.008;
        pollen.drag = 0.94;
        pollen.gravity = 0.045;
        pollen.age = 0;
        pollen.trailCount = 0;

        const theta = Math.random() * Math.PI * 2;
        const speed = 2.0 + Math.random() * 3.5;
        pollen.vx = Math.cos(theta) * speed;
        pollen.vy = Math.sin(theta) * speed;
      }
    } else {
      // ==============================================================
      // MODE A: ROYAL SPARK FIRECRACKERS (OPENING SALVO)
      // ==============================================================
      const burstCount = isMobile ? 90 : 130;
      const willowCount = Math.round(burstCount * 0.60);
      const coreCount = Math.round(burstCount * 0.25);
      const strobeCount = burstCount - willowCount - coreCount;
      const palette = PALETTES[rocket.paletteIndex];

      // Outer Ring — High-Velocity Brocade Willow Trails (60%)
      for (let i = 0; i < willowCount; i++) {
        const spark = getInactiveSpark();
        if (!spark) break;

        spark.active = true;
        spark.x = rocket.x;
        spark.y = rocket.y;
        spark.type = "willow";
        spark.colorHex = palette.willowHex;
        spark.spriteKey = palette.willowSprite;
        spark.size = isMobile ? 12 : 15;
        spark.alpha = 1.0;
        spark.decay = 0.010 + Math.random() * 0.004;
        spark.drag = 0.958;
        spark.gravity = 0.085;
        spark.age = 0;
        spark.trailCount = 0;
        spark.trailIndex = 0;

        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(1 - 2 * Math.random());
        const speed = 5.5 + Math.random() * 4.0;
        spark.vx = speed * Math.sin(phi) * Math.cos(theta);
        spark.vy = speed * Math.sin(phi) * Math.sin(theta);
      }

      // Inner Core — Peony Color Heart (25%)
      for (let i = 0; i < coreCount; i++) {
        const spark = getInactiveSpark();
        if (!spark) break;

        spark.active = true;
        spark.x = rocket.x;
        spark.y = rocket.y;
        spark.type = "core";
        const coreKey = palette.coreColors[Math.floor(Math.random() * palette.coreColors.length)];
        spark.spriteKey = coreKey;
        spark.colorHex = palette.willowHex;
        spark.size = isMobile ? 14 : 18;
        spark.alpha = 1.0;
        spark.decay = 0.016 + Math.random() * 0.006;
        spark.drag = 0.94;
        spark.gravity = 0.06;
        spark.age = 0;
        spark.trailCount = 0;
        spark.trailIndex = 0;

        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(1 - 2 * Math.random());
        const speed = 2.5 + Math.random() * 2.3;
        spark.vx = speed * Math.sin(phi) * Math.cos(theta);
        spark.vy = speed * Math.sin(phi) * Math.sin(theta);
      }

      // Delayed Finale — "Time-Rain" Diamond Strobe Crackle (15%)
      for (let i = 0; i < strobeCount; i++) {
        const spark = getInactiveSpark();
        if (!spark) break;

        spark.active = true;
        spark.x = rocket.x;
        spark.y = rocket.y;
        spark.type = "strobe";
        spark.spriteKey = palette.strobeSprite;
        spark.colorHex = "#ffffff";
        spark.size = isMobile ? 12 : 16;
        spark.alpha = 1.0;
        spark.decay = 0.009 + Math.random() * 0.003;
        spark.drag = 0.95;
        spark.gravity = 0.075;
        spark.age = 0;
        spark.trailCount = 0;
        spark.trailIndex = 0;

        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(1 - 2 * Math.random());
        const speed = 3.5 + Math.random() * 2.5;
        spark.vx = speed * Math.sin(phi) * Math.cos(theta);
        spark.vy = speed * Math.sin(phi) * Math.sin(theta);
      }
    }
  }, [getInactiveSpark, getInactiveFlower]);

  // Main 60fps Animation Loop with Batched Path Rendering & Zero shadowBlur
  const runAnimationLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const isMobile = width < 768;

    let activeCount = 0;

    // Clear canvas frame
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Atmospheric Sky Flashes
    const flashes = flashesRef.current;
    const flashSprite = flashSpriteRef.current;
    if (flashSprite) {
      for (let i = 0; i < MAX_FLASHES; i++) {
        const f = flashes[i];
        if (!f.active) continue;
        f.alpha -= f.decay;
        if (f.alpha <= 0) {
          f.active = false;
        } else {
          activeCount++;
          ctx.save();
          ctx.globalCompositeOperation = "lighter";
          ctx.globalAlpha = f.alpha;
          ctx.drawImage(flashSprite, f.x - 220, f.y - 220, 440, 440);
          ctx.restore();
        }
      }
    }

    // 2. Update and Draw Rockets & Propellant Tails
    const rockets = rocketsRef.current;
    for (let i = 0; i < MAX_ROCKETS; i++) {
      const r = rockets[i];
      if (!r.active) continue;

      activeCount++;
      r.age++;
      r.vy += r.gravity;
      r.y += r.vy;
      // Sinusoidal horizontal Mach-wobble as rocket climbs
      r.x += r.vx + Math.sin(r.age * 0.4 + r.phase) * 1.3;

      // Spawn 3 propellant sparks per frame from rocket nozzle
      for (let p = 0; p < 3; p++) {
        const propSpark = getInactiveSpark();
        if (propSpark) {
          propSpark.active = true;
          propSpark.x = r.x + (Math.random() - 0.5) * 4;
          propSpark.y = r.y + (Math.random() - 0.5) * 4;
          propSpark.vx = (Math.random() - 0.5) * 1.8;
          propSpark.vy = Math.random() * 2.8 + 1.6; // Downward ejection
          propSpark.drag = 0.94;
          propSpark.gravity = 0.05;
          propSpark.alpha = 0.95;
          propSpark.decay = 0.045; // Rapid fade
          propSpark.size = 8;
          propSpark.spriteKey = Math.random() > 0.4 ? "gold" : "amber";
          propSpark.type = "propellant";
          propSpark.age = 0;
          propSpark.trailCount = 0;
        }
      }

      // Detonation check: reached apex target or vertical velocity stalling
      if (r.y <= r.targetY || r.vy >= -0.5) {
        detonateRocket(r);
      }
    }

    // 3. Batched Path Rendering for Weeping-Willow Trails
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.lineWidth = 1.6;
    ctx.lineCap = "round";

    const sparks = sparksRef.current;
    const trailColors = ["#fde68a", "#fda4af", "#a7f3d0", "#93c5fd"];

    for (let c = 0; c < trailColors.length; c++) {
      const color = trailColors[c];
      let hasPaths = false;

      for (let i = 0; i < MAX_SPARKS; i++) {
        const s = sparks[i];
        if (!s.active || s.type !== "willow" || s.colorHex !== color || s.trailCount < 2) continue;

        if (!hasPaths) {
          ctx.strokeStyle = color;
          ctx.beginPath();
          hasPaths = true;
        }

        const start = (s.trailIndex - s.trailCount + 5) % 5;
        ctx.moveTo(s.trailX[start], s.trailY[start]);
        for (let k = 1; k < s.trailCount; k++) {
          const idx = (start + k) % 5;
          ctx.lineTo(s.trailX[idx], s.trailY[idx]);
        }
        ctx.lineTo(s.x, s.y);
      }

      if (hasPaths) {
        ctx.stroke();
      }
    }
    ctx.restore();

    // 4. Update Sparks and Render Glowing Sprites (GPU Texture Blit via drawImage)
    const sprites = spritesRef.current;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    // Draw rocket heads with bright gold/white core
    for (let i = 0; i < MAX_ROCKETS; i++) {
      const r = rockets[i];
      if (!r.active) continue;
      const goldSpr = sprites["gold"];
      const whiteSpr = sprites["white"];
      if (goldSpr) {
        ctx.globalAlpha = 1.0;
        ctx.drawImage(goldSpr, r.x - 12, r.y - 12, 24, 24);
      }
      if (whiteSpr) {
        ctx.drawImage(whiteSpr, r.x - 6, r.y - 6, 12, 12);
      }
    }

    // Draw all active sparks, pollen, and magic fairy dust
    for (let i = 0; i < MAX_SPARKS; i++) {
      const s = sparks[i];
      if (!s.active) continue;

      activeCount++;
      s.age++;
      s.alpha -= s.decay;

      if (s.alpha <= 0) {
        s.active = false;
        continue;
      }

      // Record trail history for weeping willow sparks
      if (s.type === "willow") {
        s.trailX[s.trailIndex] = s.x;
        s.trailY[s.trailIndex] = s.y;
        s.trailIndex = (s.trailIndex + 1) % 5;
        if (s.trailCount < 5) s.trailCount++;
      }

      // Physics: Stokes' air drag & gravity
      s.vx *= s.drag;
      s.vy *= s.drag;
      s.vy += s.gravity;
      s.x += s.vx;
      s.y += s.vy;

      let spr = sprites[s.spriteKey] || sprites["gold"];
      let drawSize = s.size;
      let displayAlpha = s.alpha;

      // Twinkling shimmer for magic pollen & fairy dust
      if (s.type === "pollen") {
        displayAlpha = s.alpha * (0.65 + 0.35 * Math.sin(s.age * 1.5));
      }

      // Delayed Finale: "Time-Rain" Diamond Strobe Crackle in final 35% of life
      if (s.type === "strobe" && s.alpha < 0.35) {
        const shimmer = Math.sin(s.age * 2.2 + s.id);
        if (shimmer > 0.65) {
          spr = sprites["white"];
          displayAlpha = 1.0;
          drawSize = s.size * 1.35;
        } else {
          displayAlpha = s.alpha * 0.35;
        }
      }

      ctx.globalAlpha = Math.max(0, Math.min(1, displayAlpha));
      const half = drawSize * 0.5;
      ctx.drawImage(spr, s.x - half, s.y - half, drawSize, drawSize);
    }
    ctx.restore();

    // 5. Update and Render Pushpavarsha Flowers with 3-Stage Lifecycle
    // (Spread Wide -> Parachute Rain Fall -> Sparkle Pop Vanish)
    const flowers = flowersRef.current;
    const flowerSprites = flowerSpritesRef.current;

    for (let i = 0; i < MAX_FLOWERS; i++) {
      const f = flowers[i];
      if (!f.active) continue;

      activeCount++;
      f.age++;
      f.progress = Math.min(1.0, f.age / f.maxAge);

      // --- Stage 1 & 2: Wide Spread & Parachute Rain Fall ---
      // Smooth horizontal air drag (smooths out initial umbrella spread over ~0.4s)
      f.vx *= 0.94;
      // Smoothly accelerate downward to individual terminal fall speed
      f.vy += (f.terminalVy - f.vy) * 0.06;
      // Tiny independent air drift (unique frequency & phase per flower)
      f.x += f.vx + Math.sin(f.age * f.uniqueFreq + f.uniquePhase) * 0.45;
      f.y += f.vy;
      // Completely independent, very slow drift rotation (never in sync)
      f.rotation += f.rotSpeed;

      // --- Stage 2 & 3: Stay 100% Solid & Vibrant, then Sparkle Pop Vanish ---
      if (f.progress < 0.82) {
        // Stay 100% Solid & Vibrant the entire fall down the screen
        f.scale = 1.0;
        f.alpha = 1.0;
      } else {
        // Quick scale-down & fade over final 18% of life (~0.45s)
        const t = (f.progress - 0.82) / 0.18;
        f.scale = Math.max(0, 1.0 - t);
        f.alpha = Math.max(0, 1.0 - t);

        // Burst into Golden & Rose Micro-Sparkles on Vanish
        if (!f.hasPoppedSparkles) {
          f.hasPoppedSparkles = true;
          const sparkleCount = Math.floor(6 + Math.random() * 3); // 6 to 8 sparkles
          for (let s = 0; s < sparkleCount; s++) {
            const sp = getInactiveSpark();
            if (!sp) break;

            sp.active = true;
            sp.x = f.x + (Math.random() - 0.5) * 8;
            sp.y = f.y + (Math.random() - 0.5) * 8;
            sp.type = "pollen";
            const rVal = Math.random();
            sp.spriteKey = rVal < 0.45 ? "gold" : (rVal < 0.75 ? "white" : "rose");
            sp.colorHex = sp.spriteKey === "gold" ? "#fde68a" : (sp.spriteKey === "white" ? "#ffffff" : "#fda4af");
            sp.size = isMobile ? 7 : 10;
            sp.alpha = 1.0;
            sp.decay = 0.042; // ~400ms fadeout
            sp.drag = 0.94;
            sp.gravity = 0.02;

            const sAngle = Math.random() * Math.PI * 2;
            const sSpeed = 0.8 + Math.random() * 1.4; // 0.8 to 2.2
            sp.vx = Math.cos(sAngle) * sSpeed;
            sp.vy = Math.sin(sAngle) * sSpeed - 0.3;
            sp.age = 0;
            sp.trailCount = 0;
          }
        }
      }

      // Check expiry
      if (f.alpha < 0.01 || f.progress >= 1.0) {
        f.active = false;
        continue;
      }

      // Render botanical sprite at natural 1:1 aspect ratio (NO squashing, NO tilt3DX/tilt3DY)
      const spr = flowerSprites[f.spriteIndex];
      if (spr) {
        ctx.save();
        ctx.globalCompositeOperation = "source-over"; // Natural botanical rendering
        ctx.globalAlpha = Math.max(0, Math.min(1, f.alpha));
        ctx.translate(f.x, f.y);
        ctx.rotate(f.rotation);
        ctx.scale(f.scale, f.scale); // Uniform scale, no 3D squash
        const halfSize = f.size * 0.5;
        ctx.drawImage(spr, -halfSize, -halfSize, f.size, f.size);
        ctx.restore();
      }
    }

    // 6. Conditional Auto-Sleep Architecture (0% Idle CPU/GPU/Battery cost)
    if (activeCount > 0) {
      animFrameIdRef.current = requestAnimationFrame(runAnimationLoop);
    } else {
      isSleepingRef.current = true;
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
      ctx.clearRect(0, 0, width, height);
      if (canvasRef.current) {
        canvasRef.current.style.visibility = "hidden";
      }
    }
  }, [detonateRocket, getInactiveSpark]);

  // Wake up animation loop on launch
  const wakeUpEngine = useCallback(() => {
    if (canvasRef.current) {
      canvasRef.current.style.visibility = "visible";
    }
    if (isSleepingRef.current) {
      isSleepingRef.current = false;
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = requestAnimationFrame(runAnimationLoop);
    }
  }, [runAnimationLoop]);

  // Launch a single rocket into the active pool with mode support
  const launchSingleRocket = useCallback((mode: "sparks" | "flowers" = "flowers", isPalaceHorizon = false) => {
    const rockets = rocketsRef.current;
    let available: RocketParticle | null = null;
    for (let i = 0; i < MAX_ROCKETS; i++) {
      if (!rockets[i].active) {
        available = rockets[i];
        break;
      }
    }
    if (!available) return;

    const w = window.innerWidth;
    const h = window.innerHeight;

    available.active = true;
    available.mode = mode;
    available.x = w * (0.18 + Math.random() * 0.64);

    if (isPalaceHorizon) {
      // Rise from lower horizon of hero section
      available.y = h * (0.64 + Math.random() * 0.12);
      available.targetY = h * (0.15 + Math.random() * 0.23);
    } else {
      // Rise from bottom edge of current viewport
      available.y = h + 12;
      // Apex between 18% to 35% from top of viewport
      available.targetY = h * (0.18 + Math.random() * 0.17);
    }

    const deltaH = available.y - available.targetY;
    available.gravity = 0.15;
    available.vy = -Math.sqrt(2 * available.gravity * deltaH) * 1.05;
    available.vx = (Math.random() - 0.5) * 0.8;
    available.age = 0;
    available.phase = Math.random() * Math.PI * 2;
    available.paletteIndex = Math.floor(Math.random() * PALETTES.length);

    wakeUpEngine();
  }, [wakeUpEngine]);

  // Listen for "shadi:auto-palace-fireworks" custom event dispatched when curtains part
  useEffect(() => {
    const handleAutoPalaceFireworks = () => {
      const canvas = canvasRef.current;
      if (canvas && window.scrollY < 200) {
        canvas.style.zIndex = "15";
      }

      // Launch Mode A (sparks) opening salvo of 8 royal rockets over 3.2 seconds
      PALACE_SALVO_DELAYS.forEach((delay) => {
        const timeoutId = setTimeout(() => {
          launchSingleRocket("sparks", true);
        }, delay);
        salvoTimeoutsRef.current.push(timeoutId);
      });
    };

    window.addEventListener("shadi:auto-palace-fireworks", handleAutoPalaceFireworks);
    return () => {
      window.removeEventListener("shadi:auto-palace-fireworks", handleAutoPalaceFireworks);
    };
  }, [launchSingleRocket]);

  // Triggered on button click: increment counter, haptic feedback, launch Pushpavarsha flower rockets
  const handleBlessingTap = () => {
    // 1. Mobile haptic feedback
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate([15, 30]);
      } catch {
        // Ignore unsupported permissions
      }
    }

    // 2. Increment live blessings counter & scale pop
    const nextCount = blessings + 1;
    setBlessings(nextCount);
    setIsCounterPopped(true);
    setTimeout(() => setIsCounterPopped(false), 240);

    try {
      localStorage.setItem(storageKey, nextCount.toString());
    } catch {
      // Ignore storage errors
    }

    // 3. Analytics tracking event (if slug is provided and not demo)
    if (weddingSlug && weddingSlug !== "demo") {
      fetch("/api/wedding-analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: weddingSlug, event: "blessing" }),
      }).catch(() => {});
    }

    // 4. Ensure canvas is in foreground (z-60) for gallery viewport
    if (canvasRef.current) {
      canvasRef.current.style.zIndex = "60";
    }

    // 5. Schedule 5 staggered Pushpavarsha flower rockets at [0, 180, 360, 550, 750] ms
    BLESSING_SALVO_DELAYS.forEach((delay) => {
      const timeoutId = setTimeout(() => {
        launchSingleRocket("flowers", false);
      }, delay);
      salvoTimeoutsRef.current.push(timeoutId);
    });
  };

  return (
    <>
      {/* Ultra-Simple, Minimalist Single Pill Button under Photo Gallery */}
      <div className="relative flex justify-center items-center select-none">
        <button
          type="button"
          onClick={handleBlessingTap}
          aria-label={`Tap to shower blessings on the couple. Current count: ${blessings.toLocaleString("en-US")}`}
          className="relative group overflow-hidden px-6 py-3 rounded-full bg-[#0d152e]/80 backdrop-blur-md border border-[#fde68a]/45 text-[#fff8dc] font-serif text-xs md:text-sm tracking-[0.16em] uppercase shadow-[0_0_25px_rgba(253,230,138,0.2)] hover:border-[#fde68a]/80 active:scale-95 transition-all duration-300 cursor-pointer select-none flex items-center gap-2.5"
        >
          {/* Subtle 3.5s diagonal metallic gold sheen sweep */}
          <span
            className="absolute inset-0 pointer-events-none -translate-x-[150%] skew-x-[-25deg] bg-gradient-to-r from-transparent via-[#fde68a]/30 to-transparent animate-[sheenSweep_3.5s_infinite_ease-in-out]"
            aria-hidden="true"
          />

          {/* Delicate flower icon */}
          <span className="text-base select-none drop-shadow-[0_0_6px_rgba(253,230,138,0.5)]">
            🌸
          </span>

          {/* Short elegant label */}
          <span className="font-semibold tracking-[0.16em] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            Tap to Shower Blessings
          </span>

          {/* Elegant dot separator */}
          <span className="text-[#fde68a]/50 select-none text-xs">
            •
          </span>

          {/* Compact live counter badge with scale pop */}
          <span
            className={`text-[#fde68a] font-semibold tabular-nums tracking-wider drop-shadow-[0_0_8px_rgba(253,230,138,0.5)] transition-transform duration-200 ${
              isCounterPopped ? "scale-115 text-[#ffffff]" : "scale-100"
            }`}
          >
            {blessings.toLocaleString("en-US")}
          </span>
        </button>

        {/* Scoped CSS animation for sheen sweep */}
        <style jsx>{`
          @keyframes sheenSweep {
            0% {
              transform: translateX(-160%) skewX(-25deg);
            }
            25%,
            100% {
              transform: translateX(260%) skewX(-25deg);
            }
          }
        `}</style>
      </div>

      {/* Full-viewport Hardware-Accelerated Fireworks Canvas via React Portal (0% idle cost) */}
      {mounted &&
        createPortal(
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="fixed inset-0 pointer-events-none z-[60] w-full h-full"
            style={{ visibility: "hidden" }}
          />,
          document.body
        )}
    </>
  );
}
