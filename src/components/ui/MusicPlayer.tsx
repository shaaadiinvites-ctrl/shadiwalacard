"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasStartedOnce = useRef(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5; // Set volume to 50%
    }

    // Attempt immediate play on mount (works on desktop Chrome/Edge/Firefox with prior user engagement)
    if (audioRef.current && !hasStartedOnce.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        hasStartedOnce.current = true;
      }).catch(() => {
        // Autoplay blocked by browser policy without user gesture; listener will unlock it on first gesture
      });
    }

    const handleFirstGesture = () => {
      if (hasStartedOnce.current || !audioRef.current) return;

      audioRef.current.play().then(() => {
        setIsPlaying(true);
        hasStartedOnce.current = true;
        
        window.removeEventListener("touchstart", handleFirstGesture);
        window.removeEventListener("click", handleFirstGesture);
        window.removeEventListener("pointerdown", handleFirstGesture);
        window.removeEventListener("scroll", handleFirstGesture);
      }).catch(() => {
        // Playback still blocked, wait for next gesture
      });
    };

    window.addEventListener("touchstart", handleFirstGesture, { passive: true });
    window.addEventListener("pointerdown", handleFirstGesture, { passive: true });
    window.addEventListener("click", handleFirstGesture, { passive: true });
    window.addEventListener("scroll", handleFirstGesture, { passive: true, once: true });

    return () => {
      window.removeEventListener("touchstart", handleFirstGesture);
      window.removeEventListener("pointerdown", handleFirstGesture);
      window.removeEventListener("click", handleFirstGesture);
      window.removeEventListener("scroll", handleFirstGesture);
    };
  }, []);

  const toggleMusic = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // User explicitly interacted, never auto-play again on scroll
    hasStartedOnce.current = true;
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch((err) => {
          console.error("Audio play error:", err);
        });
      }
    }
  };

  return (
    <>
      <audio 
        ref={audioRef} 
        src="/background-music.mp3" 
        loop 
        preload="auto"
        className="hidden"
      />
      
      <motion.button
        onClick={toggleMusic}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed top-6 right-6 z-[9999] flex items-center justify-center w-12 h-12 bg-black/60 backdrop-blur-md border border-white/20 rounded-full shadow-lg text-white hover:bg-black/80 transition-all"
        aria-label="Toggle background music"
      >
        {isPlaying ? (
          <Volume2 className="w-5 h-5 animate-pulse text-[#FFD98A]" />
        ) : (
          <VolumeX className="w-5 h-5 opacity-80" />
        )}
        
        {!isPlaying && (
          <span className="absolute right-14 whitespace-nowrap px-3 py-1.5 bg-black/80 backdrop-blur-sm text-xs rounded-full pointer-events-none animate-pulse text-[#FFD98A]">
            Tap for music
          </span>
        )}
      </motion.button>
    </>
  );
}
