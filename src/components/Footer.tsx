import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { ReactNode } from "react";
import { ArrowUp, ArrowUpRight, Mail } from "lucide-react";
import { Logo } from "./ui/Logo";
import { FillButton } from "./ui/FillButton";
import { Reveal } from "./ui/Reveal";
import { CTA, HERO, LINKS, NAV } from "@/data/content";
import { handleAnchorClick, scrollToTarget } from "@/lib/scroll";
import { cn } from "@/utils/cn";

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const markY = useTransform(scrollYProgress, [0, 1], ["55%", "0%"]);
  const markOpacity = useTransform(scrollYProgress, [0.25, 1], [0.05, 1]);

  const [before, after] = HERO.headline.split("STRONGEST");

  return (
    <footer ref={ref} className="relative overflow-hidden border-t border-white/10 bg-haus">
      <div aria-hidden className="pointer-events-none absolute -bottom-40 left-1/2 size-[700px] -translate-x-1/2 rounded-full bg-ember/[0.08] blur-[160px]" />

      <div className="relative mx-auto max-w-[1600px] px-5 pt-20 sm:px-8 sm:pt-28 lg:px-12">
        <div className="grid grid-cols-2 gap-x-6 gap-y-14 sm:grid-cols-6 lg:grid-cols-12">
          <Reveal className="col-span-2 sm:col-span-6 lg:col-span-5">
            <p className="max-w-lg font-display text-[34px] font-extrabold uppercase leading-[0.95] tracking-[-0.035em] [word-spacing:0.08em] sm:text-5xl">
              {before}
              <span className="font-serif font-normal italic tracking-[-0.01em] text-blush">STRONGEST</span>
              {after}
            </p>
            <div className="mt-9">
              <FillButton href="#schedule">{CTA.bookClass}</FillButton>
            </div>
          </Reveal>

          <FooterCol title="Explore" delay={0.05} className="sm:col-span-2 lg:col-span-2 lg:col-start-7">
            {NAV.map((n) => (
              <FooterLink key={n.href} href={n.href}>
                {n.label}
              </FooterLink>
            ))}
          </FooterCol>

          <FooterCol title="Studio" delay={0.1} className="sm:col-span-2 lg:col-span-2">
            <FooterLink href={LINKS.login} external>
              {CTA.login}
            </FooterLink>
            <FooterLink href={LINKS.booking} external>
              {CTA.bookMyClass}
            </FooterLink>
          </FooterCol>

          <FooterCol title="Follow" delay={0.15} className="col-span-2 sm:col-span-2 lg:col-span-2">
            <FooterLink href={LINKS.instagram} external icon={<InstagramIcon />}>
              Instagram
            </FooterLink>
            <FooterLink href={LINKS.tiktok} external icon={<TikTokIcon />}>
              TikTok
            </FooterLink>
            <FooterLink href={`mailto:${LINKS.email}`} icon={<Mail className="size-4" />}>
              {LINKS.email}
            </FooterLink>
          </FooterCol>
        </div>
      </div>

      {/* giant wordmark rising into place */}
      <motion.div
        aria-hidden
        style={{ y: markY, opacity: markOpacity }}
        className="pointer-events-none relative mt-16 flex select-none justify-center text-cream sm:mt-24"
      >
        <Logo className="text-[19.5vw] leading-[0.9]" />
      </motion.div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-4 px-5 py-6 text-[10px] font-medium uppercase tracking-[0.3em] text-cream/45 sm:flex-row sm:px-8 lg:px-12">
          <span>© All rights reserved</span>
          <button
            type="button"
            onClick={() => scrollToTarget(0)}
            className="group flex items-center gap-3 uppercase transition-colors duration-300 hover:text-cream"
          >
            Back to top
            <span className="grid size-9 place-items-center rounded-full border border-white/15 transition-all duration-500 group-hover:border-cream group-hover:bg-cream group-hover:text-haus-950">
              <ArrowUp className="size-3.5 transition-transform duration-500 group-hover:-translate-y-0.5" />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  children,
  delay = 0,
  className,
}: {
  title: string;
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <Reveal delay={delay} y={36} className={cn("col-span-1", className)}>
      <p className="text-[10px] font-medium uppercase tracking-[0.34em] text-cream/40">{title}</p>
      <ul className="mt-6 space-y-4">{children}</ul>
    </Reveal>
  );
}

function FooterLink({
  href,
  children,
  external,
  icon,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
  icon?: ReactNode;
}) {
  return (
    <li>
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        onClick={(e) => handleAnchorClick(e, href)}
        className="group inline-flex items-center gap-3 text-[15px] text-cream/75 transition-colors duration-300 hover:text-cream"
      >
        {icon && <span className="text-cream/50 transition-colors duration-300 group-hover:text-ember">{icon}</span>}
        <span className="relative">
          {children}
          <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-ember transition-transform duration-500 ease-premium group-hover:origin-left group-hover:scale-x-100" />
        </span>
        {external && (
          <ArrowUpRight className="size-3.5 -translate-x-1 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100" />
        )}
      </a>
    </li>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden>
      <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.6 2.6 0 0 1 0-5.2c.27 0 .53.04.78.12V9.66a5.7 5.7 0 0 0-.78-.05 5.69 5.69 0 1 0 5.69 5.69V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.3 4.3 0 0 1-3.25-1.48Z" />
    </svg>
  );
}
