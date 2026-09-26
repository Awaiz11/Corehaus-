import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Logo } from "./ui/Logo";
import { ABOUT } from "@/data/content";
import { EASE, EASE_CINEMA } from "@/lib/motion";

const COUNT_DURATION = 1.55; // seconds

/** Cinematic splash: ring draws itself, wordmark rises, counter runs, then fades away. */
export default function Loader() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / (COUNT_DURATION * 1000));
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const tagline = `${ABOUT.titleTop} ${ABOUT.titleMid} ${ABOUT.titleBottom}`;

  return (
    <motion.div
      role="status"
      aria-label="Loading Corehaus"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-haus"
      exit={{ opacity: 0, transition: { duration: 0.9, ease: EASE_CINEMA, delay: 0.2 } }}
    >
      {/* ambient ember glow */}
      <motion.div
        aria-hidden
        className="absolute left-1/2 top-1/2 size-[110vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(230,110,111,0.2)_0%,rgba(232,149,106,0.06)_32%,transparent_62%)]"
        initial={{ scale: 0.35, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.2, ease: EASE }}
      />

      {/* wordmark */}
      <motion.div
        className="relative text-cream"
        exit={{ y: -36, opacity: 0, filter: "blur(12px)", transition: { duration: 0.7, ease: EASE_CINEMA } }}
      >
        <Logo animated className="text-[19vw] sm:text-[13vw] lg:text-[10rem]" />
      </motion.div>

      <motion.p
        className="relative mt-5 overflow-hidden text-[10px] font-medium uppercase tracking-[0.5em] text-cream/55 sm:text-[11px]"
        exit={{ opacity: 0, transition: { duration: 0.3 } }}
      >
        <motion.span
          className="block"
          initial={{ y: "110%" }}
          animate={{ y: "0%" }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.95 }}
        >
          {tagline}
        </motion.span>
      </motion.p>

      {/* footer meta */}
      <motion.div
        className="absolute inset-x-0 bottom-0 flex items-end justify-between px-5 pb-6 sm:px-10 sm:pb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.3 } }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <span className="max-w-[16ch] text-[10px] uppercase leading-relaxed tracking-[0.32em] text-cream/40 sm:max-w-none">
          Create the strongest version of yourself
        </span>
        <span className="font-display text-5xl font-bold tabular-nums leading-none tracking-tight text-cream sm:text-7xl">
          {String(count).padStart(3, "0")}
        </span>
      </motion.div>

      {/* progress line */}
      <motion.span
        aria-hidden
        className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-gradient-to-r from-ember via-copper to-blush"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: COUNT_DURATION, ease: [0.65, 0, 0.35, 1] }}
      />
    </motion.div>
  );
}
