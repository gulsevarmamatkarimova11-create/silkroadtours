import { Cormorant, Source_Sans_3 } from "next/font/google";

// Self-hosted at build time by next/font. Both families were checked for Latin Extended, Cyrillic,
// Uzbek Cyrillic (ў қ ғ ҳ) and the Uzbek modifier letter ʻ (U+02BB) — see docs/design/DESIGN_SYSTEM.md.
// Only the Latin subset (which includes U+02BB) is preloaded; Cyrillic loads on demand via unicode-range.
//
// display: "optional" — the preloaded fonts normally arrive within the browser's ~100 ms block
// period and are used straight away. If they are late (slow network), that page view keeps the
// fallback instead of swapping mid-read. Swapping caused layout shift wherever the generated
// fallback (based on local Times New Roman / Arial) is missing, e.g. on Android phones and Linux
// CI runners, where the long tour titles re-wrapped (CLS 0.19). Next visits use the cached font.

export const displayFont = Cormorant({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "optional",
  preload: true,
  fallback: ["Georgia", "Times New Roman", "serif"],
});

export const bodyFont = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "optional",
  preload: true,
  fallback: ["system-ui", "Segoe UI", "Arial", "sans-serif"],
});
