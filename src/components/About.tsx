import { motion, useScroll, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { useRef } from "react";
import type { ReactNode } from "react";
import { Eyebrow, MaskLines, Reveal } from "./ui/Reveal";
import { ParallaxImage } from "./ui/ParallaxImage";
import { RotatingBadge } from "./ui/RotatingBadge";
import { FillButton } from "./ui/FillButton";
import { ABOUT, CTA, FEATURES, IMAGES } from "@/data/content";
import type { Feature } from "@/data/content";
import { cn } from "@/utils/cn";

/** "STRENGTH TRAINING" → ["STRENGTH", "TRAINING"] (break at the last space) */
const titleLines = (title: string) => {
  const i = title.lastIndexOf(" ");
  return i === -1 ? [title] : [title.slice(0, i), title.slice(i + 1)];
};

const featureTitle =
  "font-display text-[8.6vw] font-extrabold uppercase leading-[0.88] tracking-[-0.04em] text-cream sm:text-[7vw] lg:text-[4.9vw]";

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const driftX = useTransform(scrollYProgress, [0, 1], ["8%", "-55%"]);

  return (
    <section id="about" ref={ref} className="relative overflow-hidden bg-haus pb-28 pt-24 sm:pb-36 sm:pt-32 lg:pb-48 lg:pt-40">
      {/* ambient light */}
      <div aria-hidden className="pointer-events-none absolute -left-40 top-24 size-[520px] rounded-full bg-ember/10 blur-[140px]" />
      <div aria-hidden className="pointer-events-none absolute -right-48 top-[42%] size-[640px] rounded-full bg-copper/[0.07] blur-[160px]" />

      {/* giant drifting outline type */}
      <motion.div
        aria-hidden
        style={{ x: driftX }}
        className="pointer-events-none absolute left-0 top-[31%] whitespace-nowrap font-display text-[26vw] font-black uppercase leading-none tracking-[-0.04em] text-outline"
      >
        Sculpt · Tone · Strengthen
      </motion.div>

      <div className="relative mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        <Intro />
        <Statement />

        <div className="mt-28 space-y-28 sm:mt-36 sm:space-y-40 lg:mt-52 lg:space-y-56">
          <FeatureStrength feature={FEATURES[0]} />
          <FeatureTension feature={FEATURES[1]} />
          <FeatureExperience feature={FEATURES[2]} />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Heading + overlapping portrait                                     */
/* ------------------------------------------------------------------ */
function Intro() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["10%", "-14%"]);
  const captionY = useTransform(scrollYProgress, [0, 1], ["60%", "-60%"]);

  return (
    <div ref={ref} className="relative grid grid-cols-12">
      <div className="relative z-10 col-span-12 lg:col-span-9">
        <Eyebrow index="01">About</Eyebrow>
        <h2
          aria-label={`${ABOUT.titleTop} ${ABOUT.titleMid} ${ABOUT.titleBottom}`}
          className="mt-8 font-display text-[12.4vw] font-extrabold uppercase leading-[0.86] tracking-[-0.045em] text-cream sm:mt-10 sm:text-[11vw] lg:text-[9.4vw]"
        >
          <MaskLines
            lines={[
              ABOUT.titleTop,
              <span className="pl-[14vw] font-serif font-normal normal-case italic tracking-[-0.02em] text-blush lg:pl-[16vw]">
                {ABOUT.titleMid}
              </span>,
              ABOUT.titleBottom,
            ]}
          />
        </h2>
      </div>

      <motion.div
        style={{ y: imageY }}
        className="relative col-span-8 col-start-5 -mt-[16vw] sm:col-span-6 sm:col-start-7 lg:absolute lg:col-auto lg:col-start-auto lg:right-0 lg:top-4 lg:mt-0 lg:w-[36%]"
      >
        <ParallaxImage
          src={IMAGES.studioPortrait}
          alt="Member training on a Corehaus custom machine"
          className="aspect-[3/4] w-full"
          speed={9}
        />
        <motion.p
          style={{ y: captionY }}
          className="absolute -left-4 bottom-10 hidden origin-bottom-left -rotate-90 whitespace-nowrap text-[10px] uppercase tracking-[0.4em] text-cream/50 sm:block lg:-left-8"
        >
          Corehaus — Strengthen, Tone &amp; Sculpt
        </motion.p>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Scroll-scrubbed statement                                          */
/* ------------------------------------------------------------------ */
function Statement() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = ABOUT.statement.split(" ");
  const accents = new Set(["50-minute", "custom", "machines."]);

  return (
    <div className="mt-20 grid grid-cols-12 items-start gap-y-10 sm:mt-28 lg:mt-40">
      <Reveal className="col-span-12 lg:col-span-3" y={30}>
        <RotatingBadge text="50‑minute · high‑intensity · low‑impact · ">
          <svg viewBox="0 0 60 70" aria-hidden className="h-9 w-8 text-ember">
            <ellipse cx="30" cy="35" rx="16.5" ry="29" fill="none" stroke="currentColor" strokeWidth="8.5" transform="rotate(34 30 35)" />
          </svg>
        </RotatingBadge>
      </Reveal>

      <p
        ref={ref}
        className="col-span-12 flex flex-wrap font-display text-[7.4vw] font-semibold leading-[1.08] tracking-[-0.03em] text-cream sm:text-[5.2vw] lg:col-span-9 lg:text-[3.7vw]"
      >
        {words.map((w, i) => (
          <ScrubWord
            key={`${w}-${i}`}
            progress={scrollYProgress}
            range={[i / words.length, (i + 1) / words.length]}
            accent={accents.has(w)}
          >
            {w}
          </ScrubWord>
        ))}
      </p>
    </div>
  );
}

function ScrubWord({
  children,
  progress,
  range,
  accent,
}: {
  children: ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
  accent: boolean;
}) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const y = useTransform(progress, range, [10, 0]);
  return (
    <span className="mr-[0.25em] mt-[0.08em] inline-block">
      <motion.span
        style={{ opacity, y }}
        className={cn("inline-block", accent && "font-serif font-normal italic tracking-[-0.01em] text-ember")}
      >
        {children}
      </motion.span>
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Shared bits                                                        */
/* ------------------------------------------------------------------ */
function FeatureLabel({ n }: { n: string }) {
  return (
    <Reveal y={16} className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.32em] text-cream/55">
      <span className="font-serif text-base normal-case italic tracking-normal text-ember">({n})</span>
      <span className="h-px w-16 bg-gradient-to-r from-cream/40 to-transparent" />
    </Reveal>
  );
}

function BigNumber({ n, y, className }: { n: string; y: MotionValue<number>; className?: string }) {
  return (
    <motion.span
      aria-hidden
      style={{ y }}
      className={cn(
        "pointer-events-none absolute select-none font-serif italic leading-none text-ember/90 [text-shadow:0_20px_60px_rgba(0,0,0,0.35)]",
        className,
      )}
    >
      {n}
    </motion.span>
  );
}

function useFeatureParallax() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [90, -90]);
  const numberY = useTransform(scrollYProgress, [0, 1], [170, -170]);
  const floatY = useTransform(scrollYProgress, [0, 1], [140, -200]);
  return { ref, textY, numberY, floatY };
}

