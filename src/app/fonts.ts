import { Cormorant, Source_Sans_3 } from "next/font/google";

// Self-hosted at build time by next/font. Both families were checked for Latin Extended, Cyrillic,
// Uzbek Cyrillic (ў қ ғ ҳ) and the Uzbek modifier letter ʻ (U+02BB) — see docs/design/DESIGN_SYSTEM.md.
// Only the Latin subset (which includes U+02BB) is preloaded; Cyrillic loads on demand via unicode-range.

export const displayFont = Cormorant({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  preload: true,
  fallback: ["Georgia", "Times New Roman", "serif"],
});

export const bodyFont = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "Segoe UI", "Arial", "sans-serif"],
});
