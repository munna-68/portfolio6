"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { brand, headerCta } from "@/config/content";
import { site } from "@/config/site";
import { useIsDesktop, useIsMdUp, useIsoLayoutEffect, usePrefersReducedMotion } from "@/lib/hooks";
import { cx } from "@/lib/cx";
import { usePageTransition } from "@/components/providers/TransitionProvider";
import { usePreloader } from "@/components/providers/PreloaderProvider";
import { usePageEnter } from "@/components/providers/PageEnterProvider";
import { useScrollLock } from "@/components/providers/ScrollLock";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { Menu } from "./Menu";

type Theme = "light" | "dark" | "brand";
const SECTIONS = "main [data-section][data-theme]";
// Horizontal bar padding per state (reference: top 0 / scrolled 16 / menu open 64; mobile 0 / 16 / 24)
const PADDING = { desktop: { top: 0, scrolled: 16, menuOpen: 64 }, mobile: { top: 0, scrolled: 16, menuOpen: 24 } };
// Hero ASCII art gets a head start before the header returns on first load (reference: 10% of 3.5s, md+).
const ASCII_DELAY = 0.35;

function MenuButton({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={isOpen}
      aria-label={isOpen ? "Close menu" : "Open menu"}
      className="group flex cursor-pointer items-center gap-8 text-accent uppercase tracking-tight transition-opacity duration-300 hover:opacity-70"
    >
      <span className="relative h-[1em] w-[3.5em] overflow-hidden">
        <span
          className="flex flex-col gap-2 transition-transform duration-300 ease-out"
          style={{ transform: `translateY(${isOpen ? "calc(-1em - 2px)" : "0px"})` }}
        >
          <span className="block h-[1em] leading-none">Menu</span>
          <span className="block h-[1em] leading-none">Close</span>
        </span>
      </span>
      <span className="relative flex h-16 w-16 flex-col items-center justify-center">
        <span
          className="absolute h-[2px] w-full origin-center bg-current"
          style={{ transform: isOpen ? "rotate(45deg) translateY(0px)" : "rotate(0deg) translateY(-3px)", transition: "transform 250ms ease-out" }}
        />
        <span
          className="absolute h-[2px] w-full origin-center bg-current"
          style={{ transform: isOpen ? "rotate(-45deg) translateY(0px)" : "rotate(0deg) translateY(3px)", transition: "transform 250ms ease-out" }}
        />
      </span>
    </button>
  );
}

/** PLACEHOLDER logo: two stacked words; the second slides in while the menu is open. Swap for your SVG. */
function HeaderLogo({ isMenuOpen }: { isMenuOpen: boolean }) {
  const word = "block h-24 shrink-0 text-[26px] leading-[24px] font-bold uppercase tracking-tighter text-foreground transition-colors duration-300";
  return (
    <TransitionLink href="/" aria-label={`${brand.name} – Home`} className="relative block h-24 shrink-0 overflow-hidden">
      <div
        className="flex flex-col gap-2 transition-transform duration-500 ease-out"
        style={{ transform: `translateY(${isMenuOpen ? -26 : 0}px)` }}
      >
        <span className={word}>{brand.logoWordOne}</span>
        <span className={word}>{brand.logoWordTwo}</span>
      </div>
    </TransitionLink>
  );
}

export function Header() {
  const header = useRef<HTMLElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState<"top" | "scrolled">("top");
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");
  const isDesktop = useIsDesktop();
  const mdUp = useIsMdUp();
  const reduced = usePrefersReducedMotion();
  const pathname = usePathname();
  const { phase } = usePageTransition();
  const { isInitialLoad } = usePreloader();
  const hiddenByFooter = useRef(false);

  const state = menuOpen ? "menuOpen" : scrollState;
  const padding = PADDING[isDesktop ? "desktop" : "mobile"][state];

  useScrollLock("menu", menuOpen);

  // Header theme follows the section under its top edge.
  const syncTheme = useCallback(() => {
    const y = bar.current?.offsetTop ?? 16;
    const sections = [...document.querySelectorAll<HTMLElement>(SECTIONS)];
    if (!sections.length) return;
    const under = sections.find((s) => {
      const r = s.getBoundingClientRect();
      return r.top <= y && r.bottom > y;
    });
    const t = (under ?? sections[0]).dataset.theme as Theme | undefined;
    if (t) setTheme(t);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrollState(window.scrollY > site.headerScrollThreshold ? "scrolled" : "top");
      syncTheme();
      // Hide the header once the footer reaches 10% of the viewport.
      if (reduced || !header.current) return;
      const footer = document.querySelector("footer");
      const r = footer?.getBoundingClientRect();
      const hide = !!r && r.height > 0 && r.top <= window.innerHeight * 0.1;
      if (hide !== hiddenByFooter.current) {
        hiddenByFooter.current = hide;
        header.current.classList.toggle("header-hidden", hide);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [syncTheme, reduced]);

  useEffect(() => {
    if (phase === "exiting" || phase === "idle") syncTheme();
  }, [phase, pathname, syncTheme]);

  // Hidden while the preloader runs; slides back in with the page entrance.
  useIsoLayoutEffect(() => {
    if (!isInitialLoad || reduced || !header.current) return;
    header.current.classList.add("header-hidden", "no-transition");
    requestAnimationFrame(() => header.current?.classList.remove("no-transition"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = header.current;
    if (reduced || !el) return;
    if (phase === "entering") el.classList.add("header-hidden");
    else if (phase === "holding") {
      hiddenByFooter.current = false;
      el.classList.add("header-hidden", "no-transition");
      requestAnimationFrame(() => el.classList.remove("no-transition"));
    }
  }, [phase, reduced]);

  usePageEnter(
    (delay) => {
      const extra = isInitialLoad && mdUp ? ASCII_DELAY : 0;
      window.setTimeout(() => header.current?.classList.remove("header-hidden"), (delay + extra) * 1000);
    },
    { priority: 0, skip: reduced },
  );

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const close = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <div
        onClick={close}
        aria-hidden="true"
        className={cx(
          "fixed inset-0 z-[9998] bg-black/30 backdrop-blur-sm transition-opacity duration-500 ease-out",
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <header ref={header} data-site-header data-theme={theme} className="fixed inset-x-0 top-0 z-[9999] flex flex-col gap-8 pt-16 text-foreground">
        <div
          ref={bar}
          data-state={state}
          data-style={site.headerStyle}
          className="header-bar grid-container"
          style={{ paddingLeft: padding, paddingRight: padding }}
        >
          <div className="py-16">
            <div className="grid grid-cols-2 items-center lg:grid-cols-3">
              <div className="justify-self-start">
                <HeaderLogo isMenuOpen={menuOpen} />
              </div>
              <div className="justify-self-end lg:justify-self-center">
                <MenuButton isOpen={menuOpen} onClick={() => setMenuOpen((o) => !o)} />
              </div>
              <AnimatedButton href={headerCta.href} size="sm" theme="brand" className="justify-self-end max-lg:hidden">
                {headerCta.label}
              </AnimatedButton>
            </div>
          </div>
        </div>
        <Menu isOpen={menuOpen} onClose={close} />
      </header>
    </>
  );
}
