"use client";

import React, { forwardRef, useEffect, useRef } from "react";
import { clsx } from "clsx";
import { Search } from "lucide-react";

// ── Input ───────────────────────────────────────────────────────────────────
export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={clsx(
      "w-full border border-gray-300 rounded-xl p-3 text-[14px] font-medium outline-none bg-white text-[#1A202C] transition-colors focus:border-[#4a148c]",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

// ── Floating Input ─────────────────────────────────────────────────────────────
interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id || `floating-${label.replace(/\s+/g, '-').toLowerCase()}`;
    return (
      <div className="w-full">
        <div className="relative w-full">
          <input
            ref={ref}
            id={inputId}
            placeholder=" "
            className={clsx(
              "block px-4 py-3 w-full text-[14px] font-medium text-[#1A202C] bg-white rounded-xl border border-gray-300 appearance-none focus:outline-none focus:ring-1 focus:ring-[#4a148c] focus:border-[#4a148c] peer transition-colors h-[54px]",
              error ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500" : "",
              className
            )}
            {...props}
          />
          <label
            htmlFor={inputId}
            className={clsx(
              "absolute text-[14px] text-gray-500 bg-white px-1.5 duration-300 transform -translate-y-1/2 scale-75 top-0 z-10 origin-[0] left-3",
              "peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2",
              "peer-focus:top-0 peer-focus:scale-75 peer-focus:-translate-y-1/2",
              "pointer-events-none",
              error ? "text-rose-500" : "peer-focus:text-[#4a148c]"
            )}
          >
            {label}
          </label>
        </div>
        {error && <p className="text-[12px] font-medium text-rose-600 mt-1">{error}</p>}
      </div>
    );
  }
);
FloatingInput.displayName = "FloatingInput";

// ── Textarea ─────────────────────────────────────────────────────────────────
export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={clsx(
      "w-full border border-gray-300 rounded-xl p-3 text-[14px] font-medium outline-none bg-white text-[#1A202C] transition-colors focus:border-[#4a148c] resize-none",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

// ── FieldWrapper ─────────────────────────────────────────────────────────────
interface FieldWrapperProps {
  label: React.ReactNode;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}

export function FieldWrapper({ label, hint, error, children }: FieldWrapperProps) {
  return (
    <div className="w-full min-w-0">
      <label className="block text-[14px] font-medium text-[#1A202C] mb-1">{label}</label>
      {hint && <p className="text-[12px] text-gray-500 font-normal mb-1">{hint}</p>}
      <div className="w-full">{children}</div>
      {error && <p className="text-[12px] font-medium text-rose-600 mt-1">{error}</p>}
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
            fields: ["name", "address_components", "formatted_address", "url"],
            componentRestrictions: { country: "in" },
          });

          autocompleteRef.current.addListener("place_changed", () => {
            const place = autocompleteRef.current.getPlace();
            if (place && place.name && onPlaceSelected) {
              let addressParts = [place.name];
              
              // Extract short area and city
              if (place.address_components) {
                const sublocality = place.address_components.find((c: any) => c.types.includes("sublocality") || c.types.includes("sublocality_level_1"))?.long_name;
                const locality = place.address_components.find((c: any) => c.types.includes("locality"))?.long_name;
                
                if (sublocality) addressParts.push(sublocality);
                if (locality && locality !== sublocality) addressParts.push(locality);
              }
              
              // Fallback to formatted address if components failed
              let addressStr = addressParts.length > 1 
                ? addressParts.join(", ") 
                : (place.formatted_address ? place.name + ", " + place.formatted_address.split(',').slice(-3, -1).join(',').trim() : place.name);

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
            "w-full rounded-xl border border-gray-300 bg-white pl-4 pr-10 h-[44px] text-[14px] font-medium text-[#1A202C] placeholder-gray-400",
            "focus:outline-none focus:border-[#4a148c] transition duration-200",
            className
          )}
          {...props}
          ref={ref}
          autoComplete="off"
        />
        {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <Search size={18} />
          </div>
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
        "appearance-none w-full rounded-xl border border-gray-300 bg-white px-4 h-[44px] text-[14px] font-medium text-[#1A202C] cursor-pointer",
        "focus:outline-none focus:border-[#4a148c] transition duration-200",
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
