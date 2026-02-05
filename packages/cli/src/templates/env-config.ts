import type { ProjectConfig } from "../types.js";

export function envConfigTemplate(config: ProjectConfig): string {
  const lines: string[] = [];

  lines.push('import "dotenv/config";');
  lines.push("");
  lines.push("const port = parseInt(process.env.PORT || \"3000\", 10);");
  lines.push("if (isNaN(port) || port < 0 || port > 65535) {");
  lines.push('  throw new Error(`Invalid PORT: ${process.env.PORT}. Must be a number between 0 and 65535.`);');
  lines.push("}");
  lines.push("");

  if (config.database !== "none") {
    lines.push("if (!process.env.DATABASE_URL) {");
    lines.push('  throw new Error("DATABASE_URL environment variable is required.");');
    lines.push("}");
    lines.push("");
  }

  lines.push("export const env = {");
  lines.push('  NODE_ENV: process.env.NODE_ENV || "development",');
  lines.push("  PORT: port,");

  if (config.database !== "none") {
    lines.push("  DATABASE_URL: process.env.DATABASE_URL,");
  }

  lines.push("} as const;");
  lines.push("");

  return lines.join("\n");
}
