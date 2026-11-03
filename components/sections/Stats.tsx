"use client";

import { motion } from "motion/react";
import { createRef, useMemo, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { easings } from "@/lib/easings";
import { useIsDesktop } from "@/lib/hooks";
import { useIdleGSAP } from "@/lib/useIdleGSAP";
import { stats } from "@/config/content";
import { RollerNumber } from "@/components/motion/RollerNumber";
import { ScrambleText, type ScramblePlay } from "@/components/motion/ScrambleText";
import { Media } from "@/components/ui/Media";

function parseStat(text: string) {
  const m = text.trim().match(/^([€$£¥₹]?[+]?)(\d+)([MBKx%+]*)$/i);
  return m ? { prefix: m[1] ?? "", number: Number.parseInt(m[2], 10), suffix: m[3] ?? "" } : null;
}

/**
 * Stats cards (reference: CardsSectionClient). Cards rise in (yPercent 25, 1s expo.out,
 * stagger 0.1) once the grid's top reaches the viewport bottom; numbers roll (2s, 0.1 stagger).
 * Hover: an accent square pops in (rotate -90→0, scale 0→1, backOut) and the caption slides 24px
 * and scrambles.
 */
export function Stats() {
  const grid = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const plays = useRef<(ScramblePlay | null)[]>([]);
  const triggers = useMemo(() => stats.cards.map(() => createRef<HTMLDivElement>()), []);
  const [hovered, setHovered] = useState<number | null>(null);
  const isDesktop = useIsDesktop();

  useIdleGSAP(() => {
    const els = cards.current.filter(Boolean);
    if (!els.length) return;
    gsap.fromTo(
      els,
      { yPercent: 25, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 1,
        ease: "expo.out",
        stagger: 0.1,
        scrollTrigger: { trigger: grid.current, start: "top bottom", once: true },
        onComplete: () => ScrollTrigger.refresh(),
      },
    );
  });

  return (
    <section data-section data-theme="light" className="bg-background pt-64 pb-64 text-foreground lg:pt-128 lg:pb-128">
      <div className="grid-container">
        <div
          ref={grid}
          onMouseLeave={() => setHovered(null)}
          className="relative grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-4"
        >
          <div
            ref={(el) => {
              cards.current[0] = el;
            }}
            className="relative min-h-[300px] overflow-hidden lg:min-h-[450px]"
          >
            <Media slot={stats.mediaSlot} sizes="(min-width: 1024px) 25vw, 100vw" className="absolute inset-0" />
          </div>
          {stats.cards.map((card, i) => {
            const parsed = parseStat(card.value);
            const isHovered = hovered === i;
            return (
              <div
                key={card.label}
                ref={(el) => {
                  cards.current[i + 1] = el;
                  triggers[i].current = el;
                }}
                className="flex min-h-[250px] cursor-default flex-col justify-between bg-background-muted p-16 lg:min-h-[450px] lg:p-32"
                onMouseEnter={() => {
                  setHovered(i);
                  plays.current[i]?.();
                }}
              >
                <span className="flex items-center text-h1 font-light text-foreground">
                  {parsed ? (
                    <>
                      {parsed.prefix}
                      <RollerNumber
                        value={parsed.number}
                        minDigits={parsed.number.toString().length}
                        triggerElement={triggers[i]}
                        duration={2}
                        stagger={0.1}
                        suffix={parsed.suffix}
                      />
                    </>
                  ) : (
                    card.value
                  )}
                </span>
                <span className="relative flex items-center text-accent text-foreground">
                  {isDesktop && (
                    <motion.span
                      aria-hidden="true"
                      className="absolute left-0 size-12 bg-brand"
                      initial={false}
                      animate={{ rotate: isHovered ? 0 : -90, scale: isHovered ? 1 : 0 }}
                      transition={{ duration: 0.5, ease: easings.backOut }}
                    />
                  )}
                  <motion.span
                    animate={isDesktop ? { x: isHovered ? 24 : 0 } : {}}
                    transition={{ duration: 0.5, ease: easings.power3Out }}
                  >
                    <ScrambleText
                      duration={0.5}
                      multiLine
                      onReady={(play) => {
                        plays.current[i] = play;
                      }}
                    >
                      {card.label}
                    </ScrambleText>
                  </motion.span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
