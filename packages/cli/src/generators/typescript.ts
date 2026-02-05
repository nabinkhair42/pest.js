import type { GeneratorContext } from "../types.js";
import { writeJson } from "../utils/fs.js";

export function generateTsConfig(ctx: GeneratorContext): void {
  const { config, projectDir } = ctx;

  const compilerOptions: Record<string, unknown> = {
    target: "ES2022",
    module: "commonjs",
    outDir: "./dist",
    rootDir: "./src",
    strict: true,
    esModuleInterop: true,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true,
    moduleResolution: "node",
    resolveJsonModule: true,
    sourceMap: true,
  };

  if (config.database === "typeorm") {
    compilerOptions.experimentalDecorators = true;
    compilerOptions.emitDecoratorMetadata = true;
  }

  writeJson(projectDir, "tsconfig.json", {
    compilerOptions,
    include: ["src/**/*"],
    exclude: ["node_modules", "dist", "tests"],
  });
}
