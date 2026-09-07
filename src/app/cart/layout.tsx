import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout — The Grand Palace Digital Wedding Invitation | ShadiwalaCard",
  description:
    "Secure your royal digital wedding invitation. Instant delivery to WhatsApp with 1-tap Google Maps venue navigation, RSVP tracking, and live countdowns.",
  openGraph: {
    type: "website",
    url: "https://shadiwalacard.com/cart",
    title: "Checkout — The Grand Palace Digital Wedding Invitation | ShadiwalaCard",
    description:
      "Secure your royal digital wedding invitation. Instant delivery to WhatsApp with 1-tap Google Maps navigation and guest RSVPs.",
    siteName: "ShadiwalaCard",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "The Grand Palace Digital Wedding Invitation - ShadiwalaCard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Checkout — The Grand Palace Digital Wedding Invitation | ShadiwalaCard",
    description:
      "Secure your royal digital wedding invitation with 1-tap Google Maps venue navigation.",
    images: ["/og-image.jpg"],
  },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
