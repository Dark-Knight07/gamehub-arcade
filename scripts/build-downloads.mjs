// Packages every game in public/games into a single self-contained HTML file in
// public/downloads, so it can be downloaded and played offline with no internet.
// Runs automatically before `npm run dev` and `npm run build`.
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const gamesDir = join(root, "public", "games");
const outDir = join(root, "public", "downloads");
const manifestPath = join(root, "src", "data", "downloads.generated.json");

const sdk = readFileSync(join(gamesDir, "_sdk", "sdk.js"), "utf8");
const css = readFileSync(join(gamesDir, "_sdk", "base.css"), "utf8");

mkdirSync(outDir, { recursive: true });
const manifest = {};

for (const id of readdirSync(gamesDir)) {
  if (id.startsWith("_")) continue;
  const src = join(gamesDir, id, "index.html");
  if (!existsSync(src) || !statSync(src).isFile()) continue;

  let html = readFileSync(src, "utf8");
  html = html.replace('<link rel="stylesheet" href="../_sdk/base.css" />', () => `<style>\n${css}\n</style>`);
  html = html.replace('<script src="../_sdk/sdk.js"></script>', () => `<script>\n${sdk}\n</script>`);
  html = html.replace("<head>", "<head>\n<!-- Offline edition from Owais GameHub. Open this file in any modern browser. -->");

  const file = `owais-gamehub-${id}.html`;
  writeFileSync(join(outDir, file), html);
  manifest[id] = { file: `/downloads/${file}`, bytes: Buffer.byteLength(html) };
}

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log(`Packaged ${Object.keys(manifest).length} offline game files into public/downloads`);
