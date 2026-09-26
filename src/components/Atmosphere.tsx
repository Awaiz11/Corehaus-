import { motion, useScroll, useSpring } from "framer-motion";

/** Thin gradient progress bar pinned to the top of the viewport */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-gradient-to-r from-ember via-copper to-blush"
    />
  );
}

/** Subtle animated film grain for a cinematic texture */
export function Grain() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[110] overflow-hidden opacity-[0.055]">
      <div className="grain-layer absolute -inset-[50%] animate-grain" />
    </div>
  );
}
