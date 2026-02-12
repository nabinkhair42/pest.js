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

  // --- Base project generation ---

  it("should generate all base files", () => {
    const ctx: GeneratorContext = { config: makeConfig(), projectDir };
    generateProject(ctx);

    const expected = [
      "package.json", "tsconfig.json", "eslint.config.mjs",
      ".prettierrc", "jest.config.js", ".gitignore",
      ".env", ".env.example", "vercel.json",
      "src/app.ts", "src/server.ts",
      "src/routes/health.ts", "src/routes/example.ts",
      "src/middleware/error-handler.ts", "src/middleware/validate.ts", "src/middleware/rate-limit.ts",
      "src/config/env.ts", "src/lib/errors.ts", "src/lib/logger.ts",
      "tests/app.test.ts", "tests/example.test.ts",
      ".husky/pre-commit",
    ];
    for (const file of expected) {
      expect(existsSync(join(projectDir, file)), `missing: ${file}`).toBe(true);
    }
  });

  it("should make husky pre-commit executable", () => {
    const ctx: GeneratorContext = { config: makeConfig(), projectDir };
    generateProject(ctx);

    const mode = statSync(join(projectDir, ".husky/pre-commit")).mode & 0o777;
    expect(mode & 0o111).toBeGreaterThan(0);
  });

  it("should only generate example route test for no-database config", () => {
    const noneCtx: GeneratorContext = { config: makeConfig(), projectDir };
    generateProject(noneCtx);
    expect(existsSync(join(projectDir, "tests/example.test.ts"))).toBe(true);

    // Clean and regenerate with prisma
    rmSync(projectDir, { recursive: true, force: true });
    mkdirSync(projectDir, { recursive: true });
    const prismaCtx: GeneratorContext = {
      config: makeConfig({ database: "prisma" }),
      projectDir,
    };
    generateProject(prismaCtx);
    expect(existsSync(join(projectDir, "tests/example.test.ts"))).toBe(false);
  });

  // --- Server template ---

  it("should include graceful shutdown handlers in server.ts", () => {
    const ctx: GeneratorContext = { config: makeConfig(), projectDir };
    generateProject(ctx);

    const server = readFileSync(join(projectDir, "src/server.ts"), "utf-8");
    expect(server).toContain("SIGTERM");
    expect(server).toContain("SIGINT");
    expect(server).toContain("server.close");
    expect(server).toContain("logger.info");
    expect(server).not.toContain("console.log");
    expect(server).not.toContain("initializeDatabase");
  });

  it("should initialize database and destroy on shutdown for typeorm", () => {
    const ctx: GeneratorContext = {
      config: makeConfig({ database: "typeorm", dbProvider: "postgresql" }),
      projectDir,
    };
    generateProject(ctx);

    const server = readFileSync(join(projectDir, "src/server.ts"), "utf-8");
    expect(server).toContain("initializeDatabase");
    expect(server).toContain(".then(");
    expect(server).toContain(".catch(");
    expect(server).toContain("process.exit(1)");
    expect(server).toContain("AppDataSource.destroy");
    expect(server).toContain("SIGTERM");
  });

  // --- Database generators ---

  it("should generate prisma files with Prisma 7 config", () => {
    const ctx: GeneratorContext = {
      config: makeConfig({ database: "prisma" }),
      projectDir,
    };
    generateProject(ctx);

    expect(existsSync(join(projectDir, "prisma/schema.prisma"))).toBe(true);
    expect(existsSync(join(projectDir, "prisma.config.ts"))).toBe(true);
    expect(existsSync(join(projectDir, "src/lib/prisma.ts"))).toBe(true);

    const schema = readFileSync(join(projectDir, "prisma/schema.prisma"), "utf-8");
    expect(schema).not.toContain("env(");

    const config = readFileSync(join(projectDir, "prisma.config.ts"), "utf-8");
    expect(config).toContain("defineConfig");
    expect(config).toContain('env("DATABASE_URL")');
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

  it("should use createPool for drizzle mysql", () => {
    const ctx: GeneratorContext = {
      config: makeConfig({ database: "drizzle", dbProvider: "mysql" }),
      projectDir,
    };
    generateProject(ctx);

    const dbIndex = readFileSync(join(projectDir, "src/db/index.ts"), "utf-8");
    expect(dbIndex).toContain("createPool");
  });

  it("should generate typeorm files with decorator support", () => {
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

    // getRepository should only be inside handlers, not at module level
    const route = readFileSync(join(projectDir, "src/routes/example.ts"), "utf-8");
    const topLevelRepo = route.split("\n").find((l) => l.startsWith("const userRepo"));
    expect(topLevelRepo).toBeUndefined();
    expect(route).toContain("getRepository(User)");
  });

  it("should generate correct example route per database config", () => {
    const ctx: GeneratorContext = { config: makeConfig(), projectDir };
    generateProject(ctx);

    const route = readFileSync(join(projectDir, "src/routes/example.ts"), "utf-8");
    expect(route).toContain("exampleRouter");
    expect(route).toContain("NotFoundError");
    expect(route).toContain("validate");
    expect(route).not.toContain("prisma");

    // Prisma variant
    rmSync(projectDir, { recursive: true, force: true });
    mkdirSync(projectDir, { recursive: true });
    generateProject({ config: makeConfig({ database: "prisma" }), projectDir });
    const prismaRoute = readFileSync(join(projectDir, "src/routes/example.ts"), "utf-8");
    expect(prismaRoute).toContain("prisma");
  });

  // --- Environment ---

  it("should configure DATABASE_URL based on database selection", () => {
    // With database: URL in .env + validated in env config
    const withDb: GeneratorContext = {
      config: makeConfig({ database: "prisma", dbProvider: "postgresql" }),
      projectDir,
    };
    generateProject(withDb);
    expect(readFileSync(join(projectDir, ".env"), "utf-8")).toContain("DATABASE_URL");
    expect(readFileSync(join(projectDir, "src/config/env.ts"), "utf-8")).toContain("DATABASE_URL!");

    // Without database: no DATABASE_URL
    rmSync(projectDir, { recursive: true, force: true });
    mkdirSync(projectDir, { recursive: true });
    generateProject({ config: makeConfig(), projectDir });
    expect(readFileSync(join(projectDir, ".env"), "utf-8")).not.toContain("DATABASE_URL");
    expect(readFileSync(join(projectDir, "src/config/env.ts"), "utf-8")).not.toContain("DATABASE_URL");
  });

  it("should not require DATABASE_URL for sqlite and provide fallback", () => {
    const ctx: GeneratorContext = {
      config: makeConfig({ database: "drizzle", dbProvider: "sqlite" }),
      projectDir,
    };
    generateProject(ctx);

    const envConfig = readFileSync(join(projectDir, "src/config/env.ts"), "utf-8");
    expect(envConfig).toContain("DATABASE_URL");
    expect(envConfig).not.toContain("required");
    expect(envConfig).toContain("./dev.db");
  });

  it("should include rate limit env vars in .env and env config", () => {
    const ctx: GeneratorContext = { config: makeConfig(), projectDir };
    generateProject(ctx);

    const envFile = readFileSync(join(projectDir, ".env"), "utf-8");
    expect(envFile).toContain("RATE_LIMIT_WINDOW_MS=900000");
    expect(envFile).toContain("RATE_LIMIT_MAX=100");

    const envConfig = readFileSync(join(projectDir, "src/config/env.ts"), "utf-8");
    expect(envConfig).toContain("isNaN(rateLimitWindowMs)");
    expect(envConfig).toContain("isNaN(rateLimitMax)");
    expect(envConfig).toContain("isNaN(port)");
    expect(envConfig).toContain("65535");
  });

  // --- Docker ---

  it("should generate docker files only when enabled", () => {
    generateProject({ config: makeConfig({ docker: false }), projectDir });
    expect(existsSync(join(projectDir, "Dockerfile"))).toBe(false);

    rmSync(projectDir, { recursive: true, force: true });
    mkdirSync(projectDir, { recursive: true });
    generateProject({ config: makeConfig({ docker: true }), projectDir });
    expect(existsSync(join(projectDir, "Dockerfile"))).toBe(true);
    expect(existsSync(join(projectDir, "docker-compose.yml"))).toBe(true);
    expect(existsSync(join(projectDir, ".dockerignore"))).toBe(true);
  });

  it("should include db service in docker-compose for postgres but not sqlite", () => {
    generateProject({
      config: makeConfig({ database: "prisma", dbProvider: "postgresql", docker: true }),
      projectDir,
    });
    const pgCompose = readFileSync(join(projectDir, "docker-compose.yml"), "utf-8");
    expect(pgCompose).toContain("postgres:16-alpine");
    expect(pgCompose).toContain("db:");
    expect(pgCompose).toContain("@db:");

    rmSync(projectDir, { recursive: true, force: true });
    mkdirSync(projectDir, { recursive: true });
    generateProject({
      config: makeConfig({ database: "prisma", dbProvider: "sqlite", docker: true }),
      projectDir,
    });
    const sqliteCompose = readFileSync(join(projectDir, "docker-compose.yml"), "utf-8");
    expect(sqliteCompose).not.toContain("db:");
  });

  it("should mount a volume for sqlite database file in docker-compose", () => {
    generateProject({
      config: makeConfig({ database: "drizzle", dbProvider: "sqlite", docker: true }),
      projectDir,
    });

    const compose = readFileSync(join(projectDir, "docker-compose.yml"), "utf-8");
    expect(compose).toContain("volumes:");
    expect(compose).toContain("./data:/app/data");
  });

  it("should copy prisma files to production stage in Dockerfile", () => {
    generateProject({
      config: makeConfig({ database: "prisma", docker: true }),
      projectDir,
    });

    const dockerfile = readFileSync(join(projectDir, "Dockerfile"), "utf-8");
    expect(dockerfile).toContain("COPY --from=builder /app/prisma ./prisma");
    expect(dockerfile).toContain("COPY --from=builder /app/prisma.config.ts ./");
    // prisma generate runs after COPY . .
    const copyIdx = dockerfile.indexOf("COPY . .");
    const prismaIdx = dockerfile.indexOf("prisma generate");
    expect(prismaIdx).toBeGreaterThan(copyIdx);
  });

  // --- Package manager variants ---

  it("should configure gitignore lockfiles per package manager", () => {
    generateProject({ config: makeConfig({ packageManager: "npm" }), projectDir });
    const npmIgnore = readFileSync(join(projectDir, ".gitignore"), "utf-8");
    expect(npmIgnore).toContain("pnpm-lock.yaml");
    expect(npmIgnore).toContain("yarn.lock");
    expect(npmIgnore).not.toContain("package-lock.json");

    rmSync(projectDir, { recursive: true, force: true });
    mkdirSync(projectDir, { recursive: true });
    generateProject({ config: makeConfig({ packageManager: "pnpm" }), projectDir });
    const pnpmIgnore = readFileSync(join(projectDir, ".gitignore"), "utf-8");
    expect(pnpmIgnore).toContain("package-lock.json");
    expect(pnpmIgnore).not.toContain("pnpm-lock.yaml");
  });

  it("should use correct exec command in husky hook per package manager", () => {
    generateProject({ config: makeConfig({ packageManager: "pnpm" }), projectDir });
    const pnpmHook = readFileSync(join(projectDir, ".husky/pre-commit"), "utf-8");
    expect(pnpmHook).toContain("pnpm exec lint-staged");

    rmSync(projectDir, { recursive: true, force: true });
    mkdirSync(projectDir, { recursive: true });
    generateProject({ config: makeConfig({ packageManager: "npm" }), projectDir });
    const npmHook = readFileSync(join(projectDir, ".husky/pre-commit"), "utf-8");
    expect(npmHook).toContain("npx lint-staged");
  });

  it("should generate correct Dockerfile per package manager", () => {
    // pnpm
    generateProject({ config: makeConfig({ packageManager: "pnpm", docker: true }), projectDir });
    const pnpmDockerfile = readFileSync(join(projectDir, "Dockerfile"), "utf-8");
    expect(pnpmDockerfile).toContain("corepack enable");
    expect(pnpmDockerfile).toContain("pnpm install");

    // yarn
    rmSync(projectDir, { recursive: true, force: true });
    mkdirSync(projectDir, { recursive: true });
    generateProject({ config: makeConfig({ packageManager: "yarn", docker: true }), projectDir });
    const yarnDockerfile = readFileSync(join(projectDir, "Dockerfile"), "utf-8");
    expect(yarnDockerfile).toContain("corepack enable");
    expect(yarnDockerfile).toContain("yarn install");

    // npm
    rmSync(projectDir, { recursive: true, force: true });
    mkdirSync(projectDir, { recursive: true });
    generateProject({ config: makeConfig({ docker: true }), projectDir });
    const npmDockerfile = readFileSync(join(projectDir, "Dockerfile"), "utf-8");
    expect(npmDockerfile).toContain("npm ci");
  });

  it("should use correct prisma exec in Dockerfile per package manager", () => {
    // pnpm
    generateProject({
      config: makeConfig({ database: "prisma", packageManager: "pnpm", docker: true }),
      projectDir,
    });
    expect(readFileSync(join(projectDir, "Dockerfile"), "utf-8")).toContain("pnpm exec prisma generate");

    // yarn
    rmSync(projectDir, { recursive: true, force: true });
    mkdirSync(projectDir, { recursive: true });
    generateProject({
      config: makeConfig({ database: "prisma", packageManager: "yarn", docker: true }),
      projectDir,
    });
    expect(readFileSync(join(projectDir, "Dockerfile"), "utf-8")).toContain("yarn prisma generate");
  });

  it("should point vercel.json to dist/server.js", () => {
    generateProject({ config: makeConfig(), projectDir });

    const vercel = JSON.parse(readFileSync(join(projectDir, "vercel.json"), "utf-8"));
    expect(vercel.builds[0].src).toBe("dist/server.js");
    expect(vercel.routes[0].dest).toBe("dist/server.js");
  });
});
