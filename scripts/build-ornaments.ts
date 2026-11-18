/**
 * Writes the seamless ornament tiles used as CSS backgrounds (public/ornament/*.svg)
 * from the same geometry as the React components. Run: npx tsx scripts/build-ornaments.ts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { girihTile } from "../src/components/ornament/geometry.ts";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "ornament");
mkdirSync(OUT, { recursive: true });

const SIZE = 120;
const tile = (stroke: string, opacity: number) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">` +
  `<path d="${girihTile(SIZE)}" fill="none" stroke="${stroke}" stroke-opacity="${opacity}" stroke-width="1" stroke-linejoin="round"/></svg>\n`;

writeFileSync(join(OUT, "girih-saffron.svg"), tile("#D4A24C", 0.32));
writeFileSync(join(OUT, "girih-lapis.svg"), tile("#1F3A93", 0.09));
console.log("Wrote public/ornament/girih-saffron.svg and girih-lapis.svg");
