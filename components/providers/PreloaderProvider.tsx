"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

/**
 * loading   → preloader on screen, scroll locked
 * revealing → diagonal wipe is 90% done; page-enter animations may start
 * hidden    → preloader unmounted (200ms after revealing)
 */
export type PreloaderPhase = "loading" | "revealing" | "hidden";

type Ctx = { phase: PreloaderPhase; setPhase: (p: PreloaderPhase) => void; isInitialLoad: boolean };

const PreloaderContext = createContext<Ctx>({ phase: "hidden", setPhase: () => {}, isInitialLoad: false });

export function PreloaderProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<PreloaderPhase>("loading");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (phase !== "revealing") return;
    const id = window.setTimeout(() => {
      setPhase("hidden");
      setIsInitialLoad(false);
    }, 200);
    return () => window.clearTimeout(id);
  }, [phase]);

  const value = useMemo(() => ({ phase, setPhase, isInitialLoad }), [phase, isInitialLoad]);
  return <PreloaderContext.Provider value={value}>{children}</PreloaderContext.Provider>;
}

export const usePreloader = () => useContext(PreloaderContext);
