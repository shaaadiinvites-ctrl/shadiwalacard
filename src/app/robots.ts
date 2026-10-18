import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://shadiwalacard.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin",
          "/admin/",
          "/edit/",
          "/form",
          "/success",
        ],
      },
      // Explicitly welcome all top Generative AI and search crawlers
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "PerplexityBot",
          "ClaudeBot",
          "anthropic-ai",
          "Google-Extended",
          "Applebot",
          "Bingbot",
          "Googlebot",
        ],
        allow: [
          "/",
          "/demo/",
          "/contact-us",
          "/privacy-policy",
          "/terms",
          "/refund-policy",
        ],
        disallow: [
          "/api/",
          "/admin",
          "/admin/",
          "/edit/",
          "/form",
          "/success",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
