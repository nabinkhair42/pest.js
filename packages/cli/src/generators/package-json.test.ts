import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { generatePackageJson, getDependencies } from "./package-json.js";
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
    packageManager: "npm",
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

  it("should generate a valid package.json without dependencies", () => {
    const ctx: GeneratorContext = { config: makeConfig(), projectDir };
    generatePackageJson(ctx);

    const pkg = JSON.parse(readFileSync(join(projectDir, "package.json"), "utf-8"));
    expect(pkg.name).toBe("test-app");
    expect(pkg.description).toBe("A test app");
    expect(pkg.author).toBe("tester");
    expect(pkg.scripts.build).toBe("tsc");
    expect(pkg.scripts.dev).toBe("tsx watch src/server.ts");
    expect(pkg.dependencies).toBeUndefined();
    expect(pkg.devDependencies).toBeUndefined();
  });

  it("should include db scripts for prisma", () => {
    const ctx: GeneratorContext = {
      config: makeConfig({ database: "prisma" }),
      projectDir,
    };
    generatePackageJson(ctx);

    const pkg = JSON.parse(readFileSync(join(projectDir, "package.json"), "utf-8"));
    expect(pkg.scripts["db:migrate"]).toBeDefined();
    expect(pkg.scripts["db:studio"]).toBeDefined();
  });

  it("should include db scripts for drizzle", () => {
    const ctx: GeneratorContext = {
      config: makeConfig({ database: "drizzle", dbProvider: "postgresql" }),
      projectDir,
    };
    generatePackageJson(ctx);

    const pkg = JSON.parse(readFileSync(join(projectDir, "package.json"), "utf-8"));
    expect(pkg.scripts["db:migrate"]).toBeDefined();
    expect(pkg.scripts["db:studio"]).toBeDefined();
  });

  it("should include db scripts for typeorm", () => {
    const ctx: GeneratorContext = {
      config: makeConfig({ database: "typeorm", dbProvider: "mysql" }),
      projectDir,
    };
    generatePackageJson(ctx);

    const pkg = JSON.parse(readFileSync(join(projectDir, "package.json"), "utf-8"));
    expect(pkg.scripts["db:migrate"]).toBeDefined();
    expect(pkg.scripts["db:generate"]).toBeDefined();
  });
});

describe("getDependencies", () => {
  it("should return base deps for no database", () => {
    const { deps, devDeps } = getDependencies(makeConfig());
    expect(deps).toContain("express");
    expect(deps).toContain("cors");
    expect(deps).toContain("helmet");
    expect(deps).toContain("dotenv");
    expect(devDeps).toContain("typescript");
    expect(devDeps).toContain("tsx");
    expect(devDeps).toContain("jest");
  });

  it("should include pino and zod in base deps", () => {
    const { deps, devDeps } = getDependencies(makeConfig());
    expect(deps).toContain("pino");
    expect(deps).toContain("pino-http");
    expect(deps).toContain("zod");
    expect(devDeps).toContain("pino-pretty");
  });

  it("should add prisma deps", () => {
    const { deps, devDeps } = getDependencies(makeConfig({ database: "prisma" }));
    expect(deps).toContain("@prisma/client@^6");
    expect(devDeps).toContain("prisma@^6");
  });

  it("should add drizzle deps with driver", () => {
    const { deps, devDeps } = getDependencies(
      makeConfig({ database: "drizzle", dbProvider: "postgresql" }),
    );
    expect(deps).toContain("drizzle-orm");
    expect(deps).toContain("postgres");
    expect(devDeps).toContain("drizzle-kit");
  });

  it("should add drizzle sqlite devDeps", () => {
    const { deps, devDeps } = getDependencies(
      makeConfig({ database: "drizzle", dbProvider: "sqlite" }),
    );
    expect(deps).toContain("better-sqlite3");
    expect(devDeps).toContain("@types/better-sqlite3");
  });

  it("should add typeorm deps with driver", () => {
    const { deps } = getDependencies(
      makeConfig({ database: "typeorm", dbProvider: "mysql" }),
    );
    expect(deps).toContain("typeorm");
    expect(deps).toContain("reflect-metadata");
    expect(deps).toContain("mysql2");
  });
});
