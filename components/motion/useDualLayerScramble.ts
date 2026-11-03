"use client";

import { useCallback, useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/hooks";
import { blanks, randomGlyphs, SCRAMBLE_CHARS } from "@/lib/scramble";

type Options = {
  duration?: number;
  stagger?: number;
  firstColorClass?: string;
  secondColorClass?: string;
  /** Element stays visible after kill() (buttons). Menu captions start hidden instead. */
  initiallyVisible?: boolean;
  onComplete?: () => void;
};

/** Split an element's rendered text into visual lines by measuring each character. */
function measureLines(el: HTMLElement): string[] {
  const text = el.innerText || "";
  if (!text.trim()) return [];
  if (text.includes("\n")) return text.split("\n").filter(Boolean);
  const node = el.firstChild;
  if (!node || node.nodeType !== Node.TEXT_NODE) return [text];
  const range = document.createRange();
  const lines: string[] = [];
  let current = "";
  let lastTop: number | null = null;
  const len = (node as Text).length;
  for (let i = 0; i < text.length && i < len; i++) {
    range.setStart(node, i);
    range.setEnd(node, i + 1);
    const top = range.getBoundingClientRect().top;
    if (lastTop !== null && Math.abs(top - lastTop) > 2) {
      if (current) lines.push(current);
      current = "";
    }
    current += text[i];
    lastTop = top;
  }
  if (current) lines.push(current);
  return lines.length ? lines : [text];
}

/**
 * Per-line scramble (reference: useDualLayerScramble). Each visual line gets a fixed-size
 * span so the block never reflows; lines start 0.08s apart and run the same two passes as
 * ScrambleText.
 */
export function useDualLayerScramble<T extends HTMLElement = HTMLElement>(options: Options = {}) {
  const ref = useRef<T | null>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const prepared = useRef(false);
  const original = useRef("");
  const lineSpans = useRef<{ el: HTMLSpanElement; text: string }[]>([]);
  const opts = useRef(options);
  opts.current = options;

  const prepare = useCallback(() => {
    const el = ref.current;
    if (!el || prepared.current) return;
    original.current = el.innerHTML;
    const lines = measureLines(el);
    if (!lines.length) return;
    const style = getComputedStyle(el);
    const probe = document.createElement("div");
    probe.style.cssText = "position:absolute;visibility:hidden;pointer-events:none;white-space:nowrap;";
    probe.style.font = style.font;
    probe.style.letterSpacing = style.letterSpacing;
    probe.style.textTransform = style.textTransform;
    document.body.appendChild(probe);
    const measured = lines.map((text) => {
      probe.textContent = text;
      return { text, width: probe.offsetWidth, height: probe.offsetHeight };
    });
    document.body.removeChild(probe);

    const width = Math.max(el.offsetWidth, ...measured.map((m) => m.width));
    const height = Math.max(el.offsetHeight, measured.reduce((sum, m) => sum + m.height, 0));
    gsap.set(el, { width, height, display: "inline-block", overflow: "hidden" });
    el.innerHTML = "";
    lineSpans.current = measured.map((m) => {
      const span = document.createElement("span");
      span.style.cssText = `display:block;opacity:0;width:${m.width}px;height:${m.height}px;overflow:hidden;white-space:nowrap;`;
      span.textContent = m.text;
      el.appendChild(span);
      return { el: span, text: m.text };
    });
    gsap.set(el, { opacity: 1 });
    prepared.current = true;
  }, []);

  const kill = useCallback(() => {
    tl.current?.kill();
    tl.current = null;
    const el = ref.current;
    if (!el || !prepared.current) return;
    el.innerHTML = original.current;
    gsap.set(el, {
      opacity: opts.current.initiallyVisible ? 1 : 0,
      width: "auto",
      height: "auto",
      overflow: "visible",
    });
    lineSpans.current = [];
    prepared.current = false;
  }, []);

  const scramble = useCallback(() => {
    if (!ref.current) return null;
    if (tl.current) return tl.current;
    prepare();
    const lines = lineSpans.current;
    if (!lines.length) return null;
    const {
      duration = 1,
      stagger = 0.08,
      firstColorClass = "scramble-brand",
      secondColorClass = "scramble-foreground",
      onComplete,
    } = opts.current;

    if (prefersReducedMotion()) {
      lines.forEach(({ el, text }) => {
        el.textContent = text;
        el.style.opacity = "1";
      });
      onComplete?.();
      return null;
    }

    tl.current = gsap.timeline({
      onComplete: () => {
        tl.current = null;
        onComplete?.();
      },
    });
    lines.forEach(({ el, text }, i) => {
      const at = i * stagger;
      const count = text.replace(/\s/g, "").length;
      tl.current!.add(() => {
        gsap.set(el, { opacity: 1 });
        el.textContent = blanks(text);
      }, at);
      tl.current!.to(
        el,
        {
          duration,
          ease: "none",
          scrambleText: {
            text: randomGlyphs(text),
            chars: SCRAMBLE_CHARS,
            speed: 1,
            revealDelay: 0.1,
            oldClass: firstColorClass,
            newClass: firstColorClass,
          },
        },
        at,
      );
      tl.current!.to(
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
        at + (count > 0 ? duration / count : 0),
      );
    });
    return tl.current;
  }, [prepare]);

  useEffect(
    () => () => {
      tl.current?.kill();
    },
    [],
  );

  return { ref, scramble, kill };
}
