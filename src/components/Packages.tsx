import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Fragment } from "react";
import { ArrowUpRight } from "lucide-react";
import { Eyebrow, MaskLines, Reveal } from "./ui/Reveal";
import { CopyCode } from "./ui/CopyCode";
import { PACKAGES, PLAN_GROUPS } from "@/data/content";
import type { Plan, PlanGroup } from "@/data/content";
import { EASE, stagger } from "@/lib/motion";

const pad = (n: number) => String(n).padStart(2, "0");

export default function Packages() {
  return (
    <section id="packages" className="relative overflow-hidden bg-haus py-24 sm:py-32 lg:py-44">
      <div aria-hidden className="pointer-events-none absolute -left-40 top-40 size-[560px] rounded-full bg-ember/[0.08] blur-[150px]" />
      <div aria-hidden className="pointer-events-none absolute -right-52 bottom-40 size-[600px] rounded-full bg-copper/[0.06] blur-[160px]" />

      <div className="relative mx-auto max-w-[1600px] px-5 sm:px-8 lg:px-12">
        {/* ---------- header ---------- */}
        <header className="grid grid-cols-12 gap-y-10 lg:gap-x-12">
          <div className="col-span-12 lg:col-span-8">
            <Eyebrow index="03">Packages</Eyebrow>
            <h2
              aria-label={`${PACKAGES.title} ${PACKAGES.titleAccent}`}
              className="mt-8 font-display text-[14.5vw] font-extrabold uppercase leading-[0.88] tracking-[-0.045em] text-cream sm:mt-10 sm:text-[12vw] lg:text-[8.4vw]"
            >
              <MaskLines
                lines={[
                  PACKAGES.title,
                  <span className="font-serif font-normal normal-case italic tracking-[-0.02em] text-blush">
                    {PACKAGES.titleAccent}
                  </span>,
                ]}
              />
            </h2>
          </div>
          <Reveal delay={0.15} className="col-span-12 self-end lg:col-span-4">
            <div className="max-w-md space-y-4 text-base leading-relaxed text-cream/70 sm:text-lg">
              {PACKAGES.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </Reveal>
        </header>

        {/* ---------- fluid lists ---------- */}
        <div className="mt-20 space-y-20 sm:mt-28 sm:space-y-28 lg:mt-36 lg:space-y-32">
          {PLAN_GROUPS.map((group, gi) => (
            <PlanGroupBlock key={group.id} group={group} index={gi} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PlanGroupBlock({ group, index }: { group: PlanGroup; index: number }) {
  return (
    <div className="grid grid-cols-12 gap-y-6 lg:gap-x-12">
      <div className="col-span-12 lg:col-span-3">
        <Reveal y={30} className="lg:sticky lg:top-32">
          <p className="text-[11px] font-medium uppercase tabular-nums tracking-[0.32em] text-cream/40">
            {pad(index + 1)} / {pad(PLAN_GROUPS.length)}
          </p>
          <h3 className="mt-3 font-serif text-[2.6rem] italic leading-none text-blush sm:text-5xl lg:text-[3.4rem]">
            {group.title}
          </h3>
        </Reveal>
      </div>

      <motion.ul
        className="col-span-12 lg:col-span-9"
        variants={stagger(0.11, 0.05)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.12 }}
      >
        {group.plans.map((plan, i) => (
          <PlanRow key={plan.name} plan={plan} index={i} last={i === group.plans.length - 1} />
        ))}
      </motion.ul>
    </div>
  );
}

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 44 },
  show: { opacity: 1, y: 0, transition: { duration: 0.95, ease: EASE } },
};

const lineVariants: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 1.4, ease: EASE } },
};

function PlanRow({ plan, index, last }: { plan: Plan; index: number; last: boolean }) {
  return (
    <motion.li variants={rowVariants} className="group relative">
      {/* hairlines that draw themselves in */}
      <motion.span aria-hidden variants={lineVariants} className="absolute inset-x-0 top-0 h-px origin-left bg-white/10" />
      {last && (
        <motion.span aria-hidden variants={lineVariants} className="absolute inset-x-0 bottom-0 h-px origin-left bg-white/10" />
      )}

      {/* hover: ember light sweep + glowing top line */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-ember/[0.10] via-ember/[0.035] to-transparent transition-transform duration-700 ease-premium group-hover:scale-x-100"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-ember via-copper to-transparent transition-transform duration-700 ease-premium group-hover:scale-x-100"
      />

      <div className="relative grid grid-cols-12 items-center gap-x-4 gap-y-6 py-8 sm:py-10 lg:py-11">
        <span className="col-span-2 self-start pt-1 font-serif text-lg italic text-cream/35 transition-colors duration-500 group-hover:text-ember sm:col-span-1 sm:text-xl">
          {pad(index + 1)}
        </span>

        <div className="col-span-10 sm:col-span-6">
          <h4 className="font-display text-[26px] font-bold uppercase leading-[0.95] tracking-[-0.03em] transition-transform duration-700 ease-premium group-hover:translate-x-2 sm:text-4xl lg:text-[2.5rem]">
            {plan.name}
          </h4>
          <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-cream/55">
            {plan.perClass && <span className="font-medium text-cream/90">{plan.perClass}</span>}
            {plan.details.map((d, i) => (
              <Fragment key={d}>
                {(i > 0 || plan.perClass) && <span aria-hidden className="size-1 rounded-full bg-cream/25" />}
                <span>{d}</span>
              </Fragment>
            ))}
          </p>
          {plan.promo && (
            <p className="relative z-10 mt-4 flex flex-wrap items-center gap-2 text-[10px] font-medium uppercase tracking-[0.22em] text-ember">
              <span>USE CODE</span>
              <CopyCode code={plan.promo.code} className="text-[10px]" />
              <span>FOR {plan.promo.discount}</span>
            </p>
          )}
        </div>

        <div className="col-span-12 flex items-center justify-between gap-6 sm:col-span-5 sm:justify-end">
          <span className="font-display text-[56px] font-bold leading-none tabular-nums tracking-[-0.05em] transition-colors duration-500 group-hover:text-blush sm:text-6xl lg:text-7xl">
            {plan.price}
          </span>
          {/* stretched link: the whole row is clickable */}
          <a
            href={plan.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-3 rounded-full border border-cream/20 py-1.5 pl-5 pr-1.5 text-[10px] font-medium uppercase tracking-[0.22em] text-cream transition-[background-color,border-color,color,transform] duration-500 ease-premium after:absolute after:inset-0 after:content-[''] group-hover:scale-[1.04] group-hover:border-ember group-hover:bg-ember group-hover:text-haus-950"
          >
            {plan.cta}
            <span className="grid size-9 place-items-center rounded-full bg-cream/10 transition-colors duration-500 group-hover:bg-haus-950 group-hover:text-cream">
              <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:rotate-45" />
            </span>
          </a>
        </div>
      </div>
    </motion.li>
  );
}
