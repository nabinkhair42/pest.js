import { existsSync } from "node:fs";
import { resolve } from "node:path";

export function validateProjectName(name: string): string | undefined {
  if (!name) return "Project name is required";
  if (!/^[a-z0-9][a-z0-9-]*$/.test(name)) {
    return "Project name must be kebab-case (lowercase letters, numbers, and hyphens)";
  }
  if (existsSync(resolve(name))) {
    return `Directory "${name}" already exists`;
  }
  return undefined;
}

export function hasNode(): boolean {
  try {
    const { execSync } = require("node:child_process");
    execSync("node --version", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}
