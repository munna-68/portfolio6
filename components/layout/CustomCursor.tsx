"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "@/lib/gsap";
import { usePageTransition } from "@/components/providers/TransitionProvider";
import { cx } from "@/lib/cx";

const SPEED = 0.7; // follow lag (expo.out)
const MAX_ROTATION = 35;
const DECAY = 0.92;
const VELOCITY = 0.5;

const stripes = (n: number) => Array.from({ length: n }, () => '<div class="h-full w-[6px] bg-brand"></div>').join("");

/**
 * Label cursor (reference: CustomCursor). Any element with data-cursor-text shows an accent pill
 * that pops in (back.out), trails the pointer with a 0.7s expo.out lag and tilts with horizontal
 * velocity. Optional data-cursor-stripes-left/right add thin accent bars on either side.
 */
export function CustomCursor() {
  const { phase } = usePageTransition();
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const follower = useRef<HTMLDivElement>(null);
  const tilt = useRef<HTMLDivElement>(null);
  const pill = useRef<HTMLDivElement>(null);
  const left = useRef<HTMLDivElement>(null);
  const right = useRef<HTMLDivElement>(null);
  const showing = useRef(false);
  const current = useRef<Element | null>(null);

  useEffect(() => {
    const touch = "ontouchstart" in window || navigator.maxTouchPoints > 0 || matchMedia("(hover: none)").matches;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(!touch && !reduced);
  }, []);

  const hide = () => {
    const els = [pill.current, left.current, right.current].filter(Boolean) as HTMLElement[];
    gsap.killTweensOf(els);
    showing.current = false;
    current.current = null;
    els.forEach((el) =>
      gsap.to(el, {
        scale: 0,
        duration: 0.25,
        ease: "power2.inOut",
        force3D: true,
        onComplete: () => {
          if (showing.current) return;
          if (el === pill.current) {
            el.innerHTML = "";
            el.style.backgroundColor = "";
            el.style.color = "";
          } else el.innerHTML = "";
        },
      }),
    );
  };

  const show = (target: HTMLElement) => {
    if (!pill.current) return;
    const els = [pill.current, left.current, right.current].filter(Boolean) as HTMLElement[];
    gsap.killTweensOf(els);
    showing.current = true;
    current.current = target;
    pill.current.textContent = target.dataset.cursorText ?? "";
    pill.current.style.backgroundColor = target.dataset.cursorBg ?? "";
    pill.current.style.color = target.dataset.cursorColor ?? "";
    if (left.current) left.current.innerHTML = stripes(Number(target.dataset.cursorStripesLeft ?? 0) || 0);
    if (right.current) right.current.innerHTML = stripes(Number(target.dataset.cursorStripesRight ?? 0) || 0);
    els.forEach((el) => gsap.fromTo(el, { scale: 0 }, { scale: 1, duration: 0.35, ease: "back.out(1.7)", force3D: true }));
  };

  useEffect(() => {
    if (phase === "entering" || phase === "holding") hide();
  }, [phase]);

  useEffect(() => {
    if (!enabled || !follower.current || !pill.current) return;
    gsap.set([pill.current, left.current, right.current], { scale: 0 });
    const moveX = gsap.quickTo(follower.current, "x", { duration: SPEED, ease: "expo.out" });
    const moveY = gsap.quickTo(follower.current, "y", { duration: SPEED, ease: "expo.out" });
    gsap.set(follower.current, { x: -innerWidth, y: -innerHeight });

    const pointer = { x: 0, y: 0 };
    const last = { x: 0 };
    let velocity = 0;
    let rotation = 0;
    let leaveTimer: number | null = null;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      moveX(pointer.x);
      moveY(pointer.y);
      setVisible(true);
      const target = (e.target as Element | null)?.closest?.<HTMLElement>("[data-cursor-text]") ?? null;
      if (target !== current.current) {
        if (target) show(target);
        else if (showing.current) hide();
      }
    };
    const onEnter = () => {
      if (leaveTimer) window.clearTimeout(leaveTimer);
      setVisible(true);
    };
    const onLeave = () => {
      leaveTimer = window.setTimeout(() => setVisible(false), 300);
    };

    const tick = () => {
      const dx = pointer.x - last.x;
      velocity = 0.7 * velocity + 0.3 * dx;
      last.x = pointer.x;
      const goal = Math.max(-MAX_ROTATION, Math.min(MAX_ROTATION, velocity * VELOCITY));
      rotation = showing.current ? rotation + (goal - rotation) * 0.2 : rotation * DECAY;
      if (tilt.current) gsap.set(tilt.current, { rotation, force3D: true });
    };
    gsap.ticker.add(tick);
    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseenter", onEnter);
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      gsap.ticker.remove(tick);
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      if (leaveTimer) window.clearTimeout(leaveTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  if (!enabled) return null;
  return createPortal(
    <div
      ref={follower}
      aria-hidden="true"
      className={cx(
        "pointer-events-none fixed top-0 left-0 z-[9999] will-change-transform opacity-0 transition-opacity duration-300 ease-out-expo",
        visible && "opacity-100",
      )}
    >
      <div
        ref={tilt}
        className="pointer-events-none absolute top-[-32px] left-0 flex origin-bottom -translate-x-1/2 -translate-y-full items-stretch gap-[2px]"
      >
        <div ref={left} className="flex items-stretch gap-[2px]" />
        <div ref={pill} className="whitespace-nowrap bg-brand px-8 py-4 text-center text-accent-sm text-black" />
        <div ref={right} className="flex items-stretch gap-[2px]" />
      </div>
    </div>,
    document.body,
  );
}
