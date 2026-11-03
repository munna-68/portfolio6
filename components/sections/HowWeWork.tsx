"use client";

import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { easeOutCubic, easings } from "@/lib/easings";
import { getLenis } from "@/lib/scroll";
import { process } from "@/config/content";
import { AnimatedHeadline } from "@/components/motion/AnimatedHeadline";
import { Media } from "@/components/ui/Media";

const FIRST = 1 / 6; // first sixth of the track holds step 0, the rest is split evenly

/**
 * How We Work (reference: AnimatedListSectionClient, "standard" variant).
 * A 320vh track with a sticky full-height stage. Scroll progress selects the step; the active
 * row fades to 1 and slides 48px, a 12px accent square follows it (backInOutSubtle) turning 90°
 * per step, and the 4:5 image strip translates by -100% per step (0.8s power3.inOut).
 */
export function HowWeWork() {
  const track = useRef<HTMLDivElement>(null);
  const rows = useRef<(HTMLDivElement | null)[]>([]);
  const [step, setStep] = useState(0);
  const [turns, setTurns] = useState(0);
  const [squareY, setSquareY] = useState(0);
  const steps = process.steps;

  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const n = steps.length;
    const next = p < FIRST ? 0 : Math.min(Math.floor(((p - FIRST) / (1 - FIRST)) * (n - 1)) + 1, n - 1);
    if (next !== step) {
      setStep(next);
      setTurns((t) => t + 1);
    }
  });

  useLayoutEffect(() => {
    const measure = () => {
      const row = rows.current[step];
      const first = rows.current[0];
      if (row && first) setSquareY(row.getBoundingClientRect().top - first.getBoundingClientRect().top);
    };
    measure();
    const raf = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(raf);
  }, [step]);

  const goTo = (i: number) => {
    const el = track.current;
    const lenis = getLenis();
    if (!el || !lenis) return;
    const top = window.scrollY + el.getBoundingClientRect().top;
    const range = el.scrollHeight - window.innerHeight;
    const at = i === 0 ? FIRST / 2 : FIRST + ((1 - FIRST) / (steps.length - 1)) * (i - 0.5);
    lenis.scrollTo(top + at * range, { duration: 0.2, easing: easeOutCubic });
  };

  return (
    <section data-section data-theme="light" className="bg-background pt-64 pb-64 text-foreground lg:pt-128 lg:pb-128">
      {/* Desktop: pinned stepper */}
      <div ref={track} className="relative hidden min-h-[320vh] py-64 lg:block lg:py-128">
        <div className="sticky top-0 flex h-screen items-center">
          <div className="grid-container">
            <div className="grid-layout">
              <div className="col-span-8 col-start-3 grid-subgrid">
                <div className="col-span-8 mb-64 flex items-end justify-between">
                  <AnimatedHeadline as="h2" trigger="scroll">
                    {process.headline}
                  </AnimatedHeadline>
                  <span className="section-label">{process.label}</span>
                </div>
                <div className="col-span-8 flex">
                  <div className="flex flex-col justify-center lg:flex-[1.1] lg:pr-[10%]">
                    <div className="relative space-y-48">
                      <motion.div
                        className="absolute top-8 left-[28px] z-10 h-12 w-12 bg-brand"
                        animate={{ y: squareY, rotate: 90 * turns }}
                        transition={{ duration: 0.8, ease: easings.backInOutSubtle }}
                      />
                      {steps.map((s, i) => {
                        const isActive = i === step;
                        return (
                          <motion.div
                            key={s.title}
                            ref={(el) => {
                              rows.current[i] = el;
                            }}
                            data-active={isActive}
                            className="flex cursor-pointer items-start gap-16 pl-16"
                            onClick={() => goTo(i)}
                            initial={false}
                            animate={{ opacity: isActive ? 1 : 0.4, x: isActive ? 48 : 0 }}
                            transition={{ duration: 0.8, ease: easings.power3InOut }}
                          >
                            <span className="mt-4 font-mono text-body text-foreground-muted">{String(i + 1).padStart(2, "0")}</span>
                            <div className="flex-1">
                              <h3 className="mb-8 text-h4">{s.title}</h3>
                              <p className="text-body text-foreground-muted">{s.text}</p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="relative aspect-[4/5] flex-1 overflow-hidden">
                    <motion.div
                      className="flex h-full flex-col"
                      animate={{ y: `${-100 * step}%` }}
                      transition={{ duration: 0.8, ease: easings.power3InOut }}
                    >
                      {steps.map((s) => (
                        <Media key={s.title} slot={s.slot} sizes="30vw" className="h-full w-full flex-shrink-0" />
                      ))}
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: stacked steps */}
      <div className="grid-container py-64 lg:hidden">
        <div className="mb-32">
          <AnimatedHeadline as="h2" trigger="scroll" wrapperClassName="mb-16">
            {process.headline}
          </AnimatedHeadline>
          <span className="section-label">{process.label}</span>
        </div>
        <div className="space-y-48">
          {steps.map((s, i) => (
            <div key={s.title} className="space-y-16">
              <div className="flex gap-16">
                <div className="flex items-start gap-12">
                  <div className="mt-8 h-12 w-12 bg-brand" />
                  <span className="mt-4 font-mono text-body-sm text-foreground-muted">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div className="flex-1">
                  <h3 className="mb-8 text-h4">{s.title}</h3>
                  <p className="text-body text-foreground-muted">{s.text}</p>
                </div>
              </div>
              <Media slot={s.slot} sizes="100vw" className="aspect-[4/5]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
