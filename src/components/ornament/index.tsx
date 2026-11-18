// Original SVG ornament library. Decorative only: every SVG is aria-hidden.
// Use with restraint — dividers, hero overlays, card frames, loading and empty states.
import { useId, type CSSProperties } from "react";
import { cn } from "@/lib/cn";
import {
  archPath,
  girihTile,
  ikatDiamondPath,
  islimiRepeat,
  khatamPath,
  polygonPath,
  starPolygonPath,
} from "./geometry";

type Tone = "saffron" | "lapis" | "turquoise" | "ivory" | "pomegranate" | "ink";
const TONE: Record<Tone, string> = {
  saffron: "var(--color-saffron)",
  lapis: "var(--color-lapis)",
  turquoise: "var(--color-turquoise)",
  ivory: "var(--color-ivory)",
  pomegranate: "var(--color-pomegranate)",
  ink: "var(--color-ink)",
};

interface BaseProps {
  className?: string;
  style?: CSSProperties;
}

/** Seamless girih (8-point star) lattice. Fills its box; use absolutely positioned over a band or hero. */
export function GirihPattern({
  className,
  style,
  tone = "saffron",
  tile = 96,
  strokeWidth = 0.9,
  opacity = 0.35,
}: BaseProps & { tone?: Tone; tile?: number; strokeWidth?: number; opacity?: number }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg aria-hidden="true" focusable="false" className={cn("pointer-events-none", className)} style={style} width="100%" height="100%">
      <defs>
        <pattern id={`girih-${id}`} width={tile} height={tile} patternUnits="userSpaceOnUse">
          <path d={girihTile(tile)} fill="none" stroke={TONE[tone]} strokeWidth={strokeWidth} strokeLinejoin="round" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#girih-${id})`} opacity={opacity} />
    </svg>
  );
}

/** Islimi vine-scroll border, repeated horizontally. */
export function IslimiBorder({
  className,
  tone = "saffron",
  height = 24,
}: BaseProps & { tone?: Tone; height?: number }) {
  const id = useId().replace(/:/g, "");
  const p = islimiRepeat();
  const scale = height / 32;
  return (
    <svg aria-hidden="true" focusable="false" className={cn("block w-full", className)} height={height}>
      <defs>
        <pattern id={`islimi-${id}`} width={120 * scale} height={height} patternUnits="userSpaceOnUse">
          <g transform={`scale(${scale})`}>
            <path d={p.stem} fill="none" stroke={TONE[tone]} strokeWidth={1.4} strokeLinecap="round" />
            <path d={p.leaves} fill={TONE[tone]} />
            {p.buds.map((b) => (
              <circle key={`${b.cx}-${b.cy}`} cx={b.cx} cy={b.cy} r={b.r} fill={TONE[tone]} />
            ))}
          </g>
        </pattern>
      </defs>
      <rect width="100%" height={height} fill={`url(#islimi-${id})`} />
    </svg>
  );
}

/** Ikat stripe divider: feathered-edge diamonds in alternating colours. */
export function IkatDivider({ className, height = 18 }: BaseProps & { height?: number }) {
  const id = useId().replace(/:/g, "");
  const w = 44;
  return (
    <svg aria-hidden="true" focusable="false" className={cn("block w-full", className)} height={height}>
      <defs>
        <pattern id={`ikat-${id}`} width={w * (height / 18)} height={height} patternUnits="userSpaceOnUse">
          <g transform={`scale(${height / 18})`}>
            <path d={ikatDiamondPath(11, 9, 10, 8, 2)} fill="var(--color-pomegranate)" />
            <path d={ikatDiamondPath(11, 9, 4.5, 3.5, 1.5)} fill="var(--color-saffron)" />
            <path d={ikatDiamondPath(33, 9, 10, 8, 2)} fill="var(--color-lapis)" />
            <path d={ikatDiamondPath(33, 9, 4.5, 3.5, 1.5)} fill="var(--color-turquoise)" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height={height} fill={`url(#ikat-${id})`} />
    </svg>
  );
}

