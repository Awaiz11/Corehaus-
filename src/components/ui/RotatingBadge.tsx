import { useId } from "react";
import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface RotatingBadgeProps {
  text: string;
  className?: string;
  children?: ReactNode;
}

/** Circular text that slowly rotates around a centre mark */
export function RotatingBadge({ text, className, children }: RotatingBadgeProps) {
  const id = `badge-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  return (
    <div className={cn("relative grid size-32 place-items-center sm:size-36", className)}>
      <svg viewBox="0 0 200 200" aria-hidden className="absolute inset-0 size-full animate-spin-slow">
        <defs>
          <path id={id} d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" />
        </defs>
        <text
          className="fill-cream/70 font-sans text-[12.5px] font-medium uppercase"
          style={{ letterSpacing: "0.28em" }}
        >
          <textPath href={`#${id}`}>{text}</textPath>
        </text>
      </svg>
      <span className="absolute inset-[22%] rounded-full border border-white/10" aria-hidden />
      <span className="relative">{children}</span>
    </div>
  );
}
