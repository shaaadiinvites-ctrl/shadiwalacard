import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | ShadiwalaCard",
  description: "Information regarding our 100% satisfaction guarantee, cancellation, and refund policies.",
  openGraph: {
    type: "website",
    url: "https://shadiwalacard.com/refund-policy",
    title: "Refund & Cancellation Policy | ShadiwalaCard",
    description: "Learn about ShadiwalaCard's refund and cancellation policies.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, type: "image/jpeg" }],
  },
};

export default function RefundLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
