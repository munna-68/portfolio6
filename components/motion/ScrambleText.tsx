"use client";

import { useEffect, useId, useRef, type CSSProperties } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/hooks";
import { blanks, randomGlyphs, SCRAMBLE_CHARS } from "@/lib/scramble";
import { useScrambleGroup } from "./ScrambleGroup";

export type ScramblePlay = () => gsap.core.Timeline | null;

type Props = {
  children: string;
  className?: string;
  duration?: number;
  /** Start from blank characters and type in (used by LOADING, grid titles, FAQ questions). */
  revealMode?: boolean;
  multiLine?: boolean;
  triggerOnHover?: boolean;
  firstColorClass?: string;
  secondColorClass?: string;
  onReady?: (play: ScramblePlay) => void;
  onComplete?: () => void;
};

/**
 * Characters cycle through random glyphs before settling (GSAP ScrambleTextPlugin).
 * Two passes like the reference: text → random glyphs (accent colour), then glyphs → text.
 * A hidden copy of the text reserves the final size, so nothing reflows while scrambling.
 */
export function ScrambleText({
  children,
  className,
  duration = 0.6,
  revealMode = false,
  multiLine = false,
  triggerOnHover = false,
  firstColorClass = "scramble-brand",
  secondColorClass = "scramble-foreground",
  onReady,
  onComplete,
}: Props) {
  const textRef = useRef<HTMLSpanElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const done = useRef(false);
  const group = useScrambleGroup();
  const id = useId();
  const text = children;

  const play = useRef<ScramblePlay>(() => null);
  play.current = () => {
    const el = textRef.current;
    if (!el || !text) return null;
    if (prefersReducedMotion()) {
      el.textContent = text;
      done.current = true;
      onComplete?.();
      return null;
    }
    tl.current?.kill();
    tl.current = gsap.timeline({
      onComplete: () => {
        tl.current = null;
        done.current = true;
        onComplete?.();
      },
    });
    const glyphs = randomGlyphs(text);
    const count = text.replace(/\s/g, "").length;
    const offset = count > 0 ? duration / count : 0;
    const fromBlank = revealMode && !done.current;
    if (fromBlank) el.textContent = blanks(text);
    tl.current.to(el, {
      duration,
      ease: "none",
      scrambleText: {
        text: glyphs,
        chars: SCRAMBLE_CHARS,
        speed: 1,
        revealDelay: 0.1,
        oldClass: fromBlank ? firstColorClass : secondColorClass,
        newClass: firstColorClass,
      },
    });
    tl.current.to(
      el,
      {
        duration,
        ease: "none",
        scrambleText: {
          text,
          chars: SCRAMBLE_CHARS,
          speed: 1,
          revealDelay: 0.1,
          oldClass: firstColorClass,
          newClass: secondColorClass,
        },
      },
      offset,
    );
    return tl.current;
  };

  useEffect(() => {
    const stable: ScramblePlay = () => play.current();
    onReady?.(stable);
    if (!group) return;
    group.register(id, stable);
    return () => group.unregister(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group, id]);

  useEffect(() => () => void tl.current?.kill(), []);

  const whiteSpace = multiLine ? "normal" : "nowrap";
  const wrapperStyle: CSSProperties = {
    position: "relative",
    display: multiLine ? "block" : "inline-block",
    whiteSpace,
  };

  return (
    <span className={className} style={wrapperStyle} onMouseEnter={triggerOnHover ? () => play.current() : undefined}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" style={{ visibility: "hidden", whiteSpace }}>
        {text}
      </span>
      <span
        ref={textRef}
        aria-hidden="true"
        style={{ position: "absolute", top: 0, left: 0, whiteSpace, ...(multiLine ? { width: "100%" } : {}) }}
      >
        {revealMode ? blanks(text) : text}
      </span>
    </span>
  );
}
