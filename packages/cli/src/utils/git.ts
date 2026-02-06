import { execSync } from "node:child_process";

const execOpts = { stdio: "ignore" as const };

export function isGitInstalled(): boolean {
  try {
    execSync("git --version", execOpts);
    return true;
  } catch {
    return false;
  }
}

export function gitInit(projectDir: string): void {
  execSync("git init", { ...execOpts, cwd: projectDir });
  execSync("git add .", { ...execOpts, cwd: projectDir });

  try {
    execSync('git commit -m "Initial commit: PEST.js project"', {
      ...execOpts,
      cwd: projectDir,
    });
  } catch {
    // Commit may fail if git user is not configured — that's okay
  }
}

export function getGitUser(): string {
  try {
    return execSync("git config user.name", { encoding: "utf-8" }).trim();
  } catch {
    return "";
  }
}
