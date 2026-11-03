"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePageTransition } from "@/components/providers/TransitionProvider";
import { usePrefersReducedMotion } from "@/lib/hooks";

/** The 200vmax accent square that swings across on navigation (all motion is CSS, see globals.css). */
export function PageTransitionSquare() {
  const { phase } = usePageTransition();
  const reduced = usePrefersReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || reduced) return null;
  return createPortal(<div data-phase={phase} className="page-transition-square" />, document.body);
}

/** Four small squares that rise into the centre while the square covers the screen, then rise out. */
export function PageTransitionLoader() {
  const { phase } = usePageTransition();
  const reduced = usePrefersReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted || reduced) return null;

  const moving = phase === "entering" || phase === "exiting";
  const style = (i: number) => ({
    width: 16,
    height: 16,
    backgroundColor: "#141314",
    transform:
      phase === "entering" || phase === "holding" ? "translateY(0%)" : phase === "exiting" ? "translateY(-110%)" : "translateY(110%)",
    transitionProperty: "transform",
    transitionDuration: moving ? "350ms" : "0ms",
    transitionTimingFunction: "cubic-bezier(0.215, 0.61, 0.355, 1)",
    transitionDelay: moving ? `${phase === "entering" ? 650 + 60 * i : 60 * i}ms` : "0ms",
    willChange: moving ? "transform" : undefined,
  });

  return createPortal(
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[10001] flex items-center justify-center"
      style={{ visibility: phase === "idle" ? "hidden" : "visible" }}
    >
      <div className="flex gap-[2px] overflow-hidden">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={style(i)} />
        ))}
      </div>
    </div>,
    document.body,
  );
}
