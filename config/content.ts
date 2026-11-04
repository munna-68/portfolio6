/**
 * All site copy lives here. Line lengths roughly follow the original template's headline/paragraph
 * lengths, because line counts drive the text animations.
 * Images are referenced by slot name; see config/assets.ts and IMAGES.md.
 */
import type { AssetSlot } from "./assets";

export const brand = {
  name: "SiteKeep",
  logoWordOne: "SITE",
  logoWordTwo: "KEEP",
  email: "mahamudmunna8@gmail.com",
  domain: "sitekeep.studio",
  url: "https://sitekeep.studio",
};

export type NavItem = { label: string; href: string };

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const headerCta = { label: "Start a project", href: "/contact" };

export const socials = [
  { name: "Instagram", handle: "@mahamud13954", href: "https://www.instagram.com/mahamud13954/" },
  { name: "Facebook", handle: "Mahamud Munna", href: "https://www.facebook.com/mahamud.munna.2024" },
];

export const menuFlyout = {
  contactLabel: "Contact",
  contactEmail: brand.email,
  people: [
    { name: "Mahmud", role: "Build", email: brand.email },
    { name: "Tamanna", role: "Design & clients", email: brand.email },
  ],
  socials,
  location: "Based in Bangladesh. Building for US small businesses.",
  availability: "Taking new builds.\nBaker storefronts open now.",
  spots: "Early-adopter pricing for bakers",
  centerImage: { slot: "menu-center" as AssetSlot, caption: "A two-person studio", href: "/about" },
  featured: { slot: "menu-featured" as AssetSlot, caption: "Flagship: Madysen's Pet Care", href: "/work/madysens-pet-care" },
};

export const hero = {
  headline: "Custom systems for small businesses.",
  subtext:
    "Booking with conflict detection, order limits, deposits and cancellation rules, intake flows. Hand-coded in React and Next.js, then kept running for a low monthly fee.",
  primaryCta: { label: "See the work", href: "/work" },
  secondaryCta: { label: "See pricing", href: "/pricing" },
  trustedBy: ["Madysen's Pet Care", "Kennedi's Grooming", "Burnett's Digital", "+ 15 concept builds"],
  artLabel: "Booking confirmed",
  teaser: { label: "Now building", title: "Baker storefronts", href: "/work/bake-house", slot: "hero-teaser" as AssetSlot },
};

// Values with an optional $ prefix and K/M/+/% suffix animate as rolling digits.
export const stats = {
  mediaSlot: "stats-portrait" as AssetSlot,
  cards: [
    { value: "3", label: "Client sites live and maintained" },
    { value: "15+", label: "Working demo builds across niches" },
    { value: "$19", label: "A month to keep it running (from $19.99)" },
  ],
};

export const process = {
  headline: "How it works.",
  label: "// Process",
  steps: [
    {
      title: "Tell us how you take orders.",
      text: "DMs, texts, a Google Form, a spreadsheet. A few lines is enough. We reply with what a system built for your business would actually do.",
      slot: "process-1" as AssetSlot,
    },
    {
      title: "We build the system.",
      text: "Booking with conflict detection, order and box limits, deposits, cancellation rules, intake forms. Custom React and Next.js under your own brand. No templates, no AI-generated pages.",
      slot: "process-2" as AssetSlot,
    },
    {
      title: "You try it, we tune it.",
      text: "You click through a working demo before anything goes live, and we adjust it until it runs the way your business really runs.",
      slot: "process-3" as AssetSlot,
    },
    {
      title: "We keep it running.",
      text: "Hosting, fixes and small updates are on us. You own your domain. One low monthly fee.",
      slot: "process-4" as AssetSlot,
    },
  ],
};

export type ProjectImage = { src: string; width: number; height: number; alt: string; caption: string; title: string };

export type Project = {
  slug: string;
  title: string;
  tags: string[];
  slot: AssetSlot;
  /** Shown in the home page's Selected Work list. */
  featured?: boolean;
  kind: "Client" | "Concept";
  year: string;
  /** One-line summary under the title on the project page. */
  summary: string;
  problem: string;
  built: string[];
  result: string;
  stack: string[];
  liveUrl?: string;
  liveLabel?: string;
  gallery?: ProjectImage[];
};

const shot = (dir: string, file: string, title: string, caption: string): ProjectImage => ({
  src: `/images/cases/${dir}/${file}.webp`,
  width: 1280,
  height: 800,
  alt: `${title}: ${caption}`,
  title,
  caption,
});

