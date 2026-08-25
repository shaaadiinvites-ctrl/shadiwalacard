# ShadiwalaCard - Form Flow Design System

This document outlines the standardized design system rules to be strictly followed across the entire checkout, form, and cart flow for consistency.

## 1. Typography
**Font Family:** `Manrope` (Applied to body, headings, inputs, and buttons)

*   **Final Values / Hero:** `24px` (`text-[24px]`) | Weight: `Bold` (700)
    *   *Usage:* Final Total Price, large emphasized numbers.
*   **Card Headings:** `20px` (`text-[20px]`) | Weight: `Semi-bold` (600)
    *   *Usage:* "Order Summary", "Checkout details", major section titles.
*   **Page Headers:** `18px` (`text-[18px]`) | Weight: `Bold` (700)
    *   *Usage:* App Bar Logo, Top-level page headers.
*   **Primary Labels:** `14px` (`text-[14px]`) | Weight: `Medium` (500)
    *   *Usage:* Form field labels (Email, Phone), price line items (Original Price, Subtotal), button text for secondary actions.
*   **Helper/Small Text:** `12px` (`text-[12px]`) | Weight: `Regular` (400)
    *   *Usage:* Subtext under headings, instructional micro-copy, error messages, "Complete Details" cues.

*   **Secondary Section Headers (Editorial):** `12px` (`text-[12px]`) | Weight: `Bold` (700) | `uppercase tracking-widest`
    *   *Usage:* "BRIDE'S DETAILS", "GROOM'S DETAILS", "RSVP 1", "EVENT 1".

## 2. Border Radius (Unified)
*   **Corner Radius:** `12px` (`rounded-xl` in Tailwind)
*   **Application:** Must be applied globally to ALL interactive and container elements.
    *   Card containers (`div`)
    *   Input fields (`input`, `textarea`)
    *   Select Dropdowns (`select`)
    *   All Buttons (`button`)

## 3. Spacing & Layout
*   **Strict Vertical Gaps:** `24px` (`gap-6` or `space-y-6`)
    *   *Rule:* Layouts must rely entirely on parent mathematical spacing (`gap-6` in grids or `space-y-6` in flex/block columns). DO NOT use hardcoded individual `mb-X` margins on elements to prevent awkward 48px double-spacing.
*   **Card Padding:** `24px` (`p-6`)
    *   *Rule:* All main container cards must have `24px` internal padding.
*   **Label Spacing:** `mb-1` (4px)
    *   *Rule:* Form field labels sit directly above their inputs with a tight 4px margin bottom.

## 4. Colors
### Backgrounds
*   **Page Background:** `#F2F4F8` (Light grey/blue for the main app container)
*   **Card Background:** `#FFFFFF` (White)
### Text
*   **Primary Text:** `#1A202C` (Deep slate for inputs and main body text)
*   **Card Headings:** `#2e1065` (Dark purple)
*   **Editorial Subheadings:** `#9d174d` (Pink) for Bride-related or `#2e1065` (Purple) for Groom-related.
*   **Secondary Text / Subtitles:** `text-gray-500` or `text-gray-600`
*   **Positive / Highlight:** `#16a34a` (High-contrast green for "Special Offer" or success states)

## 5. Components
### Cards
*   **Standard Styles:** `bg-white border border-gray-200/60 shadow-sm rounded-xl p-6`
*   **Grouped/Accent Cards:** Sub-grouping cards (e.g. Bride's Details vs Groom's Details) use a subtle shadow `shadow-[0_2px_10px_rgba(0,0,0,0.04)]` and a left-accent border `border-l-4` (e.g. `border-l-[#9d174d]` for Bride, `border-l-[#2e1065]` for Groom).

### Buttons
1.  **Primary CTA (Checkout & Pay, Submit)**
    *   *Background:* `#4a148c` (Bold brand purple)
    *   *Text:* White, `font-bold`, `text-[18px]`
    *   *Shape:* `rounded-xl`, `h-[54px]`
    *   *Disabled State:* Solid gray (`#9ca3af`), cursor `not-allowed`.
2.  **Secondary Actions (Apply Coupon, Get OTP)**
    *   *Background:* Transparent (`bg-transparent`)
    *   *Border:* `border border-[#4a148c]`
    *   *Text:* `#4a148c`, `font-semibold`, `text-[14px]`
    *   *Hover State:* `hover:bg-purple-50`
3.  **Minimalist Icons (Back Button)**
    *   Use simple, unstyled SVG icons (e.g., `ArrowLeft` from lucide-react) for secondary navigation rather than text.

### Inputs & Form Fields (Cart-Style)
*   **Padding:** `p-3` (Avoid fixed heights to keep text alignment natural).
*   **Border:** `border border-gray-300`
*   **Focus State:** `focus:border-[#4a148c]` (Must include `outline-none`).
*   **Text:** `text-[14px] font-medium text-[#1A202C]`
*   **Layout:** Standard top-labels. Do NOT use floating labels. Labels must use `block text-[14px] font-medium text-[#1A202C] mb-1`.

## 6. Layout Behaviors
*   **Sticky Bottom Bars:** For mobile/checkout flows, critical CTAs (like Checkout) should live in a `fixed bottom-0 z-50 bg-white` container with a top border to ensure they are always accessible.
*   **Collapsible Summaries:** Hide dense data (like price line-item breakdowns) behind smooth, collapsible accordion toggles by default to keep the UI clean.
*   **Visual Cues:** When a primary action is disabled due to missing form data, provide a pulsing text nudge (e.g., "Complete Details ↓") to direct user attention.