/* 01 — image left, overlapping title on the right */
function FeatureStrength({ feature }: { feature: Feature }) {
  const { ref, textY, numberY } = useFeatureParallax();
  return (
    <article ref={ref} className="relative grid grid-cols-12 items-center gap-y-10">
      <div className="relative col-span-11 sm:col-span-9 lg:col-span-6">
        <ParallaxImage
          src={feature.image}
          alt="Strength training on a Corehaus resistance machine"
          className="aspect-[4/5] w-full"
          speed={10}
        />
        <BigNumber n={feature.n} y={numberY} className="-right-8 -top-12 text-[34vw] sm:-right-16 sm:text-[22vw] lg:-right-20 lg:text-[13vw]" />
      </div>

      <motion.div style={{ y: textY }} className="relative z-10 col-span-12 lg:col-span-6 lg:col-start-7 lg:-ml-[16%]">
        <FeatureLabel n={feature.n} />
        <h3 className={cn(featureTitle, "mt-6")}>
          <MaskLines lines={titleLines(feature.title)} lineClassName={(i) => (i === 1 ? "lg:pl-[12%]" : "")} />
        </h3>
        <Reveal delay={0.15} className="mt-8 max-w-md lg:ml-[12%]">
          <p className="text-base leading-relaxed text-cream/70 sm:text-lg">{feature.body}</p>
        </Reveal>
      </motion.div>
    </article>
  );
}

