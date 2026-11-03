# Reference animation breakdown (good-fella.com)

Studied from the live site plus its shipped JS/CSS bundles (minified source read directly, so the
numbers below are the exact values the reference uses, not estimates).

## Stack

| Concern | Reference | This repo |
| --- | --- | --- |
| Framework | Next.js App Router (Turbopack), React 19 | same |
| Styling | Tailwind v4, 1px spacing unit (`--spacing: 0.0625rem`, so `pt-64` = 64px), 12-col grid | same tokens copied |
| Timeline animation | GSAP 3.14 + `@gsap/react` (`useGSAP`), ScrollTrigger, SplitText, ScrambleTextPlugin | same (GSAP 3.15, all plugins now free) |
| Declarative springs/tweens | Framer Motion (`motion.div` with cubic-bezier arrays) | `motion` (Framer Motion's current package) |
| Smooth scroll | Lenis 1.3 (`root`, anchors 1.2s easeInOutCubic) | same |
| Hero / footer ASCII art | Three.js + postprocessing custom `ASCIIEffect` shader | raw WebGL port of the same fragment shader (no Three.js, ~5 KB) |
| Fonts | `aktiv-grotesk` (Adobe Typekit, 300/400/500) + Geist Mono | **Inter Tight** (closest free neo-grotesk) + Geist Mono (Google Fonts) |

Shared easings (`lib/easings.ts` mirrors the reference's table): power3InOut/quartInOut `[0.76,0,0.24,1]`,
expoInOut `[0.87,0,0.13,1]`, expoOut `[0.16,1,0.3,1]`, backOut `[0.34,1.56,0.64,1]`,
backInOut `[0.68,-0.6,0.32,1.6]`, backInOutSubtle `[0.68,-0.3,0.32,1.1]`, power2Out `[0.33,1,0.68,1]`.

## 1. Preloader and page transitions

**Initial preloader** (`data-theme="brand"` full-screen accent panel, z 10000):
- Four 16px foreground squares in a 70×16 clipped strip. Each square `fromTo x: (i-1)*18 → 18i-16, rotate 0 → 90`,
  `0.5s expo.inOut`, chained `">-25%"` so they tumble in one after another like dominoes (transform-origin bottom right).
- Under it, "LOADING" written with the ScrambleText `revealMode` (0.7s; characters type in through random glyphs,
  accent-coloured while scrambling, then settle to foreground).
- At t = 1.625s the whole panel exits with a **diagonal clip-path wipe**: a 1.05s `expo.inOut` tween drives
  `polygon(0% 100%, p% 0%, 100% 0%, 100% 100%)` then `polygon(0% 100%, 100% q%, 100% 100%)` so the panel is sliced away
  from the bottom-left corner. Content fades out (0.28s power3.out) at t = 1.765s.
- At 90% of the wipe the phase flips to `revealing`; 200ms later `hidden`. Scroll is locked (Lenis stopped +
  `html.scroll-locked`) until then.
- **Page-enter orchestration:** 250ms after the preloader starts revealing, every registered entrance animation
  fires, sorted by priority (header = 0, hero ASCII = 0, hero copy = 1), with +0.08s between priority groups.

**Hero entrance** (priority 1, delayed by `ASCII delay` = 0.35s on ≥ md):
- Headline: **block-wipe line reveal**. Lines are measured; each line gets two absolutely-positioned rects
  (accent, then foreground). Per line (stagger 0.15s): accent rect `scaleX 0→1` (0.45s power3.inOut, origin left),
  foreground rect same at +0.1s, text becomes visible at +0.5s, origins flip to right, foreground rect `scaleX→0` at
  0.5s and accent rect at 0.6s.
- Subtext: SplitText lines with mask, `y 100%→0`, 0.8s power3.out, stagger 0.05, at +0.15s.
- CTAs / logos: `opacity 0, y 20 → 1, 0`, 0.6s / 0.5s power3.out, stagger 0.08.
- Header slides back in (`header-hidden` removed → `transform 0.4s ease-out-back`).
- ASCII portrait: progress 0→1 over 3.5s power3.out (typewriter radial reveal from origin 0.2/0.65), colour sweep
  starts 0.15s later.

**Navigation transition** (`PageTransitionProvider`, phases `idle → entering → holding → exiting → idle`):
- `entering` (1300ms): a 200vmax accent square, anchored at the bottom, rotates from `-90deg` to `0` around
  `50vw 100%` (1s ease-in-out-quart) — it swings up from the left like a door. The page behind gets a
  `backdrop-filter: blur(10px)` + 25% dark tint (1s). Header hides. Four 16px dark squares slide up into view in the
  centre (`translateY 110% → 0`, 350ms easeOutCubic, delay 650ms + 60ms × i).
- `holding`: route changes, scroll jumps to top, pivot moves to the right edge (`150vw 100%`).
- `exiting` (1200ms): the square keeps rotating to `90deg` around the right-bottom corner (1s, 0.1s delay) and leaves
  to the right; the loader squares slide up and out (`-110%`, 60ms stagger); blur clears (0.6s, 0.3s delay); the new
  page's entrance animations fire.

## 2. Menu

- Toggle button: "MENU / CLOSE" label stack slides `translateY(calc(-1em - 2px))` (300ms ease-out); the two 2px
  burger bars rotate to ±45° (250ms ease-out). Logo swaps word (stacked logos `translateY(-26px)`, 500ms ease-out).
- Header bar padding animates `0 → 64px` (desktop) / 24px (mobile) while open; a full-screen `bg-black/30 +
  backdrop-blur-sm` scrim fades in (500ms ease-out). Lenis stops.
- **Open** (GSAP timeline): panel is a CSS grid whose `grid-template-rows` tweens `0fr → 1fr` (1s expo.inOut) — the
  panel grows downward. At 50% of that, nav links rise from `yPercent 110` (1.4s expo.out, stagger 0.1). At +25%,
  contact/meta lines rise (0.5s power2.out, stagger 0.04). At +25% the image column fades in (1s power1.out), image
  captions and status lines run the dual-layer scramble, status dots fade in and start pulsing.
- **Hover:** link moves `x: 64` (desktop) / 36 (mobile), 0.6s power3.inOut, and turns accent. An accent square
  (32/20px) flies to the hovered row: `x` slides in from -64 (power3.inOut 0.6s), `y` follows with **backInOut**
  (overshoots), and it **rotates +90° every time you move to a different row**. The current page's link is accent
  and shows the square once the open animation is half done.
- **Click a different item:** menu closes immediately, then 150ms later the page transition starts.
- **Close:** `clipPath inset(0 0 0 0) → inset(0 0 100% 0)` over **0.6s expo.inOut** (the panel is sliced upward
  from the bottom, content stays in place), then everything resets (`grid-template-rows: 0fr`, clip-path none,
  pulse removed). Escape and scrim click also close.
- **Mobile (< 1024px):** single column; image column hidden; header padding 24px; square 20px, hover offset 36px.

## 3. Navbar scroll behaviour

- Threshold: `scrollY > 50` → `scrolled`. The bar's horizontal padding animates `0 → 16px` and its background
  `transparent → surface` with `transition: padding, background-color, color 500ms ease-out`. So it insets and
  becomes a floating bar.
- The header's `data-theme` follows whichever `[data-page-builder-section]` is under its top edge, so it flips
  light/dark as sections pass.
- Hides (`translateY(-100%)`, 0.4s ease-in-out-quart; returns with 0.4s ease-out-back) when the footer reaches
  10% of the viewport.
- **Note:** the reference's scrolled bar is an opaque `bg-surface` (#333 / #d5d5d5), not frosted glass. You asked
  for frosted glass, so this build uses a translucent surface + `backdrop-filter: blur(16px) saturate(140%)` + 1px
  border with the reference's exact 50px threshold and 500ms ease-out timing. Toggle `--header-glass` in
  `app/globals.css` to switch to the reference's solid bar.

## 4. Text animations

| Effect | Where | Mechanics |
| --- | --- | --- |
| Block-wipe line reveal (`AnimatedHeadline`) | Every h1/h2 section headline, FAQ title, contact headings | see hero above. Scroll variant triggers at `top bottom`, once. |
| Line mask rise (`AnimatedSubtext`) | Hero subtext | SplitText lines + mask, 0.8s power3.out, stagger 0.05 |
| ScrambleText (single) | "LOADING", stat card captions (on hover), Indexed-grid titles, FAQ questions | GSAP ScrambleTextPlugin with the reference's 70-char ramp, `revealDelay 0.1`, two passes: scramble to random glyphs in accent, then resolve to text. `revealMode` starts from blanks (typewriter). |
| Dual-layer scramble (per line) | Buttons (hover), work titles (scroll `top 95%` + hover), menu captions/status | splits measured lines into fixed-size spans, 0.08s stagger per line |
| ScrambleGroup | Indexed grid, FAQ | fires child scrambles at `top 85%` with 0.08s stagger |
| Rolling digits (`RollerNumber`) | Stat cards | 3 stacked 0–9 columns per digit, `y -10em → -(20+d)em`, 2s expo.inOut, 0.1s stagger right-to-left, trigger `top bottom` |
| Accordion lines | FAQ answers | SplitText lines `yPercent 110 → 0`, 0.6s expo.out, stagger 0.15 |

## 5. Selected Work

- Desktop: 12-col grid. Left `grid-span-3` column is `sticky top-header` (height `100vh - header`): headline
  (block wipe), copy, a **thumbnail nav** (16:9, 128px wide, inactive at 40% opacity), "View all" button.
  Right `grid-span-8 start-5`: stacked 16:10 project cards, 64px gap.
- Active project tracked with IntersectionObserver (threshold 0.5, rootMargin -20% top/bottom). An 8px accent
  square sits next to the active thumbnail and moves between thumbnails with a shared-layout (FLIP) animation
  (0.8s backInOutSubtle) and rotates 90° on each change.
- Clicking a thumbnail Lenis-scrolls the card to viewport centre (0.8s, easeOutCubic).
- **Inner parallax:** each card's media is scaled 1.3 and scrubbed `yPercent -15 → 15` from `top bottom` to
  `bottom top` (desktop only).
- Hover: media zooms `scale 1.075` (0.6s ease-out-quart); title runs the dual-layer scramble; **custom cursor**
  shows a "VIEW PROJECT" accent pill that pops in (`scale 0→1`, 0.35s back.out(1.7)), follows the pointer with a
  0.7s expo.out lag and tilts with horizontal velocity (max 35°, decays ×0.92/frame).
- Clicking a card runs the page transition to the project / Work page.
- Mobile: plain stacked list (no sticky nav, no parallax, hover zoom 1.05).

## 6. How We Work

- Desktop: a `min-h-[320vh]` track with a `sticky top-0 h-screen` stage (pinned with CSS sticky, not GSAP pin).
  Scroll progress (`start start` → `end end`) maps to a step: first 1/6 is step 0, the rest is split evenly.
- Steps list: active row `opacity 1, x 48`, others `opacity 0.4` (0.8s power3.inOut). A 12px accent square moves to
  the active row (0.8s backInOutSubtle) and rotates +90° each step.
- Image column (aspect 4/5) is a vertical film strip translated `y: -100% × step` (0.8s power3.inOut).
- Clicking a step Lenis-scrolls to that step's scroll position (0.2s).
- Mobile: no pinning; list of steps each with its image.

## 7. Smooth scroll and other scroll effects

- Lenis root instance; anchors 1.2s easeInOutCubic. Stopped during preloader, menu and transitions.
- Hero content pushes down `yPercent 35` scrubbed while the hero scrolls away.
- Stat cards rise `yPercent 25, opacity 0 → 0, 1` (1s expo.out, stagger 0.1) at `top bottom`. Hover: accent
  square pops (rotate -90→0, scale 0→1, backOut 0.5s), caption slides `x 24` and scrambles.
- Indexed grid: same hover square + 28px slide.
- FAQ: height `0 → auto` 0.8s expo.inOut, plus icon rotates -180° and its vertical bar fades.
- Buttons: arrow square slides in from the left (rotate -45→0, scale 0→1), label slides by its own width, right
  square leaves (700ms ease-power4-in-out), label scrambles.
- Links: two-layer underline swap (700ms `cubic-bezier(0.625,0.05,0,1)`, 300ms delay).
- Body theme follows the first section (`SyncBodyTheme`); each section sets `data-theme` light/dark.

## 8. Accent

The reference uses accent for: preloader panel, transition square, selection, section labels, scramble glyphs,
indicator squares, primary buttons, cursor pill, block-wipe first rect, ASCII art tint. All of these read one
token, `--accent` in `app/globals.css` (and `config/site.ts` for the WebGL tint).

## Not replicated / simplified

- Three.js ASCII pipeline is ported to raw WebGL with the same shader logic (reveal, colour sweep, gooey cursor
  reveal, depth parallax); the click-ripple easter egg is omitted. The depth-parallax strength multiplier isn't
  readable from the minified source, so it's an estimate.
- Footer ASCII reveal uses the hero's 3.5s power3.out tween; the reference drives it with its own 3s rAF curve.
- Work page: the reference's horizontal project slider is replaced with a simple grid (only the transition into
  it was in scope). Project and Services/About/Contact pages are placeholders so links have a destination.
- Header CTA links to /contact; the reference opens a Cal.com booking modal. Newsletter popup, analytics,
  tab-title message and credits easter egg are out of scope.
