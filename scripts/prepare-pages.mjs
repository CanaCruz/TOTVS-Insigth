/**
 * Copia `dist/` → `docs/` para publicar no GitHub Pages
 * (Settings → Pages → Branch main → pasta /docs).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const docs = path.join(root, "docs");

if (!fs.existsSync(dist)) {
  console.error("✗ pasta dist/ não encontrada — rode `pnpm build:pages` antes.");
  process.exit(1);
}

fs.rmSync(docs, { recursive: true, force: true });
fs.cpSync(dist, docs, { recursive: true });

const indexOk = fs.existsSync(path.join(docs, "index.html"));
const dataOk = fs.existsSync(path.join(docs, "data", "meetings-index.json"));
const transcricoes = fs.existsSync(path.join(docs, "data", "transcricoes"));

console.log(`✓ docs/ atualizada a partir de dist/`);
console.log(`  index.html: ${indexOk ? "ok" : "AUSENTE"}`);
console.log(`  meetings-index.json: ${dataOk ? "ok" : "AUSENTE"}`);
console.log(`  transcricoes/: ${transcricoes ? "PRESENTE (não use data:build completo)" : "omitidas (ok)"}`);
