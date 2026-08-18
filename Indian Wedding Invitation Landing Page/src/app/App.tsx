import { useState, useEffect } from "react";
import {
  Music, Music2, MapPin, Video, ExternalLink, Heart,
  ChevronDown, Instagram, Play, QrCode, Gift, Users
} from "lucide-react";

function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const target = new Date(targetDate).getTime();
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) { setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return timeLeft;
}

const EVENTS = [
  {
    id: "mehendi",
    name: "Mehendi",
    emoji: "🌿",
    date: "November 14, 2025",
    time: "4:00 PM – 9:00 PM",
    venue: "The Garden Pavilion, Taj Hotel",
    address: "Mansingh Road, New Delhi – 110011",
    theme: "Garden Greens & Ivory",
    notes: "Mehendi artists will be present for all guests. Light snacks & masala chai will be served throughout.",
    img: "photo-1526047932273-341f2a7631f9",
  },
  {
    id: "haldi",
    name: "Haldi",
    emoji: "🌼",
    date: "November 15, 2025",
    time: "10:00 AM – 1:00 PM",
    venue: "Sharma Family Residence",
    address: "12, Prithviraj Road, New Delhi",
    theme: "Sunshine Yellow & White",
    notes: "Please wear clothes you don't mind getting turmeric-stained! A lavish brunch will follow the ceremony.",
    img: "photo-1516483638261-f4dbaf036963",
  },
  {
    id: "sangeet",
    name: "Sangeet",
    emoji: "🎵",
    date: "November 15, 2025",
    time: "7:00 PM – 12:00 AM",
    venue: "The Grand Ballroom, ITC Maurya",
    address: "Sardar Patel Marg, New Delhi – 110021",
    theme: "Bollywood Glam",
    notes: "Family performances, live band, and a full dinner buffet. Formal Indian or Western attire required.",
    img: "photo-1524499982521-1ffd58dd89ea",
  },
  {
    id: "wedding",
    name: "Wedding",
    emoji: "💍",
    date: "November 16, 2025",
    time: "Muhurat: 7:11 AM",
    venue: "Laxminarayan Mandap & Temple",
    address: "Mandir Marg, New Delhi – 110001",
    theme: "Traditional Red & Gold",
    notes: "Pheras begin at the auspicious hour of 7:11 AM. Please be seated by 6:45 AM. Breakfast served after.",
    img: "photo-1583939003579-730e3918a45a",
  },
  {
    id: "reception",
    name: "Reception",
    emoji: "✨",
    date: "November 16, 2025",
    time: "7:00 PM – 11:30 PM",
    venue: "Leela Palace Gardens",
    address: "Diplomatic Enclave, Chanakyapuri, Delhi",
    theme: "Regal Ivory & Gold",
    notes: "Cocktails at 7 PM, dinner at 8:30 PM. Live ghazal performance and open bar all evening.",
    img: "photo-1519741497674-611481863552",
  },
];

const STORY = [
  {
    year: "2019",
    title: "A Chance Meeting",
    body: "Two strangers reached for the same book at a Delhi Literature Festival. Aditya insisted it was fate; Ananya insisted it was coincidence. They debated for three hours over chai. Neither won. Neither left.",
    img: "photo-1507525428034-b723cf961d3e",
    side: "left" as const,
  },
  {
    year: "2020",
    title: "Lockdown & Late Nights",
    body: "The world paused. Their calls didn't. Five hundred video calls, seventeen shared playlists, and one burnt attempt at banana bread later — they both knew this was something different.",
    img: "photo-1518199266791-5375a83190b7",
    side: "right" as const,
  },
  {
    year: "2022",
    title: "The Proposal",
    body: "On a rooftop in Jaipur, under a sky full of lanterns during Diwali, Aditya got down on one knee. Ananya said yes before he had finished asking. He still teases her about it.",
    img: "photo-1519225421980-715cb0215aed",
    side: "left" as const,
  },
  {
    year: "2025",
    title: "Forever Begins",
    body: "After three years of planning, a thousand shared dreams, countless family dinners, and the unwavering blessing of two wonderful families — they are finally, joyfully, getting married.",
    img: "photo-1606800052052-a08af7148866",
    side: "right" as const,
  },
];

const GALLERY = [
  { id: "photo-1583939003579-730e3918a45a", tall: true },
  { id: "photo-1519741497674-611481863552", tall: false },
  { id: "photo-1519225421980-715cb0215aed", tall: false },
  { id: "photo-1526047932273-341f2a7631f9", tall: true },
  { id: "photo-1512316609839-ce289d3eba0a", tall: false },
  { id: "photo-1524499982521-1ffd58dd89ea", tall: true },
];

