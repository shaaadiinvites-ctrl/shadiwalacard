"use client";

import { useEffect, useRef, useState } from "react";

export interface RubyCurtainOverlayProps {
  coupleInitials?: string;
  hashtag?: string;
}

interface Particle {
  // Stratified Grid Anchor (Guaranteed 100% full-screen coverage forever)
  homeX: number;
  homeY: number;
  orbitRadius: number;
  freqX: number;
  phaseX: number;
  phaseY: number;
  driftSpeed: number;

  // Live Position
  x: number;
  y: number;

  // Type & Optical Parameters
  type: "sequin" | "bokeh" | "glint";
  r: number;
  mass: number;
  rot: number;
  vRot: number;
  tilt: number;
  color: string;
  baseAlpha: number;
  alpha: number;

  // Aerodynamic Dynamics
  vx: number;
  vy: number;
  twinkleSpeed: number;
  phase: number;
  isFreed: boolean;
}

// Vertex shader for the full-screen curtain quad
const VERT_SHADER_SOURCE = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

// 2D-warped WebGL Velvet Shader with Catenary Fold Curvature, Fresnel Sheen & Theater Spotlight
const FRAG_SHADER_SOURCE = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_open_progress;
uniform float u_fade;

void main() {
  // Normalized UV coordinates: (0,0) at bottom-left to (1,1) at top-right
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;

  // Theatrical Catenary Pull Profile:
  // Mid-low stage tie-back cord pulls from y = 0.62 * height (uv.y = 0.38 from bottom)
  float distFromTie = abs(uv.y - 0.38);
  float tieFactor = 1.0 - smoothstep(0.0, 0.68, distFromTie);
  float pullProfile = 0.78 + 0.42 * tieFactor;

  // Half-gap width opens from center outward
  float halfGap = u_open_progress * 0.58 * pullProfile;

  float xLeftEdge = 0.5 - halfGap;
  float xRightEdge = 0.5 + halfGap;

  // Inverted-V Central Opening Gap (reveals underlying website)
  if (uv.x > xLeftEdge && uv.x < xRightEdge) {
    float dPix = min(uv.x - xLeftEdge, xRightEdge - uv.x) * u_resolution.x;
    if (dPix < 42.0) {
      // Soft 40px drop shadow cast onto underlying website
      float shadow = (1.0 - dPix / 42.0) * 0.95 * u_fade;
      gl_FragColor = vec4(0.0, 0.0, 0.0, shadow);
      return;
    } else {
      gl_FragColor = vec4(0.0);
      return;
    }
  }

  // Determine whether fragment belongs to Left or Right curtain drape
  bool isLeft = uv.x <= xLeftEdge;
  float u_cloth;
  if (isLeft) {
    u_cloth = uv.x / max(0.0001, xLeftEdge);
  } else {
    u_cloth = (1.0 - uv.x) / max(0.0001, 1.0 - xRightEdge);
  }

  // Dynamic Horizontal Pleat Bunching (Conservation of Fabric Area)
  float curWidth = isLeft ? xLeftEdge : (1.0 - xRightEdge);
  float compRatio = clamp(curWidth / 0.5, 0.08, 1.0);
  float valleyDarkness = 1.0 + (1.0 - compRatio) * 0.90;

  // 2D Catenary Curve Distortion on the Curtain Folds:
  // Symmetrically curves inward toward the tie-back cord, eliminating straight 1D vertical stripes
  float drapeCurve = sin(uv.y * 3.14159265 * 0.90) * 0.072;
  float sSag = cos(uv.y * 4.6 + 0.8) * 0.024;
  float foldOffset = (isLeft ? drapeCurve : -drapeCurve) + sSag;
  float xFold = u_cloth + foldOffset;

  // Non-uniform multi-frequency cylindrical folds (sculpted, broader velvet folds)
  float foldHeight = sin(xFold * 24.0) * 0.62 
                   + sin(xFold * 50.0 + 1.2) * 0.26 
                   + sin(xFold * 98.0 + 2.5) * 0.12;

  // Surface slope for velvet BRDF grazing reflection
  float foldSlope = cos(xFold * 24.0) * 0.62 * 24.0
                  + cos(xFold * 50.0 + 1.2) * 0.26 * 50.0
                  + cos(xFold * 98.0 + 2.5) * 0.12 * 98.0;

  // Velvet Color Spectrum:
  // Crease ambient occlusion: #080002
  // Deep crimson velvet body: #5e0615
  // Grazing-angle nap sheen: #b80d2d to #e61940
  vec3 cValley = vec3(8.0 / 255.0, 0.0 / 255.0, 2.0 / 255.0) / valleyDarkness;
  vec3 cBody   = vec3(94.0 / 255.0, 6.0 / 255.0, 21.0 / 255.0);
  vec3 cSheen  = vec3(184.0 / 255.0, 13.0 / 255.0, 45.0 / 255.0);
  vec3 cPeak   = vec3(230.0 / 255.0, 25.0 / 255.0, 64.0 / 255.0);

  vec3 col;
  if (foldHeight < -0.15) {
    float t = (foldHeight + 1.0) / 0.85;
    col = mix(cValley, cBody, clamp(t, 0.0, 1.0));
  } else if (foldHeight < 0.40) {
    float t = (foldHeight + 0.15) / 0.55;
    col = mix(cBody, cSheen, clamp(t, 0.0, 1.0));
  } else {
    float t = (foldHeight - 0.40) / 0.60;
    col = mix(cSheen, cPeak, clamp(t, 0.0, 1.0));
  }

  // Velvet Fresnel Rim Grazing Sheen along fold ridges
  float rim = abs(foldSlope) * 0.012;
  col += cPeak * clamp(rim, 0.0, 0.35);

  // Radial Overhead Theater Spotlight centered at (0.5, 0.52)
  vec2 spotDelta = (uv - vec2(0.5, 0.52)) * vec2(1.15, 1.4);
  float spotDist = length(spotDelta);
  float spotLight = smoothstep(0.85, 0.08, spotDist);
  // Cinema falloff: center stage glows deep crimson (#5e0615), edges into cinema black (#040001)
  col *= (0.05 + 0.95 * spotLight);

  // Top valance ceiling track shadow (top 20%)
  float valanceShadow = smoothstep(1.0, 0.80, uv.y);
  col *= (0.35 + 0.65 * valanceShadow);

  // Bottom floor stage shadow (bottom 20%)
  float floorShadow = smoothstep(0.0, 0.20, uv.y);
  col *= (0.30 + 0.70 * floorShadow);

  // Outer left & right 20% perimeter theater shadow into cinema black (#040001)
  float sideEdgeDist = abs(uv.x - 0.5) * 2.0;
  float sideVignette = smoothstep(1.0, 0.58, sideEdgeDist);
  col *= (0.10 + 0.90 * sideVignette);

  // Subtle per-pixel fabric weave noise (3%) to eliminate banding
  float noise = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  col += (noise - 0.5) * 0.03;

  gl_FragColor = vec4(col, u_fade);
}
`;

export default function RubyCurtainOverlay({}: RubyCurtainOverlayProps) {
  const [state, setState] = useState<"idle" | "scattering" | "opening" | "fading" | "done">("idle");
  const [tapPhase, setTapPhase] = useState<"idle" | "tug" | "release">("idle");
  const stateRef = useRef<"idle" | "scattering" | "opening" | "fading" | "done">("idle");
  const startTimeRef = useRef<number>(0);
  const scrollUnlockedRef = useRef<boolean>(false);
  const triggeredRef = useRef<boolean>(false);
  const touchStartYRef = useRef<number | null>(null);
  const pointerStartYRef = useRef<number | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const curtainCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const glitterCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Keep stateRef synchronously aligned
  stateRef.current = state;

  // 1. Lock vertical scroll only during idle, unlock cleanly on reveal
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }

    return () => {
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
      }
    };
  }, []);

  // 2. Interactive Trigger: starts music immediately on user gesture, launches physics
  const handleTrigger = () => {
    if (triggeredRef.current || stateRef.current !== "idle") return;
    triggeredRef.current = true;

    // Direct synchronous audio play to unlock mobile iOS Safari & Android Chrome autoplay
    try {
      const audioEl = document.querySelector("audio");
      if (audioEl) {
        audioEl.play().catch(() => {});
      }
    } catch {
      // Ignore if audio playback blocked
    }

    // Stage 1: The Physical Tug (0ms – 240ms) — cord + tassel stretches downward by 36px
    setTapPhase("tug");

    // Stage 2: The Release & Curtain Draw (240ms – 700ms) — snaps upward -140px & launches reveal
    setTimeout(() => {
      setTapPhase("release");
      stateRef.current = "scattering";
      setState("scattering");
      startTimeRef.current = performance.now();
    }, 240);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartYRef.current === null) return;
    const currentY = e.touches[0].clientY;
    if (currentY - touchStartYRef.current > 16) {
      touchStartYRef.current = null;
      handleTrigger();
    }
  };

  const handleTouchEnd = () => {
    touchStartYRef.current = null;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStartYRef.current = e.clientY;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (pointerStartYRef.current === null) return;
    if (e.buttons > 0 && e.clientY - pointerStartYRef.current > 16) {
      pointerStartYRef.current = null;
      handleTrigger();
    }
  };

  const handlePointerUp = () => {
    pointerStartYRef.current = null;
  };

  // 3. WebGL Curtain Shader & 2D "Ruby Hour" Micro-Glitter Wall Engine (Overlay Canvases Only)
  useEffect(() => {
    const curtainCanvas = curtainCanvasRef.current;
    const glitterCanvas = glitterCanvasRef.current;
    if (!curtainCanvas || !glitterCanvas) return;

    // Initialize WebGL context for Curtains
    let gl: WebGLRenderingContext | null =
      curtainCanvas.getContext("webgl", { alpha: true, premultipliedAlpha: false }) ||
      (curtainCanvas.getContext("experimental-webgl") as WebGLRenderingContext | null);

    let program: WebGLProgram | null = null;
    let uResolutionLoc: WebGLUniformLocation | null = null;
    let uTimeLoc: WebGLUniformLocation | null = null;
    let uOpenProgressLoc: WebGLUniformLocation | null = null;
    let uFadeLoc: WebGLUniformLocation | null = null;

    if (gl) {
      const compileShader = (type: number, src: string) => {
        if (!gl) return null;
        const shader = gl.createShader(type);
        if (!shader) return null;
        gl.shaderSource(shader, src);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          console.error("WebGL Shader Compile Error:", gl.getShaderInfoLog(shader));
          gl.deleteShader(shader);
          return null;
        }
        return shader;
      };

      const vs = compileShader(gl.VERTEX_SHADER, VERT_SHADER_SOURCE);
      const fs = compileShader(gl.FRAGMENT_SHADER, FRAG_SHADER_SOURCE);

      if (vs && fs) {
        program = gl.createProgram();
        if (program) {
          gl.attachShader(program, vs);
          gl.attachShader(program, fs);
          gl.linkProgram(program);
          if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
            gl.useProgram(program);
            uResolutionLoc = gl.getUniformLocation(program, "u_resolution");
            uTimeLoc = gl.getUniformLocation(program, "u_time");
            uOpenProgressLoc = gl.getUniformLocation(program, "u_open_progress");
            uFadeLoc = gl.getUniformLocation(program, "u_fade");

            // Fullscreen quad buffer
            const quadBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
            gl.bufferData(
              gl.ARRAY_BUFFER,
              new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
              gl.STATIC_DRAW
            );

            const aPositionLoc = gl.getAttribLocation(program, "a_position");
            gl.enableVertexAttribArray(aPositionLoc);
            gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 0, 0);
          }
        }
      }
    }

    // Initialize 2D Canvas context for "Ruby Hour" Micro-Glitter & Bokeh
    const glitterCtx = glitterCanvas.getContext("2d", { alpha: true });
    if (!glitterCtx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resizeCanvases = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      curtainCanvas.width = width * dpr;
      curtainCanvas.height = height * dpr;
      curtainCanvas.style.width = `${width}px`;
      curtainCanvas.style.height = `${height}px`;

      glitterCanvas.width = width * dpr;
      glitterCanvas.height = height * dpr;
      glitterCanvas.style.width = `${width}px`;
      glitterCanvas.style.height = `${height}px`;
      glitterCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (gl) {
        gl.viewport(0, 0, width * dpr, height * dpr);
      }
    };

    resizeCanvases();

    // --- STRATIFIED GRID HOME ANCHORS (ELIMINATES PARTICLE CLUMPING) ---
    // In idle state, particles NEVER clump. 100% of viewport remains uniformly packed forever.
    const isMobile = width < 768;
    const cols = isMobile ? 28 : 40;
    const rows = isMobile ? 30 : 35;
    const particles: Particle[] = [];

    // Crisp faceted metallic sequin palette
    const sequinColors = ["#800517", "#b80a24", "#e61538", "#ff3b61"];
    const glintColors = ["#fff0f3", "#fde68a", "#ffffff"];

    const cellW = width / cols;
    const cellH = height / rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Permanent home anchor inside grid cell with random jitter
        const homeX = (c + Math.random()) * cellW;
        const homeY = (r + Math.random()) * cellH;

        // 3 Distinct Optical Particle Types (NOT Blurry Pink Smoke)
        // 75% Type A: Crisp Metallic Ruby Sequins (radius: 1.2px to 3.2px)
        // 15% Type B: True Camera Lens Bokeh Discs (radius: 8px to 20px)
        // 10% Type C: Diamond Specular Pinpricks (radius: 0.8px to 1.8px)
        const rand = Math.random();
        let type: "sequin" | "bokeh" | "glint";
        let radius: number;
        let baseAlpha: number;
        let color: string;

        if (rand < 0.75) {
          type = "sequin";
          radius = 1.2 + Math.random() * 2.0; // 1.2px - 3.2px
          baseAlpha = 0.75 + Math.random() * 0.25;
          color = sequinColors[Math.floor(Math.random() * sequinColors.length)];
        } else if (rand < 0.90) {
          type = "bokeh";
          radius = 8.0 + Math.random() * 12.0; // 8px - 20px
          baseAlpha = 0.08 + Math.random() * 0.08; // 0.08 - 0.16
          color = "#c90c2b";
        } else {
          type = "glint";
          radius = 0.8 + Math.random() * 1.0; // 0.8px - 1.8px
          baseAlpha = 0.85 + Math.random() * 0.15;
          color = glintColors[Math.floor(Math.random() * glintColors.length)];
        }

        const mass = Math.max(0.2, (radius * radius) * 0.05);

        particles.push({
          homeX,
          homeY,
          orbitRadius: 4.0 + Math.random() * 8.0,
          freqX: 0.8 + Math.random() * 1.4,
          phaseX: Math.random() * Math.PI * 2,
          phaseY: Math.random() * height,
          driftSpeed: 12.0 + Math.random() * 16.0, // Slow upward convection in px/s

          x: homeX,
          y: homeY,

          type,
          r: radius,
          mass,
          rot: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 3.5,
          tilt: Math.random() * Math.PI * 2,
          color,
          baseAlpha,
          alpha: baseAlpha,

          vx: 0,
          vy: 0,
          twinkleSpeed: 2.5 + Math.random() * 4.0,
          phase: Math.random() * Math.PI * 2,
          isFreed: false,
        });
      }
    }

    const handleResize = () => {
      const oldW = width;
      const oldH = height;
      resizeCanvases();
      if (oldW > 0 && oldH > 0) {
        const sX = width / oldW;
        const sY = height / oldH;
        for (let i = 0; i < particles.length; i++) {
          particles[i].homeX *= sX;
          particles[i].homeY *= sY;
          particles[i].x *= sX;
          particles[i].y *= sY;
        }
      }
    };

    window.addEventListener("resize", handleResize);

    // --- DRAPED CURTAIN SPRING-DAMPER PHYSICS SOLVER ---
    let openProgress = 0.0;
    let vProgress = 0.0;
    const targetPull = 1.15; // Pulls completely into wings past screen borders
    const omega = 1.48; // rad/s (gives ~3.3s graceful opening duration)
    const zeta = 0.88; // Damped settling

    let lastTime = performance.now();
    let animFrameId: number;

    // --- ANIMATION / PHYSICS TICK LOOP ---
    const tick = (now: number) => {
      const dt = Math.min(Math.max((now - lastTime) / 1000, 0.001), 0.04);
      lastTime = now;
      const nowSec = now * 0.001;

      const elapsed = startTimeRef.current > 0 ? (now - startTimeRef.current) / 1000 : 0;
      const currentState = stateRef.current;

      // Timeline:
      // t = 0.8s: Curtains begin pulling outward from mid-low tie-back point
      if (currentState === "scattering" && elapsed >= 0.8) {
        stateRef.current = "opening";
        setState("opening");
      }

      // t = 2.0s: Unlock scrolling when curtains have parted sufficiently
      if (currentState === "opening" && elapsed >= 2.0 && !scrollUnlockedRef.current) {
        scrollUnlockedRef.current = true;
        document.body.style.overflow = "";
      }

      // t = 3.4s: Gentle 0.8s dissolve fade-out begins
      if (currentState === "opening" && elapsed >= 3.4) {
        stateRef.current = "fading";
        setState("fading");
      }

      // t = 4.2s: Animation complete, unmount completely
      if ((currentState === "opening" || currentState === "fading") && elapsed >= 4.2) {
        stateRef.current = "done";
        setState("done");
        return;
      }

      // 1. Solve Curtain Opening Spring Physics (begins at t = 0.8s)
      const isOpening = currentState === "opening" || currentState === "fading";
      const targetP = isOpening ? targetPull : 0.0;

      const k = omega * omega;
      const c = 2.0 * zeta * omega;
      const accel = -k * (openProgress - targetP) - c * vProgress;

      vProgress += accel * dt;
      openProgress += vProgress * dt;
      if (openProgress < 0.0) openProgress = 0.0;

      // Compute current fade opacity (1.0 down to 0.0 during fading phase)
      let fadeOpacity = 1.0;
      if (currentState === "fading") {
        fadeOpacity = Math.max(0.0, 1.0 - (elapsed - 3.4) / 0.8);
      }

      // 2. Render 2D-Warped WebGL Velvet Curtain Shader
      if (gl && program && uResolutionLoc) {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.uniform2f(uResolutionLoc, width * dpr, height * dpr);
        gl.uniform1f(uTimeLoc, nowSec);
        gl.uniform1f(uOpenProgressLoc, openProgress);
        gl.uniform1f(uFadeLoc, fadeOpacity);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }

      // 3. Render "Ruby Hour" Micro-Glitter Wall & Camera Lens Bokeh Canvas
      glitterCtx.clearRect(0, 0, width, height);

      const isIdle = currentState === "idle";
      const isScattering = currentState === "scattering" || currentState === "opening" || currentState === "fading";

      // Solid Ruby-Black Base Layer at 0:00 (rgba(12, 1, 3, 0.90))
      // Completely hides the curtains behind it until the user taps
      if (fadeOpacity > 0.01) {
        if (isIdle) {
          glitterCtx.fillStyle = "rgba(12, 1, 3, 0.90)";
          glitterCtx.fillRect(0, 0, width, height);
        } else if (isScattering) {
          // Left-to-right aerodynamic clearing wave fades out base layer behind clearFrontX
          const clearProgress = Math.min(1.0, elapsed / 1.45);
          const clearFrontX = -0.10 * width + 1.30 * width * clearProgress;
          const washGrad = glitterCtx.createLinearGradient(0, 0, width, 0);

          const edgeNorm = clearFrontX / width;
          const stop0 = Math.max(0.0, Math.min(1.0, edgeNorm - 0.22));
          const stop1 = Math.max(0.0, Math.min(1.0, edgeNorm + 0.15));

          const curAlpha = 0.90 * (1.0 - clearProgress);
          washGrad.addColorStop(0.0, "rgba(12, 1, 3, 0)");
          washGrad.addColorStop(stop0, "rgba(12, 1, 3, 0)");
          washGrad.addColorStop(stop1, `rgba(12, 1, 3, ${curAlpha})`);
          washGrad.addColorStop(1.0, `rgba(12, 1, 3, ${curAlpha})`);

          glitterCtx.fillStyle = washGrad;
          glitterCtx.fillRect(0, 0, width, height);
        }
      }

      // Particle Motion Calculation
      if (isIdle) {
        // Continuous 3D orbital float around (homeX, homeY) + slow vertical upward convection with seamless modulo:
        // Guaranteed 100% full-screen coverage forever with ZERO clumping!
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const floatX = Math.sin(nowSec * p.freqX + p.phaseX) * p.orbitRadius;
          const floatY = (nowSec * p.driftSpeed + p.phaseY) % height;
          p.x = (p.homeX + floatX + width) % width;
          p.y = (p.homeY - floatY + height) % height;
          p.rot += p.vRot * dt;
          p.alpha = p.baseAlpha;
        }
      } else if (isScattering) {
        // On-Tap Left-to-Right Clearing Wave sweeps from -0.1 * width to 1.2 * width over 1.45s
        const clearProgress = Math.min(1.0, elapsed / 1.45);
        const clearFrontX = -0.10 * width + 1.30 * width * clearProgress;

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          // Trigger aerodynamic release when clearing wave reaches particle
          if (!p.isFreed && p.x <= clearFrontX + 50) {
            p.isFreed = true;
            p.vx = (16.0 + Math.random() * 14.0) / p.mass;
            p.vy = (Math.random() - 0.5) * 5.0;
            p.vRot += (Math.random() - 0.5) * 12.0;
          }

          if (p.isFreed) {
            // Free aerodynamic velocity with Stokes' drag
            p.vx += 22.0 * dt * 60.0;
            p.vy += Math.sin(p.x * 0.01 + elapsed * 3.0) * 1.5 * dt * 60.0;
            p.vx *= Math.pow(0.96, dt * 60);
            p.vy *= Math.pow(0.96, dt * 60);

            p.x += p.vx * dt * 60.0;
            p.y += p.vy * dt * 60.0;
            p.rot += p.vRot * dt;

            // Fade out as it blows cleanly off the screen to the right
            p.alpha *= Math.pow(0.94, dt * 60);
          } else {
            // Still in idle orbit until wave reaches it
            const floatX = Math.sin(nowSec * p.freqX + p.phaseX) * p.orbitRadius;
            const floatY = (nowSec * p.driftSpeed + p.phaseY) % height;
            p.x = (p.homeX + floatX + width) % width;
            p.y = (p.homeY - floatY + height) % height;
            p.rot += p.vRot * dt;
          }
        }
      }

      // True "Ruby Hour" Micro-Glitter Wall (Screen Blending + Sharp Geometries)
      glitterCtx.globalCompositeOperation = "screen";

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (p.alpha <= 0.005) continue;
        if (p.x < -40 || p.x > width + 40 || p.y < -40 || p.y > height + 40) continue;

        const effectiveAlpha = p.alpha * fadeOpacity;

        if (p.type === "sequin") {
          // Type A — 75% Crisp Metallic Ruby Sequins (Sharp high-contrast tilted micro-ellipses)
          const scaleY = Math.max(0.12, Math.abs(Math.cos(p.rot)));
          glitterCtx.save();
          glitterCtx.globalAlpha = effectiveAlpha;
          glitterCtx.fillStyle = p.color;
          glitterCtx.beginPath();
          glitterCtx.ellipse(p.x, p.y, p.r, p.r * scaleY, p.tilt, 0, Math.PI * 2);
          glitterCtx.fill();
          glitterCtx.restore();
        } else if (p.type === "bokeh") {
          // Type B — 15% True Camera Lens Bokeh Discs (Defined circular disc edge with subtle rim)
          glitterCtx.save();
          glitterCtx.globalAlpha = effectiveAlpha;
          glitterCtx.beginPath();
          glitterCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          glitterCtx.fillStyle = "#c90c2b";
          glitterCtx.fill();

          // Brighter defined rim
          glitterCtx.globalAlpha = Math.min(1.0, effectiveAlpha * 1.35);
          glitterCtx.lineWidth = 1.2;
          glitterCtx.strokeStyle = "#ff2a52";
          glitterCtx.stroke();
          glitterCtx.restore();
        } else {
          // Type C — 10% Specular Diamond Pinpricks
          const flash = Math.pow(Math.max(0.0, Math.sin(nowSec * p.twinkleSpeed + p.phase)), 18);
          if (flash > 0.015) {
            glitterCtx.save();
            glitterCtx.globalAlpha = Math.min(1.0, flash * 1.8 * effectiveAlpha);
            glitterCtx.fillStyle = p.color;
            glitterCtx.beginPath();
            glitterCtx.arc(p.x, p.y, p.r * (1.0 + flash * 0.4), 0, Math.PI * 2);
            glitterCtx.fill();

            // Specular cross-glint on peak flash
            if (flash > 0.70) {
              glitterCtx.strokeStyle = "#ffffff";
              glitterCtx.lineWidth = 0.8;
              const gLen = p.r * 2.8;
              glitterCtx.beginPath();
              glitterCtx.moveTo(p.x - gLen, p.y);
              glitterCtx.lineTo(p.x + gLen, p.y);
              glitterCtx.moveTo(p.x, p.y - gLen);
              glitterCtx.lineTo(p.x, p.y + gLen);
              glitterCtx.stroke();
            }
            glitterCtx.restore();
          }
        }
      }

      // Reset composite operation
      glitterCtx.globalCompositeOperation = "source-over";

      animFrameId = requestAnimationFrame(tick);
    };

    animFrameId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  // When transition completes at 4.2s, unmount completely from DOM
  if (state === "done") {
    return null;
  }

  const isIdle = state === "idle";
  const isFading = state === "fading";

  return (
    <div
      ref={containerRef}
      onClick={handleTrigger}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="fixed inset-0 z-[9999] select-none pointer-events-auto"
      style={{
        pointerEvents: isIdle ? "auto" : "none",
        cursor: isIdle ? "pointer" : "default",
        opacity: isFading ? 0 : 1,
        transition: isFading ? "opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1)" : "none",
        touchAction: "none",
      }}
      aria-label="Interactive Wedding Curtain Reveal"
    >
      {/* Scoped CSS Keyframes for Pendulum Sway and Chevron Bob */}
      <style>{`
        @keyframes pendulumSway {
          0%, 100% {
            transform: rotate(-2.2deg);
          }
          50% {
            transform: rotate(2.2deg);
          }
        }
        @keyframes chevronBob {
          0%, 100% {
            transform: translateY(0);
            opacity: 0.65;
          }
          50% {
            transform: translateY(5px);
            opacity: 1;
          }
        }
      `}</style>

      {/* 2D-Warped WebGL Velvet Curtain Shader (Underneath) */}
      <canvas
        ref={curtainCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Heavy Theater Vignette & Stage Spotlight Falloff (Directly over curtains) */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at 50% 48%, transparent 0%, rgba(10, 0, 2, 0.55) 55%, rgba(3, 0, 1, 0.94) 100%)",
          opacity: isFading ? 0 : 1,
          transition: isFading ? "opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1)" : "none",
        }}
      />

      {/* Dense "Ruby Hour" Micro-Glitter & Camera Bokeh Canvas (Foreground) */}
      <canvas
        ref={glitterCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-20"
      />

      {/* Center Auspicious Blessing & Theatre Tassel Pull-Cord Group (z-30) */}
      <div
        className="fixed inset-0 z-30 flex items-center justify-center pointer-events-none p-4"
        style={{
          opacity: state === "idle" || tapPhase === "tug" ? 1 : 0,
          transform: state === "idle" ? "scale(1)" : "scale(1.02)",
          transition: "opacity 0.45s ease-out, transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
          background:
            "radial-gradient(ellipse 620px 520px at 50% 50%, rgba(12, 1, 3, 0.65) 0%, rgba(12, 1, 3, 0.30) 45%, transparent 75%)",
        }}
      >
        <div className="relative flex flex-col items-center justify-center p-4 sm:p-8 text-center max-w-[460px] w-full">
          {/* Sacred Shree Ganesha Motif */}
          <div
            className="flex flex-col items-center"
            style={{
              opacity: tapPhase === "idle" ? 1 : 0,
              transform: tapPhase === "idle" ? "translateY(0)" : "translateY(-6px)",
              transition: "opacity 0.25s ease-out, transform 0.25s ease-out",
            }}
          >
            <img
              src="/project3-assets/ganesh-opt.png"
              alt="Shree Ganesha"
              className="w-14 h-14 md:w-16 md:h-16 object-contain opacity-95 drop-shadow-[0_2px_16px_rgba(255,30,86,0.65)]"
            />
            {/* Devanagari Blessing (Fixed letter-spacing for connected shirorekha & matras) */}
            <div
              className="font-serif text-xl md:text-2xl font-medium text-[#fde68a] mt-3.5 drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)] tracking-normal"
              style={{ letterSpacing: "0px" }}
            >
              || श्री गणेशाय नमः ||
            </div>
          </div>

          {/* Minimal Ornamental Gold Diamond Divider */}
          <div
            className="flex items-center justify-center gap-3 my-4 opacity-75"
            style={{
              opacity: tapPhase === "idle" ? 0.75 : 0,
              transition: "opacity 0.2s ease-out",
            }}
          >
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#fde68a]/60" />
            <span className="text-[10px] text-[#fde68a]">✦</span>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#fde68a]/60" />
          </div>

          {/* Pendulum Wrapper: Gently sways back and forth in idle state (transform-origin: top center) */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleTrigger();
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              touchStartYRef.current = e.touches[0].clientY;
            }}
            onTouchMove={(e) => {
              e.stopPropagation();
              if (touchStartYRef.current === null) return;
              if (e.touches[0].clientY - touchStartYRef.current > 16) {
                touchStartYRef.current = null;
                handleTrigger();
              }
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              pointerStartYRef.current = e.clientY;
            }}
            onPointerMove={(e) => {
              e.stopPropagation();
              if (pointerStartYRef.current === null) return;
              if (e.buttons > 0 && e.clientY - pointerStartYRef.current > 16) {
                pointerStartYRef.current = null;
                handleTrigger();
              }
            }}
            className="relative flex flex-col items-center cursor-pointer pointer-events-auto select-none group touch-none"
            style={{
              transformOrigin: "top center",
              animation: tapPhase === "idle" ? "pendulumSway 3.2s ease-in-out infinite" : "none",
              transform:
                tapPhase === "tug"
                  ? "translateY(36px) scaleY(1.06)"
                  : tapPhase === "release"
                  ? "translateY(-140px) scale(0.92)"
                  : "translateY(0) scale(1)",
              opacity: tapPhase === "release" ? 0 : 1,
              transition:
                tapPhase === "tug"
                  ? "transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1)"
                  : tapPhase === "release"
                  ? "transform 450ms cubic-bezier(0.22, 1, 0.36, 1), opacity 450ms cubic-bezier(0.22, 1, 0.36, 1)"
                  : "none",
            }}
            aria-label="Pull to Unveil the Invite"
            role="button"
            tabIndex={0}
          >
            {/* Braided Metallic Gold Rope (h-20 w-[3px]) */}
            <div
              className="w-[3px] h-20 relative mx-auto"
              style={{
                background:
                  "repeating-linear-gradient(45deg, #7a5205 0px, #d4af37 2px, #fff6d6 4px, #b8860b 6px)",
                boxShadow: "0 0 12px rgba(212, 175, 55, 0.45)",
                borderRadius: "1.5px",
              }}
            />

            {/* Soft Warm Gold Halo Aura behind Tassel Head */}
            <div className="absolute top-[72px] w-14 h-14 rounded-full bg-[#fde68a]/30 blur-md pointer-events-none animate-pulse" />

            {/* Ornate 3D SVG Gold Theatre Tassel (w-10 h-16) */}
            <svg
              className="w-10 h-16 relative z-10 transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_8px_16px_rgba(0,0,0,0.85)] drop-shadow-[0_0_20px_rgba(212,175,55,0.45)]"
              viewBox="0 0 40 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="goldCapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fff8dc" />
                  <stop offset="30%" stopColor="#f3d078" />
                  <stop offset="70%" stopColor="#d4af37" />
                  <stop offset="100%" stopColor="#8a5a00" />
                </linearGradient>

                <radialGradient id="goldFinialRadial" cx="40%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="25%" stopColor="#fff8dc" />
                  <stop offset="50%" stopColor="#f3d078" />
                  <stop offset="75%" stopColor="#d4af37" />
                  <stop offset="100%" stopColor="#664100" />
                </radialGradient>

                <radialGradient id="rubyJewelGrad" cx="35%" cy="30%" r="65%">
                  <stop offset="0%" stopColor="#ff5c7a" />
                  <stop offset="45%" stopColor="#b80d2d" />
                  <stop offset="85%" stopColor="#540311" />
                  <stop offset="100%" stopColor="#220005" />
                </radialGradient>

                <linearGradient id="silkFringeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7a5205" />
                  <stop offset="20%" stopColor="#d4af37" />
                  <stop offset="48%" stopColor="#fff8dc" />
                  <stop offset="68%" stopColor="#d4af37" />
                  <stop offset="88%" stopColor="#f3d078" />
                  <stop offset="100%" stopColor="#5c3d00" />
                </linearGradient>
              </defs>

              {/* Top Suspension Loop (connects directly to braided rope) */}
              <ellipse cx="20" cy="3" rx="3.5" ry="2" fill="url(#goldCapGrad)" stroke="#fff8dc" strokeWidth="0.6" />

              {/* Sculpted 3D Bell-Shaped Gold Cap (Crown) */}
              <path
                d="M 13 5 C 13 3, 27 3, 27 5 C 28 9, 31 14, 30.5 18 L 9.5 18 C 9 14, 12 9, 13 5 Z"
                fill="url(#goldFinialRadial)"
                stroke="#fff8dc"
                strokeWidth="0.5"
              />

              {/* Deep Ruby Accent Jewel in the Center of Crown */}
              <ellipse cx="20" cy="11.5" rx="3" ry="4" fill="url(#rubyJewelGrad)" stroke="#fde68a" strokeWidth="0.75" />
              <ellipse cx="19" cy="10" rx="1" ry="1.4" fill="#ffffff" opacity="0.8" />

              {/* Crown Horizontal Braided Collar Ring */}
              <ellipse cx="20" cy="18" rx="10.5" ry="2.2" fill="url(#goldCapGrad)" stroke="#fff8dc" strokeWidth="0.6" />

              {/* Tight Ruby-Gold Neck Wrap Band */}
              <rect x="11.5" y="19.5" width="17" height="4.5" rx="1.5" fill="#6d0516" stroke="url(#goldCapGrad)" strokeWidth="0.7" />
              <line x1="12" y1="21.75" x2="28" y2="21.75" stroke="#fde68a" strokeWidth="0.6" strokeDasharray="1.5 1.5" />

              {/* Flowing Silk Gold Fringe Base Skirt */}
              <path
                d="M 12 24 L 28 24 L 34.5 58 C 34.5 61.5, 5.5 61.5, 5.5 58 Z"
                fill="url(#silkFringeGrad)"
                opacity="0.95"
              />

              {/* 16 Individual Metallic Gold Fringe Threads with varied tones & light reflection */}
              <line x1="12.5" y1="24" x2="6.5" y2="58" stroke="#8a5a00" strokeWidth="0.9" opacity="0.85" />
              <line x1="13.5" y1="24" x2="8.5" y2="59" stroke="#d4af37" strokeWidth="0.9" opacity="0.9" />
              <line x1="14.5" y1="24" x2="10.5" y2="59.8" stroke="#f3d078" strokeWidth="0.8" opacity="0.95" />
              <line x1="15.5" y1="24" x2="12.5" y2="60.5" stroke="#fff8dc" strokeWidth="0.9" opacity="0.9" />
              <line x1="16.5" y1="24" x2="14.5" y2="61" stroke="#d4af37" strokeWidth="0.8" opacity="0.9" />
              <line x1="17.8" y1="24" x2="16.5" y2="61.2" stroke="#f3d078" strokeWidth="0.9" opacity="0.95" />
              <line x1="19" y1="24" x2="18.5" y2="61.5" stroke="#fff8dc" strokeWidth="1" opacity="1" />
              <line x1="20" y1="24" x2="20" y2="61.5" stroke="#ffffff" strokeWidth="1.1" opacity="0.95" />
              <line x1="21" y1="24" x2="21.5" y2="61.5" stroke="#fff8dc" strokeWidth="1" opacity="1" />
              <line x1="22.2" y1="24" x2="23.5" y2="61.2" stroke="#f3d078" strokeWidth="0.9" opacity="0.95" />
              <line x1="23.5" y1="24" x2="25.5" y2="61" stroke="#d4af37" strokeWidth="0.8" opacity="0.9" />
              <line x1="24.5" y1="24" x2="27.5" y2="60.5" stroke="#fff8dc" strokeWidth="0.9" opacity="0.9" />
              <line x1="25.5" y1="24" x2="29.5" y2="59.8" stroke="#f3d078" strokeWidth="0.8" opacity="0.95" />
              <line x1="26.5" y1="24" x2="31.5" y2="59" stroke="#d4af37" strokeWidth="0.9" opacity="0.9" />
              <line x1="27.5" y1="24" x2="33.5" y2="58" stroke="#8a5a00" strokeWidth="0.9" opacity="0.85" />

              {/* Bottom Scalloped Gold Hem Rim */}
              <path d="M 6 58 Q 20 63 34 58" fill="none" stroke="#d4af37" strokeWidth="1.2" opacity="0.8" />
            </svg>
          </div>

          {/* Frameless Whisper Typography (14px below tassel) */}
          <div
            className="flex flex-col items-center mt-3.5 pointer-events-none"
            style={{
              opacity: tapPhase === "idle" ? 1 : 0,
              transform: tapPhase === "idle" ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 0.2s ease-out, transform 0.2s ease-out",
            }}
          >
            <div className="font-serif italic text-sm md:text-base tracking-[0.2em] uppercase text-[#fde68a] drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
              Pull to Unveil the Invite
            </div>

            {/* Delicate Gold Downward Double-Chevron */}
            <div
              className="flex flex-col items-center mt-1.5 text-[#fde68a] opacity-85"
              style={{ animation: "chevronBob 2.2s ease-in-out infinite" }}
            >
              <svg className="w-3.5 h-3.5 text-[#fde68a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
                <polyline points="6 14 12 20 18 14" opacity="0.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
