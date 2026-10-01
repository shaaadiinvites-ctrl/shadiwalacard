"use client";

import { motion } from "framer-motion";
import { t } from "@/lib/i18n";
import { WeddingRecord } from "@/types/wedding";

const sparkles = [
  { left: "15%", top: "20%", delay: "0s", duration: "2.5s", char: "✦" },
  { left: "75%", top: "15%", delay: "1s", duration: "3s", char: "✧" },
  { left: "25%", top: "75%", delay: "0.5s", duration: "2.2s", char: "✦" },
  { left: "80%", top: "65%", delay: "1.5s", duration: "2.8s", char: "✧" },
  { left: "50%", top: "85%", delay: "2s", duration: "3.5s", char: "✦" },
];

interface CeremonyItem {
  id: string;
  title: string;
  subtitle?: string;
  rawDate: string;
  timeFormatted: string;
  venueName: string;
  venueAddress: string;
  mapLink: string;
  theme: string;
  icon: React.ReactNode;
}

const mockCeremonies: CeremonyItem[] = [
  {
    id: "mehendi",
    title: "Mehendi & Haldi",
    subtitle: "The Colors of Joy",
    rawDate: "2026-02-14",
    timeFormatted: "10:00 AM",
    venueName: "The Garden Pavilion",
    venueAddress: "Orchid Greens, Sector 56, Gurugram, Haryana",
    mapLink: "https://maps.google.com/?q=Orchid+Greens+Sector+56+Gurugram",
    theme: "card-marigold",
    icon: (
      <svg width="60" height="60" viewBox="0 0 100 100" fill="none" stroke="#FFD98A" className="drop-shadow-md">
        <circle cx="50" cy="50" r="42" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.6"/>
        <path d="M50 20 C60 40 70 50 50 80 C30 50 40 40 50 20 Z" fill="#C8912A" opacity="0.2" strokeWidth="2"/>
        <path d="M20 50 C40 40 50 30 80 50 C50 70 40 60 20 50 Z" fill="#C8912A" opacity="0.2" strokeWidth="2"/>
        <circle cx="50" cy="50" r="10" fill="#FFD98A" opacity="0.8"/>
      </svg>
    )
  },
  {
    id: "engagement",
    title: "Engagement & Sangeet",
    subtitle: "When Two Souls Dance",
    rawDate: "2026-02-14",
    timeFormatted: "7:00 PM",
    venueName: "The Crystal Ballroom",
    venueAddress: "Le Meridien, MG Road, Gurugram, Haryana",
    mapLink: "https://maps.google.com/?q=Le+Meridien+MG+Road+Gurugram",
    theme: "card-sapphire",
    icon: (
      <svg width="60" height="60" viewBox="0 0 100 100" fill="none" stroke="#FFD98A" className="drop-shadow-md">
        <circle cx="50" cy="50" r="42" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.6"/>
        <circle cx="40" cy="55" r="18" strokeWidth="2" />
        <circle cx="60" cy="55" r="18" strokeWidth="2" />
        <path d="M40 37 L50 25 L60 37 L50 48 Z" fill="#C8912A" opacity="0.8" strokeWidth="1.5"/>
        <path d="M35 37 L65 37" strokeWidth="1.5"/>
      </svg>
    )
  },
  {
    id: "shaadi",
    title: "The Royal Shaadi",
    subtitle: "Forever Begins Today",
    rawDate: "2026-02-15",
    timeFormatted: "11:00 AM",
    venueName: "The Lotus Garden",
    venueAddress: "The Leela Ambience, Ambience Island, Gurugram",
    mapLink: "https://maps.google.com/?q=The+Leela+Ambience+Gurugram",
    theme: "card-crimson",
    icon: (
      <svg width="60" height="60" viewBox="0 0 100 100" fill="none" stroke="#FFD98A" className="drop-shadow-md">
        <circle cx="50" cy="50" r="42" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.6"/>
        <path d="M50 20 C65 45 70 65 50 75 C30 65 35 45 50 20 Z" strokeWidth="2" />
        <path d="M50 35 C58 50 60 65 50 75 C40 65 42 50 50 35 Z" fill="#C8912A" opacity="0.4" strokeWidth="1.5"/>
        <path d="M50 50 C54 60 55 70 50 75 C45 70 46 60 50 50 Z" fill="#FFD98A" strokeWidth="1"/>
      </svg>
    )
  },
  {
    id: "reception",
    title: "The Grand Reception",
    subtitle: "A Grand Celebration",
    rawDate: "2026-02-16",
    timeFormatted: "7:00 PM",
    venueName: "The Grand Ballroom",
    venueAddress: "The Oberoi, Udyog Vihar, Gurugram, Haryana",
    mapLink: "https://maps.google.com/?q=The+Oberoi+Gurugram",
    theme: "card-emerald",
    icon: (
      <svg width="60" height="60" viewBox="0 0 100 100" fill="none" stroke="#FFD98A" className="drop-shadow-md">
        <circle cx="50" cy="50" r="42" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.6"/>
        <path d="M35 30 L45 55 L45 75 M40 75 L50 75" strokeWidth="2"/>
        <path d="M65 30 L55 55 L55 75 M50 75 L60 75" strokeWidth="2"/>
        <path d="M38 38 L43 38 M57 38 L62 38" strokeWidth="1.5" opacity="0.5"/>
        <path d="M50 20 L52 25 L57 27 L52 29 L50 34 L48 29 L43 27 L48 25 Z" fill="#FFD98A" strokeWidth="1"/>
      </svg>
    )
  },
];