/* 02 — text left spilling over a wide image on the right */
function FeatureTension({ feature }: { feature: Feature }) {
  const { ref, textY, numberY } = useFeatureParallax();
  return (
    <article ref={ref} className="relative grid grid-cols-12 items-center gap-y-10">
      <motion.div
        style={{ y: textY }}
        className="relative z-10 order-2 col-span-12 lg:order-1 lg:col-span-5 lg:col-start-1 lg:row-start-1"
      >
        <FeatureLabel n={feature.n} />
        <h3 className={cn(featureTitle, "mt-6")}>
          <MaskLines lines={titleLines(feature.title)} />
        </h3>
        <Reveal delay={0.15} className="mt-8 max-w-md lg:max-w-[17rem]">
          <p className="text-base leading-relaxed text-cream/70 sm:text-lg">{feature.body}</p>
        </Reveal>
      </motion.div>

      {/* shares row 1 with the text on desktop so the title overlaps the frame */}
      <div className="relative order-1 col-span-12 sm:col-span-11 sm:col-start-2 lg:order-2 lg:col-span-9 lg:col-start-4 lg:row-start-1">
        <ParallaxImage
          src={feature.image}
          alt="Slow, controlled lunge on the sliding carriage"
          className="aspect-[4/3] w-full sm:aspect-[16/10]"
          speed={9}
        />
        <BigNumber n={feature.n} y={numberY} className="-bottom-10 right-4 text-[34vw] sm:text-[22vw] lg:-bottom-16 lg:right-10 lg:text-[13vw]" />
      </div>
    </article>
  );
}

/* 03 — cinematic wide frame, floating inset, title overlapping the bottom edge */
function FeatureExperience({ feature }: { feature: Feature }) {
  const { ref, textY, numberY, floatY } = useFeatureParallax();
  return (
    <article ref={ref} className="relative">
      <div className="relative">
        <ParallaxImage
          src={feature.image}
          alt="High-energy group class with a DJ and instructor"
          className="aspect-[4/5] w-full sm:aspect-[16/10] lg:aspect-[21/9]"
          speed={8}
        />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-haus via-haus/50 to-transparent" />

        <motion.div
          style={{ y: floatY }}
          className="absolute -top-14 right-3 w-[34%] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)] sm:-top-20 sm:right-8 sm:w-[24%] lg:-top-28 lg:right-14 lg:w-[16%]"
        >
          <ParallaxImage src={IMAGES.dj} alt="DJ-curated playlists" className="aspect-[3/4] w-full" speed={12} />
        </motion.div>

        <BigNumber n={feature.n} y={numberY} className="left-3 top-4 text-[30vw] sm:left-8 sm:text-[20vw] lg:text-[12vw]" />
      </div>

      <motion.div
        style={{ y: textY }}
        className="relative z-10 -mt-28 grid grid-cols-12 items-end gap-y-8 sm:-mt-40 lg:-mt-56"
      >
        <div className="col-span-12 lg:col-span-7">
          <FeatureLabel n={feature.n} />
          <h3 className={cn(featureTitle, "mt-6")}>
            <MaskLines lines={titleLines(feature.title)} />
          </h3>
        </div>
        <Reveal delay={0.15} className="col-span-12 lg:col-span-4 lg:col-start-9">
          <p className="text-base leading-relaxed text-cream/70 sm:text-lg">{feature.body}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <FillButton href="#schedule" size="md">
              {CTA.bookMyClass}
            </FillButton>
            <FillButton href="#packages" size="md" variant="outline" icon={false}>
              {CTA.buyPackage}
            </FillButton>
          </div>
        </Reveal>
      </motion.div>
    </article>
  );
}
