import { motion } from "framer-motion";
import type { MouseEvent, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/utils/cn";
import { handleAnchorClick } from "@/lib/scroll";

type Variant = "cream" | "ember" | "outline" | "glass";
type Size = "sm" | "md" | "lg";

interface FillButtonProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  icon?: boolean;
  external?: boolean;
  className?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

const sizes: Record<Size, { root: string; withIcon: string; icon: string }> = {
  sm: { root: "h-10 px-5 text-[10px]", withIcon: "pr-1.5", icon: "size-7" },
  md: { root: "h-12 px-6 text-[11px]", withIcon: "pr-2", icon: "size-8" },
  lg: { root: "h-14 px-7 text-[11px] sm:h-[60px] sm:px-8", withIcon: "pr-2 sm:pr-2.5", icon: "size-10" },
};

const variants: Record<Variant, { root: string; fill: string; icon: string }> = {
  cream: {
    root: "bg-cream text-haus-950",
    fill: "bg-ember",
    icon: "bg-haus-950 text-cream",
  },
  ember: {
    root: "bg-ember text-haus-950",
    fill: "bg-cream",
    icon: "bg-haus-950 text-cream",
  },
  outline: {
    root: "border border-cream/25 text-cream hover:border-cream hover:text-haus-950",
    fill: "bg-cream",
    icon: "bg-cream/10 text-cream group-hover/btn:bg-haus-950",
  },
  glass: {
    root: "border border-white/15 bg-white/[0.06] text-cream backdrop-blur-md hover:border-cream hover:text-haus-950",
    fill: "bg-cream",
    icon: "bg-white/10 text-cream group-hover/btn:bg-haus-950",
  },
};

/**
 * Premium CTA: liquid colour fill rising from below, rolling label,
 * arrow swap and a springy scale on hover / tap.
 */
export function FillButton({
  href,
  children,
  variant = "cream",
  size = "md",
  icon = true,
  external = false,
  className,
  onClick,
}: FillButtonProps) {
  const v = variants[variant];
  const s = sizes[size];

  return (
    <motion.a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) handleAnchorClick(e, href);
      }}
      whileHover={{ scale: 1.035 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 380, damping: 24 }}
      className={cn(
        "group/btn relative isolate inline-flex select-none items-center justify-center gap-3 overflow-hidden whitespace-nowrap rounded-full font-medium uppercase tracking-[0.2em] transition-[color,border-color] duration-500 ease-premium",
        s.root,
        icon && s.withIcon,
        v.root,
        className,
      )}
    >
      {/* liquid fill */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-1/2 top-full -z-10 aspect-square w-[180%] -translate-x-1/2 rounded-full transition-transform duration-700 ease-premium group-hover/btn:-translate-y-1/2",
          v.fill,
        )}
      />

      {/* rolling label */}
      <span className="relative block overflow-hidden leading-none">
        <span className="block py-[0.25em] transition-transform duration-500 ease-premium group-hover/btn:-translate-y-full">
          {children}
        </span>
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 block translate-y-full py-[0.25em] transition-transform duration-500 ease-premium group-hover/btn:translate-y-0"
        >
          {children}
        </span>
      </span>

      {icon && (
        <span
          aria-hidden
          className={cn(
            "relative grid shrink-0 place-items-center overflow-hidden rounded-full transition-colors duration-500",
            s.icon,
            v.icon,
          )}
        >
          <ArrowUpRight className="size-4 transition-transform duration-500 ease-premium group-hover/btn:-translate-y-[160%] group-hover/btn:translate-x-[160%]" />
          <ArrowUpRight className="absolute size-4 -translate-x-[160%] translate-y-[160%] transition-transform duration-500 ease-premium group-hover/btn:translate-x-0 group-hover/btn:translate-y-0" />
        </span>
      )}
    </motion.a>
  );
}
