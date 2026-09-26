import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import type { Variants } from "framer-motion";
import { Fragment, useRef } from "react";
import type { MouseEvent } from "react";
import { FillButton } from "./ui/FillButton";
import { CTA, HERO, IMAGES } from "@/data/content";
import { EASE } from "@/lib/motion";
import { handleAnchorClick } from "@/lib/scroll";
import { cn } from "@/utils/cn";

type Word = { text: string; accent?: boolean; breakAfter?: boolean };

/** "CREATE THE STRONGEST VERSION OF YOURSELF" split for the staggered reveal */
const WORDS: Word[] = HERO.headline.split(" ").map((text) => ({
  text,
  accent: text === "STRONGEST",
  breakAfter: text === "STRONGEST",
}));

const headline: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.35 } },
};

const word: Variants = {
  hidden: { y: "120%", rotate: 8, opacity: 0 },
  show: { y: "0%", rotate: 0, opacity: 1, transition: { duration: 1.25, ease: EASE } },
};

export default function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null);

  /* scroll-driven parallax */
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.14]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const shade = useTransform(scrollYProgress, [0, 1], [0, 0.8]);

  /* subtle mouse parallax (desktop) */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 45, damping: 18 });
  const sy = useSpring(my, { stiffness: 45, damping: 18 });
  const imgX = useTransform(sx, (v) => v * -28);
  const imgY = useTransform(sy, (v) => v * -18);

  const onMove = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  const enter = (delay: number) => ({
    initial: { opacity: 0, y: 28 },
    animate: ready ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1.05, ease: EASE, delay },
  });

  return (
    <section
      ref={ref}
      id="top"
      onMouseMove={onMove}
      className="relative flex h-[100svh] min-h-[680px] w-full items-end overflow-hidden bg-haus-950"
    >
      {/* ---------- cinematic background ---------- */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 will-change-transform">
        <motion.div
          className="absolute -inset-[4%]"
          initial={{ scale: 1.3, opacity: 0 }}
          animate={ready ? { scale: 1, opacity: 1 } : undefined}
          transition={{ duration: 2.8, ease: EASE }}
        >
          <motion.img
            src={IMAGES.studioHero}
            alt="Corehaus studio — custom resistance machines under warm neon light"
            style={{ x: imgX, y: imgY, scale: bgScale }}
            className="h-full w-full object-cover object-[60%_50%]"
          />
        </motion.div>
      </motion.div>

      {/* overlays: burgundy tint + depth gradients */}
      <div aria-hidden className="absolute inset-0 bg-haus/40 mix-blend-multiply" />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-haus-950/60 via-haus-950/10 to-haus md:from-haus-950/85 md:via-haus-950/25"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(120%_85%_at_0%_100%,rgba(40,24,25,0.96)_12%,transparent_62%)]"
      />
      <motion.div aria-hidden style={{ opacity: shade }} className="absolute inset-0 bg-haus" />

      {/* light sweep across the frame */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-y-1/4 left-0 w-[45%] -skew-x-12 bg-gradient-to-r from-transparent via-copper/[0.14] to-transparent blur-3xl"
        initial={{ x: "-160%" }}
        animate={ready ? { x: "330%" } : undefined}
        transition={{ duration: 3.4, delay: 0.6, ease: [0.45, 0, 0.2, 1] }}
      />

      {/* ---------- content ---------- */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto w-full max-w-[1600px] px-5 pb-8 sm:px-8 sm:pb-10 lg:px-12 lg:pb-14"
      >
        <motion.div
          {...enter(0.2)}
          className="mb-6 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.34em] text-cream/75 sm:mb-8 sm:text-[11px]"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-ember opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-ember" />
          </span>
          50&#8209;minute · high&#8209;intensity · low&#8209;impact
        </motion.div>

        <motion.h1
          variants={headline}
          initial="hidden"
          animate={ready ? "show" : "hidden"}
          aria-label={HERO.headline}
          className="font-display text-[11vw] font-extrabold uppercase leading-[0.9] tracking-[-0.035em] text-cream sm:text-[9.4vw] md:text-[6.3vw] 2xl:text-[6vw]"
        >
          {WORDS.map((w, i) => (
            <Fragment key={w.text}>
              <span
                aria-hidden
                className={cn(
                  "-mb-[0.09em] inline-block overflow-hidden pb-[0.09em] align-bottom",
                  w.accent && "-mr-[0.1em] pr-[0.2em]",
                )}
              >
                <motion.span
                  variants={word}
                  className={cn(
                    "inline-block origin-bottom-left will-change-transform",
                    w.accent &&
                      "font-serif text-[1.1em] font-normal italic tracking-[-0.01em] text-shimmer animate-shimmer",
                  )}
                >
                  {w.text}
                </motion.span>
              </span>
              {w.breakAfter && <br className="hidden md:inline" />}
              {i < WORDS.length - 1 && " "}
            </Fragment>
          ))}
        </motion.h1>

        <motion.div
          aria-hidden
          className="mt-8 h-px origin-left bg-white/15 sm:mt-10"
          initial={{ scaleX: 0 }}
          animate={ready ? { scaleX: 1 } : undefined}
          transition={{ duration: 1.6, ease: EASE, delay: 0.95 }}
        />

        <div className="mt-6 grid items-end gap-7 sm:mt-8 md:grid-cols-12 md:gap-10">
          <motion.p
            {...enter(1.05)}
            className="max-w-md text-[15px] leading-relaxed text-cream/70 sm:text-base md:col-span-6 lg:col-span-5"
          >
            {HERO.leadBefore}
            <strong className="font-semibold text-cream">{HERO.leadStrong}</strong>
            {HERO.leadAfter}
          </motion.p>

          <motion.div
            {...enter(1.2)}
            className="flex flex-col gap-3 sm:flex-row md:col-span-6 md:justify-end lg:col-span-7"
          >
            <FillButton href="#schedule" size="lg" className="w-full justify-between pl-7 sm:w-auto">
              {CTA.bookMyClass}
            </FillButton>
            <FillButton href="#packages" size="lg" variant="glass" className="w-full justify-between pl-7 sm:w-auto">
              {CTA.buyPackage}
            </FillButton>
          </motion.div>
        </div>
      </motion.div>

      {/* scroll cue */}
      <motion.a
        href="#about"
        onClick={(e) => handleAnchorClick(e, "#about")}
        aria-label="Scroll to About"
        className="absolute right-5 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-4 lg:right-12 lg:flex"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : undefined}
        transition={{ duration: 1, delay: 1.6 }}
      >
        <span className="text-[10px] uppercase tracking-[0.4em] text-cream/60 [writing-mode:vertical-rl]">
          Scroll
        </span>
        <span className="relative h-24 w-px overflow-hidden bg-cream/15">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-cream"
            animate={{ y: ["-100%", "220%"] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.a>
    </section>
  );
}
