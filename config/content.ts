/**
 * All site copy lives here. Every string is PLACEHOLDER text written to match the
 * reference's headline/paragraph lengths (line counts drive the text animations).
 * Search for "PLACEHOLDER" to find everything that needs replacing.
 */
import type { AssetSlot } from "./assets";

// PLACEHOLDER: brand name and two-word logo (the logo swaps word one ↔ word two when the menu opens)
export const brand = {
  name: "Studio Name",
  logoWordOne: "STUDIO",
  logoWordTwo: "NAME",
  email: "hello@example.com",
};

export type NavItem = { label: string; href: string };

// PLACEHOLDER: menu destinations
export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

// PLACEHOLDER: header call to action
export const headerCta = { label: "Let's work together", href: "/contact" };

// PLACEHOLDER: menu flyout content
export const menuFlyout = {
  contactLabel: "Contact",
  contactEmail: "hello@example.com",
  people: [
    { name: "Name", email: "name@example.com" },
    { name: "Partner", email: "partner@example.com" },
  ],
  socials: [
    { name: "Instagram", handle: "@yourhandle", href: "https://instagram.com" },
    { name: "LinkedIn", handle: "@yourhandle", href: "https://linkedin.com" },
    { name: "Github", handle: "@yourhandle", href: "https://github.com" },
  ],
  location: "Working globally",
  availability: "Accepting projects.\nJoin the waitlist.",
  spots: "Only 3 spots left",
  centerImage: { slot: "menu-center" as AssetSlot, caption: "About the studio", href: "/about" },
  featured: { slot: "menu-featured" as AssetSlot, caption: "Latest: Project One", href: "/work/project-one" },
};

// PLACEHOLDER: hero copy
export const hero = {
  headline: "The digital portfolio studio.",
  subtext:
    "I design and build the online presence of brands, products and people. The kind visitors forward and come back to.",
  primaryCta: { label: "See the work", href: "/work" },
  secondaryCta: { label: "Tell me more", href: "/about" },
  trustedBy: ["Client One", "Client Two", "Client Three", "+ Many more"],
  teaser: { label: "Just launched", title: "Project One", href: "/work/project-one", slot: "hero-teaser" as AssetSlot },
};

// PLACEHOLDER: stats cards (numbers with optional prefix/suffix animate as rolling digits)
export const stats = {
  mediaSlot: "stats-portrait" as AssetSlot,
  cards: [
    { value: "$12B+", label: "Combined client market cap" },
    { value: "10M+", label: "People reached by the work" },
    { value: "50+", label: "Projects shipped" },
  ],
};

// PLACEHOLDER: How We Work
export const process = {
  headline: "How I work.",
  label: "// Process",
  steps: [
    {
      title: "Send a brief.",
      text: "One paragraph is enough. I reply within two business days with whether the shape is right for what I do.",
      slot: "process-1" as AssetSlot,
    },
    {
      title: "One conversation.",
      text: "You tell me where the brand is going. I give you a clear picture of the outcome, the timeline and the cost before you commit.",
      slot: "process-2" as AssetSlot,
    },
    {
      title: "Design and build.",
      text: "Custom-coded from the ground up, every project, every time. Engagements run six to twelve weeks. Motion runs through every transition, scroll moment and interaction.",
      slot: "process-3" as AssetSlot,
    },
    {
      title: "Ship.",
      text: "The site lands as the brand's landmark online.",
      slot: "process-4" as AssetSlot,
    },
  ],
};

export type Project = {
  slug: string;
  title: string;
  tags: string[];
  slot: AssetSlot;
};

// PLACEHOLDER: projects (Selected Work + Work page)
export const projects: Project[] = [
  { slug: "project-one", title: "Project One", tags: ["Campaign Site", "Sports"], slot: "work-1" },
  { slug: "project-two", title: "Project Two", tags: ["Marketing Site", "Sports"], slot: "work-2" },
  { slug: "project-three", title: "Project Three", tags: ["Web App", "SaaS", "Animations"], slot: "work-3" },
  { slug: "project-four", title: "Project Four", tags: ["Agency Website", "Portfolio"], slot: "work-4" },
  { slug: "project-five", title: "Project Five", tags: ["Marketing Site", "Animations"], slot: "work-5" },
];

// PLACEHOLDER: Selected Work section
export const selectedWork = {
  headline: "Selected work.",
  text: "Selected sites for consumer, sports and entertainment brands. The work travels.",
  viewAll: { label: "View all", href: "/work" },
};

// PLACEHOLDER: "What's in a ..." indexed grid
export const indexedGrid = {
  headline: "What goes into it.",
  label: "// The build",
  kicker: "Every project, the same standard.",
  items: [
    { title: "Custom code.", text: "Built from scratch so the brand isn't compromised by the platform underneath." },
    { title: "Motion as medium.", text: "Every interaction is part of the brand, not added on top." },
    { title: "Identity end to end.", text: "Your design system and motion principles carry through every breakpoint." },
    { title: "One person, start to end.", text: "The person you talk to is the person writing the code." },
    { title: "Built to last.", text: "Six to twelve weeks to ship, made to stay relevant for years." },
    { title: "Craft and performance.", text: "Award-grade work that holds Core Web Vitals on launch day." },
  ],
};

// PLACEHOLDER: FAQ
export const faq = {
  headline: "Common questions",
  items: [
    {
      q: "How do you work with an existing brand book and design system?",
      a: "I start by living inside the brand book and the design system. Whatever your typography and motion principles already define, I carry through end to end.",
    },
    {
      q: "Who do I actually work with on the project?",
      a: "Me, from the first call to launch day. No hand-offs, no account managers, no juniors behind the curtain.",
    },
    {
      q: "How long does a project take?",
      a: "Most projects ship in six to twelve weeks, depending on scope. You get a clear timeline before anything starts.",
    },
    {
      q: "Do you work with teams outside your time zone?",
      a: "Yes. Most clients are in other time zones. A few overlapping hours a week is all it takes.",
    },
    {
      q: "What happens after launch?",
      a: "You own everything. I stay on for fixes and can support you on a retainer if you want ongoing work.",
    },
  ],
};

// PLACEHOLDER: "Start a project" section
export const contactCta = {
  headline: "Start a project.",
  subheadline: "Book a call or send a message. I read everything.",
  body: ["hello@example.com", "Working with teams worldwide."],
  link: { label: "Get in touch", href: "/contact" },
  secondary: { label: "Book a 15-min call", href: "/contact" },
  note: "One person on every project.",
  slot: "contact-photo" as AssetSlot,
};

// PLACEHOLDER: footer
export const footer = {
  newsletterTitle: "Don't miss out on future updates.",
  newsletterNote: "Unsubscribe anytime.",
  availability: "Accepting projects. Join the waitlist.",
  spots: "Only 3 spots left",
  legal: ["Privacy Policy", "Legal Notice"],
  copyright: "© 2026 Studio Name",
  signoff: "Let the work handle it.",
  wordmark: "Studio Name",
};

// PLACEHOLDER: Work page and generic pages
export const workPage = {
  headline: "Selected craft",
  subtext: "50+ projects shipped.\n500M+ page views delivered.",
};

export const genericPages: Record<string, { headline: string; subtext: string }> = {
  services: { headline: "Services", subtext: "Placeholder page.\nReplace with your own content." },
  about: { headline: "About", subtext: "Placeholder page.\nReplace with your own content." },
  contact: { headline: "Contact", subtext: "hello@example.com\nPlaceholder page." },
};