const CONCEPT_NOTE =
  "A self-initiated demo for a fictional brand, built to show what this system looks like for a real business in the niche. Interactions run on mock data.";

export const projects: Project[] = [
  {
    slug: "madysens-pet-care",
    title: "Madysen's Pet Care",
    tags: ["Booking System", "Pet Care"],
    slot: "work-madysens",
    featured: true,
    kind: "Client",
    year: "2026",
    summary: "A full-stack booking system for a pet-sitting business, with conflict detection, deposits and cancellation rules built in.",
    problem:
      "Bookings were coming in through a plain contact form. Clients needed to book without double-booking, pay a deposit up front and follow clear cancellation rules, without Madysen sorting it all out by hand.",
    built: [
      "Booking engine with conflict detection, so a slot can't be taken twice",
      "Deposit logic and cancellation rules built into checkout",
      "Automatic email confirmations with Nodemailer",
      "Blog powered by Notion: she writes in Notion, it publishes to the site",
      "Service pages restructured for local search, with GA4 tracking",
    ],
    result: "Live at madysenspetcare.com on Railway. SiteKeep's flagship build, still maintained by us.",
    stack: ["Next.js", "Express", "Node.js", "Nodemailer", "Notion API", "Railway"],
    liveUrl: "https://madysenspetcare.com",
    liveLabel: "madysenspetcare.com",
  },
  {
    slug: "bake-house",
    title: "Bake House",
    tags: ["Baker Storefront", "Dashboard"],
    slot: "work-bake-house",
    featured: true,
    kind: "Concept",
    year: "2026",
    summary: "Our baker product: a branded storefront plus a dashboard, so the baker runs menu, stock and orders without juggling DMs.",
    problem:
      "Small-batch bakers bake fixed daily batches. Selling mixed boxes over DMs and forms means scarce flavours get oversold, and someone ends up texting customers about substitutions.",
    built: [
      "Box builder for 4, 6 and 12-cookie boxes that checks live stock as you fill it",
      "Live rack counts per flavour that flip to sold out at zero",
      "Checkout with delivery-zone checks or pickup windows",
      "Kitchen dashboard: order queue, bake totals per tray, menu and stock controls",
    ],
    result: `${CONCEPT_NOTE} It's the base we copy and rebrand for each baker.`,
    stack: ["React", "TypeScript", "Tailwind CSS", "Vite"],
    liveUrl: "https://sitekeep.studio/bake-house",
    liveLabel: "Open the demo",
    gallery: [
      shot("bakehouse", "01-box-builder", "Build a mixed box", "Six slots filled, live price, and remaining rack stock per flavour."),
      shot("bakehouse", "02-rack-limits", "Live rack limits", "Every flavour shows its live count and flips to sold out at zero."),
      shot("bakehouse", "03-checkout", "Pickup or delivery", "Postcode check, delivery window, then pickup or courier."),
      shot("bakehouse", "04-dashboard", "Kitchen dashboard", "The same orders become a queue, bake totals and pickup windows."),
    ],
  },
  {
    slug: "kennedis-grooming-studio",
    title: "Kennedi's Grooming Studio",
    tags: ["GSAP Build", "Grooming"],
    slot: "work-kennedis",
    featured: true,
    kind: "Client",
    year: "2026",
    summary: "An animated, high-end site for a dog grooming studio, built on a paid Upwork contract.",
    problem:
      "Kennedi wanted a studio site that felt as polished as her work, with clear booking paths, her story, her reviews and her contact details easy to find.",
    built: [
      "Heavily animated GSAP build on Vite for a distinctive, high-end feel",
      "Redesigned Book Appointment and Book Now pages",
      "About Me bio, reviews section, contact info and a new navbar",
      "A Notion-powered blog, built as a separate project",
      "Cross-browser polish, including an iOS Safari animation fix",
    ],
    result: "Live at kennedigroomingstudio.com. Paid client engagement, shipped end to end.",
    stack: ["Vite", "React", "GSAP", "Notion API"],
    liveUrl: "https://kennedigroomingstudio.com",
    liveLabel: "kennedigroomingstudio.com",
  },
  {
    slug: "petal-and-crumb",
    title: "Petal & Crumb",
    tags: ["Custom Cake Orders", "Deposits"],
    slot: "work-petal-crumb",
    featured: true,
    kind: "Concept",
    year: "2026",
    summary: "A custom cake order studio with live pricing, capacity-aware dates and a clear deposit split.",
    problem:
      "Custom cakes mean quoting across sizes, fillings, finishes and lead times. Customers wait on email back-and-forth, and bakers overbook their calendar.",
    built: [
      "Cake configurator where every choice updates the price instantly",
      "Calendar with a 5-day lead time, a 6-cakes-a-day cap and rush fees",
      "Live estimate with an exact 50/50 deposit and balance split",
      "Intake form with photo references, allergen tags and delivery notes",
    ],
    result: CONCEPT_NOTE,
    stack: ["React", "TypeScript", "Tailwind CSS", "Radix UI", "Framer Motion"],
    gallery: [
      shot("petal-crumb", "01-configure", "Configure the cake", "Size, flavour, finish and complexity feed the estimate on one screen."),
      shot("petal-crumb", "02-date-calendar", "Pick a date", "Open, rush-fee and fully booked dates are clear before the form opens."),
      shot("petal-crumb", "03-live-estimate", "Live estimate", "A $231 total split evenly into deposit and balance."),
      shot("petal-crumb", "04-confirmation", "Order sent", "Confirmation with the reserved date, deposit and remaining balance."),
    ],
  },
  {
    slug: "burnetts-digital-creative",
    title: "Burnett's Digital Creative",
    tags: ["Agency Site", "Partnership"],
    slot: "work-burnetts",
    featured: true,
    kind: "Client",
    year: "2026",
    summary: "An agency site with a preloader and scroll-driven motion, built inside an ongoing partnership.",
    problem:
      "Burnett's Digital Creative needed a site with its own voice: real service pages, a team section and case studies, not a generic agency template.",
    built: [
      "Full site build with a preloader and scroll-driven animation",
      "Team grid, service pages and a case-study section",
      "Ongoing development as part of Trayvaughn Burnett's team",
    ],
    result: "Live at burnettdigitalcreative.com. A revenue-share partnership, not a one-off job.",
    stack: ["React", "GSAP"],
    liveUrl: "https://burnettdigitalcreative.com",
    liveLabel: "burnettdigitalcreative.com",
  },
  {
    slug: "sable-hair-studio",
    title: "Sable Hair Studio",
    tags: ["Salon Booking", "Intake Rules"],
    slot: "work-sable",
    kind: "Concept",
    year: "2026",
    summary: "A salon booking flow that protects service time, gates first-time colour clients and matches the right stylist.",
    problem:
      "When a colour transformation gets booked into a haircut slot, the whole day runs late. Generic booking tools don't know the difference.",
    built: [
      "Eight services with real durations, prices and deposits up front",
      "Consult gate: first-time colour clients must add a consult and patch test",
      "Only stylists qualified for the chosen service are shown",
      "Summary with the time block, deposit and a 48-hour change window",
    ],
    result: CONCEPT_NOTE,
    stack: ["React", "TypeScript", "Tailwind CSS", "Radix UI", "Framer Motion"],
    gallery: [
      shot("sable", "01-choose-service", "Choose a service", "Every service lists its real duration, price and deposit."),
      shot("sable", "02-consult-gate", "Consult gate", "A first colour visit needs the consult and patch test first."),
      shot("sable", "03-specialist", "Match a specialist", "Only the stylist qualified for balayage is offered."),
      shot("sable", "04-summary", "Review and deposit", "The time block, deposit and change window, repeated before booking."),
    ],
  },
  {
    slug: "marigold-event-co",
    title: "Marigold Event Co.",
    tags: ["Rental Quotes", "Availability"],
    slot: "work-marigold",
    kind: "Concept",
    year: "2026",
    summary: "A rental catalog where every item has its own calendar and every quote itemizes deposits and delivery.",
    problem: "Event rental quotes usually take days of email, and hosts don't know what's available until the contract arrives.",
    built: [
      "Category-filtered catalog with sizes, rates and deposits",
      "Per-item availability calendar that blocks double-booking",
      "Live quote with rental fees and refundable deposits",
      "Delivery fee by ZIP code, then a request-to-reserve form",
    ],
    result: CONCEPT_NOTE,
    stack: ["React", "TypeScript", "Tailwind CSS", "Radix UI", "Framer Motion"],
    gallery: [
      shot("marigold", "01-browse-inventory", "Browse the inventory", "Category counts, dimensions, rates and deposits."),
      shot("marigold", "02-item-calendar", "Check the date", "Each item carries its own calendar."),
      shot("marigold", "03-quote", "Build the quote", "Fees and refundable deposits itemized as you add."),
      shot("marigold", "04-delivery-zip", "Delivery by ZIP", "A ZIP resolves to a delivery line and updates the total."),
    ],
  },
  {
    slug: "anchor-home-services",
    title: "Anchor Home Services",
    tags: ["Dispatch", "Field Service"],
    slot: "work-anchor",
    kind: "Concept",
    year: "2026",
    summary: "A dispatch and booking desk for HVAC and plumbing, with flat-rate pricing and an emergency lane.",
    problem: "Home-service customers want a time and a price, fast. Phone tag and \"we'll call you back\" lose the job.",
    built: [
      "Booking desk gated by a service-area ZIP check",
      "Filterable service catalog with flat-rate pricing",
      "Maintenance plans with member pricing and included visits",
      "A 90-minute emergency lane that holds the next technician",
    ],
    result: CONCEPT_NOTE,
    stack: ["React", "TypeScript", "Tailwind CSS", "Radix UI", "Framer Motion"],
    gallery: [
      shot("anchor", "01-dispatch", "Dispatch booking", "Requests are routed by job type and urgency first."),
      shot("anchor", "02-service-catalog", "Service catalog", "Flat-rate pricing visible on every service."),
      shot("anchor", "03-protection-plans", "Protection plans", "Member pricing and included visits, spelled out."),
      shot("anchor", "04-emergency", "Emergency lane", "The next technician is held with a 90-minute window."),
    ],
  },
  {
    slug: "alder-catering",
    title: "Alder Catering",
    tags: ["Order Planner", "Catering"],
    slot: "work-alder",
    kind: "Concept",
    year: "2026",
    summary: "A catering planner where headcount, date rules, ZIP zones and the order minimum are settled before checkout.",
    problem: "Catering orders start with phone calls and days of quotes, while headcount, diets and delivery stay fuzzy until the invoice.",
    built: [
      "Headcount, 48-hour lead time, serve window and delivery zone up front",
      "Diet filters with per-guest prices that recalculate live",
      "Order sheet that enforces the $250 minimum",
      "Tax, delivery and per-guest totals before checkout",
    ],
    result: CONCEPT_NOTE,
    stack: ["React", "TypeScript", "Vite", "Framer Motion"],
    gallery: [
      shot("good-spread", "01-plan-form", "Plan the order", "Guests, date, serve time and ZIP before the menu."),
      shot("good-spread", "02-menu-filters", "Pick a spread", "Diet filters while per-guest prices recalculate."),
      shot("good-spread", "03-minimum", "Order minimum", "Checkout is blocked below $250, with the exact gap shown."),
      shot("good-spread", "04-tax-totals", "Totals", "Subtotal, delivery, tax, total and cost per guest."),
    ],
  },
  {
    slug: "rollin-bakery",
    title: "ROLLIN. Bakery",
    tags: ["Bakery Storefront", "Cart"],
    slot: "work-rollin",
    kind: "Concept",
    year: "2026",
    summary: "A hand-drawn bakery storefront with daily-bake filters and a bag that remembers the order.",
    problem: "Bakery shops online often feel like sterile product grids. This one tests whether warmth and a rewarding cart sell more.",
    built: [
      "Daily bake grid with category filters and live counts",
      "Bakery bag that survives a page reload",
      "Promo progress bar that unlocks 15% off at $100",
    ],
    result: CONCEPT_NOTE,
    stack: ["React", "TypeScript", "Tailwind CSS", "Framer Motion", "Vite"],
    gallery: [
      shot("crumb-and-roll", "01-filter-grid", "Filter the daily bake", "Category pills with live counts, no page reload."),
      shot("crumb-and-roll", "02-bag", "The bag", "Quantities, subtotal and promo progress in one place."),
      shot("crumb-and-roll", "03-promo-progress", "Promo unlocked", "Past $100, the 15% reward applies right away."),
      shot("crumb-and-roll", "04-bag-persisted", "Come back later", "After a reload, the same bag comes back."),
    ],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export const selectedWork = {
  headline: "Real work.",
  text: "Live client systems and the demo builds behind our pitch. Every one is custom code.",
  viewAll: { label: "View all", href: "/work" },
};

export const indexedGrid = {
  headline: "What you get.",
  label: "// Every build",
  kicker: "A system, not just a website.",
  items: [
    { title: "Custom code.", text: "React and Next.js, written for your business. Not a template, not an AI-generated page." },
    { title: "Real business logic.", text: "Conflict detection, order limits, deposits, cancellation rules. The rules you enforce by hand today." },
    { title: "Your brand, your domain.", text: "Your name on the storefront. You own the domain; we can buy it for you or you bring your own." },
    { title: "A dashboard you control.", text: "Update your menu, availability and deposits yourself, instead of answering every DM." },
    { title: "Hosting on us.", text: "Hosting, fixes and small updates like adding an item are part of the monthly fee." },
    { title: "No platform cut.", text: "No per-order fees like Hotplate or Big Cartel. A flat monthly price, that's it." },
  ],
};

export const faq = {
  headline: "Common questions",
  items: [
    {
      q: "Is this a template or an AI-generated site?",
      a: "Neither. Every build is custom React and Next.js, written around how your business takes orders and bookings. The kind of build that usually costs $1,000 or more.",
    },
    {
      q: "How can it be this cheap?",
      a: "We build once and keep it running for a low monthly fee, instead of charging a big invoice up front. Plans start at $19.99 a month. If you'd rather pay once, there's a $750 one-time build.",
    },
    {
      q: "Who owns the domain and the site?",
      a: "You own your domain. We can buy it for you or you can buy your own. On the one-time build, the code is handed over to you too.",
    },
    {
      q: "I take orders through DMs and texts. Is this for me?",
      a: "That's exactly who it's for. A storefront and dashboard replace the back-and-forth: customers order and pay deposits themselves, and you update your menu and availability in one place.",
    },
    {
      q: "Can you add AI to my site?",
      a: "Yes, as a separate add-on. AI isn't in any plan because it costs us money to run, so it's priced on usage.",
    },
    {
      q: "Where are you based?",
      a: "Bangladesh. We work with US small businesses remotely, by message, email or a quick call.",
    },
  ],
};

export const contactCta = {
  headline: "Start a project.",
  subheadline: "Tell us how you take orders today. We'll show you what a system for it looks like.",
  body: [brand.email, "Working with US small businesses."],
  link: { label: "Email us", href: `mailto:${brand.email}` },
  secondary: { label: "See pricing", href: "/pricing" },
  note: "Two people on every project. No hand-offs.",
  slot: "contact-photo" as AssetSlot,
};

export const footer = {
  newsletterTitle: "New demo builds and launch offers, now and then.",
  newsletterNote: "No spam. Unsubscribe anytime.",
  availability: "Taking new builds.",
  spots: "Baker early-adopter pricing open",
  legal: ["Privacy Policy", "Terms"],
  copyright: `© ${new Date().getFullYear()} SiteKeep`,
  signoff: "We build it. We keep it running.",
  wordmark: "SiteKeep",
};

export const workPage = {
  headline: "The work",
  subtext: "3 live client systems.\nAnd the demo builds behind every pitch.",
};

/* ----------------------------------------------------------------------------
 * Pricing page
 * --------------------------------------------------------------------------*/

export type PricingPlan = { name: string; price: string; period: string; tagline: string; features: string[]; badge?: string };

export const pricing = {
  headline: "Simple pricing.",
  subtext: "Hosting, fixes and small updates on every plan.\nNo setup invoice. No platform cut.",
  label: "// Monthly plans",
  kicker: "Cancel anytime. You own your domain.",
  plans: [
    {
      name: "Standard",
      price: "$19.99",
      period: "/month",
      tagline: "A custom site with one custom feature, like real-time availability.",
      features: [
        "Custom responsive design",
        "One custom feature (e.g. live availability)",
        "Hosting and maintenance",
        "We buy your domain",
      ],
    },
    {
      name: "Advanced",
      price: "$29.99",
      period: "/month",
      badge: "Best value",
      tagline: "Your own dashboard to run it all.",
      features: ["Everything in Standard", "Dashboard for menu, availability and orders", "Online payments and deposits"],
    },
    {
      name: "Pro",
      price: "$39.99",
      period: "/month",
      tagline: "POS for restaurants, plus custom software.",
      features: ["Everything in Advanced", "Restaurant POS and ordering", "Custom software for your workflow"],
    },
  ] satisfies PricingPlan[],
  /** Packages outside the monthly plans (same as portfolio4's one-time buy and AI add-on cards). */
  packages: [
    {
      id: "one-time",
      badge: "One-time buy",
      name: "One-time build",
      price: "$750",
      period: "one time",
      title: "Pay once. Own your site.",
      body: "Custom build with dashboard, blog, custom booking and more. Code handed over to you.",
      groups: [
        {
          label: "What you get",
          items: [
            "Custom-built site with dashboard, blog and custom booking",
            "Full source code handed over to you",
            "Host it anywhere, no monthly fees to us",
            "A walkthrough so you can run it yourself",
          ],
        },
        {
          label: "Good to know",
          items: [
            "Hosting and domain costs are yours (we can set them up for you)",
            "Want us to keep updating it? Any monthly plan covers that",
          ],
        },
      ],
      steps: ["Tell us what you need.", "We build it and show you progress.", "We hand over the code and walk you through it."],
      cta: "Start a one-time build",
    },
    {
      id: "pro-ai",
      badge: "AI add-on",
      name: "Pro + AI",
      price: "$15+",
      period: "/month on top of Pro",
      title: "Want AI on your site?",
      body: "Chat assistant, smart replies and automations. Pro plan only, priced on usage, because AI costs money to run.",
      groups: [
        {
          label: "What it can do",
          items: [
            "Chat assistant that answers customer questions 24/7",
            "Smart replies for inquiries and booking requests",
            "Automations for follow-ups and reminders",
          ],
        },
        {
          label: "Good to know",
          items: [
            "Pro ($39.99/month) + AI from $15/month",
            "Priced on usage, so you only pay for what it handles",
            "Never bundled into a plan you didn't ask for",
          ],
        },
      ],
      steps: [] as string[],
      cta: "Ask about AI",
    },
  ],
  extras: {
    headline: "On every plan.",
    label: "// Included",
    kicker: "No setup invoice. No platform cut.",
    items: [
      {
        title: "Hosting and maintenance.",
        text: "Hosting, fixes and small updates like adding a menu item or changing hours are part of the monthly fee.",
      },
      {
        title: "Your domain.",
        text: "You always own it. From $19.99 we'll buy your domain for you, or you can bring your own.",
      },
      {
        title: "Bakers: launch offer.",
        text: "Storefront plus dashboard, normally in Advanced at $29.99, for an early-adopter price of $19 a month while we launch the baker product.",
      },
    ],
  },
  faq: [
    {
      q: "Why is there no setup fee?",
      a: "We'd rather earn your business every month. The build is included; the monthly fee covers hosting, fixes and small updates.",
    },
    {
      q: "What counts as a small update?",
      a: "Things like adding a menu item, changing prices or hours, or swapping a photo. Bigger new features are quoted separately.",
    },
    {
      q: "Is the $19 baker price the Standard plan?",
      a: "No. It's an early-adopter launch price on the baker storefront and dashboard, which normally sits in Advanced at $29.99 a month.",
    },
    {
      q: "What happens if I cancel?",
      a: "Your domain stays yours. If you want to keep the site running yourself, the one-time build option hands over the code.",
    },
  ],
};

/* ----------------------------------------------------------------------------
 * About page
 * --------------------------------------------------------------------------*/

export const about = {
  headline: "A two-person studio.",
  subtext: "Mahmud builds it. Tamanna designs it.\nWe keep it running.",
  label: "// Who we are",
  kicker: "Small team, no hand-offs.",
  people: [
    {
      title: "Mahmud Munna. Build.",
      text: "Founder and developer. Writes every line of React, Next.js and Node behind your system, and handles the fixes after launch.",
    },
    {
      title: "Tamanna. Design & clients.",
      text: "Designs the storefronts and dashboards, and is the person you talk to about what your business needs.",
    },
    {
      title: "Based in Bangladesh.",
      text: "Working with US small businesses remotely. Messages, email, or a quick call when it helps.",
    },
  ],
  beliefsHeadline: "What we believe.",
  beliefsLabel: "// Why SiteKeep",
  beliefsKicker: "Small businesses deserve real software.",
  beliefs: [
    { title: "Systems over brochures.", text: "A pretty page doesn't stop double-bookings. Business logic does." },
    { title: "Affordable, monthly.", text: "A low monthly fee beats a $1,000 invoice you can't justify yet." },
    { title: "No platform cut.", text: "Your orders, your customers, your money. We don't take a slice." },
  ],
};

export const contactPage = {
  headline: "Let's talk.",
  subtext: "Tell us what you sell and how orders come in today.\nWe reply within a day or two.",
};
