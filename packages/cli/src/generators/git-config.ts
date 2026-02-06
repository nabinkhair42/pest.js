import type { GeneratorContext } from "../types.js";
import { writeFile, ensureDir } from "../utils/fs.js";
import { writeFileSync, chmodSync } from "node:fs";
import { join } from "node:path";

export function generateGitConfig(ctx: GeneratorContext): void {
  const lockfileIgnores = getLockfileIgnores(ctx.config.packageManager);

  writeFile(
    ctx.projectDir,
    ".gitignore",
    `node_modules/
dist/
.env
*.log
coverage/
.DS_Store
${lockfileIgnores}`
  );

  const huskyDir = join(ctx.projectDir, ".husky");
  ensureDir(huskyDir);

  // Husky hooks must use LF line endings even on Windows
  const huskyFile = join(huskyDir, "pre-commit");
  writeFileSync(huskyFile, "#!/usr/bin/env sh\nnpx lint-staged\n", "utf-8");

  // chmod is needed on Unix for executable bit; skip on Windows
  try {
    chmodSync(huskyFile, 0o755);
  } catch {
    // Fails on Windows — that's okay, git handles executable bit via config
  }
}

function getLockfileIgnores(pm: string): string {
  switch (pm) {
    case "pnpm":
      return "package-lock.json\nyarn.lock\n";
    case "yarn":
      return "package-lock.json\npnpm-lock.yaml\n";
    default:
      return "pnpm-lock.yaml\nyarn.lock\n";
  }
}
