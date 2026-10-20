import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us & WhatsApp Support | ShadiwalaCard",
  description: "Get in touch with the ShadiwalaCard team for digital wedding card customization, instant WhatsApp assistance, or design queries.",
  alternates: {
    canonical: "https://shadiwalacard.com/contact-us",
  },
  openGraph: {
    title: "Contact Us & WhatsApp Support | ShadiwalaCard",
    description: "Get in touch with the ShadiwalaCard team for digital wedding card customization, instant WhatsApp assistance, or design queries.",
    url: "https://shadiwalacard.com/contact-us",
    siteName: "ShadiwalaCard",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
