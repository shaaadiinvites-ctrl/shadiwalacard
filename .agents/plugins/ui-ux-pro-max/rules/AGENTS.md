# UI/UX Pro Max Design Principles

When modifying or creating user interfaces for this project, you MUST strictly adhere to the following UI/UX Pro Max intelligence layer rules. Do not generate generic, predictable AI layouts.

## 1. Typography & Hierarchy
- **Fluid Scaling**: Never use hardcoded pixel or rem values for major headlines (h1, h2). ALWAYS use CSS clamp() (e.g., clamp(2rem, 4.5vw, 4rem)) to ensure perfect fluid scaling across all devices without awkward wrapping.
- **Line Heights**: Keep headline line-heights extremely tight (1.0 to 1.15). Keep paragraph line-heights breathable (1.5 to 1.7).
- **Font Selection**: Use the project's premium fonts (ar(--font-display) for headers, ar(--font-body) for paragraphs).
- **Subtle Emphasis**: Use italics, lowered opacity (e.g., gba(255,255,255,0.7)), and subtle font-weight shifts to create hierarchy, not just size.

## 2. Colors & Gradients
- **Theme Consistency**: Strictly adhere to the cinematic dark theme (#050505 backgrounds) and ruby red accents (#e11d48). Do NOT introduce random colors that break this theme.
- **Glassmorphism**: When creating cards or overlays on dark backgrounds, use sleek, dark frosted glass effects rather than flat grey boxes.
  - Example: ackground: linear-gradient(135deg, rgba(20, 20, 20, 0.95) 0%, rgba(5, 5, 5, 0.95) 100%), ackdrop-filter: blur(24px) saturate(180%), and order: 1px solid rgba(255,255,255,0.05).
- **Gradients over Flat**: Use subtle gradients for backgrounds and text fills to add depth.
- **High Contrast Actions**: Primary call-to-actions and important badges (like discounts) must use high-contrast, vibrant colors (e.g., solid white #FFFFFF or gold #ffbc4b with dark text) to immediately draw the eye.

## 3. Layout & Spacing
- **Mathematical Consistency**: Use mathematically consistent padding/margins across all sections (e.g., exactly 120px top and bottom padding for every major section). Do not eyeball spacing.
- **Negative Space**: Embrace massive amounts of negative (empty) space. It is the hallmark of premium design.
- **Avoid Boxes**: Prevent the 'predictable AI look' by avoiding putting everything inside bordered boxes. Let elements breathe on the open canvas.

## 4. Interaction & Micro-Animations
- **Hover States**: Every interactive element (buttons, cards, links) MUST have a smooth hover transition (	ransition: all 0.3s ease). Include subtle scale bumps (	ransform: scale(1.02)) or glowing shadows.
- **Entry Animations**: Use staggered fade-up animations for hero text and important elements entering the viewport.

## 5. Mobile & Accessibility
- **Touch Targets**: Any clickable icon (like a hamburger menu) MUST have a minimum invisible touch target of 44x44px. Add invisible padding (padding: 12px; margin: -8px;) to achieve this without distorting the visual layout.
- **Vector Icons**: Never use emojis for critical UI icons as their padding and rendering varies wildly across operating systems. Always use inline SVGs for perfect centering and crispness.

## 6. Copywriting & Tone
- **Emotional over Robotic**: Write copy that is emotional, relatable, and action-driven. 
- Example: Instead of "Get web invite now", use "Create My Stunning Invite". Instead of "Guide guests to venue", use "No more 'Bhaiya, location bhejna' calls".
