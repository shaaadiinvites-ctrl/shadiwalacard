"use client";

import { useState, useEffect } from "react";
import { MapPin, ExternalLink, ArrowDown, Instagram, Play, Gift, Video, Users } from "lucide-react";
import { WeddingRecord } from "@/types/wedding";

/* ── Modern Minimal template ───────────────────────────────────────────────
   Editorial, monochrome, big whitespace, sans-serif everywhere. Deliberately
   the visual opposite of Royal Heritage: no gold, no ornaments, thin rules
   and a lot of negative space instead. */

const INK = "#111111";
const MUTE = "#6B6B6B";
const LINE = "#E5E5E5";
const PAPER = "#FFFFFF";

interface Props { wedding: WeddingRecord; }

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

function fmtDate(d?: string) {
  if (!d) return "";
  return new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}
function fmtTime(t?: string) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: "var(--font-body)", color: MUTE, fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase" }}>
      {children}
    </p>
  );
}

function SectionTitle({ label, title }: { label: string; title: string }) {
  return (
    <div className="mb-14">
      <Label>{label}</Label>
      <h2 style={{ fontFamily: "var(--font-body)", color: INK, fontSize: "clamp(1.75rem,4vw,2.75rem)", fontWeight: 300, marginTop: "0.5rem" }}>
        {title}
      </h2>
      <div style={{ height: 1, width: 48, background: INK, marginTop: "1.25rem" }} />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between border-b py-3" style={{ borderColor: LINE }}>
      <span style={{ fontFamily: "var(--font-body)", color: MUTE, fontSize: "0.72rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>{label}</span>
      <span style={{ fontFamily: "var(--font-body)", color: INK, fontSize: "0.95rem", textAlign: "right" }}>{value}</span>
    </div>
  );
}

export default function ModernMinimalTemplate({ wedding }: Props) {
  const events = (wedding.events ?? []).filter(e => e.name);
  const [activeIdx, setActiveIdx] = useState(0);
  const active = events[activeIdx] ?? null;
  const firstDate = events[0]?.date;
  const countdown = useCountdown(firstDate);
  const galleryUrls = (wedding.gallery_urls ?? []).filter(Boolean);
  const heroImg = wedding.cover_photo_url
    ? wedding.cover_photo_url
    : "https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&h=1080&fit=crop&auto=format";

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ fontFamily: "var(--font-body)", background: PAPER, color: INK }}>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-14 py-5"
        style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)", borderBottom: `1px solid ${LINE}` }}>
        <span style={{ fontSize: "0.8rem", letterSpacing: "0.25em", textTransform: "uppercase" }}>
          {wedding.groom_name.split(" ")[0]} / {wedding.bride_name.split(" ")[0]}
        </span>
        {wedding.hashtag && <span style={{ color: MUTE, fontSize: "0.75rem" }}>{wedding.hashtag}</span>}
      </nav>

      {/* Hero */}
      <section className="relative flex items-end" style={{ minHeight: "100svh" }}>
        <div className="absolute inset-0">
          <img src={heroImg} alt="Wedding" className="w-full h-full object-cover" style={{ filter: "grayscale(15%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0.05))" }} />
        </div>
        <div className="relative z-10 w-full px-6 md:px-14 pb-16 pt-32">
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.75rem", letterSpacing: "0.35em", textTransform: "uppercase", marginBottom: "1rem" }}>
            {firstDate ? fmtDate(firstDate) : "Save the date"}
          </p>
          <h1 style={{ color: "white", fontSize: "clamp(2.75rem,9vw,6rem)", fontWeight: 300, lineHeight: 1.02, letterSpacing: "-0.02em" }}>
            {wedding.groom_name}
            <br />
            <span style={{ color: "rgba(255,255,255,0.55)" }}>&amp;</span> {wedding.bride_name}
          </h1>
          {firstDate && (
            <div className="flex gap-8 mt-10">
              {[{ l: "Days", v: countdown.days }, { l: "Hrs", v: countdown.hours }, { l: "Min", v: countdown.minutes }, { l: "Sec", v: countdown.seconds }].map(({ l, v }) => (
                <div key={l}>
                  <span style={{ color: "white", fontSize: "1.75rem", fontWeight: 300 }}>{String(v).padStart(2, "0")}</span>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>{l}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <ArrowDown className="absolute bottom-6 right-6 w-5 h-5 animate-bounce" style={{ color: "white" }} />
      </section>

      {/* Story */}
      {wedding.our_story && (
        <section className="py-24 px-6 md:px-14 max-w-3xl mx-auto">
          <SectionTitle label="Our Story" title="How it began" />
          <p style={{ color: "#333", fontSize: "1.05rem", lineHeight: 1.9, whiteSpace: "pre-line" }}>{wedding.our_story}</p>
        </section>
      )}

      {/* Gallery */}
      {galleryUrls.length > 0 && (
        <section className="px-6 md:px-14 pb-24 max-w-6xl mx-auto">
          <SectionTitle label="Gallery" title="In pictures" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {galleryUrls.map((url, i) => (
              <img key={i} src={url} alt={`Gallery ${i + 1}`} className="w-full aspect-square object-cover" style={{ filter: "grayscale(8%)" }} />
            ))}
          </div>
        </section>
      )}

      {/* Video */}
      {wedding.video_link && (
        <section className="px-6 md:px-14 pb-24 max-w-3xl mx-auto text-center">
          <a href={wedding.video_link} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 border" style={{ borderColor: INK, color: INK, textDecoration: "none" }}>
            <Play className="w-4 h-4" /> <span style={{ fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>Watch the film</span>
          </a>
        </section>
      )}

      {/* Events */}
      {events.length > 0 && (
        <section className="py-24 px-6 md:px-14 max-w-3xl mx-auto" style={{ borderTop: `1px solid ${LINE}` }}>
          <SectionTitle label="Itinerary" title="Schedule" />
          <div className="flex gap-6 mb-8 flex-wrap">
            {events.map((ev, i) => (
              <button key={i} onClick={() => setActiveIdx(i)}
                style={{
                  fontFamily: "var(--font-body)", fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase",
                  color: activeIdx === i ? INK : MUTE, background: "none", border: "none", cursor: "pointer",
                  borderBottom: activeIdx === i ? `2px solid ${INK}` : "2px solid transparent", paddingBottom: 6,
                }}>
                {ev.name}
              </button>
            ))}
          </div>
          {active && (
            <div>
              {active.date && <Row label="Date" value={fmtDate(active.date)} />}
              {active.time && <Row label="Time" value={fmtTime(active.time)} />}
              {active.venue && <Row label="Venue" value={active.venue} />}
              {active.dressCode && <Row label="Dress Code" value={active.dressCode} />}
              {active.notes && <p style={{ color: MUTE, fontSize: "0.85rem", marginTop: "1rem", fontStyle: "italic" }}>{active.notes}</p>}
              {active.mapsLink && (
                <a href={active.mapsLink} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-6" style={{ color: INK, fontSize: "0.85rem", textDecoration: "underline" }}>
                  <MapPin className="w-4 h-4" /> View on map
                </a>
              )}
            </div>
          )}
        </section>
      )}

      {/* Family */}
      {(wedding.bride_mother_name || wedding.groom_mother_name || wedding.wedding_party) && (
        <section className="py-24 px-6 md:px-14 max-w-5xl mx-auto" style={{ borderTop: `1px solid ${LINE}` }}>
          <SectionTitle label="Families" title="With love from" />
          <div className="grid md:grid-cols-2 gap-16">
            {(wedding.bride_mother_name || wedding.bride_father_name) && (
              <div>
                <Label>{wedding.bride_name}'s Family</Label>
                <p style={{ color: "#333", fontSize: "0.92rem", lineHeight: 1.8, marginTop: "0.75rem", whiteSpace: "pre-line" }}>{wedding.bride_mother_name} {wedding.bride_mother_name && wedding.bride_father_name && "&"} {wedding.bride_father_name}</p>
              </div>
            )}
            {(wedding.groom_mother_name || wedding.groom_father_name) && (
              <div>
                <Label>{wedding.groom_name}'s Family</Label>
                <p style={{ color: "#333", fontSize: "0.92rem", lineHeight: 1.8, marginTop: "0.75rem", whiteSpace: "pre-line" }}>{wedding.groom_mother_name} {wedding.groom_mother_name && wedding.groom_father_name && "&"} {wedding.groom_father_name}</p>
              </div>
            )}
          </div>
          {wedding.wedding_party && (
            <div className="mt-14 flex items-start gap-3">
              <Users className="w-4 h-4 mt-1" style={{ color: MUTE }} />
              <p style={{ color: "#333", fontSize: "0.92rem", lineHeight: 1.8, whiteSpace: "pre-line" }}>{wedding.wedding_party}</p>
            </div>
          )}
        </section>
      )}

      {/* Virtual */}
      {(wedding.live_stream_link) && (
        <section className="py-24 px-6 md:px-14 max-w-5xl mx-auto" style={{ borderTop: `1px solid ${LINE}` }}>
          <SectionTitle label="Good to know" title="Join & give" />
          <div className="grid md:grid-cols-2 gap-16">
            {wedding.live_stream_link && (
              <div>
                <div className="flex items-center gap-2 mb-3"><Video className="w-4 h-4" /><Label>Livestream</Label></div>
                <a href={wedding.live_stream_link} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5" style={{ color: INK, fontSize: "0.9rem", textDecoration: "underline" }}>
                  {wedding.live_stream_link.replace(/^https?:\/\//, "")} <ExternalLink className="w-3 h-3" />
                </a>
                {wedding.live_stream_notes && <p style={{ color: MUTE, fontSize: "0.85rem", marginTop: "0.75rem" }}>{wedding.live_stream_notes}</p>}
              </div>
            )}

          </div>
        </section>
      )}

      {/* Contact */}
      {(wedding.contact_number || wedding.primary_email) && (
        <section className="py-16 px-6 text-center" style={{ borderTop: `1px solid ${LINE}` }}>
          <div className="flex flex-wrap gap-6 justify-center" style={{ fontSize: "0.9rem" }}>
            {wedding.contact_number && <a href={`tel:${wedding.contact_number}`} style={{ color: INK, textDecoration: "underline" }}>{wedding.contact_number}</a>}
            {wedding.primary_email && <a href={`mailto:${wedding.primary_email}`} style={{ color: INK, textDecoration: "underline" }}>{wedding.primary_email}</a>}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-16 px-6 text-center" style={{ background: INK }}>
        <h2 style={{ color: "white", fontSize: "clamp(1.5rem,4vw,2.25rem)", fontWeight: 300 }}>{wedding.groom_name} &amp; {wedding.bride_name}</h2>
        {firstDate && <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", marginTop: "0.75rem" }}>{fmtDate(firstDate)}</p>}
        {wedding.hashtag && (
          <p className="inline-flex items-center gap-2 mt-6" style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.8rem" }}>
            <Instagram className="w-3.5 h-3.5" /> {wedding.hashtag}
          </p>
        )}
      </footer>
    </div>
  );
}
