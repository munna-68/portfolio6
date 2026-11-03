/**
 * Every image on the site is referenced from this file, by slot name.
 * Swap a URL (or a local path such as "/images/hero.png" in /public) to replace an image;
 * component code never hard-codes an image.
 *
 * PLACEHOLDER: all URLs below are hotlinked from the reference site's CDN and must be replaced.
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
  // Hero ASCII portrait (transparent PNG works best; the effect reads luminance + alpha)
  "hero-ascii": {
    src: sanity("c77e38e561aecc789c0f96dd79cc962098b07a03-665x1071.png", "w=800&h=1288&q=90&auto=format"),
    width: 665,
    height: 1071,
    alt: "Portrait rendered as ASCII art",
  },
  // Grayscale depth map for the hero portrait (white = near). Optional: set to null to disable depth parallax.
  "hero-ascii-depth": {
    src: sanity("b7c8eba9f6435c5e27a85fc7f17cc5f3f4333c1c-665x1071.png", "w=800&h=1288&q=90&auto=format"),
    width: 665,
    height: 1071,
    alt: "",
  },
  "hero-ascii-mobile": {
    src: sanity("c77e38e561aecc789c0f96dd79cc962098b07a03-665x1071.png", "w=400&h=644&q=90&auto=format"),
    width: 665,
    height: 1071,
    alt: "Portrait rendered as ASCII art",
  },
  // "Just launched" teaser in the hero's bottom-right corner
  "hero-teaser": {
    src: sanity("9ffc1edd5cf99d75a405c6c125895281b389eb28-1931x1091.jpg"),
    width: 1931,
    height: 1091,
    alt: "Latest project preview",
  },
  // Stats section media card
  "stats-portrait": {
    src: sanity("c7863541ce386e0b47397f3f7aec355f0f0368c6-1600x2400.heif"),
    width: 1600,
    height: 2400,
    alt: "Studio portrait",
  },
  // How We Work: one image per step (4:5 frame)
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
  // Selected Work projects (shown 16:10 on the landing page)
  "work-1": {
    src: sanity("9ffc1edd5cf99d75a405c6c125895281b389eb28-1931x1091.jpg"),
    width: 1931,
    height: 1091,
    alt: "Project one",
  },
  "work-2": {
    src: sanity("08e554af79798c7ce09316be88c0d296ace9ce4a-2250x1500.jpg"),
    width: 2250,
    height: 1500,
    alt: "Project two",
  },
  "work-3": {
    src: sanity("4a67c5fddb677d52f4c76ec3e7a52d2861adc898-3462x2550.jpg"),
    width: 3462,
    height: 2550,
    alt: "Project three",
  },
  "work-4": {
    src: sanity("5d302071b3ef530f3de3528f9f1d3a9678e0643c-3000x2250.jpg"),
    width: 3000,
    height: 2250,
    alt: "Project four",
  },
  "work-5": {
    src: sanity("aaf4d81f4ba2322d94bfd8a2f87981244ade97c1-3000x2250.jpg"),
    width: 3000,
    height: 2250,
    alt: "Project five",
  },
  // Menu flyout images (desktop only)
  "menu-center": {
    src: sanity("c6b897f2873c4b8c2d6f395cf6a5e0e5ed49d9ef-1600x2400.heif"),
    width: 1600,
    height: 2400,
    alt: "About the studio",
  },
  "menu-featured": {
    src: sanity("9ffc1edd5cf99d75a405c6c125895281b389eb28-1931x1091.jpg"),
    width: 1931,
    height: 1091,
    alt: "Featured project",
  },
  // "Start a project" section
  "contact-photo": {
    src: sanity("c6b897f2873c4b8c2d6f395cf6a5e0e5ed49d9ef-1600x2400.heif"),
    width: 1600,
    height: 2400,
    alt: "Studio portrait",
  },
  // Footer ASCII art (two halves, rendered with the same ASCII effect as the hero)
  "footer-ascii-left": {
    src: sanity("22515e3d37993416866dbd2f773d92bae460ab53-807x1117.heif", "w=807&fm=png"),
    width: 807,
    height: 1117,
    alt: "",
  },
  "footer-ascii-right": {
    src: sanity("5867400cb21bbb7ec08f7f5e67bf65431f133133-829x1117.heif", "w=829&fm=png"),
    width: 829,
    height: 1117,
    alt: "",
  },
} satisfies Record<string, ImageAsset>;

export type AssetSlot = keyof typeof assets;
