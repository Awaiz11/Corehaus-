import { AnimatePresence, motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent, MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Clock, Moon } from "lucide-react";
import { Eyebrow, MaskLines, Reveal } from "./ui/Reveal";
import { FillButton } from "./ui/FillButton";
import { CTA, LINKS, SCHEDULE, SCHEDULE_DAYS, getSessions } from "@/data/content";
import type { ScheduleDay, Session } from "@/data/content";
import { EASE } from "@/lib/motion";
import { cn } from "@/utils/cn";

const pad = (n: number) => String(n).padStart(2, "0");

export default function Schedule() {
  const [selected, setSelected] = useState(1);

  return (
    <section id="schedule" className="relative overflow-hidden bg-haus-900 py-24 sm:py-32 lg:py-44">
      <div aria-hidden className="pointer-events-none absolute -right-40 top-10 size-[560px] rounded-full bg-ember/[0.09] blur-[150px]" />
      <div aria-hidden className="pointer-events-none absolute -left-52 bottom-0 size-[520px] rounded-full bg-copper/[0.06] blur-[150px]" />

      <div className="relative mx-auto grid max-w-[1600px] grid-cols-12 gap-y-14 px-5 sm:px-8 lg:gap-x-12 lg:px-12">
        {/* ---------- header ---------- */}
        <div className="col-span-12 lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <Eyebrow index="02">Schedule</Eyebrow>
            <h2 className="mt-8 sm:mt-10" aria-label={`${SCHEDULE.eyebrow} ${SCHEDULE.title}`}>
              <MaskLines
                lines={[
                  <span className="font-serif text-[13vw] font-normal italic leading-[0.95] text-blush sm:text-[10vw] lg:text-[4.6vw]">
                    {SCHEDULE.eyebrow}
                  </span>,
                  <span className="font-display text-[15.5vw] font-extrabold uppercase leading-[0.9] tracking-[-0.045em] text-cream sm:text-[13vw] lg:text-[5.3vw]">
                    {SCHEDULE.title}
                  </span>,
                ]}
              />
            </h2>
            <Reveal delay={0.1} className="mt-8 max-w-md">
              <p className="text-base leading-relaxed text-cream/70">{SCHEDULE.body}</p>
            </Reveal>
            <Reveal delay={0.2} className="mt-10">
              <FillButton href={LINKS.booking} external size="lg">
                {CTA.bookMyClass}
              </FillButton>
            </Reveal>
          </div>
        </div>

        {/* ---------- booking app ---------- */}
        <Reveal className="col-span-12 lg:col-span-8" amount={0.08} y={80}>
          <BookingPanel selected={selected} onSelect={setSelected} />
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
function BookingPanel({ selected, onSelect }: { selected: number; onSelect: (d: number) => void }) {
  const stripRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, startLeft: 0, moved: false });
  const day = SCHEDULE_DAYS[selected - 1];
  const sessions = useMemo(() => getSessions(day), [day]);

  /* keep the active date centred in the strip */
  useEffect(() => {
    const strip = stripRef.current;
    const el = strip?.querySelector<HTMLElement>(`[data-day="${selected}"]`);
    if (!strip || !el) return;
    strip.scrollTo({ left: el.offsetLeft - strip.clientWidth / 2 + el.offsetWidth / 2, behavior: "smooth" });
  }, [selected]);

  /* mouse drag-to-scroll */
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !stripRef.current) return;
    drag.current = { active: true, startX: e.clientX, startLeft: stripRef.current.scrollLeft, moved: false };
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const strip = stripRef.current;
    if (!d.active || !strip) return;
    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > 5) {
      d.moved = true;
      strip.style.scrollSnapType = "none";
    }
    strip.scrollLeft = d.startLeft - dx;
  };
  const endDrag = () => {
    drag.current.active = false;
    if (stripRef.current) stripRef.current.style.scrollSnapType = "";
  };

  const pick = (date: number) => {
    if (drag.current.moved) {
      drag.current.moved = false;
      return;
    }
    onSelect(date);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") onSelect(Math.min(SCHEDULE_DAYS.length, selected + 1));
    if (e.key === "ArrowLeft") onSelect(Math.max(1, selected - 1));
  };

  const nudge = (dir: 1 | -1) =>
    stripRef.current?.scrollBy({ left: dir * stripRef.current.clientWidth * 0.7, behavior: "smooth" });

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.015] shadow-[0_60px_140px_-50px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:rounded-[36px]">
      <span aria-hidden className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

      {/* header */}
      <div className="flex items-end justify-between gap-4 px-5 pb-6 pt-7 sm:px-8 sm:pt-9">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.34em] text-cream/45">
            {SCHEDULE.eyebrow} {SCHEDULE.title}
          </p>
          <p className="mt-2 font-display text-3xl font-bold uppercase leading-none tracking-[-0.03em] sm:text-[42px]">
            {SCHEDULE.month}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StripArrow label="Previous dates" onClick={() => nudge(-1)}>
            <ChevronLeft className="size-4" />
          </StripArrow>
          <StripArrow label="Next dates" onClick={() => nudge(1)}>
            <ChevronRight className="size-4" />
          </StripArrow>
        </div>
      </div>

      {/* horizontal date selector */}
      <motion.div
        ref={stripRef}
        layoutScroll
        data-lenis-prevent
        role="tablist"
        aria-label={`${SCHEDULE.month} dates`}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        className="no-scrollbar mask-fade-x relative flex cursor-grab snap-x snap-proximity gap-2 overflow-x-auto px-5 pb-7 pt-1 outline-none active:cursor-grabbing sm:gap-3 sm:px-8"
      >
        {SCHEDULE_DAYS.map((d) => (
          <DayPill key={d.date} day={d} active={d.date === selected} onClick={() => pick(d.date)} />
        ))}
      </motion.div>

      <div className="mx-5 h-px bg-white/10 sm:mx-8" />

      {/* selected day + animated class list */}
      <AutoHeight>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={selected}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -14, filter: "blur(6px)", transition: { duration: 0.28, ease: EASE } }}
            transition={{ duration: 0.3 }}
          >
            <DaySummary day={day} />
            {sessions.length > 0 ? <SessionList day={day} sessions={sessions} /> : <NoClasses />}
          </motion.div>
        </AnimatePresence>
      </AutoHeight>

      {/* footer legend */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 px-5 py-5 text-[10px] font-medium uppercase tracking-[0.28em] text-cream/45 sm:px-8">
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-ember" /> Classes
          </span>
          <span className="flex items-center gap-2">
            <span className="h-px w-3 bg-cream/40" /> No classes
          </span>
        </div>
        <a
          href={LINKS.booking}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 text-cream/70 transition-colors hover:text-cream"
        >
          {CTA.bookClass}
          <ArrowUpRight className="size-3.5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </div>
    </div>
  );
}

