import type { GeneratorContext } from "../types.js";
import { writeFile } from "../utils/fs.js";

export function generateEslint(ctx: GeneratorContext): void {
  const content = `import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
  {
    ignores: ["dist/", "node_modules/", "coverage/", "jest.config.js"],
  }
);
`;

  writeFile(ctx.projectDir, "eslint.config.mjs", content);
}
