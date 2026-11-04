import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Destination Wedding Digital Invitations & Resort Guide | ShadiwalaCard',
  description: 'Design luxury digital invitations for destination weddings in Udaipur, Jaipur, Goa & international resorts. Includes 1-tap Google Maps, multi-day itinerary, dress codes & hotel details for ₹799.',
  keywords: [
    'destination wedding digital invite',
    'destination wedding website india',
    'royal palace wedding invitation',
    'udaipur wedding digital card',
    'jaipur destination wedding invite',
    'goa beach wedding e-card',
    'multi-day wedding itinerary website',
    'wedding card with hotel and maps'
  ],
  alternates: {
    canonical: 'https://shadiwalacard.com/destination-wedding-card',
  },
  openGraph: {
    title: 'Destination Wedding Digital Invitations & Resort Guide | ShadiwalaCard',
    description: 'Design luxury digital invitations for destination weddings with 1-tap Google Maps, multi-day itineraries & dress codes for ₹799.',
    url: 'https://shadiwalacard.com/destination-wedding-card',
    siteName: 'ShadiwalaCard',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Destination Wedding Digital Invitations' }],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Product',
      name: 'Destination Wedding Digital Invitation & Multi-Day Itinerary',
      image: 'https://shadiwalacard.com/project3-assets/cover.jpg',
      description: 'Luxury interactive wedding website tailored for destination weddings with resort maps, multi-day events, and dress codes.',
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
        { '@type': 'ListItem', position: 2, name: 'Destination Wedding Digital Invitations', item: 'https://shadiwalacard.com/destination-wedding-card' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How do guests navigate large resorts and palace properties?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You can provide exact Google Maps pins for the specific palace gate, lakeside lawn, or poolside cabana so out-of-town guests arrive effortlessly without calling you.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I include flight guidelines, airport shuttles, and hotel check-in info?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! You can organize multi-day schedules (Welcome Dinner, Sangeet, Pheras, Reception), add dress code recommendations, and include airport shuttle details.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I edit the schedule if flight or cocktail timings change?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! You get a private edit link to update timings, venues, or photos anytime. All updates reflect instantly on your guests’ live link without re-sending.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does WhatsApp sharing work for international guests?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Your invite is a lightweight web link that opens seamlessly on any phone worldwide across WhatsApp, Instagram, or iMessage with rich previews and music.',
          },
        },
      ],
    },
  ],
};

export default function DestinationWeddingLayout({ children }: { children: React.ReactNode }) {
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
