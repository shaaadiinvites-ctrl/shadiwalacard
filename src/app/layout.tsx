import type { Metadata, Viewport } from "next";
import { Montserrat, Inter, Caveat } from "next/font/google";
import { PostHogProvider } from "@/providers/PostHogProvider";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-handwriting",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://shadiwalacard.com"),
  title: {
    default: "ShadiwalaCard — India's Most Premium Digital Wedding Card",
    template: "%s | ShadiwalaCard",
  },
  description: "Ultra-premium digital wedding invitations featuring 1-tap Google Maps venue navigation, live countdowns, event timelines, and HD couple galleries.",
  keywords: [
    "digital wedding card",
    "indian wedding invite",
    "shadi card online",
    "web wedding invitation",
    "the grand palace wedding card",
    "whatsapp wedding card",
    "interactive wedding card with google maps",
    "paperless wedding invite india",
    "best digital shadi card",
    "wedding invitation website maker"
  ],
  alternates: {
    canonical: "https://shadiwalacard.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://shadiwalacard.com",
    siteName: "ShadiwalaCard",
    title: "ShadiwalaCard — India's Most Premium Digital Wedding Card",
    description: "Ultra-premium digital wedding invitations featuring 1-tap Google Maps venue navigation, live countdowns, and HD couple galleries.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "The Grand Palace Digital Wedding Invitation Preview - ShadiwalaCard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ShadiwalaCard — India's Most Premium Digital Wedding Card",
    description: "Ultra-premium digital wedding invitations with 1-tap Google Maps venue navigation & live countdowns.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

const jsonLdOrg = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ShadiwalaCard",
  url: "https://shadiwalacard.com",
  logo: "https://shadiwalacard.com/icon.png",
  description: "India's premier digital wedding invitation platform, creating interactive web invites with 1-tap Google Maps navigation, HD galleries, and WhatsApp delivery.",
  email: "hello@shadiwalacard.com",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    areaServed: "IN",
    availableLanguage: ["English", "Hindi"]
  }
};

const jsonLdWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ShadiwalaCard",
  url: "https://shadiwalacard.com"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${inter.variable} ${caveat.variable} h-full antialiased`} suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
      </head>
      <body className="min-h-full flex flex-col" style={{ background: '#050505', color: '#FFFFFF', fontFamily: "var(--font-body), 'Inter', sans-serif" }} suppressHydrationWarning>
        <PostHogProvider>
          {children}
        </PostHogProvider>
      </body>
    </html>
  );
}

