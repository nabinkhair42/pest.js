import { existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { resolve } from "node:path";

const MAX_PROJECT_NAME_LENGTH = 214; // npm package name limit

export function validateProjectName(name: string): string | undefined {
  if (!name) return "Project name is required";
  if (!/^[a-z0-9][a-z0-9-]*$/.test(name)) {
    return "Project name must be kebab-case (lowercase letters, numbers, and hyphens)";
  }
  if (name.length > MAX_PROJECT_NAME_LENGTH) {
    return `Project name must be ${MAX_PROJECT_NAME_LENGTH} characters or less`;
  }
  if (existsSync(resolve(name))) {
    return `Directory "${name}" already exists`;
  }
  return undefined;
}

export function isPackageManagerInstalled(pm: "npm" | "pnpm" | "yarn"): boolean {
  try {
    execSync(`${pm} --version`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

export function hasNode(): boolean {
  try {
    execSync("node --version", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}
