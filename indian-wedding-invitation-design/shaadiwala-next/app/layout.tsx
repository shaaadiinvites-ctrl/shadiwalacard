import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'shadiwalacard.com — Bespoke Digital Wedding Invitations',
  description: 'Hand-painted digital shadi invitations with live RSVP, venue map & countdown. Trusted by 12,400+ couples across India.',
  keywords: 'digital wedding invitation, Indian wedding card, shadi invitation online, digital invite India, shadiwalacard.com',
  openGraph: {
    title: 'shadiwalacard.com — Bespoke Digital Wedding Invitations',
    description: 'Hand-painted digital invitations with live RSVP, venue map & countdown timer. Starting ₹2,499.',
    type: 'website',
    locale: 'en_IN',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
