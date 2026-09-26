import type { Transition, Variants } from "framer-motion";

export type Bezier = [number, number, number, number];

/** Signature easings */
export const EASE: Bezier = [0.22, 1, 0.36, 1];
export const EASE_CINEMA: Bezier = [0.76, 0, 0.24, 1];

export const springSoft: Transition = { type: "spring", stiffness: 260, damping: 26, mass: 0.8 };
export const springSnappy: Transition = { type: "spring", stiffness: 420, damping: 30 };

/** Standard section reveal: fade + slide up */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 56 },
  show: { opacity: 1, y: 0, transition: { duration: 1.05, ease: EASE } },
};

/** Parent that staggers its children */
export const stagger = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

/** Word/line that rises from behind a mask */
export const maskRise: Variants = {
  hidden: { y: "115%", rotate: 6 },
  show: { y: "0%", rotate: 0, transition: { duration: 1.15, ease: EASE } },
};

export const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};
