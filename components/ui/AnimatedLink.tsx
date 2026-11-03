"use client";

import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { TransitionLink } from "./TransitionLink";

const swap = "transition-transform duration-700 [transition-timing-function:cubic-bezier(0.625,0.05,0,1)]";
const slide = "transition-transform duration-500 [transition-timing-function:cubic-bezier(0.33,1,0.68,1)]";

/**
 * Text link with the reference's two-layer underline: on hover the visible line retracts to the
 * right, then (300ms later) a second line draws in from the left. `indicator` adds the accent
 * square that pops in while the label slides 24px.
 */
export function AnimatedLink({
  href,
  children,
  className,
  indicator = false,
  external,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  indicator?: boolean;
  external?: boolean;
}) {
  const classes = cx(
    "group relative w-fit cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-brand/50",
    indicator ? "inline-flex items-center" : "inline-block",
    className,
  );
  const body = (
    <>
      {indicator && (
        <span
          aria-hidden="true"
          className={cx(
            "absolute left-0 size-8 bg-brand lg:size-12 -rotate-90 scale-0 transition-transform duration-500 [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]",
            "group-hover:rotate-0 group-hover:scale-100 group-focus-visible:rotate-0 group-focus-visible:scale-100",
          )}
        />
      )}
      {indicator ? <span className={cx(slide, "group-hover:translate-x-24 group-focus-visible:translate-x-24")}>{children}</span> : children}
      <span aria-hidden="true" className={cx("pointer-events-none absolute inset-x-0 -bottom-1", indicator && [slide, "group-hover:translate-x-24"])}>
        <span className={cx("absolute inset-x-0 top-0 h-px bg-current origin-left scale-x-100 delay-300", swap, "group-hover:origin-right group-hover:scale-x-0 group-hover:delay-0")} />
        <span className={cx("absolute inset-x-0 top-0 h-px bg-current origin-right scale-x-0 delay-0", swap, "group-hover:origin-left group-hover:scale-x-100 group-hover:delay-300")} />
      </span>
    </>
  );
  if (external || /^(https?:|mailto:|tel:)/.test(href)) {
    return (
      <a href={href} className={classes} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {body}
      </a>
    );
  }
  return (
    <TransitionLink href={href} className={classes}>
      {body}
    </TransitionLink>
  );
}
