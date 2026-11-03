"use client";

import { useEffect } from "react";
import { getLenis } from "@/lib/scroll";

// Several things stop smooth scrolling at once (preloader, menu, transitions); track them by reason.
const reasons = new Set<string>();

function apply() {
  const lenis = getLenis();
  if (!lenis) return;
  if (reasons.size > 0) lenis.stop();
  else lenis.start();
}

export function lockScroll(reason: string) {
  reasons.add(reason);
  apply();
}
export function unlockScroll(reason: string) {
  reasons.delete(reason);
  apply();
}
export const syncScrollLock = apply;

export function useScrollLock(reason: string, active: boolean) {
  useEffect(() => {
    if (!active) return;
    lockScroll(reason);
    return () => unlockScroll(reason);
  }, [reason, active]);
}
