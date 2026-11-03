"use client";

import { useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { cx } from "@/lib/cx";
import { usePageEnter } from "@/components/providers/PageEnterProvider";
import { AnimatedHeadline, type AnimatedHeadlineHandle } from "@/components/motion/AnimatedHeadline";
import { AnimatedSubtext, type AnimatedSubtextHandle } from "@/components/motion/AnimatedSubtext";

/** Centered page intro (reference: HeroTextOnly) — block-wipe headline + masked subtext at +0.3s. */
export function HeroTextOnly({ headline, subtext, className }: { headline: string; subtext?: string; className?: string }) {
  const h = useRef<AnimatedHeadlineHandle>(null);
  const s = useRef<AnimatedSubtextHandle>(null);
  const reduced = usePrefersReducedMotion();
  usePageEnter(
    (delay) => {
      const t = delay + 0.3;
      h.current?.reveal(t);
      s.current?.reveal(t + 0.15);
    },
    { priority: 1, skip: reduced },
  );
  return (
    <div className={cx("grid-container", className)}>
      <div className="grid-layout items-center justify-center">
        <div className="col-span-12 flex flex-col items-center gap-16 text-center lg:col-span-10 lg:col-start-2 lg:gap-24">
          <AnimatedHeadline ref={h} as="h1" className="text-foreground" skip={reduced}>
            {headline}
          </AnimatedHeadline>
          {subtext && (
            <AnimatedSubtext ref={s} skip={reduced} className="max-w-2xl text-body text-foreground-muted">
              {subtext}
            </AnimatedSubtext>
          )}
        </div>
      </div>
    </div>
  );
}
