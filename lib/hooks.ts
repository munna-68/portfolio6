"use client";

import { useEffect, useLayoutEffect, useState } from "react";

export const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function useMediaQuery(query: string, initial = false) {
  const [matches, setMatches] = useState(initial);
  useIsoLayoutEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return matches;
}

export const usePrefersReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");
export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)");
export const useIsMdUp = () => useMediaQuery("(min-width: 768px)");
export const useIsTouch = () => useMediaQuery("(hover: none), (pointer: coarse)");

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