function StripArrow({ children, label, onClick }: { children: ReactNode; label: string; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={onClick}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      className="grid size-11 place-items-center rounded-full border border-white/15 text-cream/80 transition-colors duration-300 hover:border-cream hover:bg-cream hover:text-haus-950"
    >
      {children}
    </motion.button>
  );
}

function DayPill({ day, active, onClick }: { day: ScheduleDay; active: boolean; onClick: () => void }) {
  const closed = !day.lower;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      data-day={day.date}
      onClick={onClick}
      aria-label={`${day.weekday} ${day.date} ${SCHEDULE.month}${closed ? " — no classes" : ""}`}
      className={cn(
        "relative flex h-[92px] w-[62px] shrink-0 snap-center select-none flex-col items-center justify-center gap-1.5 rounded-2xl border transition-colors duration-300 sm:h-[104px] sm:w-[72px]",
        active
          ? "border-transparent text-haus-950"
          : "border-white/[0.08] text-cream hover:border-white/25 hover:bg-white/[0.05]",
        closed && !active && "text-cream/35",
      )}
    >
      {active && (
        <motion.span
          layoutId="schedule-active-day"
          className="absolute inset-0 rounded-2xl bg-cream shadow-[0_14px_40px_-12px_rgba(243,239,222,0.55)]"
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
        />
      )}
      <span className="relative text-[10px] font-medium uppercase tracking-[0.2em] opacity-70">{day.short}</span>
      <span className="relative font-display text-2xl font-bold leading-none tabular-nums tracking-tight sm:text-[28px]">
        {pad(day.date)}
      </span>
      <span
        aria-hidden
        className={cn("relative mt-0.5 rounded-full", closed ? "h-px w-3 bg-current opacity-60" : "size-1 bg-ember")}
      />
    </button>
  );
}

function DaySummary({ day }: { day: ScheduleDay }) {
  return (
    <div className="flex flex-col gap-5 px-5 pt-7 sm:flex-row sm:items-end sm:justify-between sm:px-8 sm:pt-9">
      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.34em] text-ember">{day.weekday}</p>
        <p className="mt-2 font-display text-2xl font-bold uppercase leading-none tracking-[-0.03em] sm:text-3xl">
          {pad(day.date)} {SCHEDULE.month}
        </p>
      </div>
      {day.lower && day.upper && (
        <div className="flex flex-wrap gap-2">
          <FocusTag label="Lower body" value={day.lower} />
          <FocusTag label="Upper body" value={day.upper} />
        </div>
      )}
    </div>
  );
}

