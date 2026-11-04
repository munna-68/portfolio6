"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { easings } from "@/lib/easings";
import { useIsDesktop } from "@/lib/hooks";
import { cx } from "@/lib/cx";
import { navItems, menuFlyout } from "@/config/content";
import { usePageTransition } from "@/components/providers/TransitionProvider";
import { useDualLayerScramble } from "@/components/motion/useDualLayerScramble";
import { AnimatedLink } from "@/components/ui/AnimatedLink";
import { Media } from "@/components/ui/Media";

/**
 * Menu panel (reference: HeaderClient flyout).
 * Open:  grid-template-rows 0fr → 1fr (1s expo.inOut); links rise from yPercent 110 (1.4s expo.out,
 *        stagger 0.1) at 50%; meta lines rise (0.5s power2.out, stagger 0.04); images fade in;
 *        captions + status lines scramble; status dots fade in and pulse.
 * Close: clip-path inset(0 0 0 0) → inset(0 0 100% 0), 0.6s expo.inOut, then reset.
 * Hover: row slides x 64 (36 mobile); an accent square follows the hovered row (y with backInOut)
 *        and rotates 90° each time the hovered row changes.
 */
export function Menu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const isDesktop = useIsDesktop();
  const squareSize = isDesktop ? 32 : 20;
  const hoverOffset = isDesktop ? 64 : 36;
  const pathname = usePathname();
  const { navigate, isTransitioning } = usePageTransition();

  const panel = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const rows = useRef<(HTMLDivElement | null)[]>([]);
  const links = useRef<(HTMLAnchorElement | null)[]>([]);
  const meta = useRef<(HTMLElement | null)[]>([]);
  const dotA = useRef<HTMLSpanElement>(null);
  const dotB = useRef<HTMLSpanElement>(null);
  const images = useRef<HTMLDivElement>(null);
  const opened = useRef(false);

  const [hovered, setHovered] = useState<number | null>(null);
  const [indicatorY, setIndicatorY] = useState<number | null>(null);
  const [turns, setTurns] = useState(0);
  const [ready, setReady] = useState(false);
  const lastHovered = useRef<number | null>(null);

  const activeIndex = useMemo(() => {
    const i = navItems.findIndex((n) => (n.href === "/" ? pathname === "/" : pathname === n.href || pathname.startsWith(`${n.href}/`)));
    return i >= 0 ? i : null;
  }, [pathname]);
  const target = hovered ?? (ready ? activeIndex : null);

  const capCenter = useDualLayerScramble<HTMLParagraphElement>({ duration: 0.5 });
  const capFeatured = useDualLayerScramble<HTMLParagraphElement>({ duration: 0.5 });
  const status = useDualLayerScramble<HTMLSpanElement>({ duration: 0.5 });
  const spots = useDualLayerScramble<HTMLSpanElement>({ duration: 0.5 });
  const scrambles = [capCenter, capFeatured, status, spots];

  // Position the indicator on the hovered (or current) row.
  useEffect(() => {
    if (target === null) return setIndicatorY(null);
    const raf = requestAnimationFrame(() => {
      const row = rows.current[target];
      const nav = navRef.current;
      if (!row || !nav) return;
      const r = row.getBoundingClientRect();
      const n = nav.getBoundingClientRect();
      setIndicatorY(r.top - n.top + (r.height - squareSize) / 2);
    });
    return () => cancelAnimationFrame(raf);
  }, [target, squareSize]);

  useEffect(() => {
    if (isOpen) return;
    setHovered(null);
    setIndicatorY(null);
    setTurns(0);
    setReady(false);
    lastHovered.current = null;
    scrambles.forEach((s) => s.kill());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useGSAP(
    () => {
      const el = panel.current;
      if (!el) return;
      tl.current?.kill();
      if (isOpen) {
        opened.current = true;
        tl.current = gsap.timeline();
        gsap.set(el, { clipPath: "none", gridTemplateRows: "0fr" });
        tl.current.to(el, { gridTemplateRows: "1fr", duration: 1, ease: "expo.inOut" });
        const linkEls = links.current.filter(Boolean);
        if (linkEls.length)
          tl.current.fromTo(
            linkEls,
            { yPercent: 110 },
            { yPercent: 0, duration: 1.4, ease: "expo.out", stagger: 0.1, force3D: true },
            "<+50%",
          );
        const metaEls = meta.current.filter(Boolean);
        if (metaEls.length)
          tl.current.fromTo(
            metaEls,
            { yPercent: 110 },
            { yPercent: 0, duration: 0.5, ease: "power2.out", stagger: 0.04, force3D: true },
            "<+25%",
          );
        if (images.current)
          tl.current.fromTo(images.current, { opacity: 0 }, { opacity: 1, duration: 1, ease: "power1.out" }, "<+25%");
        tl.current.add(() => {
          scrambles.forEach((s) => {
            s.kill();
            s.scramble();
          });
        }, "<");
        [dotA.current, dotB.current].forEach((dot) => {
          if (dot)
            tl.current!.to(
              dot,
              { opacity: 1, duration: 0.5, ease: "power2.out", onComplete: () => dot.classList.add("animate-pulse") },
              "<",
            );
        });
        tl.current.add(() => setReady(true), "<+50%");
      } else {
        if (!opened.current) return;
        tl.current = gsap.timeline();
        gsap.set(el, { clipPath: "inset(0% 0% 0% 0%)" });
        tl.current.to(el, {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 0.6,
          ease: "expo.inOut",
          onComplete: () => {
            gsap.set(el, { gridTemplateRows: "0fr", clipPath: "none" });
            [dotA.current, dotB.current].forEach((dot) => {
              if (!dot) return;
              gsap.set(dot, { opacity: 0 });
              dot.classList.remove("animate-pulse");
            });
            if (images.current) gsap.set(images.current, { opacity: 0 });
          },
        });
      }
    },
    { dependencies: [isOpen], scope: panel },
  );

  const go = useCallback(
    (e: MouseEvent, href: string) => {
      e.preventDefault();
      if (isTransitioning) return;
      onClose();
      window.setTimeout(() => navigate(href), 150);
    },
    [isTransitioning, onClose, navigate],
  );

  // Meta lines rise in document order: label, email, people, socials, location.
  const setMeta = (i: number) => (el: HTMLElement | null) => {
    meta.current[i] = el;
  };
  const peopleStart = 2;
  const socialsStart = peopleStart + menuFlyout.people.length;
  const locationIndex = socialsStart + menuFlyout.socials.length;

  return (
    <div className="grid-container">
      <div ref={panel} className="grid bg-surface transition-colors duration-300" style={{ gridTemplateRows: "0fr" }}>
        <div className="overflow-hidden">
          <div className="max-h-[calc(100svh-104px)] overflow-y-auto p-24 lg:max-h-none lg:overflow-visible lg:p-64" data-lenis-prevent>
            <div className="grid-layout gap-y-32">
              <nav ref={navRef} className="relative col-span-12 flex flex-col items-start gap-4 lg:col-span-4" aria-label="Main">
                {indicatorY !== null && (
                  <motion.div
                    className="pointer-events-none absolute left-0 bg-brand"
                    style={{ width: squareSize, height: squareSize }}
                    initial={{ x: -hoverOffset, y: indicatorY, opacity: 0 }}
                    animate={{ x: 0, y: indicatorY, rotate: 90 * turns, opacity: 1 }}
                    transition={{
                      x: { duration: 0.6, ease: easings.power3InOut },
                      y: { duration: 0.6, ease: easings.backInOut },
                      rotate: { duration: 0.6, ease: easings.backInOut },
                      opacity: { duration: 0.15 },
                    }}
                  />
                )}
                {navItems.map((item, i) => {
                  const isActive = i === activeIndex;
                  const isTarget = i === target;
                  return (
                    <div
                      key={item.href}
                      ref={(el) => {
                        rows.current[i] = el;
                      }}
                      className="overflow-x-visible overflow-y-clip"
                    >
                      <motion.div
                        animate={{ x: isTarget ? hoverOffset : 0 }}
                        transition={{ duration: 0.6, ease: easings.power3InOut }}
                        onMouseEnter={() => {
                          if (lastHovered.current !== null && lastHovered.current !== i) setTurns((t) => t + 1);
                          lastHovered.current = i;
                          setHovered(i);
                        }}
                        onMouseLeave={() => setHovered(null)}
                      >
                        <a
                          ref={(el) => {
                            links.current[i] = el;
                          }}
                          href={item.href}
                          onClick={(e) => go(e, item.href)}
                          aria-current={isActive ? "page" : undefined}
                          className={cx(
                            "block py-4 text-h2 transition-colors duration-300",
                            (isActive || i === hovered) && "text-brand",
                          )}
                        >
                          {item.label}
                        </a>
                      </motion.div>
                    </div>
                  );
                })}
              </nav>

              <div className="col-span-12 flex flex-col gap-24 lg:col-span-2 lg:col-start-5">
                <div className="flex flex-col gap-4">
                  <div className="overflow-hidden">
                    <p ref={setMeta(0)} className="text-accent text-foreground-muted transition-colors duration-300">
                      {menuFlyout.contactLabel}
                    </p>
                  </div>
                  <div className="overflow-hidden">
                    <span ref={setMeta(1)} className="block">
                      <AnimatedLink href={`mailto:${menuFlyout.contactEmail}`} className="text-body-sm [overflow-wrap:anywhere] lg:text-body">
                        {menuFlyout.contactEmail}
                      </AnimatedLink>
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  {menuFlyout.people.map((p, i) => (
                    <div key={p.name} className="overflow-hidden">
                      <span ref={setMeta(peopleStart + i)} className="block">
                        <AnimatedLink href={`mailto:${p.email}`} className="text-body-sm [overflow-wrap:anywhere] lg:text-body">
                          {p.name}: {p.role}
                        </AnimatedLink>
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-4">
                  {menuFlyout.socials.map((s, i) => (
                    <div key={s.name} className="overflow-hidden">
                      <span ref={setMeta(socialsStart + i)} className="block">
                        <AnimatedLink href={s.href} external className="text-body-sm [overflow-wrap:anywhere] lg:text-body">
                          {s.name}: {s.handle}
                        </AnimatedLink>
                      </span>
                    </div>
                  ))}
                </div>
                <div className="overflow-hidden">
                  <p ref={setMeta(locationIndex)} className="text-accent-sm text-foreground-muted transition-colors duration-300">
                    {menuFlyout.location}
                  </p>
                </div>
                <div className="mt-auto flex flex-col gap-8">
                  <p className="inline-flex items-start gap-8 text-accent-sm">
                    <span ref={dotA} className="mt-6 inline-block size-8 shrink-0 bg-brand opacity-0" />
                    <span ref={status.ref} className="opacity-0">
                      {menuFlyout.availability}
                    </span>
                  </p>
                  <p className="inline-flex items-start gap-8 text-accent-sm">
                    <span ref={dotB} className="mt-6 inline-block size-8 shrink-0 bg-brand opacity-0" />
                    <span ref={spots.ref} className="opacity-0">
                      {menuFlyout.spots}
                    </span>
                  </p>
                </div>
              </div>

              <div ref={images} className="col-span-5 col-start-8 hidden gap-16 opacity-0 lg:flex">
                <div className="flex flex-1 flex-col gap-8">
                  <a
                    href={menuFlyout.centerImage.href}
                    onClick={(e) => go(e, menuFlyout.centerImage.href)}
                    onMouseEnter={() => capCenter.scramble()}
                    className="block min-h-0 flex-1 overflow-hidden"
                  >
                    <Media slot={menuFlyout.centerImage.slot} className="h-full w-full" imgClassName="zoom-in-image" sizes="20vw" />
                  </a>
                  <p ref={capCenter.ref} className="text-accent-sm transition-colors duration-300">
                    {menuFlyout.centerImage.caption}
                  </p>
                </div>
                <div className="flex flex-1 flex-col gap-8">
                  <a
                    href={menuFlyout.featured.href}
                    onClick={(e) => go(e, menuFlyout.featured.href)}
                    onMouseEnter={() => capFeatured.scramble()}
                    className="block min-h-0 flex-1 overflow-hidden transition-opacity duration-300 hover:opacity-80"
                  >
                    <Media slot={menuFlyout.featured.slot} className="h-full w-full" imgClassName="zoom-in-image" sizes="20vw" />
                  </a>
                  <p ref={capFeatured.ref} className="text-accent-sm transition-colors duration-300">
                    {menuFlyout.featured.caption}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
