import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/utils/cn";
import { EASE } from "@/lib/motion";

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  /** vertical travel of the inner image in % */
  speed?: number;
  /** curtain reveal when entering the viewport */
  reveal?: boolean;
}

/**
 * Framed image whose contents drift at a different speed than the page
 * (parallax) and that opens with a cinematic clip-path curtain reveal.
 */
export function ParallaxImage({
  src,
  alt,
  className,
  imgClassName,
  speed = 10,
  reveal = true,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${speed}%`, `${speed}%`]);
  const scale = 1 + (speed * 2.3) / 100;

  return (
    <motion.div
      ref={ref}
      className={cn("relative overflow-hidden bg-haus-900", className)}
      initial={reveal ? { clipPath: "inset(14% 10% 14% 10%)", opacity: 0.2 } : false}
      whileInView={reveal ? { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 } : undefined}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.5, ease: EASE }}
    >
      <motion.img
        src={src}
        alt={alt}
        decoding="async"
        style={{ y, scale }}
        className={cn("absolute inset-0 h-full w-full object-cover will-change-transform", imgClassName)}
      />
    </motion.div>
  );
}
