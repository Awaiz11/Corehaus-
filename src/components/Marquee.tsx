import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { Fragment, useRef } from "react";
import type { ReactNode } from "react";
import { MARQUEE_WORDS, HERO } from "@/data/content";
import { EASE, wrap } from "@/lib/motion";

/** A row that drifts continuously and accelerates / reverses with scroll velocity */
function VelocityRow({ children, baseVelocity }: { children: ReactNode; baseVelocity: number }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smoothVelocity, [0, 1000], [0, 4], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    let moveBy = direction.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) direction.current = -1;
    else if (f > 0) direction.current = 1;
    moveBy += direction.current * moveBy * f;
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="flex overflow-hidden whitespace-nowrap">
      <motion.div style={{ x }} className="flex shrink-0 flex-nowrap whitespace-nowrap will-change-transform">
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} aria-hidden={i > 0} className="flex shrink-0 items-center">
            {children}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function Spark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="mx-6 size-[0.42em] shrink-0 text-ember sm:mx-10">
      <path fill="currentColor" d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" />
    </svg>
  );
}

export default function Marquee() {
  const accentWords = HERO.leadStrong.replace(/, and |, /g, "|").split("|"); // sculpt · tone · strengthen

  return (
    <motion.section
      aria-label="The Corehaus method"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.1, ease: EASE }}
      className="relative overflow-hidden border-y border-white/10 bg-haus py-7 sm:py-10"
    >
      <VelocityRow baseVelocity={-2}>
        {MARQUEE_WORDS.map((w) => (
          <Fragment key={w}>
            <span className="font-display text-[11vw] font-extrabold uppercase leading-[1.05] tracking-[-0.03em] text-cream sm:text-[7.5vw] lg:text-[6vw]">
              {w}
            </span>
            <Spark />
          </Fragment>
        ))}
      </VelocityRow>
      <VelocityRow baseVelocity={2}>
        {accentWords.map((w) => (
          <Fragment key={w}>
            <span className="font-serif text-[10vw] italic leading-[1.1] text-outline-ember sm:text-[6.5vw] lg:text-[5vw]">
              {w}
            </span>
            <span className="mx-8 h-px w-[8vw] shrink-0 bg-ember/40 sm:mx-12" aria-hidden />
          </Fragment>
        ))}
      </VelocityRow>
    </motion.section>
  );
}
