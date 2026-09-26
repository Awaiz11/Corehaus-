import Lenis from "lenis";

/* ------------------------------------------------------------------
   Smooth-scroll controller (Lenis) with a ref-counted scroll lock so
   the loader, the promo modal and the mobile menu can all pause it.
------------------------------------------------------------------- */
let lenis: Lenis | null = null;
let locks = 0;

export function createLenis() {
  if (typeof window === "undefined" || lenis) return;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    autoRaf: true,
  });

  if (locks > 0) lenis.stop();
}

export function destroyLenis() {
  lenis?.destroy();
  lenis = null;
}

export function scrollToTarget(target: string | number, offset = 0) {
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.6, force: true });
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: "smooth" });
  } else {
    const el = document.querySelector(target);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }
}

export function lockScroll() {
  locks += 1;
  lenis?.stop();
  document.documentElement.classList.add("scroll-locked");
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1);
  if (locks === 0) {
    lenis?.start();
    document.documentElement.classList.remove("scroll-locked");
  }
}

/** Handles in-page anchor clicks (#about, #schedule…) with smooth scrolling */
export function handleAnchorClick(e: { preventDefault: () => void }, href: string, after?: () => void) {
  if (!href.startsWith("#")) return;
  e.preventDefault();
  after?.();
  // give closing overlays (menu / modal) a moment to release the scroll lock
  window.setTimeout(() => scrollToTarget(href === "#top" ? 0 : href, 0), after ? 90 : 0);
}
