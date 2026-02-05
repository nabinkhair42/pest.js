import type { GeneratorContext } from "../types.js";
import { generatePackageJson } from "./package-json.js";
import { generateTsConfig } from "./typescript.js";
import { generateEslint } from "./eslint.js";
import { generatePrettier } from "./prettier.js";
import { generateJest } from "./jest.js";
import { generateGitConfig } from "./git-config.js";
import { generateEnv } from "./env.js";
import { generateVercel } from "./vercel.js";
import { generateApp } from "./app.js";
import { generateDatabase } from "./database/index.js";
import { generateDocker } from "./docker.js";

export function generateProject(ctx: GeneratorContext): void {
  generatePackageJson(ctx);
  generateTsConfig(ctx);
  generateEslint(ctx);
  generatePrettier(ctx);
  generateJest(ctx);
  generateGitConfig(ctx);
  generateEnv(ctx);
  generateVercel(ctx);
  generateApp(ctx);
  generateDatabase(ctx);
  generateDocker(ctx);
}
