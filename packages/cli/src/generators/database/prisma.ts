import type { GeneratorContext } from "../../types.js";
import { writeFile } from "../../utils/fs.js";

const PRISMA_PROVIDERS: Record<string, string> = {
  postgresql: "postgresql",
  mysql: "mysql",
  sqlite: "sqlite",
};

export function generatePrismaDatabase(ctx: GeneratorContext): void {
  const { config, projectDir } = ctx;
  const provider = PRISMA_PROVIDERS[config.dbProvider] ?? "postgresql";

  // prisma/schema.prisma
  writeFile(
    projectDir,
    "prisma/schema.prisma",
    `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "${provider}"
  url      = env("DATABASE_URL")
}
`
  );

  // src/lib/prisma.ts - singleton client
  writeFile(
    projectDir,
    "src/lib/prisma.ts",
    `import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
`
  );
}
