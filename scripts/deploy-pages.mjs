// Publishes the built dist/ to the `gh-pages` branch of `origin`.
// A standalone static deploy — no GitHub Actions `workflow` scope required.
import { execFileSync } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");

function run(cmd, args, cwd) {
  return execFileSync(cmd, args, { cwd, stdio: "pipe", encoding: "utf8" }).trim();
}

async function main() {
  await fs.access(dist).catch(() => {
    throw new Error("dist/ not found — run `pnpm build` first.");
  });

  const remote = run("git", ["remote", "get-url", "origin"], root);

  // Jekyll off (serve files/underscores verbatim) + SPA 404 fallback.
  await fs.writeFile(path.join(dist, ".nojekyll"), "");
  await fs.copyFile(path.join(dist, "index.html"), path.join(dist, "404.html"));

  await fs.rm(path.join(dist, ".git"), { recursive: true, force: true });
  run("git", ["init", "-b", "gh-pages"], dist);
  run("git", ["add", "-A"], dist);
  run("git", ["commit", "-m", "Deploy to GitHub Pages"], dist);
  run("git", ["push", "-f", remote, "gh-pages"], dist);
  await fs.rm(path.join(dist, ".git"), { recursive: true, force: true });

  console.log("Deployed dist/ to gh-pages on", remote);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
