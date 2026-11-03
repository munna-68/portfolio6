"use client";

import { motion } from "motion/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { easeOutCubic, easings } from "@/lib/easings";
import { useIdleGSAP } from "@/lib/useIdleGSAP";
import { getLenis } from "@/lib/scroll";
import { cx } from "@/lib/cx";
import { projects, selectedWork, type Project } from "@/config/content";
import { AnimatedHeadline } from "@/components/motion/AnimatedHeadline";
import { useDualLayerScramble } from "@/components/motion/useDualLayerScramble";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { Media } from "@/components/ui/Media";

/** Project title that scrambles when it scrolls in (top 95%) and on card hover. */
function ProjectTitle({ title, onRegister }: { title: string; onRegister: (play: () => void) => void }) {
  const { ref, scramble } = useDualLayerScramble<HTMLHeadingElement>({ duration: 0.5 });
  const played = useRef(false);
  useEffect(() => onRegister(() => void scramble()), [onRegister, scramble]);
  useIdleGSAP(
    () => {
      if (!ref.current) return;
      played.current = false;
      const st = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: "top 95%",
          onEnter: () => {
            if (played.current) return;
            played.current = true;
            scramble();
          },
        },
      });
      return () => void st.scrollTrigger?.kill();
    },
    { dependencies: [scramble] },
  );
  return (
    <h3 ref={ref} className="text-accent-lg">
      {title}
    </h3>
  );
}

function Tags({ tags, className }: { tags: string[]; className?: string }) {
  return (
    <div className={className}>
      {tags.map((tag, i) => (
        <Fragment key={tag}>
          {i > 0 && <span className="text-foreground-muted">—</span>}
          <span className="text-accent-sm uppercase">[{tag}]</span>
        </Fragment>
      ))}
    </div>
  );
}

/**
 * Selected Work (reference: FeaturedWorkSectionClient).
 * Desktop: sticky left column (headline, copy, thumbnail nav with a FLIP indicator, View all);
 * right column of 16:10 cards whose media is scaled 1.3 and scrubbed yPercent -15 → 15.
 * The active card is tracked with an IntersectionObserver; clicking a thumbnail Lenis-scrolls
 * that card to the viewport centre. Mobile: a plain stacked list.
 */
