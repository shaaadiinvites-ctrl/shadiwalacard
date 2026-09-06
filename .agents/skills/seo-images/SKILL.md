---
name: seo-images
description: Image SEO audit and optimization for a codebase or URL without external APIs. Audits alt-text quality, modern-format coverage (WebP / AVIF), responsive sizing (srcset / sizes), lazy-loading and LCP priority signals, CLS-safe dimensions, and ImageObject JSON-LD. Produces a prioritized remediation list plus paste-ready Next.js Image or picture element markup. Use when the user asks for "image SEO", "image audit", "alt-text audit", "WebP coverage", "responsive images", "lazy loading images", "CLS images", or "optimize images".
---

# Image SEO & Performance Audit (Zero-API)

A focused, codebase-level or page-level audit of every image on the site. Surfaces alt-text quality, missing dimensions (CLS risk), format opportunities (WebP/AVIF), responsive sizing (`sizes` / `srcset`), LCP risk (`priority` / `fetchpriority`), and missing `ImageObject` markup.

Authoritative checks and rubric: [image-checks.md](./references/image-checks.md).  
Lazy-loader taxonomy: [lazy-loaders.md](./references/lazy-loaders.md).

## Core Audit Checks

### 1. Alt-Text Quality
- **Missing alt**: `<img />` or Next.js `<Image />` without `alt` attribute (Severity: High).
- **Generic alt**: `alt="image.jpg"`, `alt="photo"`, `alt="banner"`, or `alt="click here"` (Severity: High).
- **Decorative images**: Use `alt=""` and `aria-hidden="true"` for purely decorative icons/dividers.
- **Contextual alt**: Descriptive, concise text (10–125 characters) that explains the visual for screen readers and search engines.

### 2. Modern Formats & Compression
- Audit file extensions in `public/` and component imports:
  - Prefer modern formats (**WebP**, **AVIF**, **SVG** for vector icons).
  - Flag uncompressed PNG/JPEG files larger than 150KB.
  - Flag animated GIFs larger than 500KB and recommend `<video autoplay muted loop playsinline>`.

### 3. Cumulative Layout Shift (CLS) Prevention
- Verify all images declare explicit `width` and `height` or use Next.js `<Image fill />` inside an aspect-ratio container to prevent layout shifts.

### 4. Largest Contentful Paint (LCP) & Lazy Loading
- **Hero / Above-the-Fold Image**: MUST NOT be lazy-loaded. In Next.js, add `priority` (which sets `fetchpriority="high"` and `loading="eager"`).
- **Below-the-Fold Images**: Ensure lazy loading is active (`loading="lazy"`).

### 5. Next.js Image Best Practice
```tsx
import Image from 'next/image';

// Above the fold (Hero / LCP)
<Image
  src="/hero-invite.webp"
  alt="Elegant gold and ruby wedding invitation card preview"
  width={1200}
  height={675}
  priority
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  className="rounded-2xl object-cover"
/>

// Below the fold
<Image
  src="/venue-map.webp"
  alt="Map and directions to the wedding venue banquet hall"
  width={800}
  height={600}
  loading="lazy"
  className="rounded-xl shadow-lg"
/>
```

### 6. Templates
- Next.js / HTML Picture element: [picture-element.html](./templates/picture-element.html)
- ImageObject JSON-LD Schema: [image-object.json](./templates/image-object.json)
