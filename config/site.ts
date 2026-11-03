/**
 * Site-wide settings. The accent colour itself lives in app/globals.css (--accent).
 */
export const site = {
  /** "glass" = translucent frosted bar once scrolled (requested); "solid" = the reference's opaque surface bar. */
  headerStyle: "glass" as "glass" | "solid",
  /** Scroll distance (px) after which the navbar switches to its scrolled style. Reference: 50. */
  headerScrollThreshold: 50,
};
