import { motion, useScroll, useTransform } from "framer-motion";
import type { Variants } from "framer-motion";
import { Fragment, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { FillButton } from "./ui/FillButton";
import { Reveal } from "./ui/Reveal";
import { RotatingBadge } from "./ui/RotatingBadge";
import { CTA, HERO, IMAGES } from "@/data/content";
import { EASE } from "@/lib/motion";
import { handleAnchorClick } from "@/lib/scroll";
import { cn } from "@/utils/cn";

/* "Get ready to sweat, shake, and keep coming back for more." */
const CLOSING = HERO.leadAfter.slice(HERO.leadAfter.indexOf("Get ready"));
const ACCENTS = new Set(["sweat,", "shake,"]);

const wordRise: Variants = {
  hidden: { y: "115%", rotate: 5 },
  show: { y: "0%", rotate: 0, transition: { duration: 1.1, ease: EASE } },
};

export default function FinalCTA() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-14%", "14%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.35, 1.1, 1.02]);

  return (
    <section
      ref={ref}
      aria-label={CTA.bookClass}
      className="relative isolate flex min-h-[88svh] items-center overflow-hidden bg-haus-950 py-28 sm:py-36"
    >
      <motion.img
        src={IMAGES.detail}
        alt=""
        aria-hidden
        style={{ y, scale }}
        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-75"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-haus/45 mix-blend-multiply" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-haus via-haus/30 to-haus" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(65%_55%_at_50%_50%,transparent,rgba(20,11,12,0.75))]"
      />

      <div className="mx-auto flex w-full max-w-[1600px] flex-col items-center px-5 text-center sm:px-8 lg:px-12">
        <motion.a
          href="#schedule"
          onClick={(e) => handleAnchorClick(e, "#schedule")}
          aria-label={CTA.bookClass}
          initial={{ opacity: 0, scale: 0.6, rotate: -40 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          whileHover={{ scale: 1.08 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.2, ease: EASE }}
          className="group mb-10 sm:mb-14"
        >
          <RotatingBadge text="Book your class · Book your class · ">
            <span className="grid size-12 place-items-center rounded-full bg-ember text-haus-950 transition-transform duration-500 group-hover:rotate-45">
              <ArrowUpRight className="size-5" />
            </span>
          </RotatingBadge>
        </motion.a>

        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
          aria-label={CLOSING}
          className="max-w-[17ch] font-display text-[10.5vw] font-extrabold uppercase leading-[0.92] tracking-[-0.04em] text-cream sm:text-[7.6vw] lg:text-[5.6vw]"
        >
          {CLOSING.split(" ").map((w, i, arr) => (
            <Fragment key={`${w}-${i}`}>
              <span aria-hidden className="-mb-[0.1em] inline-block overflow-hidden pb-[0.1em] pr-[0.04em] align-bottom">
                <motion.span
                  variants={wordRise}
                  className={cn(
                    "inline-block origin-bottom-left",
                    ACCENTS.has(w) && "font-serif font-normal italic tracking-[-0.01em] text-shimmer animate-shimmer",
                  )}
                >
                  {w}
                </motion.span>
              </span>
              {i < arr.length - 1 && " "}
            </Fragment>
          ))}
        </motion.h2>

        <Reveal delay={0.3} className="mt-12 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <FillButton href="#schedule" size="lg" className="w-full justify-between pl-7 sm:w-auto">
            {CTA.bookMyClass}
          </FillButton>
          <FillButton href="#packages" size="lg" variant="glass" className="w-full justify-between pl-7 sm:w-auto">
            {CTA.buyPackage}
          </FillButton>
        </Reveal>
      </div>
    </section>
  );
}
