"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

export function MusicPlayer({ url }: { url?: string } = {}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasStartedOnce = useRef(false);
  const musicSrc = url || "/background-music.mp3";

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.5; // Set volume to 50%

    // Synchronize React state with actual HTML5 Audio playback state
    const handlePlayState = () => {
      setIsPlaying(true);
      hasStartedOnce.current = true;
    };

    const handlePauseState = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("play", handlePlayState);
    audio.addEventListener("playing", handlePlayState);
    audio.addEventListener("pause", handlePauseState);
    audio.addEventListener("ended", handlePauseState);

    // If audio is already playing (e.g. unlocked before hydration or by earlier trigger)
    if (!audio.paused && audio.currentTime > 0) {
      handlePlayState();
    }

    // Direct event listener for curtain reveal / rope pull triggers
    const handleStartMusic = () => {
      audio.play().then(handlePlayState).catch((err) => {
        console.warn("Audio play prevented:", err);
      });
    };

    window.addEventListener("shadi:play-music", handleStartMusic);
    window.addEventListener("shadi:curtain-revealed", handleStartMusic);

    // Fallback gesture listeners
    const handleFirstGesture = () => {
      if (hasStartedOnce.current) return;
      audio.play().then(handlePlayState).catch(() => {});
    };

    window.addEventListener("touchstart", handleFirstGesture, { passive: true });
    window.addEventListener("pointerdown", handleFirstGesture, { passive: true });
    window.addEventListener("click", handleFirstGesture, { passive: true });

    return () => {
      audio.removeEventListener("play", handlePlayState);
      audio.removeEventListener("playing", handlePlayState);
      audio.removeEventListener("pause", handlePauseState);
      audio.removeEventListener("ended", handlePauseState);
      window.removeEventListener("shadi:play-music", handleStartMusic);
      window.removeEventListener("shadi:curtain-revealed", handleStartMusic);
      window.removeEventListener("touchstart", handleFirstGesture);
      window.removeEventListener("pointerdown", handleFirstGesture);
      window.removeEventListener("click", handleFirstGesture);
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
        src={musicSrc} 
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
