// Cubic-bezier table copied from the reference (used by Motion and Lenis; GSAP uses its named eases).
export const easings = {
  power2Out: [0.33, 1, 0.68, 1],
  power3Out: [0.25, 1, 0.5, 1],
  power3InOut: [0.76, 0, 0.24, 1],
  expoOut: [0.16, 1, 0.3, 1],
  expoInOut: [0.87, 0, 0.13, 1],
  backOut: [0.34, 1.56, 0.64, 1],
  backInOut: [0.68, -0.6, 0.32, 1.6],
  backInOutSubtle: [0.68, -0.3, 0.32, 1.1],
} as const satisfies Record<string, readonly [number, number, number, number]>;

export const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
