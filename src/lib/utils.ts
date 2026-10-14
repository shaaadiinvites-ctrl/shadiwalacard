import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts any time string (24h or 12h, e.g. "19:30", "7:30 PM", "07:30 AM") 
 * to a standardized 12-hour format string with AM/PM (e.g. "07:30 PM").
 */
export function formatTime12(timeStr?: string, padHour = true): string {
  if (!timeStr) return "";
  const trimmed = timeStr.trim();
  
  // Check if already in 12-hour format (e.g. "7:30 PM", "07:30 AM", "7:30pm")
  const match12 = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (match12) {
    const h = parseInt(match12[1], 10);
    const m = match12[2];
    const period = match12[3].toUpperCase();
    const hStr = padHour ? h.toString().padStart(2, "0") : h.toString();
    return `${hStr}:${m} ${period}`;
  }

  // Check 24-hour format (e.g. "19:30", "09:05", "19:30:00")
  const match24 = trimmed.match(/^(\d{1,2}):(\d{2})/);
  if (match24) {
    const h = parseInt(match24[1], 10);
    const m = match24[2];
    const period = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 === 0 ? 12 : h % 12;
    const hStr = padHour ? h12.toString().padStart(2, "0") : h12.toString();
    return `${hStr}:${m} ${period}`;
  }

  return timeStr;
}

/**
 * Converts any time string (12h or 24h) to standardized 24h "HH:mm" format (e.g. "19:30", "09:15").
 */
export function timeTo24h(timeStr?: string): string {
  if (!timeStr) return "00:00";
  const trimmed = timeStr.trim();
  
  const match12 = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (match12) {
    let h = parseInt(match12[1], 10);
    const m = match12[2];
    const period = match12[3].toUpperCase();
    if (period === "AM") {
      if (h === 12) h = 0;
    } else {
      if (h < 12) h += 12;
    }
    return `${h.toString().padStart(2, "0")}:${m}`;
  }

  const match24 = trimmed.match(/^(\d{1,2}):(\d{2})/);
  if (match24) {
    const h = parseInt(match24[1], 10);
    const m = match24[2];
    return `${h.toString().padStart(2, "0")}:${m}`;
  }

  return timeStr;
}

/**
 * Parses any time string into its 12-hour components: hour ("01"-"12"), minute ("00"-"59"), period ("AM" | "PM").
 */
export function parseTimeTo12h(timeStr?: string): { hour: string; minute: string; period: "AM" | "PM" } {
  if (!timeStr) {
    return { hour: "07", minute: "00", period: "PM" };
  }
  const trimmed = timeStr.trim();
  const match12 = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (match12 && match12[3]) {
    const h = parseInt(match12[1], 10);
    const m = match12[2];
    const period = match12[3].toUpperCase() as "AM" | "PM";
    const hClamped = Math.min(Math.max(h, 1), 12);
    return {
      hour: hClamped.toString().padStart(2, "0"),
      minute: m.padStart(2, "0"),
      period,
    };
  }

  const match24 = trimmed.match(/^(\d{1,2}):(\d{2})/);
  if (match24) {
    const h = parseInt(match24[1], 10);
    const m = match24[2];
    const period: "AM" | "PM" = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return {
      hour: h12.toString().padStart(2, "0"),
      minute: m.padStart(2, "0"),
      period,
    };
  }

  return { hour: "07", minute: "00", period: "PM" };
}

/**
 * Resolves the user-facing display title for any wedding event.
 * If event name is "Custom", "Other", or empty, it uses the user-specified customName.
 */
export function getEventDisplayName(
  event?: { name?: string; customName?: string } | null,
  fallback = "Special Event"
): string {
  if (!event) return fallback;
  const rawName = event.name?.trim() || "";
  const rawCustom = event.customName?.trim() || "";
  const isCustomType = rawName === "Custom" || rawName === "Other" || rawName === "Others" || !rawName;

  if (isCustomType) {
    return rawCustom || fallback;
  }

  return rawName || rawCustom || fallback;
}

