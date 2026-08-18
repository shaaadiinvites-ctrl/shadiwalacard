"use client";

import { useState, useRef, useEffect } from "react";
import { useInView } from "framer-motion";
import Smooth3DSlideshow from "@/components/templates/project3/originkit/ui/coverflowgallery";
import { FooterSection } from "@/components/templates/project3/FooterSection";
import { Starfield } from "@/components/templates/project3/Starfield";
import { Fireflies } from "@/components/templates/project3/Fireflies";

const gallerySlides = [
  {
    image: { src: "/project3-assets/pre_wed_1_1785746695686.jpg" },
    title: "A Royal Promise\nThe Palace",
    bgColor: "#2b0e14", // Deep royal burgundy
  },
  {
    image: { src: "/project3-assets/pre_wed_2_1785746705454.jpg" },
    title: "Endless Laughter\nMarigold Canopy",
    bgColor: "#2a1e0b", // Warm dark marigold
  },
  {
    image: { src: "/project3-assets/pre_wed_3_1785746715469.jpg" },
    title: "Walking Together\nGolden Hour",
    bgColor: "#301511", // Deep warm sunset
  },
  {
    image: { src: "/project3-assets/pre_wed_4_1785746725930.jpg" },
    title: "Elegance\nThe Grand Staircase",
    bgColor: "#0c151c", // Deep slate navy
  },
  {
    image: { src: "/project3-assets/pre_wed_5_1785746737724.jpg" },
    title: "Quiet Moments\nIn The Garden",
    bgColor: "#0d2114", // Deep forest green
  },
];

import { WeddingRecord } from "@/types/wedding";

export function GallerySection({ galleryUrls = [], wedding }: { galleryUrls?: string[], wedding?: WeddingRecord }) {
  const activeGallerySlides = galleryUrls && galleryUrls.length > 0 
    ? galleryUrls.map((url, idx) => ({
        image: { src: url },
        title: "",
        bgColor: ["#2b0e14", "#2a1e0b", "#301511", "#0c151c", "#0d2114"][idx % 5],
      }))
    : gallerySlides;
  const [activeIndex, setActiveIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(1200); // Default to desktop
  const sectionRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Trigger when 30% of the section is visible in the viewport
  const isInView = useInView(sectionRef, { once: false, amount: 0.3 });

  const currentBgColor = gallerySlides[activeIndex]?.bgColor || "#09202b";

  // Responsive card sizes
  const cardWidth = windowWidth < 400 ? 280 : (windowWidth < 768 ? 320 : 350);
  const cardHeight = windowWidth < 400 ? 400 : (windowWidth < 768 ? 460 : 500);

  return (
    <section 
      id="gallery"
      ref={sectionRef}
      className="relative w-full pt-24 md:pt-32 pb-0 flex flex-col justify-center items-center overflow-hidden z-20 transition-colors duration-1000 ease-in-out"
      style={{ backgroundColor: currentBgColor }}
    >
      {/* Top Gradient Blend - smooths the hard edge from the section above (#09202b) */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-[#09202b] via-[#09202b]/70 to-transparent pointer-events-none z-0"></div>

      {/* Gallery Heading */}
      <div className="text-center px-6 flex-shrink-0 text-[#f7ede2] mb-16 relative z-10">
        <div className="font-montserrat text-sm md:text-base tracking-[5px] text-[#C8912A] uppercase mb-3 drop-shadow-sm">
          Captured Moments
        </div>
        <h2 className="font-cinzel font-bold text-3xl md:text-5xl text-white tracking-[1px] mb-4 drop-shadow-md">
          A Glimpse in Time
        </h2>
        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#C8912A] to-transparent mx-auto"></div>
      </div>

      {/* Sky and Fireflies covering footer and bottom half of gallery */}
      <Starfield className="absolute bottom-0 left-0 w-full h-[80%] z-0 pointer-events-none opacity-70 [mask-image:linear-gradient(to_top,black_50%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_top,black_50%,transparent_100%)]" />
      <Fireflies className="absolute bottom-0 left-0 w-full h-[80%] z-0 pointer-events-none opacity-80 mix-blend-screen [mask-image:linear-gradient(to_top,black_50%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_top,black_50%,transparent_100%)]" />

      {/* OriginKit Gallery */}
      <div className="relative w-full z-10 flex justify-center overflow-hidden">
        <Smooth3DSlideshow 
          slides={activeGallerySlides}
          cardWidth={cardWidth}
          cardHeight={cardHeight}
          showTitle={false}
          autoplay={isInView}
          transition={{
            type: "tween",
            duration: 0.6,
            delay: 3.0,
            ease: [0.22, 1, 0.36, 1],
          }}
          onSlideChange={setActiveIndex}
        />
      </div>

      {/* Full width Footer Section */}
      <FooterSection wedding={wedding} />
    </section>
  );
}
