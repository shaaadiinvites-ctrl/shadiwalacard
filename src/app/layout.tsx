import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { PostHogProvider } from "@/providers/PostHogProvider";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "ShadiwalaCard — Bespoke Digital Wedding Invitations",
  description: "Hand-painted digital shadi invitations with live RSVP, venue map & countdown. Trusted by couples across India.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} h-full antialiased`} suppressHydrationWarning data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col" style={{ background: '#F2F4F8', color: '#1A202C', fontFamily: "var(--font-body), 'Inter', sans-serif" }} suppressHydrationWarning>
        <PostHogProvider>
          {children}
        </PostHogProvider>
      </body>
    </html>
  );
}
