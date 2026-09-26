import { AnimatePresence, motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { FillButton } from "./ui/FillButton";
import { CopyCode } from "./ui/CopyCode";
import { Logo } from "./ui/Logo";
import { IMAGES, PROMO } from "@/data/content";
import { EASE } from "@/lib/motion";
import { handleAnchorClick, lockScroll, unlockScroll } from "@/lib/scroll";

const backdrop: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6 } },
  exit: { opacity: 0, transition: { duration: 0.45, delay: 0.1 } },
};

const panel: Variants = {
  hidden: { opacity: 0, y: 70, scale: 0.94, filter: "blur(14px)" },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.95, ease: EASE, staggerChildren: 0.075, delayChildren: 0.3 },
  },
  exit: { opacity: 0, y: 36, scale: 0.97, filter: "blur(10px)", transition: { duration: 0.42, ease: EASE } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
};

interface WelcomeModalProps {
  open: boolean;
  onClose: () => void;
}

/** Summer promo popup — dark glassmorphism panel (content from corehaus.es) */
export default function WelcomeModal({ open, onClose }: WelcomeModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    lockScroll();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    // move focus into the dialog for keyboard / screen-reader users
    const focusTimer = window.setTimeout(() => panelRef.current?.focus({ preventScroll: true }), 450);
    return () => {
      unlockScroll();
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(focusTimer);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="promo"
          className="fixed inset-0 z-[90] flex items-end justify-center p-3 sm:items-center sm:p-6"
          initial="hidden"
          animate="show"
          exit="exit"
        >
          <motion.div
            aria-hidden
            variants={backdrop}
            onClick={onClose}
            className="absolute inset-0 bg-haus-950/60 backdrop-blur-md"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="promo-title"
            tabIndex={-1}
            data-lenis-prevent
            variants={panel}
            className="no-scrollbar relative grid outline-none focus-visible:outline-none max-h-[92svh] w-full max-w-[980px] overflow-y-auto rounded-[28px] border border-white/15 bg-haus/55 shadow-[0_80px_160px_-40px_rgba(0,0,0,0.9)] backdrop-blur-2xl sm:rounded-[36px] md:grid-cols-[0.85fr_1.15fr] md:overflow-hidden"
          >
            {/* glass highlights */}
            <span aria-hidden className="pointer-events-none absolute inset-x-10 top-0 z-20 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            <span aria-hidden className="pointer-events-none absolute -right-24 -top-28 size-72 rounded-full bg-ember/25 blur-[90px]" />
            <span aria-hidden className="pointer-events-none absolute -bottom-36 left-1/3 size-72 rounded-full bg-copper/15 blur-[100px]" />

            {/* visual */}
            <div className="relative hidden min-h-[560px] overflow-hidden md:block">
              <motion.img
                src={IMAGES.studioPortrait}
                alt=""
                aria-hidden
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                transition={{ duration: 2, ease: EASE }}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-haus via-haus/10 to-haus/30" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-haus/60" />
              <div className="absolute inset-x-8 bottom-8 text-cream">
                <Logo className="text-[42px]" />
              </div>
            </div>

            {/* content */}
            <div className="relative p-7 pt-9 sm:p-10 lg:p-12">
              <button
                type="button"
                onClick={onClose}
                aria-label="Close promo"
                className="absolute right-4 top-4 grid size-11 place-items-center rounded-full border border-white/15 bg-white/[0.05] text-cream/80 backdrop-blur-md transition-all duration-500 ease-premium hover:rotate-90 hover:border-cream hover:bg-cream hover:text-haus-950 sm:right-6 sm:top-6"
              >
                <X className="size-4" strokeWidth={1.5} />
              </button>

              <motion.h2
                id="promo-title"
                variants={item}
                className="flex items-center gap-3 pr-14 text-[10px] font-medium uppercase tracking-[0.42em] text-ember sm:text-[11px]"
              >
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-ember opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-ember" />
                </span>
                {PROMO.eyebrow}
              </motion.h2>

              <div className="mt-7 border-t border-white/10">
                {PROMO.offers.map((offer) => (
                  <motion.div key={offer.code} variants={item} className="border-b border-white/10 py-6">
                    <p className="whitespace-nowrap font-display text-5xl font-extrabold uppercase leading-none tracking-[-0.045em] text-cream sm:text-6xl">
                      {offer.discount}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                      <p className="text-sm text-cream/75 sm:text-base">{offer.title}</p>
                      <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.24em] text-cream/50">
                        <span>Code:</span>
                        <CopyCode code={offer.code} className="text-[10px]" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.p variants={item} className="mt-6 max-w-md text-sm leading-relaxed text-cream/70 sm:text-base">
                {PROMO.message}
              </motion.p>

              <motion.div variants={item} className="mt-8">
                <FillButton
                  href="#packages"
                  variant="ember"
                  size="lg"
                  onClick={(e) => handleAnchorClick(e, "#packages", onClose)}
                  className="w-full justify-between pl-7 sm:w-auto"
                >
                  {PROMO.cta}
                </FillButton>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
