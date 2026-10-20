import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "100% Money-Back Guarantee & Refund Policy | ShadiwalaCard",
  description: "Learn about ShadiwalaCard's 100% money-back guarantee and simple email-only refund process with zero questions asked.",
  alternates: {
    canonical: "https://shadiwalacard.com/refund-policy",
  },
  openGraph: {
    title: "100% Money-Back Guarantee & Refund Policy | ShadiwalaCard",
    description: "Learn about ShadiwalaCard's 100% money-back guarantee and simple email-only refund process with zero questions asked.",
    url: "https://shadiwalacard.com/refund-policy",
    siteName: "ShadiwalaCard",
  },
};

export default function RefundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
