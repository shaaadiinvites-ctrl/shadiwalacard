import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us & Royal Support | ShadiwalaCard",
  description:
    "Need assistance with your digital wedding invitation or custom concierge design? Connect with our dedicated ShadiwalaCard team.",
  openGraph: {
    type: "website",
    url: "https://shadiwalacard.com/contact-us",
    title: "Contact Us & Royal Support | ShadiwalaCard",
    description:
      "Need assistance with your digital wedding invitation? Connect with our dedicated concierge support team.",
    siteName: "ShadiwalaCard",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Contact ShadiwalaCard Support",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us & Royal Support | ShadiwalaCard",
    description:
      "Need assistance with your digital wedding invitation? Connect with our team.",
    images: ["/og-image.jpg"],
  },
};

export default function ContactUsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
