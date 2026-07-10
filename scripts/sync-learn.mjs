// Copies the `teach`-skill training materials into public/ so they ship with
// the deployed site. Lessons are standalone HTML with relative links; we mirror
// the repo layout under public/ so those links resolve on GitHub Pages.
//
//   teaching/{lessons,reference,assets,MISSION.md}  ->  public/learn/...
//   CONTEXT.md                                      ->  public/CONTEXT.md
//   docs/                                           ->  public/docs/
//
// It also writes public/learn/index.json listing the lessons for the in-app
// Learn view.

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const teaching = path.join(root, "teaching");
const publicDir = path.join(root, "public");
const learnDir = path.join(publicDir, "learn");

async function exists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

async function copyDir(src, dest) {
  if (!(await exists(src))) return;
  await fs.mkdir(dest, { recursive: true });
  for (const entry of await fs.readdir(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) await copyDir(s, d);
    else await fs.copyFile(s, d);
  }
}

async function copyFile(src, dest) {
  if (!(await exists(src))) return;
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.copyFile(src, dest);
}

// Parse "<h1>…</h1>" and "<p class=\"lede\">…</p>" from a lesson for the index.
function extract(html, re) {
  const m = html.match(re);
  return m ? m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() : "";
}

async function indexHtmlDir(subdir) {
  const dir = path.join(learnDir, subdir);
  if (!(await exists(dir))) return [];
  const files = (await fs.readdir(dir)).filter((f) => f.endsWith(".html")).sort();
  const out = [];
  for (const file of files) {
    const html = await fs.readFile(path.join(dir, file), "utf8");
    out.push({
      file: `${subdir}/${file}`,
      number: (file.match(/^(\d+)/) || [])[1] || "",
      title: extract(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i) || file,
      lede: extract(html, /<p class="lede"[^>]*>([\s\S]*?)<\/p>/i),
    });
  }
  return out;
}

async function main() {
  await fs.rm(learnDir, { recursive: true, force: true });
  await fs.mkdir(learnDir, { recursive: true });

  await copyDir(path.join(teaching, "lessons"), path.join(learnDir, "lessons"));
  await copyDir(path.join(teaching, "reference"), path.join(learnDir, "reference"));
  await copyDir(path.join(teaching, "assets"), path.join(learnDir, "assets"));
  await copyFile(path.join(teaching, "MISSION.md"), path.join(learnDir, "MISSION.md"));

  // Mirror docs the lessons link to (so ../../CONTEXT.md, ../../docs/… resolve).
  await copyFile(path.join(root, "CONTEXT.md"), path.join(publicDir, "CONTEXT.md"));
  await copyDir(path.join(root, "docs"), path.join(publicDir, "docs"));

  const lessons = await indexHtmlDir("lessons");
  const reference = await indexHtmlDir("reference");
  await fs.writeFile(
    path.join(learnDir, "index.json"),
    JSON.stringify({ lessons, reference }, null, 2)
  );

  console.log(
    `sync:learn — ${lessons.length} lesson(s), ${reference.length} reference sheet(s) copied to public/learn/`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
