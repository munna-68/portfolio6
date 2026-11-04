# SiteKeep: image checklist

Every image is wired by slot name in [`config/assets.ts`](config/assets.ts). To swap one, drop the file in
`public/images/…` and change that slot's `src`, `width` and `height`. Components never hard-code images.

## Still needed (placeholders)

These slots still point at the template's demo images on another studio's CDN. Replace them before launch.

| Slot | Where it shows | Shape | What to put there |
| --- | --- | --- | --- |
| `process-1` | Home → "How it works", step 1: *Tell us how you take orders* | 4:5 portrait, ≥1600×2000 | A phone showing a messy Instagram DM or text thread with order requests. That's the "before" picture. |
| `process-2` | Step 2: *We build the system* | 4:5 portrait | Mahmud at the laptop with code or a booking flow on screen, or a close crop of the Bake House box builder on a laptop. |
| `process-3` | Step 3: *You try it, we tune it* | 4:5 portrait | A hand holding a phone clicking through a demo (the Petal & Crumb estimate screen works well), or Tamanna reviewing a design. |
| `process-4` | Step 4: *We keep it running* | 4:5 portrait | The Bake House kitchen dashboard on a tablet or laptop, or a "live site" shot of madysenspetcare.com on a phone. |

> **Footer ASCII:** the two halves of Michelangelo's "Creation of Adam" hands from the template are now served
> locally from `public/images/footer/`, so the ASCII effect renders. The painting is public domain, but the
> cut-outs came from the template author's site. Swap in your own pair of transparent cut-outs when you can,
> e.g. Mahmud on the left and Tamanna on the right (~800×1120 each).

## Replace when you can (working stand-ins)

These slots already have real files. They're usable, but a purpose-made version would look better.

| Slot | Current file | Better version |
| --- | --- | --- |
| `hero-ascii` | `brand/hero-booking.webp`: a phone running a booking calendar with a "Deposit paid" card, drawn in code | A proper render of the same idea, 800×1160, **transparent background**. High contrast helps, because bright areas become dense glyphs. A real screenshot of the Madysen's or Bake House booking screen inside a phone frame works well. |
| `hero-ascii-depth` | `brand/hero-booking-depth.webp` | Grayscale depth map the same size as `hero-ascii` (white = closest to the viewer). Optional: delete the slot's `depthSrc` use to turn off the parallax. |
| `hero-ascii-mobile` | `brand/hero-booking-mobile.webp` | The same image at 400px wide. |
| `stats-portrait` | `brand/card-front.webp` (your lanyard card) | A real photo of Mahmud and Tamanna together, portrait, ≥1200×1800. |
| `menu-center` | `brand/card-back.webp` ("A two-person studio") | A candid photo of the two of you working, portrait. |
| `contact-photo` | `brand/about-abstract.jpg` (wireframe sketch) | A 16:9 desk shot: laptop with a SiteKeep build open, phone beside it. |
| `about-system` | `work/studio-system.webp` ("YourBrand" illustration) | A 16:9 collage of 3 or 4 real builds (Madysen's, Kennedi's, Bake House, Petal & Crumb) on devices. |
| `work-*` covers | Screenshots from portfolio4, 1200×800 | Fine as they are. Re-export at 2400×1500 for sharper retina displays. |

## Nice to add

- **LudaVia** (AI advisor prototype for Tia Garland): a 16:10 screenshot, if you're allowed to show it. Add it to `projects` in `config/content.ts` with a new `work-ludavia` slot.
- **New baker demos**: each rebranded Bake House copy needs a 16:10 cover plus four 1280×800 feature screenshots, matching `public/images/cases/bakehouse/`.
- **Open Graph image** (`public/images/og-image.jpg`, 1200×630): a simple text card is in place now. A designed version with a device mockup would get more clicks when the link is shared on Facebook or Instagram.

## Already done

- Favicons and web manifest, copied from portfolio4.
- All ten project covers and 28 case-study screenshots (`public/images/work`, `public/images/cases`).
