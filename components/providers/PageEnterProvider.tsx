"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { usePreloader } from "./PreloaderProvider";
import { usePageTransition } from "./TransitionProvider";

/**
 * Orchestrates entrance animations (reference: PageEnterProvider).
 * Components register a trigger(delay) with a priority. 250ms after the preloader starts
 * revealing (first load) or the transition starts exiting (navigation), every trigger fires
 * in priority order.
 */
type Entry = { trigger: (delay: number) => void; priority: number };
type EnterPhase = "waiting" | "entering" | "complete";

type Ctx = {
  phase: EnterPhase;
  register: (id: string, entry: Entry) => void;
  unregister: (id: string) => void;
};

const PageEnterContext = createContext<Ctx>({ phase: "complete", register: () => {}, unregister: () => {} });

export function PageEnterProvider({ children }: { children: ReactNode }) {
  const { phase: transitionPhase } = usePageTransition();
  const { phase: preloaderPhase } = usePreloader();
  const [phase, setPhase] = useState<EnterPhase>("waiting");
  const entries = useRef(new Map<string, Entry>());
  const fired = useRef(false);

  const register = useCallback((id: string, entry: Entry) => entries.current.set(id, entry), []);
  const unregister = useCallback((id: string) => void entries.current.delete(id), []);

  const fire = useCallback(() => {
    if (fired.current) return;
    fired.current = true;
    setPhase("entering");
    // The reference's group offset only applies once a delay is already non-zero, which never
    // happens, so in practice every entry fires at delay 0 in priority order. Kept identical.
    const sorted = [...entries.current.values()].sort((a, b) => a.priority - b.priority);
    for (const entry of sorted) entry.trigger(0);
    window.setTimeout(() => setPhase("complete"), 1000);
  }, []);

  useEffect(() => {
    const preloaderDone = preloaderPhase === "revealing" || preloaderPhase === "hidden";
    const transitionDone = transitionPhase === "exiting" || transitionPhase === "idle";
    if (phase === "waiting" && preloaderDone && transitionDone) {
      const id = window.setTimeout(fire, 250);
      return () => window.clearTimeout(id);
    }
  }, [phase, preloaderPhase, transitionPhase, fire]);

  useEffect(() => {
    if (transitionPhase === "entering" || transitionPhase === "holding") {
      fired.current = false;
      setPhase("waiting");
    }
  }, [transitionPhase]);

  const value = useMemo(() => ({ phase, register, unregister }), [phase, register, unregister]);
  return <PageEnterContext.Provider value={value}>{children}</PageEnterContext.Provider>;
}

export const usePageEnterContext = () => useContext(PageEnterContext);

/** Register an entrance animation. `trigger(delay)` is called once per page entry. */
export function usePageEnter(trigger: (delay: number) => void, { priority = 0, skip = false } = {}) {
  const { register, unregister, phase } = usePageEnterContext();
  const reduced = usePrefersReducedMotion();
  const id = useId();
  const latest = useRef(trigger);
  latest.current = trigger;

  useEffect(() => {
    if (skip) return;
    register(id, { trigger: (d) => latest.current(d), priority });
    return () => unregister(id);
  }, [id, priority, skip, register, unregister]);

  return { phase, prefersReducedMotion: reduced };
}
