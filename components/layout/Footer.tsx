"use client";

import { useEffect, useRef } from "react";
import { assets } from "@/config/assets";
import { brand, footer, navItems } from "@/config/content";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { AnimatedLink } from "@/components/ui/AnimatedLink";
import { AsciiImage, type AsciiImageHandle } from "@/components/sections/AsciiImage";
import { useIsDesktop } from "@/lib/hooks";

/** Text scaled so it exactly spans its container (reference: fitted watermark). */
function FitText({ text }: { text: string }) {
  const box = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fit = () => {
      if (!box.current || !inner.current) return;
      inner.current.style.fontSize = "100px";
      inner.current.style.width = "max-content";
      const w = inner.current.offsetWidth;
      inner.current.style.width = "";
      if (w > 0) inner.current.style.fontSize = `${(100 * box.current.offsetWidth) / w}px`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    if (box.current) ro.observe(box.current);
    document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={box} className="overflow-hidden">
      <div ref={inner} className="whitespace-nowrap font-medium tracking-tighter" style={{ lineHeight: "0.75em" }}>
        {text}
      </div>
    </div>
  );
}

export function Footer() {
  const root = useRef<HTMLElement>(null);
  const left = useRef<AsciiImageHandle>(null);
  const right = useRef<AsciiImageHandle>(null);
  const isDesktop = useIsDesktop();

  // ASCII halves type in the first time the footer enters the viewport.
  useEffect(() => {
    if (!root.current) return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      [left, right].forEach((r) => r.current?.reveal(0));
    });
    io.observe(root.current);
    return () => io.disconnect();
  }, []);

  const l = assets["footer-ascii-left"];
  const r = assets["footer-ascii-right"];

  return (
    <footer ref={root} data-theme="dark" className="relative h-auto min-h-svh overflow-hidden bg-background pt-48 text-foreground lg:h-svh">
      {/* One WebGL canvas per half; desktop and mobile only differ in placement. */}
      <div
        className={
          isDesktop
            ? "pointer-events-none absolute top-[12.5%] bottom-0 left-0 z-20 w-1/2"
            : "pointer-events-none absolute top-1/5 bottom-0 -left-1/3 flex w-3/4 items-end"
        }
      >
        <AsciiImage ref={left} src={l.src} cellSize={18} parallaxIntensity={0.1} revealOrigin={{ x: 0, y: 0.5 }} alignX="left" />
      </div>
      <div
        className={
          isDesktop
            ? "pointer-events-none absolute top-[12.5%] right-0 bottom-0 z-20 w-1/2"
            : "pointer-events-none absolute top-1/5 -right-1/3 bottom-0 flex w-3/4 items-end"
        }
      >
        <AsciiImage ref={right} src={r.src} cellSize={18} parallaxIntensity={0.1} revealOrigin={{ x: 1, y: 0.5 }} alignX="right" />
      </div>

      <div className="grid-container pointer-events-none relative z-30 flex h-full min-h-[calc(100svh-48px)] flex-col lg:min-h-0">
        <div className="grid-layout !gap-y-48 lg:gap-y-0">
          <div className="pointer-events-auto col-span-12 flex flex-col gap-16 lg:col-span-3 lg:col-start-1">
            <p className="text-body">{footer.newsletterTitle}</p>
            {/* TODO: connect to your newsletter provider */}
            <form className="flex flex-col gap-8" onSubmit={(e) => e.preventDefault()}>
              <input aria-label="Name" placeholder="Name" className="h-40 bg-surface px-12 text-body-sm outline-none placeholder:text-foreground-muted" />
              <input aria-label="Email" type="email" placeholder="Email" className="h-40 bg-surface px-12 text-body-sm outline-none placeholder:text-foreground-muted" />
              <AnimatedButton size="sm" theme="light" className="w-full">
                Subscribe
              </AnimatedButton>
            </form>
            <p className="text-body-sm text-foreground-muted">{footer.newsletterNote}</p>
            <div className="flex flex-col gap-4">
              <p className="flex items-center gap-8 text-accent-sm text-foreground-muted">
                <span className="inline-block size-8 shrink-0 animate-pulse bg-brand" />
                {footer.availability}
              </p>
              <p className="flex items-center gap-8 text-accent-sm text-foreground-muted">
                <span className="inline-block size-8 shrink-0 animate-pulse bg-brand" />
                {footer.spots}
              </p>
            </div>
          </div>
          <nav className="pointer-events-auto col-span-12 lg:col-span-2 lg:col-start-6" aria-label="Footer">
            <ul className="flex flex-col items-start gap-4 space-y-4 lg:items-center">
              {navItems.map((n) => (
                <li key={n.href}>
                  <AnimatedLink href={n.href} className="text-accent">
                    {n.label}
                  </AnimatedLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="pointer-events-auto col-span-12 flex flex-col gap-16 lg:col-span-3 lg:col-start-10">
            <div className="flex flex-col items-start gap-4">
              <AnimatedLink href={`mailto:${brand.email}`} className="text-body">
                {brand.email}
              </AnimatedLink>
            </div>
            <div className="flex flex-col items-start gap-4">
              {footer.legal.map((item) => (
                <AnimatedLink key={item} href="/" className="text-body">
                  {item}
                </AnimatedLink>
              ))}
            </div>
          </div>
        </div>
        <p className="pointer-events-auto pt-[12.5%] text-center text-body text-foreground-muted">
          {footer.copyright}
          <br />
          {footer.signoff}
        </p>
        <div className="mt-auto overflow-hidden text-foreground opacity-10">
          <FitText text={footer.wordmark} />
        </div>
      </div>
    </footer>
  );
}
