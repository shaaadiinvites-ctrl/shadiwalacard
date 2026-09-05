import Link from "next/link";
import { HeroSection } from "@/components/templates/project3/HeroSection";
import { InvitationSection } from "@/components/templates/project3/InvitationSection";
import { CeremonySection } from "@/components/templates/project3/CeremonySection";
import { CountdownSection } from "@/components/templates/project3/CountdownSection";
import { Starfield } from "@/components/templates/project3/Starfield";
import { Fireflies } from "@/components/templates/project3/Fireflies";
import { FlowersOverlay } from "@/components/templates/project3/FlowersOverlay";
import { GallerySection } from "@/components/templates/project3/GallerySection";
import Watermark from "@/components/Watermark";

export const metadata = {
  title: "The Grand Palace Theme - Demo",
  description: "Live preview of The Grand Palace Theme",
};

export default function GrandPalaceDemo() {
  return (
    <main className="relative flex min-h-screen flex-col w-full">
      {/* Floating Back Navigation for seamless return from mobile WebViews & desktop */}
      <div className="fixed top-4 left-4 z-[9000]">
        <Link
          href="/v2"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white transition-all hover:scale-105 active:scale-95 shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
          style={{
            background: 'rgba(10, 5, 8, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            textDecoration: 'none',
          }}
          aria-label="Back to ShadiwalaCard website"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Back</span>
        </Link>
      </div>

      <Watermark />
      {/* Background container */}
      <div className="fixed inset-0 z-[-3] bg-gradient-to-b from-[#030c22] via-[#081e28] to-[#0d2a33]" />
      
      {/* Palace Image Background - Absolutely positioned to the document so it scrolls away naturally */}
      <div 
        className="absolute inset-0 z-[-1] bg-no-repeat pointer-events-none palace-bg-responsive"
        style={{
          backgroundImage: 'url("/project3-assets/Palace_image2.png")'
        }}
      ></div>

      {/* Canvas effects */}
      <Starfield />
      <Fireflies />
      
      {/* Parallax Flowers floating across the document */}
      <FlowersOverlay />

      <HeroSection wedding={{ slug: 'demo', bride_name: 'Kanika', groom_name: 'Abhishek', events: [] }} />
      <InvitationSection wedding={{ slug: 'demo', bride_name: 'Kanika', groom_name: 'Abhishek', events: [] }} />
      <CeremonySection events={[]} />
      <CountdownSection wedding={{ slug: 'demo', bride_name: 'Kanika', groom_name: 'Abhishek', events: [] }} />

      {/* OriginKit Coverflow Gallery with Mood Backgrounds & Grand Palace Footer */}
      <GallerySection galleryUrls={[]} />

      {/* Sticky Buy Now Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 z-[9000] flex justify-center bg-gradient-to-t from-[#030c22] via-[#030c22cc] to-transparent pointer-events-none pb-6">
        <Link 
          href="/cart?template=grand-palace"
          className="pointer-events-auto shadow-[0_10px_30px_rgba(255,217,138,0.3)] bg-gradient-to-r from-[#C8912A] to-[#FFD98A] text-[#2c1a06] font-bold text-[1.1rem] px-10 py-3 rounded-full transition-transform hover:scale-105 active:scale-95"
          style={{ letterSpacing: '0.5px' }}
        >
          Buy Now (₹799)
        </Link>
      </div>
    </main>
  );
}
