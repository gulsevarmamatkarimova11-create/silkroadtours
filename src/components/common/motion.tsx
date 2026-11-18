"use client";

// Motion primitives (Framer Motion). LazyMotion + `m` keeps the runtime small, MotionConfig
// honours prefers-reduced-motion, and only transform/opacity are animated (no layout shift).
import { domAnimation, LazyMotion, m, MotionConfig, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}

/** Slow fade-and-rise when the block scrolls into view. Never use on the LCP element. */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li";
}) {
  const reduce = useReducedMotion();
  const Comp = as === "section" ? m.section : as === "li" ? m.li : m.div;
  if (reduce) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Comp>
  );
}

/** An ornament line that "draws" itself in (stroke-dashoffset), e.g. under section titles. */
export function DrawnRule({ className, tone = "var(--color-saffron)" }: { className?: string; tone?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 240 16" className={cn("h-4 w-60", className)} fill="none">
      <m.path
        d="M2 8H96M144 8H238M104 8l8-6 8 6-8 6zM120 8l8-6 8 6-8 6z"
        stroke={tone}
        strokeWidth="1.6"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0.4 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}

/** Gentle parallax for the hero background layer only. */
export function HeroParallax({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  return (
    <div ref={ref} className={cn("absolute inset-0 overflow-hidden", className)}>
      <m.div style={{ y }} className="absolute inset-0 will-change-transform">
        {children}
      </m.div>
    </div>
  );
}
