import type { ReactNode } from "react";

/**
 * Minimal root layout so `next build` succeeds while the site only has API routes.
 * Phase 3 replaces this with the localized layout under app/[locale]/.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