const bgFireflies = [
  { left: "70.27%", animDuration: "14.24s", animDelay: "-6.86s", drift: "20px", glowDuration: "3.98s" },
  { left: "91.28%", animDuration: "18.58s", animDelay: "-17.18s", drift: "19px", glowDuration: "4.75s" },
  { left: "97.31%", animDuration: "20.24s", animDelay: "-15.29s", drift: "-43px", glowDuration: "4.11s" },
  { left: "12.44%", animDuration: "17.38s", animDelay: "-11.87s", drift: "31px", glowDuration: "3.00s" },
  { left: "61.61%", animDuration: "12.98s", animDelay: "-3.76s", drift: "54px", glowDuration: "2.18s" },
  { left: "47.35%", animDuration: "21.70s", animDelay: "-6.95s", drift: "-39px", glowDuration: "4.63s" },
  { left: "56.97%", animDuration: "22.23s", animDelay: "-13.08s", drift: "-40px", glowDuration: "2.72s" },
  { left: "35.28%", animDuration: "19.89s", animDelay: "-8.14s", drift: "-50px", glowDuration: "4.17s" },
  { left: "77.13%", animDuration: "14.31s", animDelay: "-13.21s", drift: "40px", glowDuration: "2.57s" },
  { left: "29.93%", animDuration: "12.49s", animDelay: "-11.74s", drift: "45px", glowDuration: "4.75s" },
];

interface DateGroup {
  dateKey: string;
  dayLabel: string;
  formattedDate: string;
  events: CeremonyItem[];
}

