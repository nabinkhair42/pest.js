import type { GeneratorContext } from "../types.js";
import { writeFile } from "../utils/fs.js";
import { dockerfileTemplate, dockerignoreTemplate } from "../templates/dockerfile.js";
import { dockerComposeTemplate } from "../templates/docker-compose.js";

export function generateDocker(ctx: GeneratorContext): void {
  if (!ctx.config.docker) return;

  writeFile(ctx.projectDir, "Dockerfile", dockerfileTemplate(ctx.config));
  writeFile(ctx.projectDir, ".dockerignore", dockerignoreTemplate());
  writeFile(ctx.projectDir, "docker-compose.yml", dockerComposeTemplate(ctx.config));
}
