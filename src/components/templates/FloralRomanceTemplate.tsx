"use client";

import { useState, useEffect } from "react";
import { MapPin, ExternalLink, Heart, Instagram, Play, Gift, Video, Sparkles } from "lucide-react";
import { WeddingRecord } from "@/types/wedding";

/* ── Floral Romance template ───────────────────────────────────────────────
   Soft blush pastels, rounded cards, script accents for names, botanical
   emoji flourishes instead of gold ornaments. Deliberately soft and airy
   compared to Royal Heritage and Modern Minimal. */

const BLUSH = "#FBEAF0";
const PINK = "#D68FA1";
const SAGE = "#7A9E7E";
const INK = "#4A3B3F";
const CREAM = "#FFF9F7";

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

function Petals() {
  return <p style={{ color: PINK, fontSize: "1.1rem", letterSpacing: "0.5em" }}>🌸 🌿 🌸</p>;
}

function SectionHeader({ overline, title }: { overline: string; title: string }) {
  return (
    <div className="text-center mb-12">
      <p style={{ fontFamily: "var(--font-body)", color: SAGE, fontSize: "0.72rem", letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: "0.5rem" }}>{overline}</p>
      <h2 style={{ fontFamily: "var(--font-display)", color: INK, fontSize: "clamp(2rem,5vw,3rem)", fontStyle: "italic", fontWeight: 400 }}>{title}</h2>
      <div className="mt-3"><Petals /></div>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-7" style={{ background: "white", borderRadius: 24, border: `1px solid ${BLUSH}`, boxShadow: "0 10px 30px rgba(214,143,161,0.12)" }}>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-2 mb-3">
      <span style={{ color: PINK }}>❀</span>
      <div>
        <span style={{ fontFamily: "var(--font-body)", color: SAGE, fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase", display: "block" }}>{label}</span>
        <span style={{ fontFamily: "var(--font-body)", color: INK, fontSize: "0.95rem" }}>{value}</span>
      </div>
    </div>
  );
}

export default function FloralRomanceTemplate({ wedding }: Props) {
  const events = (wedding.events ?? []).filter(e => e.name);
  const [activeIdx, setActiveIdx] = useState(0);
  const active = events[activeIdx] ?? null;
  const firstDate = events[0]?.date;
  const countdown = useCountdown(firstDate);
  const galleryUrls = (wedding.gallery_urls ?? []).filter(Boolean);
  const heroImg = wedding.cover_photo_url
    ? wedding.cover_photo_url
    : "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1920&h=1080&fit=crop&auto=format";

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ fontFamily: "var(--font-body)", background: CREAM, color: INK }}>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 md:px-10 py-3"
        style={{ background: "rgba(255,249,247,0.9)", backdropFilter: "blur(10px)", borderBottom: `1px solid ${BLUSH}` }}>
        <span style={{ fontFamily: "var(--font-display)", color: PINK, fontStyle: "italic", fontSize: "1rem" }}>
          {wedding.groom_name.split(" ")[0]} &amp; {wedding.bride_name.split(" ")[0]}
        </span>
        <Petals />
      </nav>

      {/* Hero */}
      <section className="relative flex items-center justify-center" style={{ minHeight: "100svh" }}>
        <div className="absolute inset-0">
          <img src={heroImg} alt="Wedding" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(214,143,161,0.35), rgba(74,59,63,0.55))" }} />
        </div>
        <div className="relative z-10 text-center px-6 pt-20">
          <p style={{ color: "white", fontSize: "2rem", marginBottom: "1rem" }}>🌸</p>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.78rem", letterSpacing: "0.35em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
            Together with love, we're getting married
          </p>
          <h1 style={{ fontFamily: "var(--font-display)", color: "white", fontSize: "clamp(3rem,9vw,5.5rem)", fontStyle: "italic", fontWeight: 400, lineHeight: 1.1 }}>
            {wedding.groom_name}
            <span style={{ display: "block", color: "#FBD9E3", fontSize: "0.5em", margin: "0.3em 0" }}>&amp;</span>
            {wedding.bride_name}
          </h1>
          {firstDate && (
            <p style={{ color: "white", fontSize: "1.1rem", marginTop: "1.5rem" }}>{fmtDate(firstDate)}</p>
          )}
          {firstDate && (
            <div className="flex justify-center gap-3 md:gap-5 mt-8">
              {[{ l: "Days", v: countdown.days }, { l: "Hours", v: countdown.hours }, { l: "Mins", v: countdown.minutes }, { l: "Secs", v: countdown.seconds }].map(({ l, v }) => (
                <div key={l} className="flex flex-col items-center justify-center"
                  style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,0.18)", backdropFilter: "blur(4px)" }}>
                  <span style={{ color: "white", fontSize: "1.2rem", fontWeight: 600 }}>{String(v).padStart(2, "0")}</span>
                  <span style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.55rem", textTransform: "uppercase" }}>{l}</span>
                </div>
              ))}
            </div>
          )}
          {wedding.hashtag && (
            <div className="inline-flex items-center gap-2 mt-8 px-5 py-2 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }}>
              <Instagram className="w-3.5 h-3.5" style={{ color: "white" }} />
              <span style={{ color: "white", fontSize: "0.85rem" }}>{wedding.hashtag}</span>
            </div>
          )}
        </div>
      </section>

      {/* Story */}
      {wedding.our_story && (
        <section className="py-24 px-5 md:px-10">
          <div className="max-w-2xl mx-auto">
            <SectionHeader overline="Once Upon a Time" title="Our Story" />
            <Card>
              <p style={{ color: "#6B5257", fontSize: "1rem", lineHeight: 1.9, whiteSpace: "pre-line" }}>{wedding.our_story}</p>
            </Card>
          </div>
        </section>
      )}

      {/* Gallery */}
      {galleryUrls.length > 0 && (
        <section className="py-16 px-5 md:px-10" style={{ background: BLUSH }}>
          <div className="max-w-5xl mx-auto">
            <SectionHeader overline="Sweet Moments" title="Our Gallery" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryUrls.map((url, i) => (
                <img key={i} src={url} alt={`Gallery ${i + 1}`} className="w-full aspect-[4/5] object-cover" style={{ borderRadius: 20 }} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Video */}
      {wedding.video_link && (
        <section className="py-16 px-5 md:px-10 text-center">
          <a href={wedding.video_link} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full" style={{ background: PINK, color: "white", textDecoration: "none" }}>
            <Play className="w-4 h-4" /> Watch our film
          </a>
        </section>
      )}

      {/* Events */}
      {events.length > 0 && (
        <section className="py-24 px-5 md:px-10">
          <div className="max-w-3xl mx-auto">
            <SectionHeader overline="Mark Your Calendars" title="Celebration Timeline" />
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {events.map((ev, i) => (
                <button key={i} onClick={() => setActiveIdx(i)}
                  className="px-4 py-2 rounded-full transition-all"
                  style={{
                    fontFamily: "var(--font-body)", fontSize: "0.8rem", cursor: "pointer", border: `1px solid ${PINK}`,
                    background: activeIdx === i ? PINK : "transparent", color: activeIdx === i ? "white" : PINK,
                  }}>
                  {ev.name}
                </button>
              ))}
            </div>
            {active && (
              <Card>
                <h3 style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: INK, fontSize: "1.6rem", marginBottom: "1.25rem" }}>{active.name}</h3>
                {active.date && <Row label="Date" value={fmtDate(active.date)} />}
                {active.time && <Row label="Time" value={fmtTime(active.time)} />}
                {active.venue && <Row label="Venue" value={active.venue} />}
                {active.dressCode && <Row label="Dress Code" value={active.dressCode} />}
                {active.notes && <p style={{ color: "#6B5257", fontSize: "0.88rem", fontStyle: "italic", marginTop: "1rem" }}>🌷 {active.notes}</p>}
                {active.mapsLink && (
                  <a href={active.mapsLink} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-full" style={{ background: SAGE, color: "white", textDecoration: "none", fontSize: "0.85rem" }}>
                    <MapPin className="w-4 h-4" /> View on map
                  </a>
                )}
              </Card>
            )}
          </div>
        </section>
      )}

      {/* Family */}
      {(wedding.bride_mother_name || wedding.groom_mother_name || wedding.wedding_party) && (
        <section className="py-24 px-5 md:px-10" style={{ background: BLUSH }}>
          <div className="max-w-4xl mx-auto">
            <SectionHeader overline="Blessed By" title="Our Families" />
            <div className="grid md:grid-cols-2 gap-6">
              {(wedding.bride_mother_name || wedding.bride_father_name) && (
                <Card>
                  <p style={{ color: SAGE, fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Bride's Family</p>
                  <p style={{ color: "#6B5257", fontSize: "0.9rem", lineHeight: 1.8, whiteSpace: "pre-line" }}>{wedding.bride_mother_name} {wedding.bride_mother_name && wedding.bride_father_name && "&"} {wedding.bride_father_name}</p>
                </Card>
              )}
              {(wedding.groom_mother_name || wedding.groom_father_name) && (
                <Card>
                  <p style={{ color: SAGE, fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Groom's Family</p>
                  <p style={{ color: "#6B5257", fontSize: "0.9rem", lineHeight: 1.8, whiteSpace: "pre-line" }}>{wedding.groom_mother_name} {wedding.groom_mother_name && wedding.groom_father_name && "&"} {wedding.groom_father_name}</p>
                </Card>
              )}
            </div>
            {wedding.wedding_party && (
              <div className="mt-8"><Card><p style={{ color: "#6B5257", fontSize: "0.9rem", lineHeight: 1.8, whiteSpace: "pre-line" }}>{wedding.wedding_party}</p></Card></div>
            )}
          </div>
        </section>
      )}

      {/* Virtual */}
      {(wedding.live_stream_link) && (
        <section className="py-24 px-5 md:px-10">
          <div className="max-w-4xl mx-auto">
            <SectionHeader overline="Can't Make It?" title="Join & Bless Us" />
            <div className="grid md:grid-cols-2 gap-6">
              {wedding.live_stream_link && (
                <Card>
                  <div className="flex items-center gap-2 mb-3"><Video className="w-4 h-4" style={{ color: PINK }} /><span style={{ color: SAGE, fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>Livestream</span></div>
                  <a href={wedding.live_stream_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5" style={{ color: PINK, fontSize: "0.9rem", textDecoration: "none" }}>
                    {wedding.live_stream_link.replace(/^https?:\/\//, "")} <ExternalLink className="w-3 h-3" />
                  </a>
                  {wedding.live_stream_notes && <p style={{ color: "#6B5257", fontSize: "0.85rem", marginTop: "0.75rem" }}>{wedding.live_stream_notes}</p>}
                </Card>
              )}

            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      {(wedding.contact_number || wedding.primary_email) && (
        <section className="py-14 px-5 text-center" style={{ background: BLUSH }}>
          <div className="flex flex-wrap gap-4 justify-center">
            {wedding.contact_number && (
              <a href={`tel:${wedding.contact_number}`} className="inline-flex items-center gap-2 px-6 py-3 rounded-full" style={{ background: PINK, color: "white", textDecoration: "none", fontSize: "0.85rem" }}>📞 {wedding.contact_number}</a>
            )}
            {wedding.primary_email && (
              <a href={`mailto:${wedding.primary_email}`} className="inline-flex items-center gap-2 px-6 py-3 rounded-full" style={{ border: `1px solid ${PINK}`, color: PINK, textDecoration: "none", fontSize: "0.85rem" }}>✉️ {wedding.primary_email}</a>
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-16 px-6 text-center" style={{ background: "linear-gradient(180deg, " + PINK + ", #C97690)" }}>
        <Sparkles className="w-6 h-6 mx-auto mb-4" style={{ color: "white" }} />
        <h2 style={{ fontFamily: "var(--font-display)", color: "white", fontStyle: "italic", fontSize: "clamp(1.8rem,5vw,2.75rem)" }}>{wedding.groom_name} &amp; {wedding.bride_name}</h2>
        {firstDate && <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.85rem", marginTop: "0.75rem" }}>{fmtDate(firstDate)}</p>}
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem", marginTop: "1.5rem", fontStyle: "italic" }}>
          "Two hearts, one love story."
        </p>
      </footer>
    </div>
  );
}
