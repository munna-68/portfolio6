"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { usePageEnter } from "@/components/providers/PageEnterProvider";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { projects } from "@/config/content";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { Media } from "@/components/ui/Media";

/** Work page list. Simplified stand-in for the reference's project slider; cards rise in on page enter. */
export function WorkGrid() {
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const reduced = usePrefersReducedMotion();
  usePageEnter(
    (delay) => {
      const els = cards.current.filter(Boolean);
      gsap.fromTo(els, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.08, delay: delay + 0.5 });
    },
    { priority: 1, skip: reduced },
  );
  return (
    <div className="grid-container">
      <div className="grid-layout gap-y-48">
        {projects.map((p, i) => (
          <div
            key={p.slug}
            ref={(el) => {
              cards.current[i] = el;
            }}
            className="col-span-12 md:col-span-6"
            style={reduced ? undefined : { opacity: 0 }}
          >
            <TransitionLink href={`/work/${p.slug}`} className="group block" data-cursor-text="VIEW PROJECT">
              <Media slot={p.slot} sizes="(min-width: 768px) 50vw, 100vw" className="aspect-[16/10]" imgClassName="zoom-in-image" />
              <div className="mt-16 flex items-start justify-between gap-16">
                <h2 className="text-accent-lg">{p.title}</h2>
                <span className="text-accent-sm text-foreground-muted">{p.tags.map((t) => `[${t}]`).join(" — ")}</span>
              </div>
            </TransitionLink>
          </div>
        ))}
      </div>
    </div>
  );
}
