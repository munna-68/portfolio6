/**
 * Every image on the site is referenced from this file, by slot name.
 * Swap a URL (or a local path such as "/images/hero.png" in /public) to replace an image;
 * component code never hard-codes an image.
 *
 * PLACEHOLDER: the slots marked PLACEHOLDER below are still hotlinked from the template's
 * reference CDN and must be replaced before going live. IMAGES.md lists exactly what to shoot.
 * `width`/`height` are the source's intrinsic size; they set the aspect-ratio box so nothing
 * shifts while images load. Update them if your replacement has a different shape.
 */
export type ImageAsset = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

const sanity = (id: string, query = "w=1600&q=85&auto=format") =>
  `https://cdn.sanity.io/images/degpnzrx/production/${id}?${query}`;

export const assets = {
  // Hero ASCII art: a phone running a booking calendar with a "Deposit paid" card (transparent WebP).
  // Drawn in code; regenerate or replace with your own render. Bright pixels become dense glyphs.
  "hero-ascii": { src: "/images/brand/hero-booking.webp", width: 800, height: 1160, alt: "A phone showing a booking calendar with a deposit-paid confirmation, rendered as ASCII art" },
  // Grayscale depth map for the hero art (white = near): the floating card and button sit closest.
  "hero-ascii-depth": { src: "/images/brand/hero-booking-depth.webp", width: 800, height: 1160, alt: "" },
  "hero-ascii-mobile": { src: "/images/brand/hero-booking-mobile.webp", width: 400, height: 580, alt: "A phone showing a booking calendar, rendered as ASCII art" },
  // "Now building" teaser in the hero's bottom-right corner
  "hero-teaser": { src: "/images/work/bake-house.webp", width: 1200, height: 800, alt: "Bake House baker storefront demo" },
  // Stats section media card (portrait)
  "stats-portrait": { src: "/images/brand/card-front.webp", width: 1024, height: 1536, alt: "Mahmud Munna, founder and web developer at SiteKeep" },

  // PLACEHOLDER: How it works, one image per step (4:5 frame). Still hotlinked from the template; see IMAGES.md.
  "process-1": {
    src: sanity("728234c6dbc099bb9ffd7ab8160a443b7ed9b239-1600x2400.heif"),
    width: 1600,
    height: 2400,
    alt: "Process step one",
  },
  "process-2": {
    src: sanity("8c7de2558b412dbf660620894a264bfc0a21dd46-1600x2400.heif"),
    width: 1600,
    height: 2400,
    alt: "Process step two",
  },
  "process-3": {
    src: sanity("dacef92f30d8e3ebe3c32ed098eb878f39e133ef-1600x2400.heif"),
    width: 1600,
    height: 2400,
    alt: "Process step three",
  },
  "process-4": {
    src: sanity("b370e4f512a2d26bb53dd93bc1d84b473ffcb988-2400x1600.heif"),
    width: 2400,
    height: 1600,
    alt: "Process step four",
  },

  // Work: one cover per project (16:10 on the landing page)
  "work-madysens": { src: "/images/work/madysens-pet-care-booking.webp", width: 1200, height: 800, alt: "Madysen's Pet Care booking site" },
  "work-kennedis": { src: "/images/work/kennedis-grooming-showcase.webp", width: 1200, height: 800, alt: "Kennedi's Grooming Studio site" },
  "work-burnetts": { src: "/images/work/burnetts-digital-booking.webp", width: 1200, height: 800, alt: "Burnett's Digital Creative agency site" },
  "work-bake-house": { src: "/images/work/bake-house.webp", width: 1200, height: 800, alt: "Bake House cookie storefront demo" },
  "work-petal-crumb": { src: "/images/work/petal-crumb-bakery.webp", width: 1200, height: 800, alt: "Petal & Crumb custom cake order demo" },
  "work-sable": { src: "/images/work/sable-hair-studio.webp", width: 1200, height: 800, alt: "Sable Hair Studio booking demo" },
  "work-marigold": { src: "/images/work/marigold-event-co.webp", width: 1200, height: 800, alt: "Marigold Event Co. rental quote demo" },
  "work-anchor": { src: "/images/work/anchor-home-services.webp", width: 1200, height: 800, alt: "Anchor Home Services dispatch demo" },
  "work-alder": { src: "/images/work/good-spread.webp", width: 1200, height: 800, alt: "Alder Catering order planner demo" },
  "work-rollin": { src: "/images/work/crumb-and-roll.webp", width: 1200, height: 800, alt: "ROLLIN. Bakery storefront demo" },

  // Menu flyout images (desktop only)
  "menu-center": { src: "/images/brand/card-back.webp", width: 1024, height: 1536, alt: "SiteKeep: a two-person studio" },
  "menu-featured": { src: "/images/work/madysens-pet-care-booking.webp", width: 1200, height: 800, alt: "Madysen's Pet Care" },
  // "Start a project" section (16:9)
  "contact-photo": { src: "/images/brand/about-abstract.jpg", width: 1408, height: 768, alt: "Sketch of a website wireframe turning into a booking flow" },
  // About page wide image
  "about-system": { src: "/images/work/studio-system.webp", width: 1200, height: 787, alt: "Illustration of a custom website connected to an API and dashboard" },

  // Footer ASCII art: two halves of Michelangelo's "Creation of Adam" hands (the template's art,
  // now served locally so WebGL can read it). Swap for your own pair of transparent cut-outs; see IMAGES.md.
  "footer-ascii-left": { src: "/images/footer/hands-left.webp", width: 807, height: 1117, alt: "" },
  "footer-ascii-right": { src: "/images/footer/hands-right.webp", width: 829, height: 1117, alt: "" },
} satisfies Record<string, ImageAsset>;

export type AssetSlot = keyof typeof assets;
