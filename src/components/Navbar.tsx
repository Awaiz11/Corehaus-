import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { Logo } from "./ui/Logo";
import { FillButton } from "./ui/FillButton";
import { CTA, LINKS, NAV } from "@/data/content";
import { handleAnchorClick, lockScroll, unlockScroll } from "@/lib/scroll";
import { EASE, EASE_CINEMA } from "@/lib/motion";
import { cn } from "@/utils/cn";

export default function Navbar({ ready }: { ready: boolean }) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > prev && y > 520);
  });

  useEffect(() => {
    if (!open) return;
    lockScroll();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      unlockScroll();
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        initial={{ y: "-100%" }}
        animate={{ y: !ready ? "-100%" : hidden && !open ? "-110%" : "0%" }}
        transition={{ duration: 0.9, ease: EASE, delay: ready && !scrolled ? 0.5 : 0 }}
      >
        {/* glass backdrop appears once the page scrolls */}
        <motion.div
          aria-hidden
          className="absolute inset-0 border-b border-white/[0.08] bg-haus/70 backdrop-blur-xl"
          initial={false}
          animate={{ opacity: scrolled && !open ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />

        <nav
          aria-label="Main"
          className="relative mx-auto flex h-20 max-w-[1600px] items-center justify-between px-5 sm:px-8 lg:h-24 lg:px-12"
        >
          <a
            href="#top"
            onClick={(e) => handleAnchorClick(e, "#top", open ? close : undefined)}
            className="relative z-10 text-cream transition-opacity hover:opacity-80"
            aria-label="Corehaus — back to top"
          >
            <Logo className="text-[28px] sm:text-[32px]" />
          </a>

          {/* desktop links */}
          {/* docked beside the actions on small laptops, perfectly centred from xl */}
          <ul className="hidden items-center gap-8 lg:ml-auto lg:mr-12 lg:flex xl:absolute xl:left-1/2 xl:mx-0 xl:-translate-x-1/2 xl:gap-10">
            {NAV.map((item, i) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={(e) => handleAnchorClick(e, item.href)}
                  className="group relative flex items-start gap-1.5 py-2 text-[11px] font-medium uppercase tracking-[0.28em] text-cream/75 transition-colors duration-300 hover:text-cream"
                >
                  <span className="-mt-1 font-serif text-xs normal-case italic tracking-normal text-ember">
                    0{i + 1}
                  </span>
                  {item.label}
                  <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-ember transition-transform duration-500 ease-premium group-hover:origin-left group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>

          <div className="relative z-10 flex items-center gap-2 sm:gap-6">
            <a
              href={LINKS.login}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative hidden py-2 text-[11px] font-medium uppercase tracking-[0.28em] text-cream/80 transition-colors duration-300 hover:text-cream sm:block"
            >
              {CTA.login}
              <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-cream transition-transform duration-500 ease-premium group-hover:origin-left group-hover:scale-x-100" />
            </a>

            <FillButton href="#schedule" size="sm" className="hidden sm:inline-flex">
              {CTA.bookClass}
            </FillButton>

            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className={cn(
                "relative grid size-12 place-items-center rounded-full border backdrop-blur-md transition-colors duration-500 lg:hidden",
                open ? "border-cream/40 bg-cream/10" : "border-white/15 bg-white/[0.05]",
              )}
            >
              <motion.span
                className="absolute h-px w-5 bg-cream"
                animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }}
                transition={{ duration: 0.5, ease: EASE }}
              />
              <motion.span
                className="absolute h-px w-5 bg-cream"
                animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 4 }}
                transition={{ duration: 0.5, ease: EASE }}
              />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>{open && <MobileMenu onClose={close} />}</AnimatePresence>
    </>
  );
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  const item = {
    hidden: { y: "105%" },
    show: { y: "0%", transition: { duration: 0.9, ease: EASE } },
    exit: { y: "105%", transition: { duration: 0.45, ease: EASE_CINEMA } },
  };

  return (
    <motion.div
      id="mobile-menu"
      data-lenis-prevent
      className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-haus-900 lg:hidden"
      initial={{ clipPath: "circle(0% at 90% 40px)" }}
      animate={{ clipPath: "circle(160% at 90% 40px)" }}
      exit={{ clipPath: "circle(0% at 90% 40px)", transition: { duration: 0.75, ease: EASE_CINEMA, delay: 0.2 } }}
      transition={{ duration: 0.95, ease: EASE_CINEMA }}
    >
      <div aria-hidden className="pointer-events-none absolute -right-32 top-24 size-[420px] rounded-full bg-ember/15 blur-[120px]" />
      <div aria-hidden className="pointer-events-none absolute -left-40 bottom-10 size-[360px] rounded-full bg-copper/10 blur-[120px]" />

      <nav aria-label="Mobile" className="relative flex flex-1 flex-col justify-center px-6 pb-8 pt-28 sm:px-10">
        <motion.ul
          initial="hidden"
          animate="show"
          exit="exit"
          variants={{
            show: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
            exit: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
          }}
        >
          {NAV.map((link, i) => (
            <li key={link.href} className="overflow-hidden border-b border-white/10">
              <motion.a
                variants={item}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link.href, onClose)}
                className="group flex items-baseline justify-between py-5"
              >
                <span className="font-display text-[12.5vw] font-bold uppercase leading-none tracking-[-0.03em] transition-colors duration-300 group-hover:text-ember sm:text-7xl">
                  {link.label}
                </span>
                <span className="font-serif text-lg italic text-ember">0{i + 1}</span>
              </motion.a>
            </li>
          ))}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.65, duration: 0.8, ease: EASE } }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          className="mt-10 flex flex-col gap-3 sm:flex-row"
        >
          <FillButton
            href="#schedule"
            size="lg"
            onClick={(e) => handleAnchorClick(e, "#schedule", onClose)}
            className="w-full justify-between pl-7 sm:w-auto"
          >
            {CTA.bookClass}
          </FillButton>
          <FillButton
            href={LINKS.login}
            external
            variant="outline"
            size="lg"
            className="w-full justify-between pl-7 sm:w-auto"
          >
            {CTA.login}
          </FillButton>
        </motion.div>
      </nav>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.8, duration: 0.6 } }}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
        className="relative flex flex-wrap items-center justify-between gap-4 border-t border-white/10 px-6 py-6 text-[10px] uppercase tracking-[0.28em] text-cream/55 sm:px-10"
      >
        <a href={LINKS.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-cream">
          Instagram
        </a>
        <a href={LINKS.tiktok} target="_blank" rel="noopener noreferrer" className="hover:text-cream">
          TikTok
        </a>
        <a href={`mailto:${LINKS.email}`} className="normal-case tracking-[0.12em] hover:text-cream">
          {LINKS.email}
        </a>
      </motion.div>
    </motion.div>
  );
}
