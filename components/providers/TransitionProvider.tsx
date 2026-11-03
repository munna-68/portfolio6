"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/hooks";
import { scrollToTop } from "@/lib/scroll";
import { useScrollLock } from "./ScrollLock";

/**
 * Page transition state machine (reference: PageTransitionProvider).
 *   idle → entering (1300ms: accent square swings in, page blurs, loader squares rise)
 *        → holding  (route swaps, scroll resets; waits for the new page to commit, min 100ms)
 *        → exiting  (1200ms: square swings out to the right, new page's entrance plays)
 *        → idle
 */
export type TransitionPhase = "idle" | "entering" | "holding" | "exiting";

const ENTER_MS = 1300;
const EXIT_MS = 1200;
const MIN_HOLD_MS = 100;

type Ctx = {
  phase: TransitionPhase;
  isTransitioning: boolean;
  navigate: (href: string) => void;
};

const TransitionContext = createContext<Ctx>({
  phase: "idle",
  isTransitioning: false,
  navigate: () => {},
});

const pathOf = (href: string) => href.split(/[?#]/)[0] || "/";

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const [isPending, startTransition] = useTransition();
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const timer = useRef<number | null>(null);
  const heldAt = useRef(0);
  const target = useRef<string | null>(null);

  useScrollLock("transition", phase !== "idle");

  const clear = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
  };

  const exit = useCallback(() => {
    clear();
    heldAt.current = 0;
    setPhase("exiting");
    timer.current = window.setTimeout(() => {
      setPhase("idle");
      ScrollTrigger.refresh(true);
    }, EXIT_MS);
  }, []);

  const navigate = useCallback(
    (href: string) => {
      if (phaseRef.current !== "idle") return;
      if (prefersReducedMotion()) {
        router.push(href, { scroll: true });
        return;
      }
      clear();
      target.current = pathOf(href);
      setPhase("entering");
      timer.current = window.setTimeout(() => {
        heldAt.current = Date.now();
        setPhase("holding");
        ScrollTrigger.clearScrollMemory();
        scrollToTop();
        startTransition(() => router.push(href, { scroll: true }));
      }, ENTER_MS);
    },
    [router],
  );

  // Leave "holding" once the new route has committed (or after a safety timeout).
  useEffect(() => {
    if (phase !== "holding" || !heldAt.current) return;
    const arrived = !isPending && (target.current === null || target.current === pathname);
    const wait = arrived ? Math.max(0, MIN_HOLD_MS - (Date.now() - heldAt.current)) : 4000;
    const id = window.setTimeout(exit, wait);
    return () => window.clearTimeout(id);
  }, [phase, isPending, pathname, exit]);

  // Browser back/forward: no swing-in, just the exit half (reference behaviour).
  useEffect(() => {
    const onPop = () => {
      if (prefersReducedMotion()) return;
      clear();
      target.current = null;
      heldAt.current = Date.now();
      setPhase("holding");
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    document.body.dataset.transitionPhase = phase;
  }, [phase]);

  useEffect(() => clear, []);

  const value = useMemo(() => ({ phase, isTransitioning: phase !== "idle", navigate }), [phase, navigate]);
  return <TransitionContext.Provider value={value}>{children}</TransitionContext.Provider>;
}

export const usePageTransition = () => useContext(TransitionContext);
