---
name: seo-schema
description: Detect existing JSON-LD structured data on a page, validate against Google's rich-result requirements, and generate missing schema markup (Article, Product, LocalBusiness, FAQPage, BreadcrumbList, Event). Produces paste-ready JSON-LD script blocks or Next.js components without external APIs. Use when the user asks for "schema markup", "structured data", "JSON-LD", "rich results", "schema validation", or "fix the schema on this page".
---

# Schema Markup & Structured Data (Zero-API)

Detect, validate, and generate Schema.org JSON-LD for pages, web applications, and components. Produces paste-ready `<script>` blocks or Next.js React components that can be dropped straight into page layouts or templates, plus a validation report against Google's official Rich Results guidelines.

## Quick Reference: Supported Types & Templates

| Type | Best For | Template File |
|---|---|---|
| `Event` | Weddings, celebrations, conferences, ceremonies | [event.json](./templates/event.json) |
| `Article` / `BlogPosting` | Editorial, blog, and news content | [article.json](./templates/article.json) |
| `Product` (with `Offer`) | E-commerce items, cards, tiers | [product.json](./templates/product.json) |
| `LocalBusiness` | Venues, vendors, storefronts | [local-business.json](./templates/local-business.json) |
| `BreadcrumbList` | Hierarchy and navigation trails | [breadcrumb-list.json](./templates/breadcrumb-list.json) |
| `FAQPage` | Dedicated FAQ blocks (gov/health/explicit FAQs) | [faq-page.json](./templates/faq-page.json) |

Full specification rules and lifecycle status: [google-rich-results.md](./references/google-rich-results.md).

## Process

### 1. Identify Intent & Inspect Existing Schema
- **For Local Codebases (Next.js / React):** Inspect `app/layout.tsx`, `app/**/page.tsx`, or component files for existing `<script type="application/ld+json">`.
- **For Live URLs:** Inspect page source using curl or browser fetch for `<script type="application/ld+json">`.
- **Determine Page Type:** Match intent (wedding/event invitation -> Event, product page -> Product, blog -> Article, navigation -> BreadcrumbList).

### 2. Validate Against Google's Rich Result Specification
Consult [google-rich-results.md](./references/google-rich-results.md) and verify:
- `@context` is `"https://schema.org"`
- All required fields are present (e.g. `headline`, `image`, `datePublished` for Article; `startDate`, `location`, `name` for Event)
- Dates are formatted in ISO 8601 (`YYYY-MM-DD` or `YYYY-MM-DDTHH:mm:ssZ`)
- Numeric values are appropriately formatted (e.g. prices as strings in offers)
- Check for deprecated schemas: Google retired `HowTo` rich results in Sep 2023 and Sitelinks Search Box in Nov 2024.

### 3. Generate Paste-Ready Markup

#### Option A: Next.js App Router Component (Recommended)
```tsx
export default function WeddingCardPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: 'Rahul & Priya Wedding Celebration',
    startDate: '2026-11-20T18:00:00+05:30',
    endDate: '2026-11-20T23:00:00+05:30',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: 'Grand Palace Banquet Hall',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Mumbai',
        addressRegion: 'Maharashtra',
        addressCountry: 'IN'
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Page Content */}
    </>
  );
}
```

#### Option B: Standard HTML Script Tag
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "..."
}
</script>
```

### 4. Output Deliverable
Provide:
1. **Summary of Findings:** Validation of existing schema or declaration of missing rich result opportunities.
2. **Generated JSON-LD:** Clean, complete code with no placeholder `{REPLACE:...}` tokens unresolved.
3. **Verification Link:** Prompt user to test on [Google Rich Results Test](https://search.google.com/test/rich-results).
