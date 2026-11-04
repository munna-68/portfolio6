import { assets, type AssetSlot, type ImageAsset } from "@/config/assets";
import { cx } from "@/lib/cx";

/**
 * Image by slot name. The wrapper owns the box (pass an aspect class or fill a parent), so the
 * page never shifts while images load. `fit` defaults to cover.
 * Pass `image` instead of `slot` for one-off images (e.g. case-study screenshots).
 */
export function Media({
  slot,
  image,
  className,
  imgClassName,
  priority = false,
  sizes = "100vw",
  alt,
}: {
  slot?: AssetSlot;
  image?: ImageAsset;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  sizes?: string;
  alt?: string;
}) {
  const asset = image ?? assets[slot as AssetSlot];
  return (
    <div className={cx(!/\b(absolute|fixed)\b/.test(className ?? "") && "relative", "overflow-hidden bg-surface", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset.src}
        alt={alt ?? asset.alt}
        width={asset.width}
        height={asset.height}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        className={cx("absolute inset-0 h-full w-full object-cover", imgClassName)}
      />
    </div>
  );
}
