import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { DrawnRule } from "./motion";

export function SectionHeading({
  eyebrow,
  title,
  text,
  align = "left",
  tone = "light",
  id,
  action,
  as: As = "h2",
}: {
  eyebrow?: string;
  title: string;
  text?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  id?: string;
  action?: ReactNode;
  as?: "h1" | "h2";
}) {
  const dark = tone === "dark";
  return (
    <div className={cn("flex flex-col gap-3", align === "center" && "items-center text-center", action && "sm:flex-row sm:items-end sm:justify-between")}>
      <div className={cn("flex flex-col gap-3", align === "center" && "items-center")}>
        {eyebrow && (
          <p className={cn("text-sm font-bold uppercase tracking-[0.18em]", dark ? "text-saffron" : "text-saffron-ink")}>{eyebrow}</p>
        )}
        <As id={id} className={cn(As === "h1" ? "text-4xl" : "text-3xl", dark ? "text-ivory" : "text-lapis-deep")}>
          {title}
        </As>
        <DrawnRule tone={dark ? "var(--color-saffron)" : "var(--color-terracotta)"} />
        {text && <div className={cn("max-w-2xl text-lg", dark ? "text-sand" : "text-ink-muted")}>{text}</div>}
      </div>
      {action}
    </div>
  );
}
