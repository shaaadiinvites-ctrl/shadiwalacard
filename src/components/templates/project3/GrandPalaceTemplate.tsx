"use client";

import { WeddingRecord } from "@/types/wedding";
import { HeroSection } from "@/components/templates/project3/HeroSection";
import { InvitationSection } from "@/components/templates/project3/InvitationSection";
import { CeremonySection } from "@/components/templates/project3/CeremonySection";
import { CountdownSection } from "@/components/templates/project3/CountdownSection";
import { Starfield } from "@/components/templates/project3/Starfield";
import { Fireflies } from "@/components/templates/project3/Fireflies";
import { FlowersOverlay } from "@/components/templates/project3/FlowersOverlay";
import { GallerySection } from "@/components/templates/project3/GallerySection";
import Watermark from "@/components/Watermark";
import Link from "next/link";
import { useEffect } from "react";

export default function GrandPalaceTemplate({ wedding }: { wedding: WeddingRecord }) {
  // Use cover photo as background if provided, else default to palace image
  const bgImage = wedding.cover_photo_url || "/project3-assets/Palace_image2.png";

  return (
    <main className="relative flex min-h-screen flex-col w-full">
      {/* Background container */}
      <div className="fixed inset-0 z-[-3] bg-gradient-to-b from-[#030c22] via-[#081e28] to-[#0d2a33]" />
      
      {/* Palace/Cover Image Background - Absolutely positioned to the document so it scrolls away naturally */}
      <div 
        className="absolute inset-0 z-[-1] bg-no-repeat pointer-events-none palace-bg-responsive"
        style={{
          backgroundImage: `url("${bgImage}")`
        }}
      ></div>

      {/* Canvas effects */}
      <Starfield />
      <Fireflies />
      
      {/* Parallax Flowers floating across the document */}
      <FlowersOverlay />

      <HeroSection wedding={wedding} />
      <InvitationSection wedding={wedding} />
      <CeremonySection events={wedding.events || []} />
      
      {/* Only show countdown if there's a main event with a date in the future */}
      <CountdownSection wedding={wedding} />

      {/* OriginKit Coverflow Gallery with Mood Backgrounds & Grand Palace Footer */}
      <GallerySection galleryUrls={wedding.gallery_urls || []} />

      {/* Action Bar (Edit Link / Payment info can go here later if needed) */}
    </main>
  );
}
