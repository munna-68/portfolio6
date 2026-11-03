"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Body background follows the first section's theme so overscroll and gaps match. */
export function SyncBodyTheme() {
  const pathname = usePathname();
  useEffect(() => {
    const sync = () => {
      const first = document.querySelector<HTMLElement>("main [data-section][data-theme]");
      if (first?.dataset.theme) document.body.dataset.theme = first.dataset.theme;
    };
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, [pathname]);
  return null;
}
