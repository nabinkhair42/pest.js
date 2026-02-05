import type { ProjectConfig } from "../types.js";

export function serverTemplate(config: ProjectConfig): string {
  const lines: string[] = [];

  lines.push('import app from "./app.js";');
  lines.push('import { env } from "./config/env.js";');
  lines.push('import { logger } from "./lib/logger.js";');

  if (config.database === "typeorm") {
    lines.push('import { initializeDatabase } from "./db/index.js";');
    lines.push("");
    lines.push("initializeDatabase().then(() => {");
    lines.push("  app.listen(env.PORT, () => {");
    lines.push("    logger.info(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);");
    lines.push("  });");
    lines.push("});");
  } else {
    lines.push("");
    lines.push("app.listen(env.PORT, () => {");
    lines.push("  logger.info(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);");
    lines.push("});");
  }

  lines.push("");
  return lines.join("\n");
}
