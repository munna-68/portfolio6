"use client";

import { createContext, useCallback, useContext, useMemo, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIdleGSAP } from "@/lib/useIdleGSAP";

type Play = () => unknown;
type Ctx = { register: (id: string, play: Play) => void; unregister: (id: string) => void };

const ScrambleGroupContext = createContext<Ctx | null>(null);
export const useScrambleGroup = () => useContext(ScrambleGroupContext);

/** Fires every child ScrambleText, staggered, when the group scrolls into view. */
export function ScrambleGroup({
  children,
  stagger = 0.1,
  start = "top 80%",
  className,
}: {
  children: ReactNode;
  stagger?: number;
  start?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const plays = useRef(new Map<string, Play>());
  const register = useCallback((id: string, play: Play) => void plays.current.set(id, play), []);
  const unregister = useCallback((id: string) => void plays.current.delete(id), []);

  useIdleGSAP(
    () => {
      if (!ref.current) return;
      const st = ScrollTrigger.create({
        trigger: ref.current,
        start,
        once: true,
        onEnter: () => {
          [...plays.current.values()].forEach((play, i) => gsap.delayedCall(i * stagger, play));
        },
      });
      return () => st.kill();
    },
    { dependencies: [start, stagger] },
  );

  const value = useMemo(() => ({ register, unregister }), [register, unregister]);
  return (
    <ScrambleGroupContext.Provider value={value}>
      <div ref={ref} className={className}>
        {children}
      </div>
    </ScrambleGroupContext.Provider>
  );
}
