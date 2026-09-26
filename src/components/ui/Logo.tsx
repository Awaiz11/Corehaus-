import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { EASE } from "@/lib/motion";

interface LogoProps {
  className?: string;
  /** Plays the cinematic draw-on animation (used by the loader) */
  animated?: boolean;
}

/**
 * Corehaus wordmark — lowercase grotesk where the "o" is a tilted ring,
 * rebuilt in SVG/HTML so it can be animated and scales crisply.
 */
export function Logo({ className, animated = false }: LogoProps) {
  return (
    <span
      role="img"
      aria-label="Corehaus"
      className={cn(
        "inline-flex select-none items-baseline font-display font-semibold lowercase leading-none tracking-[-0.05em] stretch-semi",
        className,
      )}
    >
      <Letters text="c" animated={animated} delay={0.5} />
      <Ring animated={animated} />
      <Letters text="rehaus" animated={animated} delay={0.58} />
    </span>
  );
}

function Letters({ text, animated, delay }: { text: string; animated: boolean; delay: number }) {
  if (!animated) return <span aria-hidden>{text}</span>;
  return (
    <span aria-hidden className="-mb-[0.14em] inline-flex overflow-hidden pb-[0.14em]">
      {text.split("").map((ch, i) => (
        <motion.span
          key={`${ch}-${i}`}
          className="inline-block"
          initial={{ y: "115%" }}
          animate={{ y: "0%" }}
          transition={{ duration: 0.95, ease: EASE, delay: delay + i * 0.05 }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

function Ring({ animated }: { animated: boolean }) {
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 60 70"
      className="mx-[0.015em] h-[0.7em] w-[0.6em] translate-y-[0.07em] overflow-visible"
      initial={animated ? { rotate: -120, scale: 0.6 } : false}
      animate={animated ? { rotate: 0, scale: 1 } : undefined}
      transition={{ duration: 1.3, ease: EASE }}
    >
      <g transform="rotate(34 30 35)">
        <motion.ellipse
          cx="30"
          cy="35"
          rx="16.5"
          ry="29"
          fill="none"
          stroke="currentColor"
          strokeWidth="8.5"
          strokeLinecap="round"
          initial={animated ? { pathLength: 0 } : false}
          animate={animated ? { pathLength: 1 } : undefined}
          transition={{ duration: 1.2, ease: EASE, delay: 0.1 }}
        />
      </g>
    </motion.svg>
  );
}
