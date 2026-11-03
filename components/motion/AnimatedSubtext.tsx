"use client";

import { useImperativeHandle, useRef, type Ref } from "react";
import { gsap, SplitText } from "@/lib/gsap";
import { useIsoLayoutEffect } from "@/lib/hooks";
import { cx } from "@/lib/cx";

export type AnimatedSubtextHandle = { reveal: (delay?: number) => void };

/** Paragraph whose lines slide up out of clipped masks (SplitText, mask: "lines"). */
export function AnimatedSubtext({
  children,
  className,
  skip = false,
  stagger = 0.05,
  duration = 0.8,
  ref,
}: {
  children: string;
  className?: string;
  skip?: boolean;
  stagger?: number;
  duration?: number;
  ref?: Ref<AnimatedSubtextHandle>;
}) {
  const el = useRef<HTMLParagraphElement>(null);
  const split = useRef<SplitText | null>(null);

  useIsoLayoutEffect(() => {
    if (!el.current || skip) return;
    split.current = new SplitText(el.current, {
      type: "lines",
      mask: "lines",
      autoSplit: true,
      aria: "none",
      linesClass: "split-line",
    });
    return () => {
      split.current?.revert();
      split.current = null;
    };
  }, [skip]);

  useImperativeHandle(
    ref,
    () => ({
      reveal: (delay = 0) => {
        if (!el.current || !split.current || skip) return;
        el.current.style.visibility = "visible";
        gsap.fromTo(
          split.current.lines,
          { y: "100%" },
          { y: "0%", duration, ease: "power3.out", stagger, delay },
        );
      },
    }),
    [skip, duration, stagger],
  );

  const rows = children.split("\n");
  return (
    <p ref={el} className={cx(!skip && "invisible", className)}>
      {rows.map((row, i) => (
        <span key={i}>
          {row}
          {i < rows.length - 1 && <br />}
        </span>
      ))}
    </p>
  );
}
