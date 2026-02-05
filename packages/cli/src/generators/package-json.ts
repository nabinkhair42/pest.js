import type { GeneratorContext } from "../types.js";
import { DEPS, DEV_DEPS, DB_DEPS } from "../constants.js";
import { writeJson } from "../utils/fs.js";

export function generatePackageJson(ctx: GeneratorContext): void {
  const { config, projectDir } = ctx;

  const dependencies: Record<string, string> = { ...DEPS };
  const devDependencies: Record<string, string> = { ...DEV_DEPS };
  const scripts: Record<string, string> = {
    start: "node dist/server.js",
    dev: "nodemon --exec ts-node src/server.ts",
    build: "tsc",
    test: "jest",
    lint: "eslint src/",
    "lint:fix": "eslint src/ --fix",
    format: 'prettier --write "src/**/*.ts"',
    "format:check": 'prettier --check "src/**/*.ts"',
    prepare: "husky",
  };

  // Add database-specific deps
  if (config.database === "prisma") {
    Object.assign(dependencies, DB_DEPS.prisma.dependencies);
    Object.assign(devDependencies, DB_DEPS.prisma.devDependencies);
    scripts["db:generate"] = "prisma generate";
    scripts["db:migrate"] = "prisma migrate dev";
    scripts["db:push"] = "prisma db push";
    scripts["db:studio"] = "prisma studio";
  } else if (config.database === "drizzle") {
    Object.assign(dependencies, DB_DEPS.drizzle.base.dependencies);
    Object.assign(devDependencies, DB_DEPS.drizzle.base.devDependencies);
    const driver = DB_DEPS.drizzle.drivers[config.dbProvider];
    Object.assign(dependencies, driver.dependencies);
    if ("devDependencies" in driver) {
      Object.assign(devDependencies, driver.devDependencies);
    }
    scripts["db:generate"] = "drizzle-kit generate";
    scripts["db:migrate"] = "drizzle-kit migrate";
    scripts["db:push"] = "drizzle-kit push";
    scripts["db:studio"] = "drizzle-kit studio";
  } else if (config.database === "typeorm") {
    Object.assign(dependencies, DB_DEPS.typeorm.base.dependencies);
    const driver = DB_DEPS.typeorm.drivers[config.dbProvider];
    Object.assign(dependencies, driver.dependencies);
    scripts["db:migrate"] = "typeorm migration:run -d src/db/data-source.ts";
    scripts["db:generate"] = "typeorm migration:generate -d src/db/data-source.ts";
  }

  const pkg: Record<string, unknown> = {
    name: config.name,
    version: "1.0.0",
    description: config.description,
    main: "dist/server.js",
    author: config.author,
    license: "MIT",
    scripts,
    dependencies,
    devDependencies,
    "lint-staged": {
      "*.ts": ["eslint --fix", "prettier --write"],
    },
  };

  writeJson(projectDir, "package.json", pkg);
}
