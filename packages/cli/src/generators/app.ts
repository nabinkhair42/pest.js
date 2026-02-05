import type { GeneratorContext } from "../types.js";
import { writeFile } from "../utils/fs.js";
import { appTemplate } from "../templates/app.js";
import { serverTemplate } from "../templates/server.js";
import { healthRouteTemplate } from "../templates/health-route.js";
import { errorHandlerTemplate } from "../templates/error-handler.js";
import { envConfigTemplate } from "../templates/env-config.js";
import { appTestTemplate } from "../templates/app-test.js";

export function generateApp(ctx: GeneratorContext): void {
  const { config, projectDir } = ctx;

  writeFile(projectDir, "src/app.ts", appTemplate(config));
  writeFile(projectDir, "src/server.ts", serverTemplate());
  writeFile(projectDir, "src/routes/health.ts", healthRouteTemplate());
  writeFile(projectDir, "src/middleware/error-handler.ts", errorHandlerTemplate());
  writeFile(projectDir, "src/config/env.ts", envConfigTemplate(config));
  writeFile(projectDir, "tests/app.test.ts", appTestTemplate());
}
