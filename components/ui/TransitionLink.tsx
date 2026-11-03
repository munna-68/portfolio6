"use client";

import NextLink from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { usePageTransition } from "@/components/providers/TransitionProvider";

type Props = Omit<ComponentProps<typeof NextLink>, "href"> & { href: string };

const isModified = (e: MouseEvent<HTMLAnchorElement>) =>
  e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0 || (e.currentTarget.target && e.currentTarget.target !== "_self");

/** Internal link that plays the accent-square page transition before navigating. */
export function TransitionLink({ href, onClick, ...rest }: Props) {
  const { navigate, isTransitioning } = usePageTransition();
  const external = /^(https?:|mailto:|tel:)/.test(href);
  return (
    <NextLink
      href={href}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || external || isModified(e)) return;
        e.preventDefault();
        if (!isTransitioning) navigate(href);
      }}
    />
  );
}
