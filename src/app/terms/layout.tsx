import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | ShadiwalaCard",
  description: "Terms and conditions of service for creating, customizing, and hosting interactive digital wedding invitations on ShadiwalaCard.",
  alternates: {
    canonical: "https://shadiwalacard.com/terms",
  },
  openGraph: {
    title: "Terms & Conditions | ShadiwalaCard",
    description: "Terms and conditions of service for creating, customizing, and hosting interactive digital wedding invitations on ShadiwalaCard.",
    url: "https://shadiwalacard.com/terms",
    siteName: "ShadiwalaCard",
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