export function CeremonySection({ events, language }: { events: WeddingRecord["events"]; language?: "en" | "hi" }) {
  // Use DB events if provided, otherwise fallback to hardcoded ceremonies
  const activeCeremonies: CeremonyItem[] = events && events.length > 0 
    ? [...events]
        .sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time || '00:00'}`);
          const dateB = new Date(`${b.date}T${b.time || '00:00'}`);
          return dateA.getTime() - dateB.getTime();
        })
        .map((e, idx) => ({
          id: `event-${idx}`,
          title: (e.name === "Other" || e.name === "Others" || !e.name) ? (e.customName || "Special Event") : (e.name || "Wedding Event"),
          rawDate: e.date,
          timeFormatted: e.time 
            ? new Date(`2000-01-01T${e.time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) 
            : '',
          venueName: e.venue || "",
          venueAddress: "",
          mapLink: e.mapsLink || "",
          theme: ["card-marigold", "card-sapphire", "card-crimson", "card-emerald"][idx % 4],
          icon: mockCeremonies[idx % mockCeremonies.length].icon
        }))
    : mockCeremonies;

  // Group ceremonies date-wise in chronological sequence
  const groupedMap = new Map<string, CeremonyItem[]>();
  activeCeremonies.forEach((ceremony) => {
    const key = ceremony.rawDate || "date-unknown";
    if (!groupedMap.has(key)) {
      groupedMap.set(key, []);
    }
    groupedMap.get(key)!.push(ceremony);
  });

  const dateGroups: DateGroup[] = Array.from(groupedMap.entries()).map(([dateKey, groupEvents], groupIdx) => {
    let formattedDate = dateKey;
    try {
      const d = new Date(dateKey + "T00:00:00");
      if (!isNaN(d.getTime())) {
        formattedDate = d.toLocaleDateString('en-GB', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }).toUpperCase();
      }
    } catch (err) {}

    return {
      dateKey,
      dayLabel: `DAY ${String(groupIdx + 1).padStart(2, '0')}`,
      formattedDate,
      events: groupEvents
    };
  });

  return (
    <section 
      id="cer" 
      className="relative z-20 w-full mt-[-160px] md:mt-[-200px]"
      style={{
        background: 'linear-gradient(180deg, var(--cer-bg-transparent, rgba(9,32,43,0)) 0%, var(--cer-bg-color, #09202b) var(--cer-bg-stop, 200px), var(--cer-bg-color, #09202b) 100%)'
      }}
    >
      {/* Background Fireflies Layer (Ambient) */}
      <div className="hidden md:block absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {bgFireflies.map((ff, i) => (
          <div 
            key={i} 
            className="firefly-wrapper" 
            style={{
              left: ff.left, 
              animation: `fireflyFloat ${ff.animDuration} linear ${ff.animDelay} infinite`,
              '--drift': ff.drift
            } as React.CSSProperties}
          >
            <div className="firefly-glow" style={{ animation: `glowPulse ${ff.glowDuration} alternate infinite ease-in-out` }}></div>
          </div>
        ))}
      </div>

      <div className="pt-4 pb-12 md:pb-16 px-4 w-full relative z-20">
        {/* GRAND FLORAL MANDALA TRANSITION */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          viewport={{ once: true, margin: "-80px" }}
          className="relative w-full h-[200px] md:h-[220px] flex items-center justify-center mb-6 overflow-visible"
        >
          {/* Glowing aura */}
          <div className="absolute w-[300px] md:w-[350px] h-[300px] md:h-[350px] rounded-full bg-[radial-gradient(circle,rgba(200,145,42,0.2)_0%,transparent_60%)] animate-[pulse_4s_ease-in-out_infinite]"></div>
          
          {/* Rotating rings */}
          <div className="absolute w-[160px] md:w-[180px] h-[160px] md:h-[180px] border-2 border-dashed border-[#C8912A]/40 rounded-full animate-[spin_30s_linear_infinite]"></div>
          <div className="absolute w-[220px] md:w-[240px] h-[220px] md:h-[240px] border border-[#C8912A]/20 rounded-full animate-[spin_40s_linear_infinite_reverse]"></div>
          
          {/* Center Lotus */}
          <img loading="lazy" src="/project3-assets/champagne_lotus.png" alt="Lotus" className="absolute w-[clamp(75px,12vw,110px)] z-[2] md:drop-shadow-[0_0_25px_rgba(200,145,42,0.6)] animate-bob" />
          
          {/* Orbiting Roses */}
          <div className="absolute w-[160px] md:w-[180px] h-[160px] md:h-[180px] animate-[spin_25s_linear_infinite]">
            <img loading="lazy" src="/project3-assets/burgundy_rose.png" className="absolute top-[-15px] left-[calc(50%-15px)] w-[30px] rotate-0 md:drop-shadow-md" />
            <img loading="lazy" src="/project3-assets/burgundy_rose.png" className="absolute bottom-[-15px] left-[calc(50%-15px)] w-[30px] rotate-180 md:drop-shadow-md" />
          </div>
          
          {/* Outer Orbiting Marigolds */}
          <div className="absolute w-[250px] md:w-[280px] h-[250px] md:h-[280px] animate-[spin_35s_linear_infinite_reverse]">
            <img loading="lazy" src="/project3-assets/marigold_petals.png" className="absolute top-[10%] right-[10%] w-[40px] md:w-[45px] opacity-80 md:drop-shadow-sm" />
            <img loading="lazy" src="/project3-assets/marigold_petals.png" className="absolute bottom-[10%] left-[10%] w-[40px] md:w-[45px] opacity-80 rotate-180 md:drop-shadow-sm" />
          </div>

          {/* Elegant single line passing behind the lotus */}
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[min(85vw,800px)] h-[1px] bg-gradient-to-r from-transparent via-[#C8912A]/70 to-transparent z-[-1]"></div>
        </motion.div>

        {/* Section Header */}
        <div className="text-center px-4 max-w-2xl mx-auto mb-12 md:mb-16">
          <div className="font-montserrat text-xs md:text-sm tracking-[5px] text-[#C8912A] uppercase mb-3 drop-shadow-sm font-semibold">
            {t("festivities", language)}
          </div>
          <h2 className="font-cinzel font-bold text-3xl md:text-5xl text-white tracking-[1px] mb-3 drop-shadow-md">
            {t("daysOfCelebration", language)}
          </h2>
          <div className="h-[2px] w-24 bg-gradient-to-r from-transparent via-[#C8912A] to-transparent mx-auto mt-4"></div>
        </div>

        {/* DATE-WISE CEREMONY CONTAINERS */}
        <div className="max-w-5xl mx-auto px-2 sm:px-4 pb-20 md:pb-28 flex flex-col gap-16 md:gap-24">
          {dateGroups.map((group) => (
            <div key={group.dateKey} className="w-full flex flex-col items-center">
              
              {/* Royal Date Banner / Header */}
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="flex flex-col items-center justify-center mb-8 md:mb-10 text-center w-full"
              >
                {/* Gold Day Badge */}
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#170e04] via-[#2f1f07] to-[#170e04] border border-[#FFE8AC]/40 shadow-[0_2px_15px_rgba(200,145,42,0.25)] mb-3">
                  <span className="text-[#FFE8AC] text-xs">✦</span>
                  <span className="font-montserrat font-bold text-[11px] sm:text-xs tracking-[3px] text-[#FFE8AC] uppercase">
                    {group.dayLabel}
                  </span>
                  <span className="text-[#FFE8AC] text-xs">✦</span>
                </div>

                {/* Big, Legible Date Title */}
                <h3 className="font-cinzel font-bold text-xl sm:text-2xl md:text-3xl text-white tracking-wide drop-shadow-md">
                  {group.formattedDate}
                </h3>

                {/* Ornamental Gold Divider */}
                <div className="flex items-center justify-center gap-3 w-full max-w-xs sm:max-w-md mt-3 opacity-75">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#C8912A] to-[#FFD98A]" />
                  <span className="text-[#FFE8AC] text-xs font-serif">❖</span>
                  <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#C8912A] to-[#FFD98A]" />
                </div>
              </motion.div>

              {/* Day Events Grid */}
              <div className={`w-full ${
                group.events.length === 1 
                  ? "flex justify-center" 
                  : "grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 justify-items-center"
              }`}>
                {group.events.map((ceremony, idx) => (
                  <motion.div
                    key={ceremony.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className="gem-wrapper is-active w-full max-w-[440px] relative"
                  >
                    <article
                      className={`palace-card ${ceremony.theme} w-full h-full p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden`}
                      style={{
                        clipPath: "polygon(26px 0, calc(100% - 26px) 0, 100% 26px, 100% calc(100% - 26px), calc(100% - 26px) 100%, 26px 100%, 0 calc(100% - 26px), 0 26px)",
                      }}
                    >
                      {/* Sparkles */}
                      {sparkles.map((s, i) => (
                        <span 
                          key={i} 
                          className="card-sparkle" 
                          style={{ left: s.left, top: s.top, animationDelay: s.delay, animationDuration: s.duration }}
                        >
                          {s.char}
                        </span>
                      ))}

                      <div className="relative z-10">
                        {/* Emblem */}
                        <div className="ceremony-emblem flex justify-center mb-4 opacity-90">
                          {ceremony.icon}
                        </div>

                        {/* Title */}
                        <h4 className="text-center font-cinzel font-bold text-2xl md:text-3xl text-white tracking-wider drop-shadow-md mb-3">
                          {ceremony.title}
                        </h4>

                        {/* Time Badge (Without Ceremony Tags) */}
                        {ceremony.timeFormatted && (
                          <div className="flex justify-center mb-5 md:mb-6">
                            <div className="text-center px-4 py-1.5 rounded-full bg-gold-primary/15 border border-[#FFE8AC]/40 font-montserrat font-bold text-xs md:text-sm tracking-wider text-[#FFE8AC] shadow-inner">
                              ✦ {ceremony.timeFormatted} ✦
                            </div>
                          </div>
                        )}

                        <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-[#C8912A]/70 to-transparent mx-auto mb-5"></div>

                        {/* Venue Information */}
                        <div className="text-center flex flex-col gap-1.5 mb-6">
                          <div className="font-montserrat font-bold text-[11px] tracking-widest text-[#FFD98A] uppercase mb-0.5">
                            {t("theVenue", language)}
                          </div>
                          <div className="font-playfair font-bold text-lg md:text-xl text-white drop-shadow-md">
                            {ceremony.venueName}
                          </div>
                          {ceremony.venueAddress && (
                            <div className="font-lora text-sm text-white/85 leading-relaxed max-w-xs mx-auto">
                              {ceremony.venueAddress}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Google Maps Directions Action Button */}
                      <div className="flex justify-center relative z-10 mt-auto pt-2">
                        <a
                          href={ceremony.mapLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ceremony.venueName)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center min-h-[46px] w-full max-w-[280px] px-6 rounded-full bg-gradient-to-br from-[#FFE8AC] via-[#E7B75F] to-[#C8912A] border border-[#FFF2C6] font-montserrat font-bold text-xs tracking-[1.5px] text-[#061622] shadow-[0_4px_18px_rgba(200,145,42,0.4)] transition-all hover:scale-105 active:scale-95 hover:shadow-[0_6px_22px_rgba(200,145,42,0.6)]"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 shrink-0">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          <span>{t("getDirections", language)}</span>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 shrink-0">
                            <line x1="5" y1="19" x2="19" y2="5"></line>
                            <polyline points="9 5 19 5 19 15"></polyline>
                          </svg>
                        </a>
                      </div>
                    </article>
                  </motion.div>
                ))}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
