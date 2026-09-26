import { AnimatePresence, MotionConfig } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import About from "./components/About";
import Schedule from "./components/Schedule";
import Packages from "./components/Packages";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";
import WelcomeModal from "./components/WelcomeModal";
import { Grain, ScrollProgress } from "./components/Atmosphere";
import { createLenis, destroyLenis, lockScroll, unlockScroll } from "./lib/scroll";

/** Splash duration (ms) — within the 1.5–2s brief */
const LOADER_MS = 1850;
/** Delay after the reveal before the promo popup glides in (ms) */
const PROMO_DELAY_MS = 2300;

export default function App() {
  const [loading, setLoading] = useState(true);
  const [promoOpen, setPromoOpen] = useState(false);

  /* smooth scrolling */
  useEffect(() => {
    if ("scrollRestoration" in window.history) window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    createLenis();
    return () => destroyLenis();
  }, []);

  /* cinematic splash — scroll is locked until it lifts */
  useEffect(() => {
    if (!loading) return;
    lockScroll();
    const timer = window.setTimeout(() => setLoading(false), LOADER_MS);
    return () => {
      window.clearTimeout(timer);
      unlockScroll();
    };
  }, [loading]);

  /* welcome popup shortly after the page is revealed */
  useEffect(() => {
    if (loading) return;
    const timer = window.setTimeout(() => setPromoOpen(true), PROMO_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [loading]);

  const closePromo = useCallback(() => setPromoOpen(false), []);

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>{loading && <Loader key="loader" />}</AnimatePresence>

      <ScrollProgress />
      <Navbar ready={!loading} />

      <main>
        <Hero ready={!loading} />
        <Marquee />
        <About />
        <Schedule />
        <Packages />
        <FinalCTA />
      </main>

      <Footer />
      <WelcomeModal open={promoOpen} onClose={closePromo} />
      <Grain />
    </MotionConfig>
  );
}
