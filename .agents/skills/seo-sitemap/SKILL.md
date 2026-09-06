---
name: seo-sitemap
description: Inspect, validate, and generate XML sitemaps and robots.txt directives for Next.js and web applications without external APIs. Checks route coverage, canonical consistency, changefreq, priority, and lastmod formatting. Use when the user asks for "sitemap analysis", "check my sitemap", "generate sitemap", "robots.txt", "missing pages from sitemap", or "sitemap health".
---

# Sitemap & Robots Directive Management (Zero-API)

Generate, audit, and optimize XML sitemaps and `robots.txt` configurations to ensure 100% crawl efficiency and clean indexation for search engines.

## Next.js App Router Sitemap Pattern

Create or audit `app/sitemap.ts`:

```typescript
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shadiwalacard.com';
  
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/templates`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  return staticRoutes;
}
```

## Next.js App Router Robots Pattern

Create or audit `app/robots.ts`:

```typescript
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shadiwalacard.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/private/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

## Audit Checklist
- **All Key Routes Present**: Homepage, product pages, template galleries, pricing, contact.
- **No Non-200 or 404 Pages**: Ensure every URL listed in the sitemap returns a 200 HTTP status.
- **Canonical Match**: Every sitemap URL must match its self-referencing canonical URL exactly (no trailing-slash mismatches or protocol differences).
- **Robots Reference**: Ensure `robots.txt` declares the absolute URL of the sitemap: `Sitemap: https://domain.com/sitemap.xml`.
