"use client";

import { useEffect, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion, useIsoLayoutEffect } from "@/lib/hooks";
import { setScrollLocked } from "@/lib/scroll";
import { usePreloader } from "@/components/providers/PreloaderProvider";
import { useScrollLock } from "@/components/providers/ScrollLock";
import { ScrambleText, type ScramblePlay } from "@/components/motion/ScrambleText";
import { cx } from "@/lib/cx";

/** Diagonal wipe: slices the panel away from the bottom-left corner as p goes 0 → 1. */
function wipe(p: number) {
  if (p <= 0) return "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";
  if (p >= 1) return "polygon(0% 100%, 0% 100%, 0% 100%)";
  if (p <= 0.5) return `polygon(0% 100%, ${p * 200}% 0%, 100% 0%, 100% 100%)`;
  return `polygon(0% 100%, 100% ${(p - 0.5) * 200}%, 100% 100%)`;
}

/**
 * First-load preloader (reference timings): four squares tumble in like dominoes
 * (0.5s expo.inOut each, overlapping 25%) while "LOADING" types in through scrambled glyphs;
 * at 1.625s the accent panel is wiped away diagonally (1.05s expo.inOut).
 */
export function Preloader() {
  const { phase, setPhase, isInitialLoad } = usePreloader();
  const panel = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const squares = useRef<(HTMLDivElement | null)[]>([]);
  const playLabel = useRef<ScramblePlay | null>(null);
  const active = isInitialLoad && phase !== "hidden";

  useScrollLock("preloader", active);

  useIsoLayoutEffect(() => {
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    setScrollLocked(true);
  }, []);

  useEffect(() => {
    if (phase === "hidden") setScrollLocked(false);
  }, [phase]);

  useGSAP(
    () => {
      if (!isInitialLoad || phase !== "loading") return;
      if (prefersReducedMotion()) {
        setPhase("revealing");
        return;
      }
      let tl: gsap.core.Timeline | null = null;
      const start = () => {
        if (!playLabel.current) return requestAnimationFrame(start);
        tl = gsap.timeline();
        playLabel.current();
        squares.current.filter(Boolean).forEach((sq, i) => {
          tl!.fromTo(
            sq,
            { x: i === 0 ? -16 : (i - 1) * 18, rotate: 0 },
            { x: 18 * i - 16, rotate: 90, duration: 0.5, ease: "expo.inOut", immediateRender: false },
            i === 0 ? 0 : ">-25%",
          );
        });
        const at = 1.625;
        tl.to(content.current, { opacity: 0, duration: 0.28, ease: "power3.out" }, at + 0.14);
        const progress = { value: 0 };
        let flagged = false;
        tl.to(
          progress,
          {
            value: 1,
            duration: 1.05,
            ease: "expo.inOut",
            onUpdate: () => {
              if (panel.current) panel.current.style.clipPath = wipe(progress.value);
              if (!flagged && progress.value >= 0.9) {
                flagged = true;
                setPhase("revealing");
              }
            },
          },
          at,
        );
      };
      const id = window.setTimeout(start, 100);
      return () => {
        window.clearTimeout(id);
        tl?.kill();
      };
    },
    { dependencies: [isInitialLoad, phase] },
  );

  if (!isInitialLoad || phase === "hidden") return null;

  return (
    <div
      ref={panel}
      data-theme="brand"
      aria-hidden="true"
      className={cx("fixed inset-0 z-[10000] flex items-center justify-center bg-background", phase === "revealing" && "pointer-events-none")}
    >
      <div ref={content} className="flex flex-col items-center gap-4">
        <div className="relative overflow-x-clip overflow-y-visible" style={{ width: 70, height: 16 }}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              ref={(el) => {
                squares.current[i] = el;
              }}
              className="absolute top-0 left-0 bg-foreground"
              style={{ width: 16, height: 16, transform: "translateX(-16px)", transformOrigin: "bottom right" }}
            />
          ))}
        </div>
        <div className="overflow-hidden text-accent-sm text-foreground">
          <ScrambleText
            revealMode
            duration={0.7}
            firstColorClass="scramble-white"
            onReady={(play) => {
              playLabel.current = play;
            }}
          >
            LOADING
          </ScrambleText>
        </div>
      </div>
    </div>
  );
}
