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

  // prisma/schema.prisma (Prisma 7 compatible - no url in schema)
  writeFile(
    projectDir,
    "prisma/schema.prisma",
    `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "${provider}"
}
`
  );

  // prisma.config.ts (Prisma 7 config file)
  writeFile(
    projectDir,
    "prisma.config.ts",
    `import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  earlyAccess: true,
  schema: "./prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
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
