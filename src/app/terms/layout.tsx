import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | ShadiwalaCard",
  description: "Terms and conditions for creating and hosting digital wedding invitations on ShadiwalaCard.",
  openGraph: {
    type: "website",
    url: "https://shadiwalacard.com/terms",
    title: "Terms of Service | ShadiwalaCard",
    description: "Terms and conditions for creating digital wedding invitations on ShadiwalaCard.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, type: "image/jpeg" }],
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
