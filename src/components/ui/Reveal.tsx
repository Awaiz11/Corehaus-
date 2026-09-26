import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/utils/cn";
import { EASE, maskRise } from "@/lib/motion";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  amount?: number;
}

/** Fade + slide-up as the element scrolls into view */
export function Reveal({ children, className, delay = 0, y = 56, amount = 0.2 }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 1.05, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

interface MaskLinesProps {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string | ((index: number) => string);
  delay?: number;
  stagger?: number;
  amount?: number;
}

/** Headline lines that rise one by one from behind a mask */
export function MaskLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.12,
  amount = 0.35,
}: MaskLinesProps) {
  return (
    <motion.span
      className={cn("block", className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {lines.map((line, i) => (
        <span key={i} className="-mb-[0.1em] block overflow-hidden pb-[0.1em]">
          <motion.span
            variants={maskRise}
            className={cn(
              "block origin-bottom-left will-change-transform",
              typeof lineClassName === "function" ? lineClassName(i) : lineClassName,
            )}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

interface EyebrowProps {
  index?: string;
  children: ReactNode;
  className?: string;
}

/** Editorial section label: (01) —— About */
export function Eyebrow({ index, children, className }: EyebrowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ duration: 0.9, ease: EASE }}
      className={cn(
        "flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.32em] text-cream/60",
        className,
      )}
    >
      {index && (
        <span className="font-serif text-base normal-case italic tracking-normal text-ember">({index})</span>
      )}
      <motion.span
        aria-hidden
        className="h-px w-10 origin-left bg-cream/30"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: EASE, delay: 0.25 }}
      />
      <span>{children}</span>
    </motion.div>
  );
}
