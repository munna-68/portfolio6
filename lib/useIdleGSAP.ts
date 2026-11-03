"use client";

import { useEffect, useState, type DependencyList, type RefObject } from "react";
import { useGSAP } from "@/lib/gsap";
import { usePageTransition } from "@/components/providers/TransitionProvider";

/**
 * useGSAP that only runs once the page transition has settled (reference: useIdleGSAP),
 * so ScrollTriggers measure the new page, not the one being swapped out.
 */
export function useIdleGSAP(
  fn: () => void | (() => void),
  options: { scope?: RefObject<Element | null>; dependencies?: DependencyList } = {},
) {
  const { phase } = usePageTransition();
  const [ready, setReady] = useState(phase === "idle");

  useEffect(() => {
    if (phase === "idle") setReady(true);
    else if (phase === "holding") setReady(false);
  }, [phase]);

  return useGSAP(
    () => {
      if (ready) return fn();
    },
    { scope: options.scope, dependencies: [...(options.dependencies ?? []), ready] },
  );
}
