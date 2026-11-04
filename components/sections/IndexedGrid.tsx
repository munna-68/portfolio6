"use client";

import { motion } from "motion/react";
import { useRef, useState } from "react";
import { easings } from "@/lib/easings";
import { indexedGrid } from "@/config/content";
import { AnimatedHeadline } from "@/components/motion/AnimatedHeadline";
import { ScrambleGroup } from "@/components/motion/ScrambleGroup";
import { ScrambleText, type ScramblePlay } from "@/components/motion/ScrambleText";

/**
 * "What's in a landmark" grid (reference: IndexedGridSectionClient, standard variant).
 * Titles type in through scrambled glyphs as a group (top 85%, 0.08s apart). Hover: accent square
 * pops in, the title slides 28px and re-scrambles.
 */
export type IndexedGridData = {
  headline: string;
  label: string;
  kicker: string;
  items: { title: string; text: string }[];
};

export function IndexedGrid({
  data = indexedGrid,
  theme = "light",
}: { data?: IndexedGridData; theme?: "light" | "dark" } = {}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const plays = useRef<(ScramblePlay | null)[]>([]);

  return (
    <section data-section data-theme={theme} className="bg-background pt-64 pb-64 text-foreground lg:pt-128 lg:pb-128">
      <div className="grid-container">
        <div className="grid-layout mb-48 lg:mb-64">
          <div className="col-span-12 flex flex-col gap-16 lg:flex-row lg:items-end lg:justify-between">
            <AnimatedHeadline as="h2" trigger="scroll" className="lg:max-w-1/2">
              {data.headline}
            </AnimatedHeadline>
            <span className="section-label">{data.label}</span>
          </div>
          <div className="col-span-12 mt-32 flex items-center gap-8">
            <div className="h-12 w-12 bg-brand" />
            <span className="text-accent-sm uppercase">{data.kicker}</span>
          </div>
        </div>
        <ScrambleGroup stagger={0.08} start="top 85%">
          <div className="grid-layout">
            {data.items.map((item, i) => {
              const isHovered = hovered === i;
              return (
                <div
                  key={item.title}
                  className="col-span-12 md:col-span-6 lg:col-span-4"
                  onMouseEnter={() => {
                    setHovered(i);
                    plays.current[i]?.();
                  }}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div className="relative flex items-center pt-24 pb-16 lg:pt-32 lg:pb-20">
                    <motion.span
                      aria-hidden="true"
                      className="absolute top-1/2 left-0 -mt-6 hidden size-12 bg-brand lg:block"
                      initial={false}
                      animate={{ rotate: isHovered ? 0 : -90, scale: isHovered ? 1 : 0 }}
                      transition={{ duration: 0.5, ease: easings.backOut }}
                    />
                    <motion.h3
                      className="text-accent uppercase"
                      animate={{ x: isHovered ? 28 : 0 }}
                      transition={{ duration: 0.5, ease: easings.power3Out }}
                    >
                      <ScrambleText
                        duration={0.5}
                        revealMode
                        onReady={(play) => {
                          plays.current[i] = play;
                        }}
                      >
                        {item.title}
                      </ScrambleText>
                    </motion.h3>
                  </div>
                  <div className="h-px w-full bg-border" />
                  <p className="pt-16 pb-24 text-body text-foreground-muted lg:max-w-2/3 lg:pt-20 lg:pb-32">{item.text}</p>
                </div>
              );
            })}
          </div>
        </ScrambleGroup>
      </div>
    </section>
  );
}
