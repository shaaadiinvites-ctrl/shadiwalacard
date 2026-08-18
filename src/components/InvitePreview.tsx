"use client";

import { WeddingFormData } from "@/types/wedding";

interface Props {
  data: Partial<WeddingFormData>;
}

const DISPLAY = '"Playfair Display", Georgia, serif';
const BODY = '"DM Sans", system-ui, sans-serif';
const GOLD = "#C9A84C";
const GREEN = "#1A3A2A";
const CREAM = "#FDF8F0";
const BROWN = "#2C1810";
const MID = "#5C3A1E";
const MUTED = "#7A5C3E";
const BORDER = "rgba(201,168,76,0.25)";

function fmtDate(d?: string) {
  if (!d) return "";
  return new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
function fmtTime(t?: string) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

function GoldRule() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, margin: "6px 0" }}>
      <div style={{ flex: 1, height: 1, background: `rgba(201,168,76,0.4)` }} />
      <span style={{ color: GOLD, fontSize: "0.5rem" }}>✦</span>
      <div style={{ flex: 1, height: 1, background: `rgba(201,168,76,0.4)` }} />
    </div>
  );
}

function GoldDivider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px" }}>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, rgba(201,168,76,0.3))` }} />
      <span style={{ color: GOLD, fontSize: "0.45rem", letterSpacing: "0.5em" }}>✦ ✦ ✦</span>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, rgba(201,168,76,0.3))` }} />
    </div>
  );
}

/** Mirrors the final page's <SectionHeader>: small gold overline, big serif
 *  title, centered, with a small ornament rule beneath. */
function SectionHeader({ overline, title }: { overline: string; title: string }) {
  return (
    <div style={{ textAlign: "center", marginBottom: 10 }}>
      <p style={{ fontFamily: BODY, color: GOLD, fontSize: "0.5rem", letterSpacing: "0.35em", textTransform: "uppercase", marginBottom: 4 }}>
        {overline}
      </p>
      <h3 style={{ fontFamily: DISPLAY, color: BROWN, fontSize: "1.05rem", fontWeight: 400, lineHeight: 1.15, margin: 0 }}>
        {title}
      </h3>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginTop: 5 }}>
        <div style={{ height: 1, width: 16, background: "rgba(201,168,76,0.5)" }} />
        <span style={{ color: GOLD, fontSize: "0.5rem" }}>✦</span>
        <div style={{ height: 1, width: 16, background: "rgba(201,168,76,0.5)" }} />
      </div>
    </div>
  );
}

/** Mirrors the final page's <Row>: uppercase label on its own line, value
 *  beneath it. Multiple Rows stack vertically, never side by side. */
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span style={{ fontFamily: BODY, color: MUTED, fontSize: "0.48rem", letterSpacing: "0.2em", textTransform: "uppercase", display: "block", marginBottom: 1 }}>
        {label}
      </span>
      <span style={{ fontFamily: BODY, color: BROWN, fontSize: "0.66rem" }}>{value}</span>
    </div>
  );
}

export default function InvitePreview({ data }: Props) {
  const bride = data.brideName || "Bride";
  const groom = data.groomName || "Groom";
  const events = (data.events ?? []).filter(e => e.name);
  const hasStory = !!data.ourStory;
  const hasBrideFamily = !!data.brideMotherName || !!data.brideFatherName;
  const hasGroomFamily = !!data.groomMotherName || !!data.groomFatherName;
  const hasGift = false; // Gift policy removed in this version
  const hasStream = !!data.liveStreamLink;
  const isEmpty = !events.length && !hasStory && !hasBrideFamily && !hasGift && !hasStream;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", fontFamily: BODY, background: CREAM, color: BROWN, borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.12)" }}>

      {/* ── Hero (mirrors the dark green top of final page) ── */}
      <div style={{ background: GREEN, flexShrink: 0, padding: "16px 14px 12px", textAlign: "center", borderBottom: `1px solid ${BORDER}`, position: "relative" }}>
        {/* Gold top bar */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, transparent, ${GOLD}, transparent)` }} />

        <p style={{ fontFamily: BODY, color: GOLD, fontSize: "0.48rem", letterSpacing: "0.45em", textTransform: "uppercase", marginBottom: 6 }}>
          ॐ · With Divine Blessings
        </p>
        <GoldRule />
        <p style={{ fontFamily: BODY, color: "rgba(255,255,255,0.5)", fontSize: "0.5rem", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 6 }}>
          Together with their families
        </p>

        {/* Names */}
        <div style={{ fontFamily: DISPLAY, color: "white", lineHeight: 1.1 }}>
          <span style={{ display: "block", fontSize: "1.3rem", fontWeight: 400 }}>{groom}</span>
          <span style={{ display: "block", color: GOLD, fontSize: "0.7rem", fontStyle: "italic", margin: "2px 0" }}>&amp;</span>
          <span style={{ display: "block", fontSize: "1.3rem", fontWeight: 400 }}>{bride}</span>
        </div>

        {data.hashtag && (
          <p style={{ fontFamily: BODY, color: GOLD, fontSize: "0.55rem", letterSpacing: "0.12em", marginTop: 5 }}>{data.hashtag}</p>
        )}
        {events[0]?.date && (
          <p style={{ fontFamily: DISPLAY, color: GOLD, fontSize: "0.6rem", fontStyle: "italic", marginTop: 4 }}>{fmtDate(events[0].date)}</p>
        )}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(to right, transparent, rgba(201,168,76,0.35), transparent)` }} />
      </div>

      {/* ── Scrollable body ── */}
      <div style={{ flex: 1, overflowY: "auto", overscrollBehavior: "contain", minHeight: 0 }}>

        {/* Empty state */}
        {isEmpty && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: "2rem 1rem", textAlign: "center", color: MUTED }}>
            <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>✍️</p>
            <p style={{ fontFamily: BODY, fontSize: "0.68rem" }}>Fill in the form to see your invitation here</p>
          </div>
        )}

        {!isEmpty && <GoldDivider />}

        {/* Events — mirrors "Save the Dates" / "Wedding Itinerary" section */}
        {events.length > 0 && (
          <div style={{ padding: "0 12px 12px" }}>
            <SectionHeader overline="Save the Dates" title="Wedding Itinerary" />

            {/* Tabs — centered pill row, mirrors the tab bar (e.g. "Sangeet") on the final page */}
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 4, marginBottom: 8 }}>
              {events.map((evt, i) => (
                <span key={i}
                  style={{
                    fontFamily: BODY, fontSize: "0.56rem", letterSpacing: "0.05em", padding: "3px 8px", border: "1px solid",
                    background: i === 0 ? GREEN : "transparent",
                    color: i === 0 ? GOLD : MID,
                    borderColor: i === 0 ? GREEN : "rgba(201,168,76,0.35)",
                  }}>
                  {evt.name}
                </span>
              ))}
            </div>

            {/* Event detail cards — each one stacked below the other, never side by side */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {events.map((evt, i) => (
                <div key={i} style={{ background: "white", border: `1px solid ${BORDER}`, overflow: "hidden" }}>
                  {/* Gold accent bar — same as final page card top */}
                  <div style={{ height: 2, background: `linear-gradient(to right, ${GOLD}, #E8C97A, ${GOLD})` }} />
                  <div style={{ padding: "8px 9px" }}>
                    <p style={{ fontFamily: DISPLAY, color: BROWN, fontSize: "0.8rem", fontWeight: 400, marginBottom: 6 }}>{evt.name}</p>

                    {/* Stacked Row-style label/value pairs — mirrors final page's <Row> layout */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      {evt.date && <Row label="Date" value={fmtDate(evt.date)} />}
                      {evt.time && <Row label="Time" value={fmtTime(evt.time)} />}
                      {evt.venue && <Row label="Venue" value={`${evt.venue.slice(0, 55)}${evt.venue.length > 55 ? "…" : ""}`} />}
                      {evt.dressCode && (
                        <div>
                          <span style={{ fontFamily: BODY, color: MUTED, fontSize: "0.48rem", letterSpacing: "0.2em", textTransform: "uppercase", display: "block", marginBottom: 2 }}>
                            Dress Code / Theme
                          </span>
                          <span style={{ fontFamily: BODY, fontSize: "0.58rem", color: MID, background: "rgba(201,168,76,0.08)", border: `1px solid rgba(201,168,76,0.4)`, padding: "1px 6px", display: "inline-block" }}>
                            ✦ {evt.dressCode}
                          </span>
                        </div>
                      )}
                    </div>

                    {evt.notes && (
                      <div style={{ marginTop: 6, padding: "3px 6px", borderLeft: `2px solid ${GOLD}`, background: CREAM }}>
                        <p style={{ fontFamily: BODY, color: MUTED, fontSize: "0.58rem", fontStyle: "italic", lineHeight: 1.5 }}>
                          📌 {evt.notes.slice(0, 70)}{evt.notes.length > 70 ? "…" : ""}
                        </p>
                      </div>
                    )}
                    {evt.mapsLink && (
                      <p style={{ fontFamily: BODY, color: GOLD, fontSize: "0.56rem", marginTop: 5 }}>📍 Maps link added</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {events.length > 0 && (hasStory || hasBrideFamily || hasGroomFamily) && <GoldDivider />}

        {/* Story */}
        {hasStory && (
          <div style={{ padding: "0 12px 12px" }}>
            <SectionHeader overline="How We Met" title="Our Love Story" />
            <div style={{ background: "white", border: `1px solid ${BORDER}`, padding: "8px 10px" }}>
              <p style={{ fontFamily: BODY, color: MUTED, fontSize: "0.68rem", lineHeight: 1.7 }}>
                {(data.ourStory ?? "").slice(0, 180)}{(data.ourStory ?? "").length > 180 ? "…" : ""}
              </p>
            </div>
          </div>
        )}

        {/* Media */}
        {(data.videoLink || data.musicLink) && (
          <div style={{ padding: "0 12px 12px", display: "flex", gap: 6, flexWrap: "wrap" }}>
            {data.videoLink && (
              <span style={{ fontFamily: BODY, fontSize: "0.58rem", color: GOLD, border: `1px solid rgba(201,168,76,0.35)`, padding: "2px 8px", background: `rgba(26,58,42,0.05)` }}>
                🎥 Video linked
              </span>
            )}
            {data.musicLink && (
              <span style={{ fontFamily: BODY, fontSize: "0.58rem", color: GOLD, border: `1px solid rgba(201,168,76,0.35)`, padding: "2px 8px", background: `rgba(26,58,42,0.05)` }}>
                🎵 Music linked
              </span>
            )}
          </div>
        )}

        {(hasStory || data.videoLink || data.musicLink) && (hasBrideFamily || hasGroomFamily) && <GoldDivider />}

        {/* Family — mirrors "With Blessings Of" / "Our Families", bride & groom side by side */}
        {(hasBrideFamily || hasGroomFamily) && (
          <div style={{ padding: "0 12px 12px" }}>
            <SectionHeader overline="With Blessings Of" title="Our Families" />
            <div style={{ display: "grid", gridTemplateColumns: hasBrideFamily && hasGroomFamily ? "1fr 1fr" : "1fr", gap: 6 }}>
              {hasBrideFamily && (
                <div style={{ background: "white", border: `1px solid ${BORDER}`, padding: "7px 8px" }}>
                  <p style={{ fontFamily: BODY, color: GOLD, fontSize: "0.46rem", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 3 }}>Bride's Family</p>
                  <p style={{ fontFamily: DISPLAY, color: BROWN, fontSize: "0.7rem", fontWeight: 400, marginBottom: 4 }}>{bride}'s Family</p>
                  <p style={{ fontFamily: BODY, color: MID, fontSize: "0.6rem", lineHeight: 1.55 }}>
                    {data.brideMotherName} {data.brideMotherName && data.brideFatherName && "&"} {data.brideFatherName}
                  </p>
                </div>
              )}
              {hasGroomFamily && (
                <div style={{ background: "white", border: `1px solid ${BORDER}`, padding: "7px 8px" }}>
                  <p style={{ fontFamily: BODY, color: GOLD, fontSize: "0.46rem", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 3 }}>Groom's Family</p>
                  <p style={{ fontFamily: DISPLAY, color: BROWN, fontSize: "0.7rem", fontWeight: 400, marginBottom: 4 }}>{groom}'s Family</p>
                  <p style={{ fontFamily: BODY, color: MID, fontSize: "0.6rem", lineHeight: 1.55 }}>
                    {data.groomMotherName} {data.groomMotherName && data.groomFatherName && "&"} {data.groomFatherName}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {(hasBrideFamily || hasGroomFamily) && (hasGift || hasStream) && <GoldDivider />}

        {/* Virtual & Digital Blessings — livestream + gifts side by side, mirrors final page grid */}
        {(hasGift || hasStream) && (
          <div style={{ padding: "0 12px 12px" }}>
            <SectionHeader overline="Join From Anywhere" title="Virtual & Digital Blessings" />
            <div style={{ display: "grid", gridTemplateColumns: hasGift && hasStream ? "1fr 1fr" : "1fr", gap: 6 }}>

              {/* Livestream — dark green card, same as final page */}
              {hasStream && (
                <div style={{ background: GREEN, border: `1px solid rgba(201,168,76,0.3)`, overflow: "hidden" }}>
                  <div style={{ height: 2, background: `linear-gradient(to right, ${GOLD}, #E8C97A, ${GOLD})` }} />
                  <div style={{ padding: "7px 8px" }}>
                    <p style={{ fontFamily: BODY, color: GOLD, fontSize: "0.46rem", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 3 }}>Watch from Home</p>
                    <p style={{ fontFamily: DISPLAY, color: "white", fontSize: "0.7rem", fontWeight: 400, marginBottom: 4 }}>Join Us Virtually</p>
                    <div style={{ background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.2)", padding: "3px 5px", marginBottom: 3 }}>
                      <p style={{ fontFamily: BODY, color: "rgba(255,255,255,0.45)", fontSize: "0.45rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 1 }}>Live Stream Link</p>
                      <p style={{ fontFamily: BODY, color: GOLD, fontSize: "0.58rem" }}>🔴 Link added</p>
                    </div>
                    {data.liveStreamNotes && (
                      <p style={{ fontFamily: BODY, color: "rgba(255,255,255,0.55)", fontSize: "0.55rem", fontStyle: "italic", lineHeight: 1.5 }}>
                        {data.liveStreamNotes.slice(0, 70)}{data.liveStreamNotes.length > 70 ? "…" : ""}
                      </p>
                    )}
                  </div>
                </div>
              )}


            </div>
          </div>
        )}

        {/* Bottom padding */}
        {!isEmpty && <div style={{ height: 12 }} />}
      </div>

      {/* ── Footer strip — mirrors final page footer ── */}
      <div style={{ background: GREEN, flexShrink: 0, padding: "8px 12px", textAlign: "center", borderTop: `1px solid rgba(201,168,76,0.25)` }}>
        <p style={{ fontFamily: DISPLAY, color: "white", fontSize: "0.7rem", fontWeight: 400 }}>{groom} &amp; {bride}</p>
        {data.hashtag && <p style={{ fontFamily: BODY, color: "rgba(201,168,76,0.5)", fontSize: "0.5rem", letterSpacing: "0.35em", marginTop: 2 }}>{data.hashtag}</p>}
      </div>
    </div>
  );
}