const PARTY = [
  { name: "Rohan Sharma", role: "Best Man", img: "photo-1500648767791-00dcc994a43e" },
  { name: "Priya Verma", role: "Maid of Honor", img: "photo-1494790108377-be9c29b29330" },
  { name: "Kabir Sharma", role: "Brother of Bride", img: "photo-1506794778202-cad84cf45f1d" },
  { name: "Nisha Verma", role: "Sister of Groom", img: "photo-1524250502761-1ac6f2e30d43" },
  { name: "Dev Agarwal", role: "Groomsman", img: "photo-1507003211169-0a1dd7228f2d" },
  { name: "Simran Kapoor", role: "Bridesmaid", img: "photo-1531746020798-e6953c6e8e04" },
];

export default function App() {
  const [activeEvent, setActiveEvent] = useState("wedding");
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredGallery, setHoveredGallery] = useState<number | null>(null);
  const countdown = useCountdown("2025-11-16T07:11:00");
  const active = EVENTS.find(e => e.id === activeEvent)!;

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ fontFamily: "var(--font-body)", background: "var(--background)", color: "var(--foreground)" }}
    >
      {/* ── Sticky Nav ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 md:px-10 py-3 border-b"
        style={{ background: "rgba(253,248,240,0.88)", backdropFilter: "blur(12px)", borderColor: "rgba(201,168,76,0.2)" }}
      >
        <span style={{ fontFamily: "var(--font-display)", color: "#C9A84C", letterSpacing: "0.15em", fontSize: "0.95rem" }}>
          ✦ #AdityaKiAnanya
        </span>
        <div className="hidden md:flex gap-8" style={{ fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>
          {["Story", "Events", "Family", "RSVP"].map(s => (
            <a
              key={s}
              href={`#${s.toLowerCase()}`}
              style={{ color: "#5C3A1E", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#C9A84C")}
              onMouseLeave={e => (e.currentTarget.style.color = "#5C3A1E")}
            >
              {s}
            </a>
          ))}
        </div>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all"
          style={{
            borderColor: "rgba(201,168,76,0.4)",
            color: "#C9A84C",
            background: isPlaying ? "rgba(201,168,76,0.1)" : "transparent",
            fontSize: "0.78rem",
            letterSpacing: "0.08em",
            cursor: "pointer",
          }}
        >
          {isPlaying ? <Music className="w-3.5 h-3.5" /> : <Music2 className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{isPlaying ? "Pause Music" : "♪ Play Music"}</span>
        </button>
      </nav>

      {/* ══════════════════════════════════
          1 · HERO
      ══════════════════════════════════ */}
      <section id="hero" className="relative flex items-center justify-center overflow-hidden" style={{ minHeight: "100svh" }}>
        {/* Bg image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1920&h=1080&fit=crop&auto=format"
            alt="Indian wedding mandap"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(26,10,4,0.65) 0%, rgba(26,10,4,0.45) 40%, rgba(26,10,4,0.8) 100%)" }} />
        </div>

        {/* Gold top rule */}
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: "linear-gradient(to right, transparent, #C9A84C, transparent)" }} />

        {/* Decorative mandala arcs — pure CSS */}
        <div
          className="absolute opacity-10 rounded-full border-2 pointer-events-none"
          style={{ width: 600, height: 600, top: "50%", left: "50%", transform: "translate(-50%,-50%)", borderColor: "#C9A84C" }}
        />
        <div
          className="absolute opacity-10 rounded-full border pointer-events-none"
          style={{ width: 460, height: 460, top: "50%", left: "50%", transform: "translate(-50%,-50%)", borderColor: "#C9A84C" }}
        />

        <div className="relative z-10 text-center px-6 pt-20 pb-10 w-full max-w-3xl mx-auto">
          {/* Sanskrit */}
          <p style={{ fontFamily: "var(--font-body)", color: "#C9A84C", fontSize: "0.75rem", letterSpacing: "0.45em", textTransform: "uppercase", marginBottom: "1.75rem" }}>
            ॐ श्री गणेशाय नमः · With Divine Blessings
          </p>

          <Ornament />

          <p style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.6)", fontSize: "0.72rem", letterSpacing: "0.35em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
            Together with their families
          </p>

          {/* Names */}
          <div style={{ fontFamily: "var(--font-display)", color: "white", lineHeight: 1 }}>
            <span style={{ display: "block", fontSize: "clamp(3rem, 10vw, 6.5rem)", fontWeight: 400, letterSpacing: "-0.01em" }}>Aditya</span>
            <span style={{ display: "block", color: "#C9A84C", fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontStyle: "italic", fontWeight: 400, margin: "0.6rem 0" }}>&amp;</span>
            <span style={{ display: "block", fontSize: "clamp(3rem, 10vw, 6.5rem)", fontWeight: 400, letterSpacing: "-0.01em" }}>Ananya</span>
          </div>

          <p style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.45)", fontSize: "0.72rem", letterSpacing: "0.5em", textTransform: "uppercase", marginTop: "1.25rem", marginBottom: "1.75rem" }}>
            Sharma · Verma
          </p>

          {/* Date */}
          <p style={{ fontFamily: "var(--font-display)", color: "#C9A84C", fontSize: "clamp(1rem, 3vw, 1.4rem)", fontStyle: "italic", marginBottom: "2.5rem" }}>
            November 16, 2025 · New Delhi, India
          </p>

          {/* Countdown */}
          <div className="flex justify-center gap-3 md:gap-6 mb-10">
            {[
              { label: "Days", val: countdown.days },
              { label: "Hours", val: countdown.hours },
              { label: "Mins", val: countdown.minutes },
              { label: "Secs", val: countdown.seconds },
            ].map(({ label, val }) => (
              <div key={label} className="flex flex-col items-center">
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: "clamp(56px,12vw,76px)",
                    height: "clamp(56px,12vw,76px)",
                    border: "1px solid rgba(201,168,76,0.5)",
                    background: "rgba(0,0,0,0.35)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.4rem, 4vw, 2rem)", color: "white", fontWeight: 400 }}>
                    {String(val).padStart(2, "0")}
                  </span>
                </div>
                <span style={{ fontFamily: "var(--font-body)", color: "#C9A84C", fontSize: "0.6rem", letterSpacing: "0.35em", textTransform: "uppercase", marginTop: "0.5rem" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Hashtag */}
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full mx-auto"
            style={{ border: "1px solid rgba(201,168,76,0.5)", background: "rgba(0,0,0,0.25)", backdropFilter: "blur(6px)" }}
          >
            <Instagram className="w-3.5 h-3.5" style={{ color: "#C9A84C" }} />
            <span style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.85)", fontSize: "0.82rem", letterSpacing: "0.08em" }}>#AdityaKiAnanya</span>
          </div>

          <div className="mt-14 animate-bounce">
            <ChevronDown className="w-5 h-5 mx-auto" style={{ color: "rgba(255,255,255,0.3)" }} />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(201,168,76,0.4), transparent)" }} />
      </section>

      {/* ══════════════════════════════════
          2 · OUR STORY
      ══════════════════════════════════ */}
      <section id="story" className="py-28 px-5 md:px-10" style={{ background: "#FDF8F0" }}>
        <div className="max-w-5xl mx-auto">
          <SectionHeader overline="How We Met" title="Our Love Story" />

          <div className="mt-20 relative">
            {/* Center line */}
            <div
              className="hidden md:block absolute top-0 bottom-0 pointer-events-none"
              style={{ left: "50%", width: 1, background: "linear-gradient(to bottom, transparent, rgba(201,168,76,0.35) 15%, rgba(201,168,76,0.35) 85%, transparent)" }}
            />

            {STORY.map((item, i) => (
              <div
                key={i}
                className="mb-16 flex flex-col md:flex-row gap-8 items-start"
                style={{ flexDirection: item.side === "right" ? undefined : "row-reverse" }}
              >
                {/* Year dot */}
                <div
                  className="hidden md:flex absolute items-center justify-center flex-shrink-0 rounded-full"
                  style={{
                    left: "calc(50% - 1.5rem)",
                    width: "3rem",
                    height: "3rem",
                    marginTop: "2rem",
                    background: "#1A3A2A",
                    border: "2px solid #C9A84C",
                    position: "absolute",
                    zIndex: 2,
                  }}
                >
                  <span style={{ fontFamily: "var(--font-body)", color: "#C9A84C", fontSize: "0.58rem", fontWeight: 500 }}>{item.year}</span>
                </div>

                {/* Text card */}
                <div
                  className="flex-1 md:max-w-[calc(50%-3.5rem)] p-6 border transition-shadow hover:shadow-md"
                  style={{ background: "white", borderColor: "rgba(201,168,76,0.2)" }}
                >
                  <span style={{ fontFamily: "var(--font-body)", color: "#C9A84C", fontSize: "0.68rem", letterSpacing: "0.35em", textTransform: "uppercase" }}>{item.year}</span>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem", color: "#2C1810", marginTop: "0.35rem", marginBottom: "0.75rem" }}>{item.title}</h3>
                  <p style={{ fontFamily: "var(--font-body)", color: "#7A5C3E", fontSize: "0.9rem", lineHeight: 1.75 }}>{item.body}</p>
                </div>

                {/* Image */}
                <div className="flex-1 md:max-w-[calc(50%-3.5rem)] overflow-hidden" style={{ background: "#E8D5C4", aspectRatio: "4/3" }}>
                  <img
                    src={`https://images.unsplash.com/${item.img}?w=600&h=450&fit=crop&auto=format`}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gallery ── */}
      <section style={{ background: "#FAF5EC", padding: "5rem 1.25rem" }}>
        <div className="max-w-6xl mx-auto">
          <SectionHeader overline="Pre-Wedding Shoot" title="Our Gallery" />
          <div className="mt-12 columns-2 md:columns-3 gap-3" style={{ columnGap: "0.75rem" }}>
            {GALLERY.map((img, i) => (
              <div
                key={i}
                className="mb-3 overflow-hidden relative break-inside-avoid"
                style={{ background: "#E8D5C4", cursor: "pointer" }}
                onMouseEnter={() => setHoveredGallery(i)}
                onMouseLeave={() => setHoveredGallery(null)}
              >
                <img
                  src={`https://images.unsplash.com/${img.id}?w=600&h=${img.tall ? "700" : "400"}&fit=crop&auto=format`}
                  alt={`Gallery photo ${i + 1}`}
                  className="w-full object-cover block transition-transform duration-500"
                  style={{ transform: hoveredGallery === i ? "scale(1.04)" : "scale(1)" }}
                />
                <div
                  className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
                  style={{ background: "rgba(44,24,16,0.35)", opacity: hoveredGallery === i ? 1 : 0 }}
                >
                  <Heart className="w-6 h-6" style={{ color: "#C9A84C" }} />
                </div>
              </div>
            ))}
          </div>

          {/* Video card */}
          <div className="mt-14 relative overflow-hidden border" style={{ borderColor: "rgba(201,168,76,0.3)", background: "#1A3A2A" }}>
            <img
              src="https://images.unsplash.com/photo-1524499982521-1ffd58dd89ea?w=1400&h=500&fit=crop&auto=format"
              alt="Pre-wedding video thumbnail"
              className="w-full object-cover block"
              style={{ height: 260, opacity: 0.35 }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <button
                className="flex items-center justify-center mb-5 rounded-full border-2 transition-colors duration-200"
                style={{ width: 64, height: 64, borderColor: "#C9A84C", background: "rgba(201,168,76,0.1)", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(201,168,76,0.25)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(201,168,76,0.1)")}
              >
                <Play className="w-6 h-6 ml-1" style={{ color: "#C9A84C" }} />
              </button>
              <p style={{ fontFamily: "var(--font-body)", color: "#C9A84C", fontSize: "0.68rem", letterSpacing: "0.42em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Watch Our</p>
              <h3 style={{ fontFamily: "var(--font-display)", color: "white", fontSize: "1.8rem", fontWeight: 400, marginBottom: "1rem" }}>Pre-Wedding Film</h3>
              <a
                href="#"
                className="inline-flex items-center gap-2 transition-colors"
                style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.55)", fontSize: "0.82rem", textDecoration: "none" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#C9A84C")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
              >
                <ExternalLink className="w-3.5 h-3.5" /> Watch on YouTube
              </a>
            </div>
          </div>
        </div>
      </section>

      <GoldDivider />

      {/* ══════════════════════════════════
          3 · EVENTS
      ══════════════════════════════════ */}
      <section id="events" className="py-28 px-5 md:px-10" style={{ background: "#FDF8F0" }}>
        <div className="max-w-5xl mx-auto">
          <SectionHeader overline="Save the Dates" title="Wedding Itinerary" />

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mt-12 mb-10">
            {EVENTS.map(ev => (
              <button
                key={ev.id}
                onClick={() => setActiveEvent(ev.id)}
                className="px-4 py-2 border transition-all duration-200"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8rem",
                  letterSpacing: "0.08em",
                  cursor: "pointer",
                  background: activeEvent === ev.id ? "#1A3A2A" : "transparent",
                  color: activeEvent === ev.id ? "#C9A84C" : "#5C3A1E",
                  borderColor: activeEvent === ev.id ? "#1A3A2A" : "rgba(201,168,76,0.35)",
                }}
              >
                {ev.emoji} {ev.name}
              </button>
            ))}
          </div>

          {/* Active event card */}
          <div className="border overflow-hidden shadow-sm" style={{ borderColor: "rgba(201,168,76,0.3)", background: "white" }}>
            <div className="h-1" style={{ background: "linear-gradient(to right, #C9A84C, #E8C97A, #C9A84C)" }} />
            <div className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row gap-10">
                <div className="flex-1">
                  <span style={{ fontFamily: "var(--font-body)", color: "#C9A84C", fontSize: "0.7rem", letterSpacing: "0.42em", textTransform: "uppercase" }}>
                    {active.emoji} Ceremony
                  </span>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem,5vw,3rem)", color: "#2C1810", fontWeight: 400, margin: "0.4rem 0 1.75rem" }}>
                    {active.name}
                  </h2>

                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <Row label="Date" value={active.date} />
                    <Row label="Time" value={active.time} />
                    <Row label="Venue" value={active.venue} />
                    <div>
                      <span style={{ fontFamily: "var(--font-body)", color: "#7A5C3E", fontSize: "0.68rem", letterSpacing: "0.25em", textTransform: "uppercase", display: "block", marginBottom: "0.4rem" }}>
                        Dress Code / Theme
                      </span>
                      <span
                        className="inline-block px-3 py-1"
                        style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "#5C3A1E", background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.4)" }}
                      >
                        ✦ {active.theme}
                      </span>
                    </div>
                  </div>

                  <div
                    className="mt-6 p-4"
                    style={{ background: "#FDF8F0", borderLeft: "2px solid #C9A84C" }}
                  >
                    <p style={{ fontFamily: "var(--font-body)", color: "#7A5C3E", fontSize: "0.85rem", lineHeight: 1.7, fontStyle: "italic" }}>
                      📌 {active.notes}
                    </p>
                  </div>

                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-7 px-6 py-3 transition-colors duration-200"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.82rem",
                      letterSpacing: "0.08em",
                      background: "#1A3A2A",
                      color: "#C9A84C",
                      textDecoration: "none",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#243F30")}
                    onMouseLeave={e => (e.currentTarget.style.background = "#1A3A2A")}
                  >
                    <MapPin className="w-4 h-4" /> View on Google Maps
                  </a>
                </div>

                {/* Event image + address */}
                <div style={{ width: "100%", maxWidth: 240, flexShrink: 0 }}>
                  <div className="overflow-hidden" style={{ background: "#E8D5C4", aspectRatio: "1/1" }}>
                    <img
                      src={`https://images.unsplash.com/${active.img}?w=480&h=480&fit=crop&auto=format`}
                      alt={active.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    className="mt-3 p-3 text-center border"
                    style={{ borderColor: "rgba(201,168,76,0.2)", background: "#FDF8F0" }}
                  >
                    <span style={{ fontFamily: "var(--font-body)", color: "#7A5C3E", fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", display: "block", marginBottom: "0.35rem" }}>
                      Venue Address
                    </span>
                    <span style={{ fontFamily: "var(--font-body)", color: "#5C3A1E", fontSize: "0.8rem", lineHeight: 1.5 }}>{active.address}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mini event row — timeline overview */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-3">
            {EVENTS.map(ev => (
              <button
                key={ev.id}
                onClick={() => setActiveEvent(ev.id)}
                className="p-3 border text-center transition-all duration-200"
                style={{
                  fontFamily: "var(--font-body)",
                  background: activeEvent === ev.id ? "rgba(26,58,42,0.06)" : "white",
                  borderColor: activeEvent === ev.id ? "rgba(201,168,76,0.6)" : "rgba(201,168,76,0.15)",
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: "1.5rem", display: "block", marginBottom: "0.25rem" }}>{ev.emoji}</span>
                <span style={{ color: "#5C3A1E", fontSize: "0.72rem", letterSpacing: "0.08em" }}>{ev.name}</span>
                <span style={{ color: "#C9A84C", fontSize: "0.62rem", display: "block", marginTop: "0.15rem" }}>{ev.date.split(",")[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <GoldDivider />

      {/* ══════════════════════════════════
          4 · FAMILY
      ══════════════════════════════════ */}
      <section id="family" className="py-28 px-5 md:px-10" style={{ background: "#FAF5EC" }}>
        <div className="max-w-5xl mx-auto">
          <SectionHeader overline="With Blessings Of" title="Our Families" />

          <div className="mt-16 grid md:grid-cols-2 gap-8">
            <FamilyCard
              side="Bride's Family"
              name="The Sharmas"
              parents={["Sh. Rajiv Kumar Sharma", "Smt. Priya Sharma"]}
              grandparents={[
                "Late Sh. Mahendra Prasad Sharma",
                "Smt. Kamla Devi Sharma",
                "Late Sh. Ram Avtar Gupta",
                "Smt. Sunita Gupta",
              ]}
              img="photo-1551582045-6ec9c11d8697"
              from="Lucknow, Uttar Pradesh"
            />
            <FamilyCard
              side="Groom's Family"
              name="The Vermas"
              parents={["Sh. Suresh Chandra Verma", "Smt. Meena Verma"]}
              grandparents={[
                "Sh. Ratan Lal Verma",
                "Late Smt. Shakuntala Devi Verma",
                "Late Sh. Kedar Nath Singh",
                "Smt. Parvati Singh",
              ]}
              img="photo-1502082553048-f009c37129b9"
              from="Jaipur, Rajasthan"
            />
          </div>

          {/* Wedding Party */}
          <div className="mt-20">
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px flex-1" style={{ background: "rgba(201,168,76,0.3)" }} />
              <div className="flex items-center gap-2" style={{ color: "#C9A84C" }}>
                <Users className="w-4 h-4" />
                <span style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "#2C1810", fontWeight: 400 }}>The Wedding Party</span>
              </div>
              <div className="h-px flex-1" style={{ background: "rgba(201,168,76,0.3)" }} />
            </div>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {PARTY.map((p, i) => (
                <div key={i} className="text-center group">
                  <div
                    className="mx-auto mb-3 overflow-hidden rounded-full"
                    style={{ width: 72, height: 72, background: "#E8D5C4", border: "2px solid rgba(201,168,76,0.4)" }}
                  >
                    <img
                      src={`https://images.unsplash.com/${p.img}?w=200&h=200&fit=crop&auto=format`}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <p style={{ fontFamily: "var(--font-display)", color: "#2C1810", fontSize: "0.82rem" }}>{p.name}</p>
                  <p style={{ fontFamily: "var(--font-body)", color: "#C9A84C", fontSize: "0.65rem", letterSpacing: "0.08em", marginTop: "0.15rem" }}>{p.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <GoldDivider />

      {/* ══════════════════════════════════
          5 · VIRTUAL & SHAGUN
      ══════════════════════════════════ */}
      <section id="rsvp" className="py-28 px-5 md:px-10" style={{ background: "#FDF8F0" }}>
        <div className="max-w-5xl mx-auto">
          <SectionHeader overline="Join From Anywhere" title="Virtual & Digital Blessings" />

          <div className="mt-16 grid md:grid-cols-2 gap-8">
            {/* Livestream card */}
            <div className="border overflow-hidden" style={{ background: "#1A3A2A", borderColor: "rgba(201,168,76,0.3)" }}>
              <div className="h-1" style={{ background: "linear-gradient(to right, #C9A84C, #E8C97A, #C9A84C)" }} />
              <div className="p-8">
                <div className="flex items-center gap-3 mb-7">
                  <div
                    className="flex items-center justify-center rounded-full flex-shrink-0"
                    style={{ width: 44, height: 44, border: "1px solid rgba(201,168,76,0.5)" }}
                  >
                    <Video className="w-5 h-5" style={{ color: "#C9A84C" }} />
                  </div>
                  <div>
                    <p style={{ fontFamily: "var(--font-body)", color: "#C9A84C", fontSize: "0.65rem", letterSpacing: "0.38em", textTransform: "uppercase" }}>Watch from Home</p>
                    <h3 style={{ fontFamily: "var(--font-display)", color: "white", fontSize: "1.4rem", fontWeight: 400 }}>Join Us Virtually</h3>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div className="p-4" style={{ background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.18)" }}>
                    <p style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.5)", fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "0.35rem" }}>
                      Live Stream Link
                    </p>
                    <a
                      href="#"
                      className="inline-flex items-center gap-1.5"
                      style={{ fontFamily: "var(--font-body)", color: "#C9A84C", fontSize: "0.85rem", textDecoration: "none" }}
                    >
                      youtube.com/live/adityaananya25 <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="p-4" style={{ background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.18)" }}>
                    <p style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.5)", fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "0.6rem" }}>
                      Stream Schedule
                    </p>
                    <ul style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                      {[
                        ["🔴", "Pheras begin · 7:11 AM"],
                        ["💍", "Saptapadi Ceremony · 8:00 AM"],
                        ["🍽️", "Wedding Breakfast · 9:30 AM"],
                        ["🎊", "Evening Reception · 7:00 PM"],
                      ].map(([icon, text]) => (
                        <li key={text} style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.75)", fontSize: "0.82rem" }}>
                          {icon} {text}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.42)", fontSize: "0.78rem", fontStyle: "italic", lineHeight: 1.65 }}>
                    The stream goes live 15 minutes before ceremony. Join with your blessings from anywhere in the world. 🌍
                  </p>
                </div>
              </div>
            </div>

            {/* Shagun card */}
            <div className="border overflow-hidden" style={{ background: "white", borderColor: "rgba(201,168,76,0.3)" }}>
              <div className="h-1" style={{ background: "linear-gradient(to right, #C9A84C, #E8C97A, #C9A84C)" }} />
              <div className="p-8">
                <div className="flex items-center gap-3 mb-7">
                  <div
                    className="flex items-center justify-center rounded-full flex-shrink-0"
                    style={{ width: 44, height: 44, border: "1px solid rgba(201,168,76,0.4)", background: "rgba(201,168,76,0.07)" }}
                  >
                    <Gift className="w-5 h-5" style={{ color: "#C9A84C" }} />
                  </div>
                  <div>
                    <p style={{ fontFamily: "var(--font-body)", color: "#C9A84C", fontSize: "0.65rem", letterSpacing: "0.38em", textTransform: "uppercase" }}>Digital Shagun</p>
                    <h3 style={{ fontFamily: "var(--font-display)", color: "#2C1810", fontSize: "1.4rem", fontWeight: 400 }}>Blessings & Registry</h3>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div className="p-4" style={{ background: "#FDF8F0", border: "1px solid rgba(201,168,76,0.2)" }}>
                    <p style={{ fontFamily: "var(--font-body)", color: "#7A5C3E", fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "0.35rem" }}>
                      UPI ID
                    </p>
                    <p style={{ fontFamily: "var(--font-body)", color: "#2C1810", fontSize: "0.95rem", fontWeight: 500 }}>ananya.sharma@okaxis</p>
                  </div>

                  <div className="p-4" style={{ background: "#FDF8F0", border: "1px solid rgba(201,168,76,0.2)" }}>
                    <p style={{ fontFamily: "var(--font-body)", color: "#7A5C3E", fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                      Bank Transfer
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                      {[
                        ["Account Name", "Rajiv Kumar Sharma"],
                        ["Account No.", "XXXX XXXX XXXX 4521"],
                        ["Bank", "HDFC Bank, Connaught Place"],
                        ["IFSC Code", "HDFC0001234"],
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between">
                          <span style={{ fontFamily: "var(--font-body)", color: "#7A5C3E", fontSize: "0.78rem" }}>{k}</span>
                          <span style={{ fontFamily: "var(--font-body)", color: "#2C1810", fontSize: "0.78rem", fontWeight: 500 }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* QR placeholder */}
                  <div className="flex items-center gap-4 p-4" style={{ background: "#FDF8F0", border: "1px solid rgba(201,168,76,0.2)" }}>
                    <div
                      className="flex items-center justify-center flex-shrink-0"
                      style={{ width: 64, height: 64, background: "#2C1810" }}
                    >
                      <QrCode className="w-8 h-8" style={{ color: "#C9A84C" }} />
                    </div>
                    <div>
                      <p style={{ fontFamily: "var(--font-body)", color: "#7A5C3E", fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "0.3rem" }}>
                        Scan to Pay · UPI
                      </p>
                      <p style={{ fontFamily: "var(--font-body)", color: "#5C3A1E", fontSize: "0.8rem", lineHeight: 1.5 }}>
                        QR code will be shared on the wedding day
                      </p>
                    </div>
                  </div>

                  {/* Policy note */}
                  <div className="p-3 text-center" style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.2)" }}>
                    <p style={{ fontFamily: "var(--font-body)", color: "#7A5C3E", fontSize: "0.78rem", fontStyle: "italic", lineHeight: 1.65 }}>
                      ✨ Your presence is the greatest gift of all. Shagun is only for those who wish to bless us from afar and are unable to join in person.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-16 px-6 text-center" style={{ background: "#1A3A2A" }}>
        <Ornament />
        <h2 style={{ fontFamily: "var(--font-display)", color: "white", fontSize: "clamp(1.8rem,5vw,3rem)", fontWeight: 400, marginBottom: "0.5rem" }}>
          Aditya &amp; Ananya
        </h2>
        <p style={{ fontFamily: "var(--font-body)", color: "#C9A84C", fontSize: "0.72rem", letterSpacing: "0.45em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
          November 16, 2025 · New Delhi
        </p>
        <p style={{ fontFamily: "var(--font-display)", color: "rgba(255,255,255,0.35)", fontSize: "0.95rem", fontStyle: "italic", maxWidth: "36rem", margin: "0 auto" }}>
          "Two souls, one destiny. With the blessings of our families and the love of our friends."
        </p>
        <p style={{ fontFamily: "var(--font-body)", color: "rgba(201,168,76,0.4)", fontSize: "0.68rem", letterSpacing: "0.45em", marginTop: "2.5rem" }}>
          #AdityaKiAnanya
        </p>
      </footer>
    </div>
  );
}

/* ── Shared sub-components ── */

function Ornament() {
  return (
    <div className="flex items-center justify-center gap-4 my-6">
      <div style={{ height: 1, width: 48, background: "rgba(201,168,76,0.5)" }} />
      <span style={{ color: "#C9A84C", fontSize: "1rem" }}>✦</span>
      <div style={{ height: 1, width: 48, background: "rgba(201,168,76,0.5)" }} />
    </div>
  );
}

function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-4 py-8 px-6">
      <div className="flex-1" style={{ height: 1, background: "linear-gradient(to right, transparent, rgba(201,168,76,0.35))" }} />
      <span style={{ color: "#C9A84C", fontSize: "0.7rem", letterSpacing: "0.5em" }}>✦ ✦ ✦</span>
      <div className="flex-1" style={{ height: 1, background: "linear-gradient(to left, transparent, rgba(201,168,76,0.35))" }} />
    </div>
  );
}

function SectionHeader({ overline, title }: { overline: string; title: string }) {
  return (
    <div className="text-center">
      <p style={{ fontFamily: "var(--font-body)", color: "#C9A84C", fontSize: "0.68rem", letterSpacing: "0.5em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
        {overline}
      </p>
      <h2 style={{ fontFamily: "var(--font-display)", color: "#2C1810", fontSize: "clamp(2rem,5vw,3.25rem)", fontWeight: 400, lineHeight: 1.15 }}>
        {title}
      </h2>
      <div className="flex items-center justify-center gap-3 mt-4">
        <div style={{ height: 1, width: 40, background: "rgba(201,168,76,0.5)" }} />
        <span style={{ color: "#C9A84C", fontSize: "0.65rem" }}>✦</span>
        <div style={{ height: 1, width: 40, background: "rgba(201,168,76,0.5)" }} />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span style={{ fontFamily: "var(--font-body)", color: "#7A5C3E", fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", display: "block", marginBottom: "0.2rem" }}>
        {label}
      </span>
      <span style={{ fontFamily: "var(--font-body)", color: "#2C1810", fontSize: "0.95rem" }}>{value}</span>
    </div>
  );
}

function FamilyCard({
  side, name, parents, grandparents, img, from
}: {
  side: string; name: string; parents: string[]; grandparents: string[]; img: string; from: string;
}) {
  return (
    <div className="border overflow-hidden shadow-sm transition-shadow hover:shadow-md" style={{ background: "white", borderColor: "rgba(201,168,76,0.2)" }}>
      <div className="overflow-hidden" style={{ height: 160, background: "#E8D5C4" }}>
        <img
          src={`https://images.unsplash.com/${img}?w=700&h=320&fit=crop&auto=format`}
          alt={name}
          className="w-full h-full object-cover"
          style={{ opacity: 0.72 }}
        />
      </div>
      <div className="p-7">
        <div className="flex items-end justify-between mb-1">
          <span style={{ fontFamily: "var(--font-body)", color: "#C9A84C", fontSize: "0.65rem", letterSpacing: "0.38em", textTransform: "uppercase" }}>{side}</span>
          <span style={{ fontFamily: "var(--font-body)", color: "#7A5C3E", fontSize: "0.7rem" }}>📍 {from}</span>
        </div>
        <h3 style={{ fontFamily: "var(--font-display)", color: "#2C1810", fontSize: "1.5rem", fontWeight: 400, marginBottom: "1.25rem" }}>{name}</h3>

        <div style={{ marginBottom: "1rem" }}>
          <p style={{ fontFamily: "var(--font-body)", color: "#C9A84C", fontSize: "0.62rem", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Parents</p>
          {parents.map((p, i) => (
            <p key={i} style={{ fontFamily: "var(--font-body)", color: "#2C1810", fontSize: "0.88rem", padding: "0.45rem 0", borderBottom: "1px solid rgba(201,168,76,0.12)" }}>
              {p}
            </p>
          ))}
        </div>

        <div>
          <p style={{ fontFamily: "var(--font-body)", color: "#C9A84C", fontSize: "0.62rem", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Grandparents</p>
          {grandparents.map((g, i) => (
            <p key={i} style={{ fontFamily: "var(--font-body)", color: "#5C3A1E", fontSize: "0.82rem", padding: "0.4rem 0", borderBottom: "1px solid rgba(201,168,76,0.1)", opacity: 0.82 }}>
              {g}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
