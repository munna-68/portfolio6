# Portfolio

Next.js 16 · React 19 · Tailwind v4 · GSAP 3.15 (ScrollTrigger, SplitText, ScrambleText) · Lenis · Motion.
Motion system rebuilt from good-fella.com. See `docs/animation-breakdown.md` for every timing and easing.

```bash
npm install
npm run dev
```

## What to edit

| What | Where |
| --- | --- |
| Accent colour | `app/globals.css` → `--accent` (one value drives everything, including the ASCII tint) |
| Navbar style once scrolled | `config/site.ts` → `headerStyle: "glass" \| "solid"`, `headerScrollThreshold` |
| All copy (marked `PLACEHOLDER`) | `config/content.ts` |
| All images (by slot name) | `config/assets.ts` |
| Logo | `HeaderLogo` in `components/layout/Header.tsx` (two stacked words; swap for an SVG) |
| Fonts | `app/layout.tsx` (Inter Tight stands in for Adobe-only aktiv-grotesk; Geist Mono is the reference's mono) |

## Image slots to replace

| Slot | Used in | Shape |
| --- | --- | --- |
| `hero-ascii` | Hero ASCII portrait (transparent PNG works best) | 665×1071 |
| `hero-ascii-depth` | Depth map for the portrait's mouse parallax (white = near) | same as `hero-ascii` |
| `hero-ascii-mobile` | Smaller portrait for phones | same aspect |
| `hero-teaser` | "Just launched" card, hero bottom-right | 16:9 |
| `stats-portrait` | First card in the stats row | portrait |
| `process-1` … `process-4` | How We Work image strip | shown 4:5 |
| `work-1` … `work-5` | Selected Work, Work page, project pages | shown 16:10 |
| `menu-center`, `menu-featured` | Menu flyout images (desktop) | any, cropped |
| `contact-photo` | "Start a project" section | shown 16:9 |
| `footer-ascii-left`, `footer-ascii-right` | Footer ASCII halves (transparent PNG works best) | ~807×1117 |

All current URLs are hotlinked from the reference's CDN and must be replaced before going live.
No section on the reference landing page uses video; `Media` is image-only.
