import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { generateProject } from "./index.js";
import { existsSync, readFileSync, rmSync, mkdirSync } from "node:fs";
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

describe("generateProject", () => {
  let projectDir: string;

  beforeEach(() => {
    projectDir = join(tmpdir(), `pest-gen-${Date.now()}`);
    mkdirSync(projectDir, { recursive: true });
  });

  afterEach(() => {
    rmSync(projectDir, { recursive: true, force: true });
  });

  it("should generate all base files", () => {
    const ctx: GeneratorContext = { config: makeConfig(), projectDir };
    generateProject(ctx);

    expect(existsSync(join(projectDir, "package.json"))).toBe(true);
    expect(existsSync(join(projectDir, "tsconfig.json"))).toBe(true);
    expect(existsSync(join(projectDir, "eslint.config.mjs"))).toBe(true);
    expect(existsSync(join(projectDir, ".prettierrc"))).toBe(true);
    expect(existsSync(join(projectDir, "jest.config.js"))).toBe(true);
    expect(existsSync(join(projectDir, ".gitignore"))).toBe(true);
    expect(existsSync(join(projectDir, ".env"))).toBe(true);
    expect(existsSync(join(projectDir, ".env.example"))).toBe(true);
    expect(existsSync(join(projectDir, "vercel.json"))).toBe(true);
    expect(existsSync(join(projectDir, "src/app.ts"))).toBe(true);
    expect(existsSync(join(projectDir, "src/server.ts"))).toBe(true);
    expect(existsSync(join(projectDir, "src/routes/health.ts"))).toBe(true);
    expect(existsSync(join(projectDir, "src/middleware/error-handler.ts"))).toBe(true);
    expect(existsSync(join(projectDir, "src/config/env.ts"))).toBe(true);
    expect(existsSync(join(projectDir, "tests/app.test.ts"))).toBe(true);
  });

  it("should not generate docker files when docker is false", () => {
    const ctx: GeneratorContext = { config: makeConfig({ docker: false }), projectDir };
    generateProject(ctx);

    expect(existsSync(join(projectDir, "Dockerfile"))).toBe(false);
    expect(existsSync(join(projectDir, "docker-compose.yml"))).toBe(false);
  });

  it("should generate docker files when docker is true", () => {
    const ctx: GeneratorContext = { config: makeConfig({ docker: true }), projectDir };
    generateProject(ctx);

    expect(existsSync(join(projectDir, "Dockerfile"))).toBe(true);
    expect(existsSync(join(projectDir, "docker-compose.yml"))).toBe(true);
    expect(existsSync(join(projectDir, ".dockerignore"))).toBe(true);
  });

  it("should generate prisma files", () => {
    const ctx: GeneratorContext = {
      config: makeConfig({ database: "prisma" }),
      projectDir,
    };
    generateProject(ctx);

    expect(existsSync(join(projectDir, "prisma/schema.prisma"))).toBe(true);
    expect(existsSync(join(projectDir, "src/lib/prisma.ts"))).toBe(true);

    const envContent = readFileSync(join(projectDir, ".env"), "utf-8");
    expect(envContent).toContain("DATABASE_URL");
  });

  it("should generate drizzle files", () => {
    const ctx: GeneratorContext = {
      config: makeConfig({ database: "drizzle", dbProvider: "postgresql" }),
      projectDir,
    };
    generateProject(ctx);

    expect(existsSync(join(projectDir, "drizzle.config.ts"))).toBe(true);
    expect(existsSync(join(projectDir, "src/db/index.ts"))).toBe(true);
    expect(existsSync(join(projectDir, "src/db/schema.ts"))).toBe(true);
  });

  it("should generate typeorm files", () => {
    const ctx: GeneratorContext = {
      config: makeConfig({ database: "typeorm", dbProvider: "postgresql" }),
      projectDir,
    };
    generateProject(ctx);

    expect(existsSync(join(projectDir, "src/db/data-source.ts"))).toBe(true);
    expect(existsSync(join(projectDir, "src/db/index.ts"))).toBe(true);
    expect(existsSync(join(projectDir, "src/db/entities/user.ts"))).toBe(true);

    const tsconfig = JSON.parse(readFileSync(join(projectDir, "tsconfig.json"), "utf-8"));
    expect(tsconfig.compilerOptions.experimentalDecorators).toBe(true);
    expect(tsconfig.compilerOptions.emitDecoratorMetadata).toBe(true);
  });

  it("should add DATABASE_URL to env when database is not none", () => {
    const ctx: GeneratorContext = {
      config: makeConfig({ database: "prisma", dbProvider: "postgresql" }),
      projectDir,
    };
    generateProject(ctx);

    const envContent = readFileSync(join(projectDir, ".env"), "utf-8");
    expect(envContent).toContain("DATABASE_URL");
    expect(envContent).toContain("postgresql");
  });

  it("should not add DATABASE_URL when database is none", () => {
    const ctx: GeneratorContext = {
      config: makeConfig({ database: "none" }),
      projectDir,
    };
    generateProject(ctx);

    const envContent = readFileSync(join(projectDir, ".env"), "utf-8");
    expect(envContent).not.toContain("DATABASE_URL");
  });

  it("should include db service in docker-compose for postgres", () => {
    const ctx: GeneratorContext = {
      config: makeConfig({
        database: "prisma",
        dbProvider: "postgresql",
        docker: true,
      }),
      projectDir,
    };
    generateProject(ctx);

    const compose = readFileSync(join(projectDir, "docker-compose.yml"), "utf-8");
    expect(compose).toContain("postgres:16-alpine");
    expect(compose).toContain("db:");
  });

  it("should not include db service in docker-compose for sqlite", () => {
    const ctx: GeneratorContext = {
      config: makeConfig({
        database: "prisma",
        dbProvider: "sqlite",
        docker: true,
      }),
      projectDir,
    };
    generateProject(ctx);

    const compose = readFileSync(join(projectDir, "docker-compose.yml"), "utf-8");
    expect(compose).not.toContain("db:");
  });
});
