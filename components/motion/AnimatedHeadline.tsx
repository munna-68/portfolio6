"use client";

import { Fragment, useCallback, useImperativeHandle, useRef, useState, type ElementType, type Ref } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useIsoLayoutEffect, usePrefersReducedMotion } from "@/lib/hooks";
import { useIdleGSAP } from "@/lib/useIdleGSAP";
import { cx } from "@/lib/cx";

const sizes = {
  display: "text-display",
  h1: "text-h1",
  h2: "text-h2",
  h3: "text-h3",
  h4: "text-h4",
  h5: "text-h5",
  h6: "text-h6",
} as const;

export type HeadlineLevel = keyof typeof sizes;
export type AnimatedHeadlineHandle = { reveal: (delay?: number) => void; reset: () => void };

type Props = {
  children: string;
  as?: Exclude<HeadlineLevel, "display">;
  displayAs?: HeadlineLevel;
  className?: string;
  wrapperClassName?: string;
  skip?: boolean;
  /** "scroll" reveals once the headline's top crosses the viewport bottom; "manual" waits for reveal(). */
  trigger?: "manual" | "scroll";
  /** Render a trailing "." (or "!"/"?") in the brand accent, e.g. "small businesses." */
  accentEnd?: boolean;
  ref?: Ref<AnimatedHeadlineHandle>;
};

/** Splits a trailing punctuation mark off so it can be coloured with the accent. */
function withAccentEnd(text: string, on: boolean, isLast: boolean) {
  if (!on || !isLast) return text;
  const m = text.match(/^(.*?)([.!?])$/s);
  return m ? (
    <>
      {m[1]}
      <span className="text-brand">{m[2]}</span>
    </>
  ) : (
    text
  );
}

/**
 * Block-wipe line reveal (reference: AnimatedHeadline).
 * Words are measured into visual lines; each line gets an accent rect and a foreground rect
 * that wipe across (scaleX 0→1 from the left), the text appears underneath, then both wipe
 * away to the right. Lines start 0.15s apart.
 */
export function AnimatedHeadline({
  children,
  as = "h1",
  displayAs,
  className,
  wrapperClassName,
  skip,
  trigger = "manual",
  accentEnd = false,
  ref,
}: Props) {
  const reduced = usePrefersReducedMotion();
  const off = skip ?? reduced;
  const el = useRef<HTMLHeadingElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  const revealed = useRef(false);
  const [lines, setLines] = useState<string[] | null>(null);
  const width = useRef(0);
  const Tag = as as ElementType;

  // Measure words into lines; re-measure when the available width changes.
  useIsoLayoutEffect(() => {
    if (lines || !el.current) return;
    const words = el.current.querySelectorAll<HTMLElement>("[data-word]");
    if (!words.length) return;
    const out: string[] = [];
    let current: string[] = [];
    let lastTop = -Infinity;
    let lastLine = -1;
    words.forEach((w) => {
      const top = w.getBoundingClientRect().top;
      const explicit = Number(w.dataset.explicitLine ?? -1);
      const forced = explicit !== lastLine && lastLine !== -1;
      if ((lastTop > -Infinity && top - lastTop > 2) || forced) {
        out.push(current.join(" "));
        current = [];
      }
      current.push(w.textContent || "");
      lastTop = top;
      lastLine = explicit;
    });
    if (current.length) out.push(current.join(" "));
    width.current = el.current.parentElement?.offsetWidth ?? 0;
    setLines(out);
  }, [lines]);

  useIsoLayoutEffect(() => {
    const parent = el.current?.parentElement;
    if (!parent) return;
    const ro = new ResizeObserver(() => {
      const w = parent.offsetWidth;
      if (Math.abs(w - width.current) > 1) setLines(null);
    });
    ro.observe(parent);
    return () => ro.disconnect();
  }, []);

  useGSAP(
    () => {
      if (off || !el.current || !lines) return;
      gsap.set(el.current.querySelectorAll("[data-line-inner]"), { opacity: revealed.current ? 1 : 0 });
      gsap.set(el.current.querySelectorAll("[data-brand-rect], [data-fg-rect]"), {
        scaleX: 0,
        transformOrigin: "left",
      });
    },
    { dependencies: [off, lines] },
  );

  const reveal = useCallback(
    (delay = 0) => {
      if (revealed.current || off || !el.current) return;
      revealed.current = true;
      el.current.querySelectorAll<HTMLElement>("[data-line]").forEach((line, i) => {
        const inner = line.querySelector("[data-line-inner]");
        const brand = line.querySelector("[data-brand-rect]");
        const fg = line.querySelector("[data-fg-rect]");
        if (!inner || !brand || !fg) return;
        const tl = gsap.timeline({ delay: delay + 0.15 * i });
        tl.to(brand, { scaleX: 1, duration: 0.45, ease: "power3.inOut" }, 0)
          .to(fg, { scaleX: 1, duration: 0.45, ease: "power3.inOut" }, 0.1)
          .set(inner, { opacity: 1 }, 0.5)
          .set([brand, fg], { transformOrigin: "right" }, 0.5)
          .to(fg, { scaleX: 0, duration: 0.45, ease: "power3.inOut" }, 0.5)
          .to(brand, { scaleX: 0, duration: 0.45, ease: "power3.inOut" }, 0.6);
      });
    },
    [off],
  );

  const reset = useCallback(() => {
    revealed.current = false;
    if (!el.current) return;
    gsap.set(el.current.querySelectorAll("[data-line-inner]"), { opacity: 0 });
    gsap.set(el.current.querySelectorAll("[data-brand-rect], [data-fg-rect]"), { scaleX: 0, transformOrigin: "left" });
  }, []);

  useImperativeHandle(ref, () => ({ reveal, reset }), [reveal, reset]);

  useIdleGSAP(
    () => {
      if (trigger !== "scroll" || off || !lines) return;
      const target = wrapper.current || el.current;
      if (!target) return;
      const st = ScrollTrigger.create({ trigger: target, start: "top bottom", once: true, onEnter: () => reveal() });
      return () => st.kill();
    },
    { dependencies: [trigger, off, lines] },
  );

  const classes = cx(sizes[displayAs ?? as], className);

  const content = !lines ? (
    <Tag ref={el} className={classes}>
      {children.split("\n").map((row, r) => (
        <Fragment key={r}>
          {r > 0 && <br />}
          {row
            .split(/\s+/)
            .filter(Boolean)
            .map((word, w, all) => (
              <Fragment key={w}>
                {w > 0 && " "}
                <span data-word data-explicit-line={r}>
                  {withAccentEnd(word, accentEnd, r === children.split("\n").length - 1 && w === all.length - 1)}
                </span>
              </Fragment>
            ))}
        </Fragment>
      ))}
    </Tag>
  ) : (
    <Tag ref={el} className={classes}>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          <div data-line={i} className="relative inline-block">
            <span data-line-inner className="block whitespace-nowrap">
              {withAccentEnd(line, accentEnd, i === lines.length - 1)}
            </span>
            {!off && (
              <>
                <div data-brand-rect className="absolute -inset-x-[0.1em] -inset-y-[0.1em] bg-brand" />
                <div data-fg-rect className="absolute -inset-x-[0.1em] -inset-y-[0.1em] bg-foreground" />
              </>
            )}
          </div>
        </Fragment>
      ))}
    </Tag>
  );

  return trigger === "scroll" ? (
    <div ref={wrapper} className={wrapperClassName}>
      {content}
    </div>
  ) : (
    content
  );
}
