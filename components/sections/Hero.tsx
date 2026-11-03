"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useIsMdUp, usePrefersReducedMotion } from "@/lib/hooks";
import { hero } from "@/config/content";
import { assets } from "@/config/assets";
import { usePageEnter } from "@/components/providers/PageEnterProvider";
import { AnimatedHeadline, type AnimatedHeadlineHandle } from "@/components/motion/AnimatedHeadline";
import { AnimatedSubtext, type AnimatedSubtextHandle } from "@/components/motion/AnimatedSubtext";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { AnimatedLink } from "@/components/ui/AnimatedLink";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { Media } from "@/components/ui/Media";
import { AsciiImage, type AsciiImageHandle } from "./AsciiImage";

// The ASCII portrait gets a head start of 10% of its 3.5s reveal before the copy enters (md+).
const ASCII_DELAY = 0.35;

export function Hero() {
  const section = useRef<HTMLElement>(null);
  const push = useRef<HTMLDivElement>(null);
  const headline = useRef<AnimatedHeadlineHandle>(null);
  const subtext = useRef<AnimatedSubtextHandle>(null);
  const ctas = useRef<HTMLDivElement>(null);
  const logos = useRef<(HTMLSpanElement | null)[]>([]);
  const teaser = useRef<HTMLDivElement>(null);
  const ascii = useRef<AsciiImageHandle>(null);
  const reduced = usePrefersReducedMotion();
  const mdUp = useIsMdUp();
  const asciiDelay = mdUp ? ASCII_DELAY : 0;

  useGSAP(
    () => {
      if (reduced) return;
      gsap.set([ctas.current, teaser.current, ...logos.current].filter(Boolean), { opacity: 0, y: 20 });
      // Hero content drifts down (yPercent 35) while the hero scrolls away.
      gsap.to(push.current, {
        yPercent: 35,
        ease: "none",
        scrollTrigger: { trigger: section.current, start: "top top", end: "bottom top", scrub: true },
      });
    },
    { scope: section, dependencies: [reduced] },
  );

  usePageEnter(
    (delay) => {
      if (reduced) return ascii.current?.showInstantly();
      ascii.current?.reveal(delay);
    },
    { priority: 0 },
  );

  usePageEnter(
    (delay) => {
      const t = delay + asciiDelay;
      headline.current?.reveal(t);
      subtext.current?.reveal(t + 0.15);
      const tl = gsap.timeline({ delay: t + 0.2 });
      if (ctas.current) tl.to(ctas.current, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 0.1);
      const items = logos.current.filter(Boolean);
      if (items.length)
        tl.to(items, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.08, clearProps: "y,opacity" }, 0.3);
      if (teaser.current)
        gsap.to(teaser.current, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", delay: delay + asciiDelay + 0.5 });
    },
    { priority: 1, skip: reduced },
  );

  const a = assets["hero-ascii"];
  return (
    <section ref={section} data-section data-theme="dark" className="relative min-h-svh overflow-hidden bg-background text-foreground">
      <div ref={push} className="grid-container relative min-h-svh pt-52">
        <div className="grid-layout min-h-[calc(100svh-52px)]">
          <div className="pointer-events-none relative z-10 col-span-12 flex flex-col items-start justify-between pb-16 lg:col-span-7 lg:pb-32">
            <div className="flex flex-col justify-start gap-24 pt-24 lg:mt-auto lg:mb-auto lg:justify-center lg:gap-32 lg:pt-0">
              <AnimatedHeadline ref={headline} as="h1" className="text-foreground" skip={reduced}>
                {hero.headline}
              </AnimatedHeadline>
              <AnimatedSubtext
                ref={subtext}
                skip={reduced}
                className="max-w-xl text-body-sm text-foreground lg:text-body lg:text-foreground-muted"
              >
                {hero.subtext}
              </AnimatedSubtext>
              <div ref={ctas} className="pointer-events-auto">
                <div className="flex flex-row flex-wrap items-center gap-16">
                  <AnimatedButton href={hero.primaryCta.href} size="sm" theme="brand">
                    {hero.primaryCta.label}
                  </AnimatedButton>
                  <AnimatedLink href={hero.secondaryCta.href} className="text-body-sm lg:text-body">
                    {hero.secondaryCta.label}
                  </AnimatedLink>
                </div>
              </div>
            </div>
            <div className="pointer-events-auto mt-32 flex w-full flex-col items-center gap-16 text-center lg:mt-0 lg:flex-row lg:items-center lg:text-left">
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-8 lg:justify-start lg:gap-x-16">
                {hero.trustedBy.map((name, i) => (
                  <span
                    key={name}
                    ref={(el) => {
                      logos.current[i] = el;
                    }}
                    className="text-accent-sm text-foreground-muted transition-colors hover:text-foreground"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute top-[35%] right-0 bottom-0 w-9/10 items-center justify-center overflow-hidden lg:relative lg:inset-auto lg:col-span-5 lg:flex lg:w-auto">
            <AsciiImage
              ref={ascii}
              src={a.src}
              mobileSrc={assets["hero-ascii-mobile"].src}
              depthSrc={assets["hero-ascii-depth"].src}
              cellSize={14}
              parallaxIntensity={0.12}
              revealOrigin={{ x: 0.2, y: 0.65 }}
              alt={a.alt}
            />
          </div>
        </div>

        {/* "Just launched" teaser */}
        <div ref={teaser} className="absolute right-0 bottom-16 z-10 hidden lg:bottom-32 lg:flex">
          <TransitionLink href={hero.teaser.href} className="group flex items-end gap-12" data-cursor-text="VIEW PROJECT">
            <Media
              slot={hero.teaser.slot}
              className="aspect-[16/9] w-120"
              imgClassName="transition-transform duration-500 ease-out group-hover:scale-105"
              sizes="120px"
            />
            <div className="flex flex-col">
              <span className="text-body-sm text-foreground-muted">{hero.teaser.label}</span>
              <span className="text-body text-foreground">{hero.teaser.title}</span>
            </div>
          </TransitionLink>
        </div>
      </div>
    </section>
  );
}
