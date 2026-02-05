import type { ProjectConfig } from "../types.js";

export function envConfigTemplate(config: ProjectConfig): string {
  const dbImport = config.database !== "none" ? `\n  DATABASE_URL: process.env.DATABASE_URL || "",` : "";

  return `import "dotenv/config";

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "3000", 10),${dbImport}
} as const;
`;
}
