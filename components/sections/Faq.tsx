"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, SplitText } from "@/lib/gsap";
import { useIsDesktop } from "@/lib/hooks";
import { faq } from "@/config/content";
import { AnimatedHeadline } from "@/components/motion/AnimatedHeadline";
import { ScrambleGroup } from "@/components/motion/ScrambleGroup";
import { ScrambleText } from "@/components/motion/ScrambleText";

const DURATION = 0.8;

/**
 * One accordion row (reference: AccordionClient). Open: height 0 → auto (0.8s expo.inOut),
 * plus icon rotates -180° while its vertical bar fades, answer lines rise out of masks
 * (0.6s expo.out, stagger 0.15). Close reverses the timeline.
 */
function Item({ q, a, isOpen, onToggle, isDesktop }: { q: string; a: string; isOpen: boolean; onToggle: () => void; isDesktop: boolean }) {
  const body = useRef<HTMLDivElement>(null);
  const icon = useRef<SVGSVGElement>(null);
  const bar = useRef<SVGPathElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const split = useRef<SplitText | null>(null);
  const prev = useRef(isOpen);

  useEffect(() => {
    if (!body.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.set(body.current, { height: 0, overflow: "hidden" });
    tl.current = gsap.timeline({ paused: true, defaults: { duration: DURATION, ease: "expo.inOut" } });
    tl.current.to(body.current, { height: "auto" }, 0);
    if (icon.current) tl.current.to(icon.current, { rotation: -180 }, 0);
    if (bar.current) tl.current.to(bar.current, { opacity: 0, duration: DURATION * 0.5, ease: "power2.inOut" }, DURATION * 0.25);
    return () => {
      tl.current?.kill();
      split.current?.revert();
    };
  }, []);

  useEffect(() => {
    if (!tl.current || isOpen === prev.current) return;
    prev.current = isOpen;
    if (isOpen) {
      tl.current.play();
      const p = body.current?.querySelector("p");
      if (p) {
        split.current?.revert();
        split.current = SplitText.create(p, { type: "lines", mask: "lines", linesClass: "split-line" });
        gsap.set(split.current.lines, { yPercent: 110, force3D: true });
        gsap.to(split.current.lines, { yPercent: 0, duration: 0.6, stagger: 0.15, ease: "expo.out", force3D: true });
      }
    } else tl.current.reverse();
  }, [isOpen]);

  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={`group flex w-full cursor-pointer items-start justify-between gap-16 py-24 text-left transition-colors lg:items-center ${
          isOpen ? "text-foreground" : "text-foreground-muted hover:text-foreground"
        }`}
      >
        <span className="text-accent uppercase">
          {isDesktop ? (
            <ScrambleText revealMode multiLine secondColorClass="scramble-inherit">
              {q}
            </ScrambleText>
          ) : (
            q
          )}
        </span>
        <svg ref={icon} className="h-16 w-16 shrink-0" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path ref={bar} d="M8 1V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
          <path d="M1 8H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
        </svg>
      </button>
      <div ref={body}>
        <div className="pb-24 text-body text-foreground-muted lg:max-w-2/3">
          <p>{a}</p>
        </div>
      </div>
    </div>
  );
}

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);
  const isDesktop = useIsDesktop();
  return (
    <section data-section data-theme="dark" className="bg-background py-64 text-foreground lg:py-96">
      <div className="grid-container">
        <div className="grid-layout">
          <div className="sticky top-0 z-10 col-span-12 -mx-(--site-grid-margin) bg-background px-(--site-grid-margin) pt-header pb-32 lg:top-header lg:z-auto lg:col-span-4 lg:mx-0 lg:self-start lg:bg-transparent lg:px-0 lg:pt-32">
            <AnimatedHeadline as="h2" trigger="scroll">
              {faq.headline}
            </AnimatedHeadline>
          </div>
          <div className="col-span-12 mt-48 lg:col-span-6 lg:col-start-6 lg:mt-0">
            <ScrambleGroup stagger={0.08} start="top 85%" className="w-full">
              {faq.items.map((item, i) => (
                <Item
                  key={item.q}
                  q={item.q}
                  a={item.a}
                  isDesktop={isDesktop}
                  isOpen={open === i}
                  onToggle={() => setOpen((o) => (o === i ? null : i))}
                />
              ))}
            </ScrambleGroup>
          </div>
        </div>
      </div>
    </section>
  );
}