/** Suzani medallion: pomegranate petals, leaf ring and dotted borders. */
export function SuzaniMedallion({
  className,
  size = 160,
  palette = "warm",
}: BaseProps & { size?: number; palette?: "warm" | "night" }) {
  const c = 100;
  const petal = "M0 -30C17 -38 21 -56 0 -66C-21 -56 -17 -38 0 -30Z";
  const leaf = "M0 -74C6 -79 6 -86 0 -91C-6 -86 -6 -79 0 -74Z";
  const main = palette === "warm" ? "var(--color-pomegranate)" : "var(--color-saffron)";
  const accent = palette === "warm" ? "var(--color-saffron)" : "var(--color-turquoise)";
  const deep = palette === "warm" ? "var(--color-lapis)" : "var(--color-ivory)";
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 200 200" width={size} height={size} className={className}>
      <circle cx={c} cy={c} r={96} fill="none" stroke={deep} strokeWidth={1.2} opacity={0.6} />
      <circle cx={c} cy={c} r={70} fill="none" stroke={accent} strokeWidth={1} opacity={0.8} />
      <g transform={`translate(${c} ${c})`}>
        {Array.from({ length: 16 }, (_, i) => (
          <path key={`l${i}`} d={leaf} fill={i % 2 ? accent : deep} transform={`rotate(${i * 22.5})`} opacity={0.9} />
        ))}
        {Array.from({ length: 8 }, (_, i) => (
          <g key={`p${i}`} transform={`rotate(${i * 45 + 22.5})`}>
            <path d={petal} fill={main} />
            <circle cy={-50} r={4.2} fill={accent} />
            <circle cy={-50} r={1.6} fill={deep} />
          </g>
        ))}
        {Array.from({ length: 32 }, (_, i) => (
          <circle key={`d${i}`} cx={0} cy={-80 - 0} r={1.4} fill={accent} transform={`rotate(${i * 11.25 + 5.6})`} />
        ))}
      </g>
      <path d={khatamPath(c, c, 26)} fill={deep} />
      <path d={polygonPath(c, c, 12, 8, 22.5)} fill={accent} />
      <circle cx={c} cy={c} r={4} fill={main} />
    </svg>
  );
}

/** Ten-point girih rosette ({10/3} star in a decagon) — used as an emblem and loading spinner. */
export function GirihRosette({
  className,
  size = 64,
  tone = "saffron",
  strokeWidth = 1.6,
}: BaseProps & { size?: number; tone?: Tone; strokeWidth?: number }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 100 100" width={size} height={size} className={className}>
      <g fill="none" stroke={TONE[tone]} strokeWidth={strokeWidth} strokeLinejoin="round">
        <circle cx="50" cy="50" r="47" />
        <path d={polygonPath(50, 50, 44, 10, 18)} />
        <path d={starPolygonPath(50, 50, 44, 10, 3, 0)} />
        <path d={starPolygonPath(50, 50, 20, 10, 4, 18)} />
      </g>
    </svg>
  );
}

/** Ribbed turquoise dome silhouette (drum, ribs, finial). */
export function DomeSilhouette({ className, tone = "turquoise" }: BaseProps & { tone?: Tone }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 120 150" className={className}>
      <path d="M60 4v20" stroke="var(--color-saffron)" strokeWidth="2" />
      <circle cx="60" cy="16" r="3.2" fill="var(--color-saffron)" />
      <path d="M55 8.5a5.5 5.5 0 1 0 8.5-4.6a4.4 4.4 0 1 1-8.5 4.6Z" fill="var(--color-saffron)" />
      <path d="M22 104C14 66 36 38 60 28C84 38 106 66 98 104Z" fill={TONE[tone]} />
      <g fill="none" stroke="var(--color-lapis-deep)" strokeOpacity="0.35" strokeWidth="1.3">
        <path d="M60 28V104" />
        <path d="M60 28C48 44 42 70 44 104" />
        <path d="M60 28C72 44 78 70 76 104" />
        <path d="M60 28C40 42 28 70 32 104" />
        <path d="M60 28C80 42 92 70 88 104" />
      </g>
      <rect x="26" y="102" width="68" height="10" rx="1.5" fill="var(--color-lapis-deep)" />
      <rect x="30" y="112" width="60" height="38" fill="var(--color-sand)" />
      <path d="M30 120h60M30 128h60" stroke="var(--color-saffron)" strokeWidth="1" />
      <path d={archPath(14, 20)} transform="translate(53 130)" fill="var(--color-lapis-deep)" />
    </svg>
  );
}

/** Thin saffron arch frame drawn over an arch-masked image. */
export function ArchFrame({ className, tone = "saffron", inset = 0 }: BaseProps & { tone?: Tone; inset?: number }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 100 140"
      preserveAspectRatio="none"
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    >
      <path
        d="M0 140V52C0 28 22 9 50 0c28 9 50 28 50 52v88z"
        transform={inset ? `translate(${inset} ${inset * 1.4}) scale(${(100 - inset * 2) / 100} ${(140 - inset * 1.4) / 140})` : undefined}
        fill="none"
        stroke={TONE[tone]}
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/** A centred ornament rule: line — rosette — line. Section divider on light backgrounds. */
export function OrnamentRule({ className, tone = "saffron" }: BaseProps & { tone?: Tone }) {
  return (
    <div aria-hidden="true" className={cn("flex items-center gap-3", className)}>
      <span className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, ${TONE[tone]})` }} />
      <svg viewBox="0 0 40 40" width="22" height="22">
        <path d={khatamPath(20, 20, 18)} fill="none" stroke={TONE[tone]} strokeWidth="1.6" />
        <path d={polygonPath(20, 20, 6, 8, 22.5)} fill={TONE[tone]} />
      </svg>
      <span className="h-px flex-1" style={{ background: `linear-gradient(270deg, transparent, ${TONE[tone]})` }} />
    </div>
  );
}
