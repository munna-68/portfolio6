"use client";

import { useRef, type ReactNode } from "react";
import { useDualLayerScramble } from "@/components/motion/useDualLayerScramble";
import { cx } from "@/lib/cx";
import { TransitionLink } from "./TransitionLink";

type Size = "xs" | "sm" | "default" | "lg";
type Theme = "light" | "dark" | "brand";

const base =
  "group inline-flex min-w-0 shrink-0 cursor-pointer items-center justify-center whitespace-nowrap font-medium font-mono uppercase outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background";
const textSize: Record<Size, string> = {
  xs: "text-body-sm",
  sm: "text-body-sm",
  default: "text-body-sm lg:text-body",
  lg: "text-body lg:text-body-lg",
};
const square: Record<Size, string> = {
  xs: "size-32",
  sm: "size-32 lg:size-40",
  default: "size-40 lg:size-48",
  lg: "size-48 lg:size-56",
};
const label: Record<Size, string> = {
  xs: "h-32 -translate-x-[calc(32px+6px)] px-8",
  sm: "h-32 -translate-x-[calc(32px+6px)] px-8 lg:h-40 lg:-translate-x-[calc(40px+6px)] lg:px-12",
  default: "h-40 -translate-x-[calc(40px+6px)] px-12 lg:h-48 lg:-translate-x-[calc(48px+6px)] lg:px-16",
  lg: "h-48 -translate-x-[calc(48px+6px)] px-16 lg:h-56 lg:-translate-x-[calc(56px+6px)] lg:px-24",
};
const colors: Record<Theme, string> = {
  light: "bg-foreground text-background",
  dark: "bg-foreground text-background",
  brand: "bg-brand text-black",
};
const move = "transition-transform duration-700 [transition-timing-function:var(--ease-power4-in-out)]";

function Plus() {
  return (
    <svg className="size-[0.75em]" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  );
}

/**
 * Reference button: label block + square "+" on the right. On hover a second square swings in on
 * the left (rotate -45→0, scale 0→1), the label slides right by one square, the right square
 * leaves, and the label scrambles.
 */
export function AnimatedButton({
  children,
  href,
  onClick,
  size = "default",
  theme = "light",
  className,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  size?: Size;
  theme?: Theme;
  className?: string;
}) {
  const scramble = useDualLayerScramble<HTMLSpanElement>({
    duration: 0.5,
    initiallyVisible: true,
    firstColorClass: theme === "brand" ? "scramble-white" : "scramble-brand",
    secondColorClass: "scramble-inherit",
  });
  const hovering = useRef(false);
  const onEnter = () => {
    if (hovering.current) return;
    hovering.current = true;
    scramble.scramble();
  };
  const onLeave = () => {
    hovering.current = false;
  };

  const inner = (
    <span className="relative flex w-full items-center gap-6">
      <span className={cx("flex items-center justify-center", move, square[size], colors[theme], "origin-left -rotate-45 scale-0 group-hover:rotate-0 group-hover:scale-100")}>
        <Plus />
      </span>
      <span className={cx("flex w-full flex-1 items-center justify-center", move, label[size], colors[theme], "group-hover:translate-x-0")}>
        <span ref={scramble.ref}>{children}</span>
      </span>
      <span className={cx("flex items-center justify-center", move, square[size], colors[theme], "absolute right-0 z-10 origin-right rotate-0 scale-100 group-hover:-rotate-45 group-hover:scale-0")}>
        <Plus />
      </span>
    </span>
  );

  const classes = cx(base, textSize[size], className);
  return href ? (
    <TransitionLink href={href} className={classes} onMouseEnter={onEnter} onMouseLeave={onLeave} onClick={onClick}>
      {inner}
    </TransitionLink>
  ) : (
    <button type="button" className={classes} onMouseEnter={onEnter} onMouseLeave={onLeave} onClick={onClick}>
      {inner}
    </button>
  );
}
