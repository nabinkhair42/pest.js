import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { generatePackageJson } from "./package-json.js";
import { readFileSync, rmSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import type { GeneratorContext, ProjectConfig } from "../types.js";

function makeConfig(overrides: Partial<ProjectConfig> = {}): ProjectConfig {
  return {
    name: "test-app",
    description: "A test app",
    author: "tester",
    database: "none",
    dbProvider: "postgresql",
    docker: false,
    git: false,
    install: false,
    ...overrides,
  };
}

describe("generatePackageJson", () => {
  let projectDir: string;

  beforeEach(() => {
    projectDir = join(tmpdir(), `pest-test-${Date.now()}`);
    mkdirSync(projectDir, { recursive: true });
  });

  afterEach(() => {
    rmSync(projectDir, { recursive: true, force: true });
  });

  it("should generate a valid package.json", () => {
    const ctx: GeneratorContext = { config: makeConfig(), projectDir };
    generatePackageJson(ctx);

    const pkg = JSON.parse(readFileSync(join(projectDir, "package.json"), "utf-8"));
    expect(pkg.name).toBe("test-app");
    expect(pkg.description).toBe("A test app");
    expect(pkg.author).toBe("tester");
    expect(pkg.dependencies.express).toBeDefined();
    expect(pkg.dependencies.helmet).toBeDefined();
    expect(pkg.dependencies.cors).toBeDefined();
    expect(pkg.devDependencies.typescript).toBeDefined();
    expect(pkg.devDependencies.jest).toBeDefined();
    expect(pkg.scripts.build).toBe("tsc");
  });

  it("should add prisma deps when database is prisma", () => {
    const ctx: GeneratorContext = {
      config: makeConfig({ database: "prisma" }),
      projectDir,
    };
    generatePackageJson(ctx);

    const pkg = JSON.parse(readFileSync(join(projectDir, "package.json"), "utf-8"));
    expect(pkg.dependencies["@prisma/client"]).toBeDefined();
    expect(pkg.devDependencies.prisma).toBeDefined();
    expect(pkg.scripts["db:migrate"]).toBeDefined();
  });

  it("should add drizzle deps when database is drizzle", () => {
    const ctx: GeneratorContext = {
      config: makeConfig({ database: "drizzle", dbProvider: "postgresql" }),
      projectDir,
    };
    generatePackageJson(ctx);

    const pkg = JSON.parse(readFileSync(join(projectDir, "package.json"), "utf-8"));
    expect(pkg.dependencies["drizzle-orm"]).toBeDefined();
    expect(pkg.devDependencies["drizzle-kit"]).toBeDefined();
    expect(pkg.dependencies.postgres).toBeDefined();
  });

  it("should add typeorm deps when database is typeorm", () => {
    const ctx: GeneratorContext = {
      config: makeConfig({ database: "typeorm", dbProvider: "mysql" }),
      projectDir,
    };
    generatePackageJson(ctx);

    const pkg = JSON.parse(readFileSync(join(projectDir, "package.json"), "utf-8"));
    expect(pkg.dependencies.typeorm).toBeDefined();
    expect(pkg.dependencies["reflect-metadata"]).toBeDefined();
    expect(pkg.dependencies.mysql2).toBeDefined();
  });
});
