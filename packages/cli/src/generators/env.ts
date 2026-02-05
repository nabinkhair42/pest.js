import type { GeneratorContext } from "../types.js";
import { DATABASE_URLS } from "../constants.js";
import { writeFile } from "../utils/fs.js";

export function generateEnv(ctx: GeneratorContext): void {
  const { config, projectDir } = ctx;

  const lines = ["NODE_ENV=development", "PORT=3000"];

  if (config.database !== "none") {
    const url = DATABASE_URLS[config.dbProvider]?.[config.database] ?? "";
    lines.push(`DATABASE_URL="${url}"`);
  }

  const content = lines.join("\n") + "\n";

  writeFile(projectDir, ".env", content);
  writeFile(projectDir, ".env.example", content);
}
