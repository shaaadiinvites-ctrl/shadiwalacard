---
name: seo-technical-audit
description: Comprehensive technical SEO audit for a codebase or website without external APIs. Checks crawlability, indexability, canonical tags, robots.txt, sitemap, meta tags (title, description, Open Graph, Twitter), heading hierarchy (H1-H6), mobile viewport, and security headers. Produces an impact × effort prioritized fix list. Use when the user asks for "technical audit", "site audit", "audit my site", "crawl issues", "indexation issues", or "technical SEO check".
---

# Technical SEO Audit (Zero-API)

Perform a fast, thorough technical SEO audit on a Next.js / web codebase or rendered pages. Scores issues by severity and effort to deliver an actionable top-10 remediation list.

Authoritative severity and effort mapping: [severity-mapping.md](./references/severity-mapping.md).

## Audit Scope & Checklist

### 1. Crawlability & Directives
- **`robots.txt`**: Ensure robots directives exist (e.g. `app/robots.ts`) and do not block necessary public CSS/JS/images.
- **Sitemap**: Verify XML sitemap existence (e.g. `app/sitemap.ts`) and reference in `robots.txt`.
- **Status codes & redirects**: Check for redirect loops or broken internal link paths.

### 2. Indexability & Canonicalization
- **Meta Robots**: Ensure `noindex` is not accidentally active on production pages.
- **Canonical URLs**: Every indexable page must define a self-referencing canonical URL:
  ```tsx
  export const metadata: Metadata = {
    metadataBase: new URL('https://example.com'),
    alternates: {
      canonical: '/',
    },
  };
  ```
- **Single Canonical**: Ensure no duplicate canonical tags exist.

### 3. On-Page Metadata & Social Sharing
- **Title Tag**: Present, unique, between 50–60 characters.
- **Meta Description**: Present, compelling, between 120–160 characters with clear call-to-action.
- **Open Graph**: `og:title`, `og:description`, `og:image` (minimum 1200×630), `og:url`, `og:type`.
- **Twitter Card**: `twitter:card` (`summary_large_image`), `twitter:title`, `twitter:description`, `twitter:image`.

### 4. Semantic Hierarchy & Accessibility
- **Single H1**: Exactly one semantic `<h1>` per page representing the core topic.
- **Heading Sequence**: Strict descending hierarchy (`h1` -> `h2` -> `h3`); no skipping levels for visual styling.
- **Mobile Viewport**: `width=device-width, initial-scale=1`.
- **Lang Attribute**: HTML element specifies language (e.g. `<html lang="en">` or `<html lang="hi">`).

### 5. Deliverable Output Format
Generate a report structured as:
1. **Executive Summary**: Pass / Needs-Attention / Critical status.
2. **Top-10 Actionable Fixes Table**:
   | Issue | Category | Severity | Effort | Recommended Fix |
3. **Copy-Paste Code Snippets**: Ready-to-commit metadata or configuration fixes.
