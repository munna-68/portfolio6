"use client";

import { useRef, type RefObject } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIdleGSAP } from "@/lib/useIdleGSAP";
import { cx } from "@/lib/cx";

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/**
 * Slot-machine digits (reference: RollerNumber). Each digit is a column of three 0–9 stacks;
 * it rolls from -10em to -(20 + digit)em with expo.inOut, rightmost digit first.
 */
export function RollerNumber({
  value,
  suffix,
  minDigits = 2,
  triggerElement,
  delay = 0,
  duration = 1.5,
  stagger = 0.08,
  className,
}: {
  value: number;
  suffix?: string;
  minDigits?: number;
  triggerElement?: RefObject<HTMLElement | null>;
  delay?: number;
  duration?: number;
  stagger?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const digits = Math.round(value).toString().split("").map(Number);
  while (digits.length < minDigits) digits.unshift(0);

  useIdleGSAP(
    () => {
      if (!ref.current) return;
      const cols = ref.current.querySelectorAll("[data-roller-inner]");
      const play = () =>
        cols.forEach((col, i) => {
          gsap.fromTo(
            col,
            { y: "-10em" },
            {
              y: `${-20 - (digits[i] ?? 0)}em`,
              duration,
              delay: delay + (digits.length - 1 - i) * stagger,
              ease: "expo.inOut",
            },
          );
        });
      const st = ScrollTrigger.create({
        trigger: triggerElement?.current ?? ref.current,
        start: "top bottom",
        once: true,
        invalidateOnRefresh: true,
        onEnter: play,
      });
      return () => st.kill();
    },
    { dependencies: [value] },
  );

  const column = (prefix: string) =>
    DIGITS.map((d) => (
      <div key={`${prefix}-${d}`} className="flex items-center justify-center leading-none" style={{ height: "1em", fontVariantNumeric: "tabular-nums" }}>
        {d}
      </div>
    ));

  return (
    <div ref={ref} className={cx("flex items-start justify-start overflow-hidden leading-none", className)} style={{ height: "1em" }}>
      <span className="sr-only">{`${Math.round(value)}${suffix ?? ""}`}</span>
      {digits.map((_, i) => (
        <div key={`${i}-${digits.length}`} aria-hidden="true" className="relative flex flex-col items-center justify-start overflow-hidden" style={{ width: "1ch", height: "1em" }}>
          <div data-roller-inner className="flex flex-col will-change-transform" style={{ transform: "translateY(-10em)" }}>
            {column("a")}
            {column("b")}
            {column("c")}
          </div>
        </div>
      ))}
      {suffix && (
        <span aria-hidden="true" className="flex items-center leading-none" style={{ fontVariantNumeric: "tabular-nums" }}>
          {suffix}
        </span>
      )}
    </div>
  );
}
