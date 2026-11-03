"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { easeInOutCubic } from "@/lib/easings";
import { prefersReducedMotion } from "@/lib/hooks";
import { setLenis } from "@/lib/scroll";
import { syncScrollLock } from "./ScrollLock";

/** Root Lenis instance driven by GSAP's ticker so ScrollTrigger and smooth scroll share one frame. */
export function LenisProvider() {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: false,
      smoothWheel: !prefersReducedMotion(),
      anchors: { duration: 1.2, easing: easeInOutCubic },
    });
    setLenis(lenis);
    syncScrollLock();

    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
