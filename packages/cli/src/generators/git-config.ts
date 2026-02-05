import type { GeneratorContext } from "../types.js";
import { writeFile, ensureDir } from "../utils/fs.js";
import { join } from "node:path";

export function generateGitConfig(ctx: GeneratorContext): void {
  writeFile(
    ctx.projectDir,
    ".gitignore",
    `node_modules/
dist/
.env
*.log
coverage/
.DS_Store
`
  );

  const huskyDir = join(ctx.projectDir, ".husky");
  ensureDir(huskyDir);
  writeFile(ctx.projectDir, ".husky/pre-commit", "npx lint-staged\n");
}
