import type { GeneratorContext } from "../types.js";
import { writeFile } from "../utils/fs.js";

export function generateJest(ctx: GeneratorContext): void {
  const content = `module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.ts"],
  moduleNameMapper: {
    "^(\\\\.\\\\.?/.*)\\\\.js$": "$1",
  },
};
`;

  writeFile(ctx.projectDir, "jest.config.js", content);
}
