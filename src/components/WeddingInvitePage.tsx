"use client";

import { useState, useEffect } from "react";
import {
  Music, Music2, MapPin, ExternalLink, Heart,
  ChevronDown, Instagram, Play, Gift, Video, Users
} from "lucide-react";
import { WeddingRecord } from "@/types/wedding";

/* ── Types ─────────────────────────────────────────────────────────────────── */
// This component renders the "Royal Heritage" template.
interface Props { wedding: WeddingRecord; }

/* ── Countdown hook ─────────────────────────────────────────────────────────── */
function useCountdown(targetDate?: string) {
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    if (!targetDate) return;
    const target = new Date(targetDate + "T00:00:00").getTime();
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) { setT({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setT({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, [targetDate]);
  return t;
}

/* ── Helpers ─────────────────────────────────────────────────────────────────── */
function fmtDate(d?: string) {
  if (!d) return "";
  return new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}
function fmtTime(t?: string) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

/* ── Shared sub-components ─────────────────────────────────────────────────── */
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

/* ── Main component ─────────────────────────────────────────────────────────── */
export default function WeddingInvitePage({ wedding }: Props) {
  const events = (wedding.events ?? []).filter(e => e.name);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredGallery, setHoveredGallery] = useState<number | null>(null);

  const mainEvent = events.find(e => e.isMainEvent) || events[0];
  const firstDate = mainEvent?.date;
  const countdown = useCountdown(firstDate);
  
  const active = events[activeIdx] ?? null;
  const activeDisplayName = active?.name === "Other" && active?.customName ? active.customName : active?.name;

  const heroImg = wedding.cover_photo_url
    ? wedding.cover_photo_url
    : "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1920&h=1080&fit=crop&auto=format";

  const galleryUrls = (wedding.gallery_urls ?? []).filter(Boolean);

  const isBrideFirst = wedding.name_order === "bride_first";
  
  const firstName = isBrideFirst ? wedding.bride_name : wedding.groom_name;
  const secondName = isBrideFirst ? wedding.groom_name : wedding.bride_name;

  const firstMother = isBrideFirst ? wedding.bride_mother_name : wedding.groom_mother_name;
  const firstFather = isBrideFirst ? wedding.bride_father_name : wedding.groom_father_name;
  
  const secondMother = isBrideFirst ? wedding.groom_mother_name : wedding.bride_mother_name;
  const secondFather = isBrideFirst ? wedding.groom_father_name : wedding.bride_father_name;

  const firstSonOrDaughter = isBrideFirst ? "DAUGHTER" : "SON";
  const secondSonOrDaughter = isBrideFirst ? "SON" : "DAUGHTER";

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ fontFamily: "var(--font-body)", background: "#FDF8F0", color: "#2C1810" }}>

      {/* ── Sticky Nav ─────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 md:px-10 py-3 border-b"
        style={{ background: "rgba(253,248,240,0.88)", backdropFilter: "blur(12px)", borderColor: "rgba(201,168,76,0.2)" }}>
        <span style={{ fontFamily: "var(--font-display)", color: "#C9A84C", letterSpacing: "0.15em", fontSize: "0.95rem" }}>
          ✦ {wedding.hashtag || `${firstName} & ${secondName}`}
        </span>
        <div className="hidden md:flex gap-8" style={{ fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>
          {["Story", "Events", "Family", "Gifts"].map(s => (
            <a key={s} href={`#${s.toLowerCase()}`}
              style={{ color: "#5C3A1E", textDecoration: "none" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#C9A84C")}
              onMouseLeave={e => (e.currentTarget.style.color = "#5C3A1E")}
            >{s}</a>
          ))}
        </div>
        {wedding.music_link ? (
          <a href={wedding.music_link} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all"
            style={{ borderColor: "rgba(201,168,76,0.4)", color: "#C9A84C", background: "transparent", fontSize: "0.78rem", letterSpacing: "0.08em" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,168,76,0.1)"; setIsPlaying(true); }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
          >
            {isPlaying ? <Music className="w-3.5 h-3.5" /> : <Music2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">♪ Our Song</span>
          </a>
        ) : (
          <button onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all"
            style={{ borderColor: "rgba(201,168,76,0.4)", color: "#C9A84C", background: isPlaying ? "rgba(201,168,76,0.1)" : "transparent", fontSize: "0.78rem", cursor: "pointer" }}>
            {isPlaying ? <Music className="w-3.5 h-3.5" /> : <Music2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isPlaying ? "Pause" : "♪ Play Music"}</span>
          </button>
        )}
      </nav>

      {/* ══════════════════════════════════
          1 · HERO
      ══════════════════════════════════ */}
      <section id="hero" className="relative flex items-center justify-center overflow-hidden" style={{ minHeight: "100svh" }}>
        <div className="absolute inset-0">
          <img src={heroImg} alt="Wedding" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(26,10,4,0.65) 0%, rgba(26,10,4,0.45) 40%, rgba(26,10,4,0.8) 100%)" }} />
        </div>
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: "linear-gradient(to right, transparent, #C9A84C, transparent)" }} />
        <div className="absolute opacity-10 rounded-full border-2 pointer-events-none"
          style={{ width: 600, height: 600, top: "50%", left: "50%", transform: "translate(-50%,-50%)", borderColor: "#C9A84C" }} />
        <div className="absolute opacity-10 rounded-full border pointer-events-none"
          style={{ width: 460, height: 460, top: "50%", left: "50%", transform: "translate(-50%,-50%)", borderColor: "#C9A84C" }} />

        <div className="relative z-10 text-center px-6 pt-20 pb-10 w-full max-w-3xl mx-auto">
          <p style={{ fontFamily: "var(--font-body)", color: "#C9A84C", fontSize: "0.75rem", letterSpacing: "0.45em", textTransform: "uppercase", marginBottom: "1.75rem" }}>
            ॐ श्री गणेशाय नमः · With Divine Blessings
          </p>
          <Ornament />
          <p style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.6)", fontSize: "0.72rem", letterSpacing: "0.35em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
            Together with their families
          </p>
          <div style={{ fontFamily: "var(--font-display)", color: "white", lineHeight: 1 }}>
            <span style={{ display: "block", fontSize: "clamp(3rem,10vw,6.5rem)", fontWeight: 400, letterSpacing: "-0.01em" }}>{firstName}</span>
            
            {(firstMother || firstFather) && (
              <span style={{ display: "block", fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.7)", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", marginTop: "0.5rem" }}>
                {firstSonOrDaughter} OF {firstMother ? `MRS. ${firstMother}` : ""} {firstMother && firstFather ? "&" : ""} {firstFather ? `MR. ${firstFather}` : ""}
              </span>
            )}
            
            <span style={{ display: "block", color: "#C9A84C", fontSize: "clamp(1.5rem,4vw,2.5rem)", fontStyle: "italic", fontWeight: 400, margin: "0.8rem 0" }}>&amp;</span>
            
            <span style={{ display: "block", fontSize: "clamp(3rem,10vw,6.5rem)", fontWeight: 400, letterSpacing: "-0.01em" }}>{secondName}</span>
            
            {(secondMother || secondFather) && (
              <span style={{ display: "block", fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.7)", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", marginTop: "0.5rem" }}>
                {secondSonOrDaughter} OF {secondMother ? `MRS. ${secondMother}` : ""} {secondMother && secondFather ? "&" : ""} {secondFather ? `MR. ${secondFather}` : ""}
              </span>
            )}
          </div>
          {firstDate && (
            <p style={{ fontFamily: "var(--font-display)", color: "#C9A84C", fontSize: "clamp(1rem,3vw,1.4rem)", fontStyle: "italic", marginTop: "1.25rem", marginBottom: "2.5rem" }}>
              {fmtDate(firstDate)}
            </p>
          )}

          {/* Countdown */}
          {firstDate && (
            <div className="flex justify-center gap-3 md:gap-6 mb-10">
              {[{ label: "Days", val: countdown.days }, { label: "Hours", val: countdown.hours }, { label: "Mins", val: countdown.minutes }, { label: "Secs", val: countdown.seconds }].map(({ label, val }) => (
                <div key={label} className="flex flex-col items-center">
                  <div className="flex items-center justify-center"
                    style={{ width: "clamp(56px,12vw,76px)", height: "clamp(56px,12vw,76px)", border: "1px solid rgba(201,168,76,0.5)", background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)" }}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.4rem,4vw,2rem)", color: "white", fontWeight: 400 }}>
                      {String(val).padStart(2, "0")}
                    </span>
                  </div>
                  <span style={{ fontFamily: "var(--font-body)", color: "#C9A84C", fontSize: "0.6rem", letterSpacing: "0.35em", textTransform: "uppercase", marginTop: "0.5rem" }}>{label}</span>
                </div>
              ))}
            </div>
          )}

          {wedding.hashtag && (
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full mx-auto"
              style={{ border: "1px solid rgba(201,168,76,0.5)", background: "rgba(0,0,0,0.25)", backdropFilter: "blur(6px)" }}>
              <Instagram className="w-3.5 h-3.5" style={{ color: "#C9A84C" }} />
              <span style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.85)", fontSize: "0.82rem", letterSpacing: "0.08em" }}>{wedding.hashtag}</span>
            </div>
          )}

          <div className="mt-14 animate-bounce">
            <ChevronDown className="w-5 h-5 mx-auto" style={{ color: "rgba(255,255,255,0.3)" }} />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(201,168,76,0.4), transparent)" }} />
      </section>

      {/* ══════════════════════════════════
          2 · OUR STORY
      ══════════════════════════════════ */}
      {wedding.our_story && (
        <section id="story" className="py-28 px-5 md:px-10" style={{ background: "#FDF8F0" }}>
          <div className="max-w-3xl mx-auto">
            <SectionHeader overline="How We Met" title="Our Love Story" />
            <div className="mt-14 p-8 border" style={{ background: "white", borderColor: "rgba(201,168,76,0.2)" }}>
              <p style={{ fontFamily: "var(--font-body)", color: "#7A5C3E", fontSize: "1rem", lineHeight: 1.9, whiteSpace: "pre-line" }}>
                {wedding.our_story}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Gallery */}
      {galleryUrls.length > 0 && (
        <section style={{ background: "#FAF5EC", padding: "5rem 1.25rem" }}>
          <div className="max-w-6xl mx-auto">
            <SectionHeader overline="Memories" title="Our Gallery" />
            <div className="mt-12 columns-2 md:columns-3" style={{ columnGap: "0.75rem" }}>
              {galleryUrls.map((url, i) => (
                <div key={i} className="mb-3 overflow-hidden relative break-inside-avoid"
                  style={{ background: "#E8D5C4", cursor: "pointer" }}
                  onMouseEnter={() => setHoveredGallery(i)}
                  onMouseLeave={() => setHoveredGallery(null)}>
                  <img src={url} alt={`Gallery ${i + 1}`}
                    className="w-full object-cover block transition-transform duration-500"
                    style={{ transform: hoveredGallery === i ? "scale(1.04)" : "scale(1)" }} />
                  <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
                    style={{ background: "rgba(44,24,16,0.35)", opacity: hoveredGallery === i ? 1 : 0 }}>
                    <Heart className="w-6 h-6" style={{ color: "#C9A84C" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Video */}
      {wedding.video_link && (
        <section style={{ background: "#FAF5EC", padding: "0 1.25rem 5rem" }}>
          <div className="max-w-6xl mx-auto">
            <div className="relative overflow-hidden border" style={{ borderColor: "rgba(201,168,76,0.3)", background: "#1A3A2A" }}>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                <a href={wedding.video_link} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center mb-5 rounded-full border-2 transition-colors duration-200"
                  style={{ width: 64, height: 64, borderColor: "#C9A84C", background: "rgba(201,168,76,0.1)" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(201,168,76,0.25)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "rgba(201,168,76,0.1)")}>
                  <Play className="w-6 h-6 ml-1" style={{ color: "#C9A84C" }} />
                </a>
                <p style={{ fontFamily: "var(--font-body)", color: "#C9A84C", fontSize: "0.68rem", letterSpacing: "0.42em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Watch Our</p>
                <h3 style={{ fontFamily: "var(--font-display)", color: "white", fontSize: "1.8rem", fontWeight: 400, marginBottom: "1rem" }}>Pre-Wedding Film</h3>
                <a href={wedding.video_link} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                  style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.55)", fontSize: "0.82rem", textDecoration: "none" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#C9A84C")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}>
                  <ExternalLink className="w-3.5 h-3.5" /> Watch Video
                </a>
              </div>
              <div style={{ height: 260, background: "#1A3A2A", opacity: 0.6 }} />
            </div>
          </div>
        </section>
      )}

      <GoldDivider />

      {/* ══════════════════════════════════
          3 · EVENTS
      ══════════════════════════════════ */}
      {events.length > 0 && (
        <section id="events" className="py-28 px-5 md:px-10" style={{ background: "#FDF8F0" }}>
          <div className="max-w-5xl mx-auto">
            <SectionHeader overline="Save the Dates" title="Wedding Itinerary" />

            {/* Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mt-12 mb-10">
              {events.map((ev, i) => (
                <button key={i} onClick={() => setActiveIdx(i)}
                  className="px-4 py-2 border transition-all duration-200"
                  style={{
                    fontFamily: "var(--font-body)", fontSize: "0.8rem", letterSpacing: "0.08em", cursor: "pointer",
                    background: activeIdx === i ? "#1A3A2A" : "transparent",
                    color: activeIdx === i ? "#C9A84C" : "#5C3A1E",
                    borderColor: activeIdx === i ? "#1A3A2A" : "rgba(201,168,76,0.35)",
                  }}>
                  {ev.name}
                </button>
              ))}
            </div>

            {/* Active event card */}
            {active && (
              <div className="border overflow-hidden shadow-sm" style={{ borderColor: "rgba(201,168,76,0.3)", background: "white" }}>
                <div className="h-1" style={{ background: "linear-gradient(to right, #C9A84C, #E8C97A, #C9A84C)" }} />
                <div className="p-8 md:p-12">
                  <div className="flex flex-col md:flex-row gap-10">
                    <div className="flex-1">
                      {active.dressCode && (
                        <span style={{ fontFamily: "var(--font-body)", color: "#C9A84C", fontSize: "0.7rem", letterSpacing: "0.42em", textTransform: "uppercase" }}>
                          {active.dressCode}
                        </span>
                      )}
                      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem,5vw,3rem)", color: "#2C1810", fontWeight: 400, margin: "0.4rem 0 1.75rem" }}>
                        {activeDisplayName}
                      </h2>
                      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {active.date && <Row label="Date" value={fmtDate(active.date)} />}
                        {active.time && <Row label="Time" value={fmtTime(active.time)} />}
                        {active.venue && <Row label="Venue" value={active.venue} />}
                      </div>
                      {active.mapsLink && (
                        <a href={active.mapsLink} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 mt-7 px-6 py-3 transition-colors duration-200"
                          style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", letterSpacing: "0.08em", background: "#1A3A2A", color: "#C9A84C", textDecoration: "none" }}
                          onMouseEnter={e => (e.currentTarget.style.background = "#243F30")}
                          onMouseLeave={e => (e.currentTarget.style.background = "#1A3A2A")}>
                          <MapPin className="w-4 h-4" /> View on Google Maps
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mini event grid */}
            {events.length > 1 && (
              <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-3">
                {events.map((ev, i) => {
                  const evDisplayName = ev.name === "Other" && ev.customName ? ev.customName : ev.name;
                  return (
                    <button key={i} onClick={() => setActiveIdx(i)}
                      className="p-3 border text-center transition-all duration-200"
                      style={{
                        fontFamily: "var(--font-body)", cursor: "pointer",
                        background: activeIdx === i ? "rgba(26,58,42,0.06)" : "white",
                        borderColor: activeIdx === i ? "rgba(201,168,76,0.6)" : "rgba(201,168,76,0.15)",
                      }}>
                      <span style={{ color: "#5C3A1E", fontSize: "0.72rem", letterSpacing: "0.08em", display: "block" }}>{evDisplayName}</span>
                      {ev.date && <span style={{ color: "#C9A84C", fontSize: "0.62rem", display: "block", marginTop: "0.15rem" }}>{fmtDate(ev.date).split(" ").slice(0, 2).join(" ")}</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      <GoldDivider />

      {/* ══════════════════════════════════
          4 · R.S.V.P & COMPLIMENTS
      ══════════════════════════════════ */}
      {(wedding.rsvp1_name || wedding.rsvp1_phone || wedding.rsvp2_name || wedding.rsvp2_phone) && (
        <section id="rsvp" className="py-28 px-5 md:px-10" style={{ background: "#FAF5EC" }}>
          <div className="max-w-5xl mx-auto">
            <SectionHeader overline="Looking Forward to Seeing You" title="R.S.V.P & Compliments" />
            <div className="mt-16 grid md:grid-cols-2 gap-8">
              
              {/* RSVP 1 */}
              {(wedding.rsvp1_name || wedding.rsvp1_phone) && (
                <div className="border overflow-hidden shadow-sm" style={{ background: "white", borderColor: "rgba(201,168,76,0.2)" }}>
                  <div className="p-7 text-center">
                    <span style={{ fontFamily: "var(--font-body)", color: "#C9A84C", fontSize: "0.65rem", letterSpacing: "0.38em", textTransform: "uppercase" }}>R.S.V.P</span>
                    <h3 style={{ fontFamily: "var(--font-display)", color: "#2C1810", fontSize: "1.5rem", fontWeight: 400, margin: "0.5rem 0 0.8rem" }}>{wedding.rsvp1_name}</h3>
                    {wedding.rsvp1_phone && (
                      <a href={`tel:${wedding.rsvp1_phone}`} className="inline-flex items-center justify-center gap-2 px-4 py-2 mt-2 transition-colors rounded-full" style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", background: "rgba(201,168,76,0.1)", color: "#5C3A1E", textDecoration: "none" }} onMouseEnter={e => (e.currentTarget.style.background = "rgba(201,168,76,0.2)")} onMouseLeave={e => (e.currentTarget.style.background = "rgba(201,168,76,0.1)")}>
                        📞 {wedding.rsvp1_phone}
                      </a>
                    )}
                  </div>
                </div>
              )}
              
              {/* RSVP 2 (Compliments) */}
              {(wedding.rsvp2_name || wedding.rsvp2_phone) && (
                <div className="border overflow-hidden shadow-sm" style={{ background: "white", borderColor: "rgba(201,168,76,0.2)" }}>
                  <div className="p-7 text-center">
                    <span style={{ fontFamily: "var(--font-body)", color: "#C9A84C", fontSize: "0.65rem", letterSpacing: "0.38em", textTransform: "uppercase" }}>With Best Compliments</span>
                    <h3 style={{ fontFamily: "var(--font-display)", color: "#2C1810", fontSize: "1.5rem", fontWeight: 400, margin: "0.5rem 0 0.8rem" }}>{wedding.rsvp2_name}</h3>
                    {wedding.rsvp2_phone && (
                      <a href={`tel:${wedding.rsvp2_phone}`} className="inline-flex items-center justify-center gap-2 px-4 py-2 mt-2 transition-colors rounded-full" style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", background: "rgba(201,168,76,0.1)", color: "#5C3A1E", textDecoration: "none" }} onMouseEnter={e => (e.currentTarget.style.background = "rgba(201,168,76,0.2)")} onMouseLeave={e => (e.currentTarget.style.background = "rgba(201,168,76,0.1)")}>
                        📞 {wedding.rsvp2_phone}
                      </a>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        </section>
      )}

      <GoldDivider />

      {/* ══════════════════════════════════
          5 · VIRTUAL & GIFTS
      ══════════════════════════════════ */}
      {(wedding.live_stream_link) && (
        <section id="gifts" className="py-28 px-5 md:px-10" style={{ background: "#FDF8F0" }}>
          <div className="max-w-5xl mx-auto">
            <SectionHeader overline="Join From Anywhere" title="Virtual & Digital Blessings" />
            <div className="mt-16 grid md:grid-cols-2 gap-8">

              {/* Livestream */}
              {wedding.live_stream_link && (
                <div className="border overflow-hidden" style={{ background: "#1A3A2A", borderColor: "rgba(201,168,76,0.3)" }}>
                  <div className="h-1" style={{ background: "linear-gradient(to right, #C9A84C, #E8C97A, #C9A84C)" }} />
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-7">
                      <div className="flex items-center justify-center rounded-full flex-shrink-0"
                        style={{ width: 44, height: 44, border: "1px solid rgba(201,168,76,0.5)" }}>
                        <Video className="w-5 h-5" style={{ color: "#C9A84C" }} />
                      </div>
                      <div>
                        <p style={{ fontFamily: "var(--font-body)", color: "#C9A84C", fontSize: "0.65rem", letterSpacing: "0.38em", textTransform: "uppercase" }}>Watch from Home</p>
                        <h3 style={{ fontFamily: "var(--font-display)", color: "white", fontSize: "1.4rem", fontWeight: 400 }}>Join Us Virtually</h3>
                      </div>
                    </div>
                    <div className="p-4 mb-4" style={{ background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.18)" }}>
                      <p style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.5)", fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "0.35rem" }}>Live Stream Link</p>
                      <a href={wedding.live_stream_link} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5"
                        style={{ fontFamily: "var(--font-body)", color: "#C9A84C", fontSize: "0.85rem", textDecoration: "none" }}>
                        {wedding.live_stream_link.replace(/^https?:\/\//, "")} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    {wedding.live_stream_notes && (
                      <p style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.6)", fontSize: "0.82rem", lineHeight: 1.65, whiteSpace: "pre-line" }}>
                        {wedding.live_stream_notes}
                      </p>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        </section>
      )}

      {/* ── Contact ───────────────────────────────────────────────────────────── */}
      {(wedding.contact_number || wedding.primary_email) && (
        <section className="py-14 px-5 text-center" style={{ background: "#FAF5EC" }}>
          <p style={{ fontFamily: "var(--font-body)", color: "#C9A84C", fontSize: "0.68rem", letterSpacing: "0.5em", textTransform: "uppercase", marginBottom: "1rem" }}>Get in Touch</p>
          <div className="flex flex-wrap gap-4 justify-center">
            {wedding.contact_number && (
              <a href={`tel:${wedding.contact_number}`}
                className="inline-flex items-center gap-2 px-6 py-3 transition-colors"
                style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", background: "#1A3A2A", color: "#C9A84C", textDecoration: "none" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#243F30")}
                onMouseLeave={e => (e.currentTarget.style.background = "#1A3A2A")}>
                📞 {wedding.contact_number}
              </a>
            )}
            {wedding.primary_email && (
              <a href={`mailto:${wedding.primary_email}`}
                className="inline-flex items-center gap-2 px-6 py-3 border transition-colors"
                style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "#5C3A1E", textDecoration: "none", borderColor: "rgba(201,168,76,0.35)" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "#C9A84C")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(201,168,76,0.35)")}>
                ✉️ {wedding.primary_email}
              </a>
            )}
          </div>
        </section>
      )}

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
      <footer className="py-16 px-6 text-center" style={{ background: "#1A3A2A" }}>
        <Ornament />
        <h2 style={{ fontFamily: "var(--font-display)", color: "white", fontSize: "clamp(1.8rem,5vw,3rem)", fontWeight: 400, marginBottom: "0.5rem" }}>
          {firstName} &amp; {secondName}
        </h2>
        {firstDate && (
          <p style={{ fontFamily: "var(--font-body)", color: "#C9A84C", fontSize: "0.72rem", letterSpacing: "0.45em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
            {fmtDate(firstDate)}
          </p>
        )}
        <p style={{ fontFamily: "var(--font-display)", color: "rgba(255,255,255,0.35)", fontSize: "0.95rem", fontStyle: "italic", maxWidth: "36rem", margin: "0 auto" }}>
          "Two souls, one destiny. With the blessings of our families and the love of our friends."
        </p>
        {wedding.hashtag && (
          <p style={{ fontFamily: "var(--font-body)", color: "rgba(201,168,76,0.4)", fontSize: "0.68rem", letterSpacing: "0.45em", marginTop: "2.5rem" }}>
            {wedding.hashtag}
          </p>
        )}
      </footer>
    </div>
  );
}
