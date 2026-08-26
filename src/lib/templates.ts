// Central registry of invite templates: the homepage gallery, the checkout
// page, and TemplateRenderer all read from this single list so a new
// template only needs to be added here + given a component.

export interface TemplateMeta {
  id: string;
  name: string;
  tagline: string;
  priceInr: number;
  mrp: string;
  discount: string;
  badge: string;
  img: string;
  /** 3 representative colors used for the mini preview card + accents */
  swatch: [string, string, string];
  /** Tailwind-ish font vibe shown as a label on the card */
  fontVibe: string;
}

export const TEMPLATES: TemplateMeta[] = [
  {
    id: "grand-palace",
    name: "The Grand Palace",
    tagline: "A breathtaking digital journey through a majestic royal palace",
    priceInr: 799,
    mrp: "₹1,299",
    discount: "38% OFF",
    badge: "🔥 #1 NEW ARRIVAL FOR 2026",
    img: "/project3-assets/cover.jpg",
    swatch: ["#0d2a33", "#FFD98A", "#FFFFFF"],
    fontVibe: "Serif · Royal Gold",
  },
  {
    id: "modern-minimal",
    name: "The Royal Darbar",
    tagline: "Customized golden name overlay beneath floral canopy",
    priceInr: 1500,
    mrp: "₹1,299",
    discount: "38% OFF",
    badge: "👑 ROYAL PREFERENCE",
    img: "/uploads/couple_card_2.jpg",
    swatch: ["#4c0519", "#f5d0fe", "#FFFFFF"],
    fontVibe: "Inter · Royal Preference",
  },
  {
    id: "floral-romance",
    name: "The Velvet Night",
    tagline: "Modern starry night theme for contemporary couples",
    priceInr: 1500,
    mrp: "₹1,299",
    discount: "38% OFF",
    badge: "💖 INSTAGRAM FAVORITE",
    img: "/uploads/couple_card_2.jpg",
    swatch: ["#0f172a", "#38bdf8", "#FFFFFF"],
    fontVibe: "Modern · Instagram Favorite",
  },
];

export function getTemplate(id?: string | null): TemplateMeta {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}
