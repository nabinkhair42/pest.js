import type { GeneratorContext } from "../types.js";
import { writeJson, writeFile } from "../utils/fs.js";

export function generatePrettier(ctx: GeneratorContext): void {
  writeJson(ctx.projectDir, ".prettierrc", {
    semi: true,
    trailingComma: "es5",
    singleQuote: false,
    printWidth: 80,
    tabWidth: 2,
    useTabs: false,
  });

  writeFile(
    ctx.projectDir,
    ".prettierignore",
    `node_modules/
dist/
coverage/
`
  );
}
