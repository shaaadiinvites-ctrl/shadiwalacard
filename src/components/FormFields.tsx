"use client";

import React, { forwardRef, useEffect, useRef } from "react";
import { clsx } from "clsx";

// ── Input ───────────────────────────────────────────────────────────────────
export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={clsx(
      "w-full rounded-xl border border-[#2e1065]/20 bg-white px-3.5 py-3 text-base md:text-sm text-[#1A202C] placeholder-gray-400 shadow-xs",
      "focus:outline-none focus:ring-2 focus:ring-[#9d174d]/30 focus:border-[#9d174d] transition duration-200",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

// ── Textarea ─────────────────────────────────────────────────────────────────
export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={clsx(
      "w-full rounded-xl border border-[#2e1065]/20 bg-white px-3.5 py-3 text-base md:text-sm text-[#1A202C] placeholder-gray-400 shadow-xs",
      "focus:outline-none focus:ring-2 focus:ring-[#9d174d]/30 focus:border-[#9d174d] transition duration-200 resize-none",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

// ── FieldWrapper ─────────────────────────────────────────────────────────────
interface FieldWrapperProps {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}

export function FieldWrapper({ label, hint, error, children }: FieldWrapperProps) {
  return (
    <div className="space-y-1.5 w-full min-w-0">
      <label className="block text-sm font-semibold text-[#2e1065] tracking-wide">{label}</label>
      {hint && <p className="text-xs text-gray-500 font-normal">{hint}</p>}
      <div className="w-full">{children}</div>
      {error && <p className="text-xs font-semibold text-rose-600 mt-1">{error}</p>}
    </div>
  );
}

// ── LocationInput (Google Maps Autocomplete) ──────────────────────────────
let googleMapsScriptLoaded = false;
let googleMapsScriptLoading = false;

interface LocationInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onPlaceSelected?: (address: string, mapsUrl: string) => void;
}

export const LocationInput = forwardRef<HTMLInputElement, LocationInputProps>(
  ({ className, onPlaceSelected, onChange, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const autocompleteRef = React.useRef<any>(null);
    const inputId = React.useMemo(() => `location-input-${Math.random().toString(36).substr(2, 9)}`, []);

    React.useEffect(() => {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

      const originalConsoleError = console.error;
      console.error = (...args) => {
        if (typeof args[0] === "string" && (args[0].includes("Google Maps") || args[0].includes("ApiNotActivated") || args[0].includes("BillingNotEnabled") || args[0].includes("RefererNotAllowed"))) {
          fetch("/api/log", { method: "POST", body: JSON.stringify({ error: args[0] }) }).catch(() => {});
        }
        originalConsoleError.apply(console, args);
      };
      
      const initAutocomplete = () => {
        const el = document.getElementById(inputId) as HTMLInputElement;
        if (!el || !(window as any).google?.maps?.places) return;
        
        if (autocompleteRef.current) return;

        try {
          autocompleteRef.current = new (window as any).google.maps.places.Autocomplete(el, {
            fields: ["name", "formatted_address", "url"],
            componentRestrictions: { country: "in" },
          });

          autocompleteRef.current.addListener("place_changed", () => {
            const place = autocompleteRef.current.getPlace();
            if (place && place.name && onPlaceSelected) {
              const addressStr = place.formatted_address ? place.name + ", " + place.formatted_address : place.name;
              onPlaceSelected(addressStr, place.url || "");
              
              if (onChange) {
                const syntheticEvent = { target: { value: addressStr, name: props.name } } as React.ChangeEvent<HTMLInputElement>;
                onChange(syntheticEvent);
              }
            }
          });
        } catch (e) {
          console.error("Failed to init autocomplete:", e);
        }
      };

      if (!apiKey) return;

      if ((window as any).google?.maps?.places) {
        // Slight delay to ensure DOM node is fully painted and react-hook-form is settled
        setTimeout(initAutocomplete, 100);
        return;
      }

      if (!googleMapsScriptLoaded && !googleMapsScriptLoading) {
        googleMapsScriptLoading = true;
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.onload = () => {
          googleMapsScriptLoaded = true;
          googleMapsScriptLoading = false;
          setTimeout(initAutocomplete, 100);
        };
        script.onerror = () => {
          fetch("/api/log", { method: "POST", body: JSON.stringify({ error: "Script failed to load. Possibly blocked by Adblocker or Network." }) }).catch(() => {});
        };
        document.head.appendChild(script);
      } else if (googleMapsScriptLoading) {
        const interval = setInterval(() => {
          if ((window as any).google?.maps?.places) {
            clearInterval(interval);
            setTimeout(initAutocomplete, 100);
          }
        }, 500);
        return () => {
          clearInterval(interval);
          console.error = originalConsoleError;
        }
      }
      
      return () => {
        console.error = originalConsoleError;
        if (autocompleteRef.current) {
          if ((window as any).google?.maps?.event) {
            (window as any).google.maps.event.clearInstanceListeners(autocompleteRef.current);
          }
          autocompleteRef.current = null;
        }
      };
    }, [onPlaceSelected, onChange, props.name, inputId]);

    return (
      <div className="relative w-full">
        <input
          id={inputId}
          className={clsx(
            "w-full rounded-xl border border-[#2e1065]/20 bg-white px-3.5 py-3 text-base md:text-sm text-[#1A202C] placeholder-gray-400 shadow-xs",
            "focus:outline-none focus:ring-2 focus:ring-[#9d174d]/30 focus:border-[#9d174d] transition duration-200",
            className
          )}
          {...props}
          ref={ref}
          autoComplete="off"
        />
        {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 tracking-wider pointer-events-none">
            MAPS SEARCH
          </span>
        )}
      </div>
    );
  }
);
LocationInput.displayName = "LocationInput";

// ── Select ───────────────────────────────────────────────────────────────────
export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <div className="relative">
    <select
      ref={ref}
      className={clsx(
        "appearance-none w-full rounded-xl border border-[#2e1065]/20 bg-white px-3.5 py-3 text-base md:text-sm text-[#1A202C] shadow-xs cursor-pointer",
        "focus:outline-none focus:ring-2 focus:ring-[#9d174d]/30 focus:border-[#9d174d] transition duration-200",
        className
      )}
      {...props}
    >
      {children}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
      <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
      </svg>
    </div>
  </div>
));
Select.displayName = "Select";
