import type { GeneratorContext } from "../types.js";
import { writeFile, ensureDir } from "../utils/fs.js";
import { chmodSync } from "node:fs";
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
  const huskyFile = join(ctx.projectDir, ".husky/pre-commit");
  writeFile(ctx.projectDir, ".husky/pre-commit", "npx lint-staged\n");
  chmodSync(huskyFile, 0o755);
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
