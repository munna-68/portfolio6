"use client";

import type Lenis from "lenis";

// Module-level handle so non-React code (transitions, menu) can reach the root Lenis instance.
let lenis: Lenis | null = null;
let locked = false;

export const setLenis = (instance: Lenis | null) => {
  lenis = instance;
};
export const getLenis = () => lenis;

export function setScrollLocked(value: boolean) {
  if (value === locked) return;
  locked = value;
  document.documentElement.classList.toggle("scroll-locked", value);
}
export const isScrollLocked = () => locked;

export function scrollToTop(immediate = true) {
  if (lenis) lenis.scrollTo(0, { immediate, force: true });
  else window.scrollTo(0, 0);
}
