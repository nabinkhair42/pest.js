import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

export function ensureDir(dir: string): void {
  mkdirSync(dir, { recursive: true });
}

export function writeFile(basePath: string, filePath: string, content: string): void {
  const fullPath = join(basePath, filePath);
  ensureDir(dirname(fullPath));
  writeFileSync(fullPath, content, "utf-8");
}

export function writeJson(basePath: string, filePath: string, data: Record<string, unknown>): void {
  writeFile(basePath, filePath, JSON.stringify(data, null, 2) + "\n");
}
