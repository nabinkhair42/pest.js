import type { GeneratorContext } from "../../types.js";
import { generatePrismaDatabase } from "./prisma.js";
import { generateDrizzleDatabase } from "./drizzle.js";
import { generateTypeormDatabase } from "./typeorm.js";
import { generateNoneDatabase } from "./none.js";

const generators: Record<string, (ctx: GeneratorContext) => void> = {
  prisma: generatePrismaDatabase,
  drizzle: generateDrizzleDatabase,
  typeorm: generateTypeormDatabase,
  none: generateNoneDatabase,
};

export function generateDatabase(ctx: GeneratorContext): void {
  const generator = generators[ctx.config.database];
  if (generator) {
    generator(ctx);
  }
}
