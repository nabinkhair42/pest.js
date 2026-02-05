import { execSync } from "node:child_process";

export function gitInit(projectDir: string): void {
  execSync("git init", { cwd: projectDir, stdio: "ignore" });
  execSync("git add .", { cwd: projectDir, stdio: "ignore" });

  try {
    execSync('git commit -m "Initial commit: PEST.js project"', {
      cwd: projectDir,
      stdio: "ignore",
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
