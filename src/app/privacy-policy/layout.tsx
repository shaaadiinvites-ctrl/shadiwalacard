import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | ShadiwalaCard",
  description: "Learn how ShadiwalaCard protects customer privacy, payment details, and invitation data.",
  openGraph: {
    type: "website",
    url: "https://shadiwalacard.com/privacy-policy",
    title: "Privacy Policy | ShadiwalaCard",
    description: "Learn how ShadiwalaCard protects customer privacy and invitation data.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, type: "image/jpeg" }],
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
