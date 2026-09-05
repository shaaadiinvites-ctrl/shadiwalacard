'use client';
import React from 'react';

export default function VectorRoadGrid() {
  return (
    <div 
      aria-hidden="true" 
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 1,
        background: '#050505'
      }}
    >
      <style>{`
        @keyframes roadPulseNW {
          0% { stroke-dashoffset: 1200; opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }
        @keyframes roadPulseSW {
          0% { stroke-dashoffset: 1300; opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }
        @keyframes roadPulseNE {
          0% { stroke-dashoffset: 1250; opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }
        @keyframes roadPulseSE {
          0% { stroke-dashoffset: 1350; opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }
        @keyframes roadPulseN {
          0% { stroke-dashoffset: 800; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }
        @keyframes roadPulseS {
          0% { stroke-dashoffset: 900; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }
        @keyframes sonarWave {
          0% { r: 16px; opacity: 0.8; stroke-width: 2px; }
          50% { opacity: 0.4; }
          100% { r: 140px; opacity: 0; stroke-width: 0.5px; }
        }
        @keyframes beaconPulse {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.15); opacity: 1; }
        }

        .pulse-nw {
          stroke-dasharray: 90 1200;
          animation: roadPulseNW 4.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .pulse-sw {
          stroke-dasharray: 110 1300;
          animation: roadPulseSW 5.4s cubic-bezier(0.4, 0, 0.2, 1) infinite 1.2s;
        }
        .pulse-ne {
          stroke-dasharray: 100 1250;
          animation: roadPulseNE 5.1s cubic-bezier(0.4, 0, 0.2, 1) infinite 0.6s;
        }
        .pulse-se {
          stroke-dasharray: 120 1350;
          animation: roadPulseSE 5.8s cubic-bezier(0.4, 0, 0.2, 1) infinite 2.0s;
        }
        .pulse-n {
          stroke-dasharray: 70 800;
          animation: roadPulseN 4.2s cubic-bezier(0.4, 0, 0.2, 1) infinite 2.6s;
        }
        .pulse-s {
          stroke-dasharray: 80 900;
          animation: roadPulseS 4.6s cubic-bezier(0.4, 0, 0.2, 1) infinite 1.7s;
        }
        .sonar-1 {
          animation: sonarWave 3.6s cubic-bezier(0.1, 0.8, 0.3, 1) infinite;
        }
        .sonar-2 {
          animation: sonarWave 3.6s cubic-bezier(0.1, 0.8, 0.3, 1) infinite 1.8s;
        }
      `}</style>

      {/* Ambient center radiance */}
      <div style={{
        position: 'absolute',
        top: '220px',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '640px',
        height: '640px',
        background: 'radial-gradient(circle, rgba(225, 29, 72, 0.16) 0%, rgba(255, 188, 75, 0.06) 35%, transparent 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none',
      }} />

      {/* SVG Road Network */}
      <svg
        viewBox="0 0 1200 640"
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          objectFit: 'cover',
        }}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Gradients for Glowing Moving Pulses */}
          <linearGradient id="rubyGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e11d48" stopOpacity="0" />
            <stop offset="60%" stopColor="#ff4b72" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
          </linearGradient>

          <linearGradient id="goldGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffbc4b" stopOpacity="0" />
            <stop offset="70%" stopColor="#ffe29a" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
          </linearGradient>

          {/* Glow Filters */}
          <filter id="glowPulseRuby" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="glowPulseGold" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Radial Grid Pattern */}
          <pattern id="microGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="1" />
            <circle cx="0" cy="0" r="1" fill="rgba(255, 255, 255, 0.05)" />
          </pattern>
        </defs>

        {/* Micro Grid Background */}
        <rect width="100%" height="100%" fill="url(#microGrid)" />

        {/* ── CONCENTRIC RANGE RINGS (CENTERED AT 600, 220) ── */}
        <g stroke="rgba(255, 255, 255, 0.04)" fill="none">
          <circle cx="600" cy="220" r="70" strokeWidth="1" strokeDasharray="3 6" />
          <circle cx="600" cy="220" r="150" strokeWidth="1" strokeDasharray="4 8" stroke="rgba(255, 255, 255, 0.05)" />
          <circle cx="600" cy="220" r="260" strokeWidth="1" strokeDasharray="5 10" stroke="rgba(255, 255, 255, 0.04)" />
          <circle cx="600" cy="220" r="400" strokeWidth="1" strokeDasharray="6 12" stroke="rgba(255, 255, 255, 0.03)" />
          <circle cx="600" cy="220" r="560" strokeWidth="1" strokeDasharray="8 16" stroke="rgba(255, 255, 255, 0.02)" />
        </g>

        {/* ── SECONDARY STREET NETWORK (FAINT DARK-MODE ROADS) ── */}
        <g stroke="rgba(255, 255, 255, 0.045)" strokeWidth="1.2" fill="none">
          {/* Concentric Avenue Connectors */}
          <path d="M 380,100 L 420,380 L 820,360 L 790,110 Z" />
          <path d="M 260,20 L 300,520 L 920,490 L 940,30 Z" strokeDasharray="6 6" />
          
          {/* Diagonal Cross Streets */}
          <line x1="200" y1="0" x2="1000" y2="440" strokeDasharray="2 8" />
          <line x1="1000" y1="0" x2="200" y2="440" strokeDasharray="2 8" />
          <line x1="0" y1="220" x2="1200" y2="220" stroke="rgba(255, 255, 255, 0.035)" strokeDasharray="4 12" />
          <line x1="600" y1="0" x2="600" y2="640" stroke="rgba(255, 255, 255, 0.035)" strokeDasharray="4 12" />
        </g>

        {/* ── ARTERIAL HIGHWAYS (BASE TRACKS CONVERGING TO 600, 220) ── */}
        <g stroke="rgba(255, 255, 255, 0.08)" strokeWidth="2" strokeLinecap="round" fill="none">
          {/* NW Highway */}
          <path id="routeNW" d="M -20,60 C 220,100 400,160 600,220" />
          {/* SW Highway */}
          <path id="routeSW" d="M -30,580 C 240,480 420,320 600,220" />
          {/* NE Highway */}
          <path id="routeNE" d="M 1220,70 C 980,110 800,160 600,220" />
          {/* SE Highway */}
          <path id="routeSE" d="M 1230,570 C 970,470 780,320 600,220" />
          {/* North Highway */}
          <path id="routeN" d="M 600,-20 C 580,70 590,140 600,220" />
          {/* South Highway */}
          <path id="routeS" d="M 600,660 C 615,530 610,340 600,220" />
        </g>

        {/* ── ANIMATED MOVING LIGHT PULSES (GLIDING ALONG ROADS TO VENUE) ── */}
        <g fill="none" strokeLinecap="round">
          {/* NW Pulse (Ruby) */}
          <path 
            d="M -20,60 C 220,100 400,160 600,220" 
            stroke="url(#rubyGlowGrad)" 
            strokeWidth="3.5" 
            className="pulse-nw" 
            filter="url(#glowPulseRuby)" 
          />
          {/* SW Pulse (Gold) */}
          <path 
            d="M -30,580 C 240,480 420,320 600,220" 
            stroke="url(#goldGlowGrad)" 
            strokeWidth="3.5" 
            className="pulse-sw" 
            filter="url(#glowPulseGold)" 
          />
          {/* NE Pulse (Ruby) */}
          <path 
            d="M 1220,70 C 980,110 800,160 600,220" 
            stroke="url(#rubyGlowGrad)" 
            strokeWidth="3.5" 
            className="pulse-ne" 
            filter="url(#glowPulseRuby)" 
          />
          {/* SE Pulse (Gold) */}
          <path 
            d="M 1230,570 C 970,470 780,320 600,220" 
            stroke="url(#goldGlowGrad)" 
            strokeWidth="3.5" 
            className="pulse-se" 
            filter="url(#glowPulseGold)" 
          />
          {/* North Pulse (Ruby) */}
          <path 
            d="M 600,-20 C 580,70 590,140 600,220" 
            stroke="url(#rubyGlowGrad)" 
            strokeWidth="3" 
            className="pulse-n" 
            filter="url(#glowPulseRuby)" 
          />
          {/* South Pulse (Gold) */}
          <path 
            d="M 600,660 C 615,530 610,340 600,220" 
            stroke="url(#goldGlowGrad)" 
            strokeWidth="3" 
            className="pulse-s" 
            filter="url(#glowPulseGold)" 
          />
        </g>

        {/* ── EXPANDING SONAR RIPPLE WAVES AT VENUE DESTINATION ── */}
        <circle cx="600" cy="220" r="20" fill="none" stroke="#e11d48" className="sonar-1" />
        <circle cx="600" cy="220" r="20" fill="none" stroke="#ffbc4b" className="sonar-2" />

        {/* Destination Target Rings */}
        <circle cx="600" cy="220" r="32" fill="none" stroke="rgba(225, 29, 72, 0.4)" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="600" cy="220" r="6" fill="#e11d48" />
        <circle cx="600" cy="220" r="3" fill="#ffffff" />

        {/* ── GPS COORDINATES / HUD ANNOTATIONS ── */}
        <g fill="rgba(255, 255, 255, 0.3)" fontFamily="monospace" fontSize="9" letterSpacing="1.5">
          <text x="600" y="70" textAnchor="middle">LAT 28° 35' 21\" N</text>
          <text x="600" y="420" textAnchor="middle">LON 77° 12' 44\" E</text>
          <text x="120" y="225" textAnchor="start">APPROACH NW // GATE 01</text>
          <text x="1080" y="225" textAnchor="end">PRECISION GPS // 1-TAP</text>
        </g>
      </svg>

      {/* ── SEAMLESS GRADIENT MASKS (BLENDING INTO SECTION EDGES) ── */}
      {/* Top fade */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '140px',
        background: 'linear-gradient(to bottom, #050505 0%, rgba(5, 5, 5, 0.8) 40%, transparent 100%)',
        pointerEvents: 'none'
      }} />
      {/* Bottom fade */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '160px',
        background: 'linear-gradient(to top, #050505 0%, rgba(5, 5, 5, 0.8) 40%, transparent 100%)',
        pointerEvents: 'none'
      }} />
      {/* Left vignette */}
      <div style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: '18%',
        background: 'linear-gradient(to right, #050505 0%, transparent 100%)',
        pointerEvents: 'none'
      }} />
      {/* Right vignette */}
      <div style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        width: '18%',
        background: 'linear-gradient(to left, #050505 0%, transparent 100%)',
        pointerEvents: 'none'
      }} />
    </div>
  );
}