export function SelectedWork() {
  const [active, setActive] = useState(0);
  const [turns, setTurns] = useState(0);
  const activeRef = useRef(0);
  const scrolling = useRef(false);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const media = useRef<(HTMLDivElement | null)[]>([]);
  const plays = useRef<(() => void)[]>([]);

  useEffect(() => {
    const observers = cards.current.map((card, i) => {
      if (!card) return null;
      const io = new IntersectionObserver(
        (entries) => {
          if (scrolling.current) return;
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.5 && activeRef.current !== i) {
              activeRef.current = i;
              setActive(i);
            }
          });
        },
        { threshold: 0.5, rootMargin: "-20% 0px -20% 0px" },
      );
      io.observe(card);
      return io;
    });
    return () => observers.forEach((io) => io?.disconnect());
  }, []);

  useIdleGSAP(() => {
    if (window.matchMedia("(max-width: 1023px)").matches) return;
    media.current.forEach((el) => {
      if (!el) return;
      gsap.set(el, { scale: 1.3 });
      gsap.fromTo(
        el,
        { yPercent: -15 },
        {
          yPercent: 15,
          ease: "none",
          scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true },
        },
      );
    });
  });

  const goTo = (i: number) => {
    const card = cards.current[i];
    const lenis = getLenis();
    if (!card || activeRef.current === i) return;
    scrolling.current = true;
    setTurns((t) => t + 1);
    activeRef.current = i;
    setActive(i);
    const r = card.getBoundingClientRect();
    const y = window.scrollY + r.top - window.innerHeight / 2 + r.height / 2;
    if (lenis)
      lenis.scrollTo(y, { duration: 0.8, easing: easeOutCubic, onComplete: () => void (scrolling.current = false) });
    else {
      window.scrollTo({ top: y, behavior: "smooth" });
      scrolling.current = false;
    }
  };

  const registerPlay = (i: number) => (play: () => void) => {
    plays.current[i] = play;
  };

  return (
    <section data-section data-theme="dark" className="bg-background pt-64 pb-64 text-foreground lg:pt-128 lg:pb-128">
      {/* Desktop */}
      <div className="hidden py-128 lg:block">
        <div className="grid-container">
          <div className="grid-layout">
            <div className="col-span-3">
              <div className="sticky top-header flex h-[calc(100vh-var(--site-header-height))] flex-col justify-between py-32">
                <div>
                  <AnimatedHeadline as="h2" trigger="scroll" wrapperClassName="mb-24">
                    {selectedWork.headline}
                  </AnimatedHeadline>
                  <p className="whitespace-pre-line text-body text-foreground-muted">{selectedWork.text}</p>
                </div>
                <nav className="flex flex-col items-start gap-8" aria-label="Projects">
                  {projects.map((p, i) => (
                    <button
                      key={p.slug}
                      type="button"
                      onClick={() => goTo(i)}
                      onMouseEnter={() => plays.current[i]?.()}
                      aria-label={`Go to ${p.title}`}
                      aria-current={i === active ? "true" : undefined}
                      className="group relative flex cursor-pointer items-center gap-12"
                    >
                      <Media
                        slot={p.slot}
                        sizes="128px"
                        className={cx("aspect-[16/9] w-128 transition-opacity duration-300", i === active ? "opacity-100" : "opacity-40")}
                      />
                      {i === active && (
                        <motion.div
                          layoutId="featured-work-indicator"
                          className="h-8 w-8 shrink-0 bg-brand"
                          animate={{ rotate: 90 * turns }}
                          transition={{
                            layout: { duration: 0.8, ease: easings.backInOutSubtle },
                            rotate: { duration: 0.8, ease: easings.backInOutSubtle },
                          }}
                        />
                      )}
                    </button>
                  ))}
                </nav>
                <div>
                  <AnimatedButton href={selectedWork.viewAll.href} size="sm" theme="brand">
                    {selectedWork.viewAll.label}
                  </AnimatedButton>
                </div>
              </div>
            </div>
            <div className="col-span-8 col-start-5 flex flex-col gap-64 py-32">
              {projects.map((p: Project, i) => (
                <div
                  key={p.slug}
                  ref={(el) => {
                    cards.current[i] = el;
                  }}
                  className="flex flex-col"
                >
                  <TransitionLink
                    href={`/work/${p.slug}`}
                    className="group relative block aspect-[16/10] overflow-hidden"
                    data-cursor-text="VIEW PROJECT"
                    onMouseEnter={() => plays.current[i]?.()}
                  >
                    <div
                      ref={(el) => {
                        media.current[i] = el;
                      }}
                      className="h-full w-full"
                      style={{ willChange: "transform" }}
                    >
                      <Media slot={p.slot} priority={i === 0} sizes="66vw" className="h-full w-full" imgClassName="zoom-in-image" />
                    </div>
                  </TransitionLink>
                  <div className="mt-16 flex items-start justify-between gap-16">
                    <ProjectTitle title={p.title} onRegister={registerPlay(i)} />
                    <Tags tags={p.tags} className="flex items-center gap-8 text-body text-foreground-muted" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="grid-container py-32 lg:hidden">
        <div className="mb-32">
          <AnimatedHeadline as="h2" trigger="scroll" wrapperClassName="mb-16">
            {selectedWork.headline}
          </AnimatedHeadline>
          <p className="whitespace-pre-line text-body text-foreground-muted">{selectedWork.text}</p>
        </div>
        <div className="flex flex-col gap-32">
          {projects.map((p) => (
            <div key={p.slug} className="flex flex-col">
              <TransitionLink href={`/work/${p.slug}`} className="group relative block aspect-[16/10] overflow-hidden">
                <Media slot={p.slot} sizes="100vw" className="h-full w-full" imgClassName="transition-transform duration-500 group-hover:scale-105" />
              </TransitionLink>
              <div className="mt-16 flex flex-col gap-8">
                <h3 className="text-h5">{p.title}</h3>
                <Tags tags={p.tags} className="flex flex-wrap items-center gap-8 text-accent-sm text-foreground-muted" />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-32">
          <AnimatedButton href={selectedWork.viewAll.href} size="sm" theme="brand">
            {selectedWork.viewAll.label}
          </AnimatedButton>
        </div>
      </div>
    </section>
  );
}
