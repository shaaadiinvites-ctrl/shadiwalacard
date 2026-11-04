import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Online Lagan Patrika Maker with 1-Tap Google Maps | ShadiwalaCard',
  description: 'Create traditional digital Lagan Patrika & shadi cards online. Features Devanagari Hindi font support, auspicious Shubh Muhurat timings, 1-tap Google Maps venue navigation & WhatsApp delivery for ₹799.',
  keywords: [
    'online lagan patrika maker',
    'digital lagan patrika',
    'lagan patrika online',
    'shadi card online hindi',
    'digital wedding card with google maps',
    'online lagan patrika format',
    'shubh vivah lagan patrika maker',
    'whatsapp lagan patrika'
  ],
  alternates: {
    canonical: 'https://shadiwalacard.com/lagan-patrika-online',
  },
  openGraph: {
    title: 'Online Lagan Patrika Maker with 1-Tap Google Maps | ShadiwalaCard',
    description: 'Create traditional digital Lagan Patrika with Devanagari Hindi fonts, Shubh Muhurat timings & 1-tap Google Maps for ₹799.',
    url: 'https://shadiwalacard.com/lagan-patrika-online',
    siteName: 'ShadiwalaCard',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Online Lagan Patrika Maker' }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Product',
      name: 'Digital Lagan Patrika & Traditional Shadi Card Maker',
      image: 'https://shadiwalacard.com/project3-assets/cover.jpg',
      description: 'Traditional Indian Lagan Patrika with Devanagari Hindi typography, Shubh Muhurat schedule, and modern 1-tap Google Maps navigation.',
      brand: { '@type': 'Brand', name: 'ShadiwalaCard' },
      offers: {
        '@type': 'Offer',
        price: '799',
        priceCurrency: 'INR',
        availability: 'https://schema.org/InStock',
        url: 'https://shadiwalacard.com/cart?template=grand-palace',
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://shadiwalacard.com' },
        { '@type': 'ListItem', position: 2, name: 'Online Lagan Patrika Maker', item: 'https://shadiwalacard.com/lagan-patrika-online' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Can I write family names and shlokas in Hindi/Devanagari?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! ShadiwalaCard fully supports Hindi, Sanskrit shlokas, and English. You can include Ganesh Vandana, Mangalam Bhagwan Vishnu, and traditional Nanihal/Dadihal family details.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does the Google Maps venue pin work for rural or resort venues?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'When you create the invite, you pin your exact venue on Google Maps. Guests simply tap "Navigate" on their smartphone and turn-by-turn navigation opens directly to your venue entrance gate.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I send the Lagan Patrika to relatives on WhatsApp?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Instantly after ordering, you receive a custom wedding link. You can share this link across WhatsApp groups or direct messages with rich couple photos and music preview.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I add multiple traditional events like Haldi, Mehndi, and Barat Prasthan?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! You can configure every ceremony with its own auspicious Muhurat timing, date, dress code, and dedicated 1-tap Google Maps pin.',
          },
        },
      ],
    },
  ],
};

export default function LaganPatrikaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
