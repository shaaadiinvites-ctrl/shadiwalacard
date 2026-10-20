import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | ShadiwalaCard",
  description: "Read ShadiwalaCard's privacy policy. Learn how your couple photographs, guest details, and payments are protected with bank-grade encryption.",
  alternates: {
    canonical: "https://shadiwalacard.com/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy | ShadiwalaCard",
    description: "Read ShadiwalaCard's privacy policy. Learn how your couple photographs, guest details, and payments are protected with bank-grade encryption.",
    url: "https://shadiwalacard.com/privacy-policy",
    siteName: "ShadiwalaCard",
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