function FocusTag({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs">
      <span className="text-[10px] uppercase tracking-[0.2em] text-cream/45">{label}</span>
      <span className="font-medium text-cream">{value}</span>
    </span>
  );
}

const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.065, delayChildren: 0.06 } },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 26, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: EASE } },
};

function SessionList({ day, sessions }: { day: ScheduleDay; sessions: Session[] }) {
  return (
    <motion.ul
      variants={listVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-2.5 px-3 pb-6 pt-6 sm:gap-3 sm:px-5 sm:pb-8"
    >
      {sessions.map((s) => (
        <motion.li key={s.start} variants={rowVariants}>
          <SessionRow day={day} session={s} />
        </motion.li>
      ))}
    </motion.ul>
  );
}

function SessionRow({ day, session }: { day: ScheduleDay; session: Session }) {
  const onMove = (e: ReactMouseEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  return (
    <motion.a
      href={LINKS.booking}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={onMove}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 360, damping: 24 }}
      aria-label={`${CTA.bookMyClass}: ${day.lower} & ${day.upper} at ${session.start}`}
      className="group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] px-3.5 py-4 transition-[border-color,background-color,box-shadow] duration-500 hover:border-ember/40 hover:bg-white/[0.05] hover:shadow-[0_26px_60px_-22px_rgba(230,110,111,0.6),0_0_0_1px_rgba(230,110,111,0.12)] sm:gap-6 sm:p-5"
    >
      {/* cursor spotlight */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(280px_circle_at_var(--x,50%)_var(--y,50%),rgba(230,110,111,0.18),transparent_70%)]"
      />

      <div className="relative w-[54px] shrink-0 sm:w-[84px]">
        <p className="font-display text-lg font-bold leading-none tabular-nums tracking-tight sm:text-2xl">{session.start}</p>
        <p className="mt-1.5 text-[11px] tabular-nums text-cream/45">{session.end}</p>
      </div>

      <span aria-hidden className="relative hidden h-10 w-px shrink-0 bg-white/10 transition-colors duration-500 group-hover:bg-ember/60 sm:block" />

      <div className="relative min-w-0 flex-1">
        <p className="font-display text-sm font-semibold uppercase leading-tight tracking-[-0.01em] sm:text-lg">
          {day.lower} <span className="font-serif text-[1.15em] font-normal normal-case italic text-ember">&amp;</span> {day.upper}
        </p>
        <p className="mt-1.5 flex items-center gap-2 text-xs text-cream/50">
          <Clock className="size-3.5 shrink-0" aria-hidden />
          <span className="whitespace-nowrap">50 min</span>
          <span aria-hidden className="hidden size-0.5 shrink-0 rounded-full bg-cream/40 sm:block" />
          <span className="hidden truncate sm:inline">High&#8209;intensity · Low&#8209;impact</span>
        </p>
      </div>

      <span className="relative flex shrink-0 items-center gap-3">
        <span className="hidden text-[10px] font-medium uppercase tracking-[0.22em] text-cream/55 transition-colors duration-300 group-hover:text-cream md:inline">
          {CTA.bookMyClass}
        </span>
        <span className="grid size-9 place-items-center rounded-full border border-white/15 transition-all duration-500 group-hover:border-ember group-hover:bg-ember group-hover:text-haus-950 sm:size-10">
          <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:rotate-45" />
        </span>
      </span>
    </motion.a>
  );
}

function NoClasses() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE, delay: 0.05 }}
      className="flex flex-col items-center px-6 pb-16 pt-12 text-center"
    >
      <span className="grid size-16 place-items-center rounded-full border border-white/10 bg-white/[0.03]">
        <Moon className="size-6 text-blush" aria-hidden />
      </span>
      <p className="mt-6 font-display text-2xl font-bold uppercase tracking-[-0.02em]">No classes</p>
      <p className="mt-2 max-w-xs text-sm text-cream/55">Pick another date to book your class.</p>
    </motion.div>
  );
}

/** Smoothly animates its height whenever the content size changes */
function AutoHeight({ children }: { children: ReactNode }) {
  const inner = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | "auto">("auto");
  const [clip, setClip] = useState(false);

  useLayoutEffect(() => {
    const el = inner.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <motion.div
      initial={false}
      animate={{ height }}
      transition={{ duration: 0.55, ease: EASE }}
      onAnimationStart={() => setClip(true)}
      onAnimationComplete={() => setClip(false)}
      style={{ overflow: clip ? "hidden" : "visible" }}
    >
      <div ref={inner}>{children}</div>
    </motion.div>
  );
}
