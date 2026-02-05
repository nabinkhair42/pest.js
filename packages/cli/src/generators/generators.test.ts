import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { generateProject } from "./index.js";
import { existsSync, readFileSync, rmSync, mkdirSync, statSync } from "node:fs";
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
    expect(existsSync(join(projectDir, "src/routes/example.ts"))).toBe(true);
    expect(existsSync(join(projectDir, "src/middleware/error-handler.ts"))).toBe(true);
    expect(existsSync(join(projectDir, "src/middleware/validate.ts"))).toBe(true);
    expect(existsSync(join(projectDir, "src/middleware/rate-limit.ts"))).toBe(true);
    expect(existsSync(join(projectDir, "src/config/env.ts"))).toBe(true);
    expect(existsSync(join(projectDir, "src/lib/errors.ts"))).toBe(true);
    expect(existsSync(join(projectDir, "src/lib/logger.ts"))).toBe(true);
    expect(existsSync(join(projectDir, "tests/app.test.ts"))).toBe(true);
    expect(existsSync(join(projectDir, "tests/example.test.ts"))).toBe(true);
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

  // Bug fix tests

  it("should use createPool instead of createConnection for drizzle mysql", () => {
    const ctx: GeneratorContext = {
      config: makeConfig({ database: "drizzle", dbProvider: "mysql" }),
      projectDir,
    };
    generateProject(ctx);

    const dbIndex = readFileSync(join(projectDir, "src/db/index.ts"), "utf-8");
    expect(dbIndex).toContain("createPool");
    expect(dbIndex).not.toContain("await mysql.createConnection");
  });

  it("should make husky pre-commit executable", () => {
    const ctx: GeneratorContext = { config: makeConfig(), projectDir };
    generateProject(ctx);

    const stat = statSync(join(projectDir, ".husky/pre-commit"));
    const mode = stat.mode & 0o777;
    expect(mode & 0o111).toBeGreaterThan(0); // executable bit set
  });

  it("should call initializeDatabase in server.ts for typeorm", () => {
    const ctx: GeneratorContext = {
      config: makeConfig({ database: "typeorm", dbProvider: "postgresql" }),
      projectDir,
    };
    generateProject(ctx);

    const server = readFileSync(join(projectDir, "src/server.ts"), "utf-8");
    expect(server).toContain("initializeDatabase");
    expect(server).toContain(".then(");
  });

  it("should not call initializeDatabase in server.ts for non-typeorm", () => {
    const ctx: GeneratorContext = { config: makeConfig(), projectDir };
    generateProject(ctx);

    const server = readFileSync(join(projectDir, "src/server.ts"), "utf-8");
    expect(server).not.toContain("initializeDatabase");
  });

  it("should override DATABASE_URL with db host in docker-compose", () => {
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
    expect(compose).toContain("DATABASE_URL");
    expect(compose).toContain("@db:");
  });

  it("should point vercel.json to dist/server.js", () => {
    const ctx: GeneratorContext = { config: makeConfig(), projectDir };
    generateProject(ctx);

    const vercel = JSON.parse(readFileSync(join(projectDir, "vercel.json"), "utf-8"));
    expect(vercel.builds[0].src).toBe("dist/server.js");
    expect(vercel.routes[0].dest).toBe("dist/server.js");
  });

  // Feature tests

  it("should generate error classes in src/lib/errors.ts", () => {
    const ctx: GeneratorContext = { config: makeConfig(), projectDir };
    generateProject(ctx);

    const errors = readFileSync(join(projectDir, "src/lib/errors.ts"), "utf-8");
    expect(errors).toContain("class AppError");
    expect(errors).toContain("class NotFoundError");
    expect(errors).toContain("class ValidationError");
    expect(errors).toContain("class UnauthorizedError");
  });

  it("should generate logger in src/lib/logger.ts", () => {
    const ctx: GeneratorContext = { config: makeConfig(), projectDir };
    generateProject(ctx);

    const logger = readFileSync(join(projectDir, "src/lib/logger.ts"), "utf-8");
    expect(logger).toContain("pino");
    expect(logger).toContain("pino-pretty");
  });

  it("should generate validate middleware", () => {
    const ctx: GeneratorContext = { config: makeConfig(), projectDir };
    generateProject(ctx);

    const validate = readFileSync(join(projectDir, "src/middleware/validate.ts"), "utf-8");
    expect(validate).toContain("ZodType");
    expect(validate).toContain("schema.parse");
  });

  it("should use logger.info in server.ts instead of console.log", () => {
    const ctx: GeneratorContext = { config: makeConfig(), projectDir };
    generateProject(ctx);

    const server = readFileSync(join(projectDir, "src/server.ts"), "utf-8");
    expect(server).toContain("logger.info");
    expect(server).not.toContain("console.log");
  });

  it("should handle AppError in error handler", () => {
    const ctx: GeneratorContext = { config: makeConfig(), projectDir };
    generateProject(ctx);

    const handler = readFileSync(join(projectDir, "src/middleware/error-handler.ts"), "utf-8");
    expect(handler).toContain("AppError");
    expect(handler).toContain("ZodError");
  });

  it("should validate PORT in env config", () => {
    const ctx: GeneratorContext = { config: makeConfig(), projectDir };
    generateProject(ctx);

    const envConfig = readFileSync(join(projectDir, "src/config/env.ts"), "utf-8");
    expect(envConfig).toContain("isNaN(port)");
    expect(envConfig).toContain("65535");
  });

  it("should validate DATABASE_URL when database is configured", () => {
    const ctx: GeneratorContext = {
      config: makeConfig({ database: "prisma" }),
      projectDir,
    };
    generateProject(ctx);

    const envConfig = readFileSync(join(projectDir, "src/config/env.ts"), "utf-8");
    expect(envConfig).toContain("DATABASE_URL");
    expect(envConfig).toContain("required");
  });

  it("should not validate DATABASE_URL when database is none", () => {
    const ctx: GeneratorContext = { config: makeConfig(), projectDir };
    generateProject(ctx);

    const envConfig = readFileSync(join(projectDir, "src/config/env.ts"), "utf-8");
    expect(envConfig).not.toContain("DATABASE_URL");
  });

  it("should generate in-memory example route for no database", () => {
    const ctx: GeneratorContext = { config: makeConfig(), projectDir };
    generateProject(ctx);

    const route = readFileSync(join(projectDir, "src/routes/example.ts"), "utf-8");
    expect(route).toContain("exampleRouter");
    expect(route).toContain("NotFoundError");
    expect(route).toContain("validate");
    expect(route).not.toContain("prisma");
    expect(route).not.toContain("drizzle");
    expect(route).not.toContain("typeorm");
  });

  it("should generate prisma example route for prisma database", () => {
    const ctx: GeneratorContext = {
      config: makeConfig({ database: "prisma" }),
      projectDir,
    };
    generateProject(ctx);

    const route = readFileSync(join(projectDir, "src/routes/example.ts"), "utf-8");
    expect(route).toContain("prisma");
  });

  it("should generate example route test only for no-database config", () => {
    const noneCtx: GeneratorContext = { config: makeConfig(), projectDir };
    generateProject(noneCtx);
    expect(existsSync(join(projectDir, "tests/example.test.ts"))).toBe(true);
  });

  it("should not generate example route test for database configs", () => {
    const ctx: GeneratorContext = {
      config: makeConfig({ database: "prisma" }),
      projectDir,
    };
    generateProject(ctx);
    expect(existsSync(join(projectDir, "tests/example.test.ts"))).toBe(false);
  });

  it("should use pino-http middleware in app.ts", () => {
    const ctx: GeneratorContext = { config: makeConfig(), projectDir };
    generateProject(ctx);

    const app = readFileSync(join(projectDir, "src/app.ts"), "utf-8");
    expect(app).toContain("pino-http");
    expect(app).toContain("pinoHttp");
  });

  it("should generate rate-limit middleware", () => {
    const ctx: GeneratorContext = { config: makeConfig(), projectDir };
    generateProject(ctx);

    const rateLimit = readFileSync(join(projectDir, "src/middleware/rate-limit.ts"), "utf-8");
    expect(rateLimit).toContain("express-rate-limit");
    expect(rateLimit).toContain("globalLimiter");
    expect(rateLimit).toContain("createLimiter");
  });

  it("should apply globalLimiter in app.ts", () => {
    const ctx: GeneratorContext = { config: makeConfig(), projectDir };
    generateProject(ctx);

    const app = readFileSync(join(projectDir, "src/app.ts"), "utf-8");
    expect(app).toContain("globalLimiter");
    expect(app).toContain("rate-limit");
  });

  it("should include rate limit env vars in env config", () => {
    const ctx: GeneratorContext = { config: makeConfig(), projectDir };
    generateProject(ctx);

    const envConfig = readFileSync(join(projectDir, "src/config/env.ts"), "utf-8");
    expect(envConfig).toContain("RATE_LIMIT_WINDOW_MS");
    expect(envConfig).toContain("RATE_LIMIT_MAX");
    expect(envConfig).toContain("900000");
    expect(envConfig).toContain("100");
  });

  it("should throw NotFoundError in 404 handler", () => {
    const ctx: GeneratorContext = { config: makeConfig(), projectDir };
    generateProject(ctx);

    const app = readFileSync(join(projectDir, "src/app.ts"), "utf-8");
    expect(app).toContain("NotFoundError");
  });

  // Package manager tests

  it("should ignore pnpm and yarn lockfiles in gitignore for npm", () => {
    const ctx: GeneratorContext = {
      config: makeConfig({ packageManager: "npm" }),
      projectDir,
    };
    generateProject(ctx);

    const gitignore = readFileSync(join(projectDir, ".gitignore"), "utf-8");
    expect(gitignore).toContain("pnpm-lock.yaml");
    expect(gitignore).toContain("yarn.lock");
    expect(gitignore).not.toContain("package-lock.json");
  });

  it("should ignore npm and yarn lockfiles in gitignore for pnpm", () => {
    const ctx: GeneratorContext = {
      config: makeConfig({ packageManager: "pnpm" }),
      projectDir,
    };
    generateProject(ctx);

    const gitignore = readFileSync(join(projectDir, ".gitignore"), "utf-8");
    expect(gitignore).toContain("package-lock.json");
    expect(gitignore).toContain("yarn.lock");
    expect(gitignore).not.toContain("pnpm-lock.yaml");
  });

  it("should generate pnpm Dockerfile when package manager is pnpm", () => {
    const ctx: GeneratorContext = {
      config: makeConfig({ packageManager: "pnpm", docker: true }),
      projectDir,
    };
    generateProject(ctx);

    const dockerfile = readFileSync(join(projectDir, "Dockerfile"), "utf-8");
    expect(dockerfile).toContain("corepack enable");
    expect(dockerfile).toContain("pnpm install");
    expect(dockerfile).toContain("pnpm-lock.yaml");
  });

  it("should generate yarn Dockerfile when package manager is yarn", () => {
    const ctx: GeneratorContext = {
      config: makeConfig({ packageManager: "yarn", docker: true }),
      projectDir,
    };
    generateProject(ctx);

    const dockerfile = readFileSync(join(projectDir, "Dockerfile"), "utf-8");
    expect(dockerfile).toContain("yarn install");
    expect(dockerfile).toContain("yarn.lock");
  });

  it("should generate npm Dockerfile by default", () => {
    const ctx: GeneratorContext = {
      config: makeConfig({ docker: true }),
      projectDir,
    };
    generateProject(ctx);

    const dockerfile = readFileSync(join(projectDir, "Dockerfile"), "utf-8");
    expect(dockerfile).toContain("npm ci");
  });
});
