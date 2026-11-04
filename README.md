# SiteKeep: sitekeep.studio

Portfolio and pricing site for SiteKeep: custom booking and ordering systems for small businesses.


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
| All copy (home, work, pricing, about, contact) | `config/content.ts` |
| All images (by slot name) | `config/assets.ts` |
| Logo | `HeaderLogo` in `components/layout/Header.tsx` (two stacked words; swap for an SVG) |
| Fonts | `app/layout.tsx` (Inter Tight stands in for Adobe-only aktiv-grotesk; Geist Mono is the reference's mono) |

## Images

See [`IMAGES.md`](IMAGES.md) for which slots still need real photos and what to shoot.
