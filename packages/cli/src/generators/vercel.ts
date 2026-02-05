import type { GeneratorContext } from "../types.js";
import { writeJson } from "../utils/fs.js";

export function generateVercel(ctx: GeneratorContext): void {
  writeJson(ctx.projectDir, "vercel.json", {
    version: 2,
    builds: [
      {
        src: "src/app.ts",
        use: "@vercel/node",
        config: {
          maxDuration: 60,
          memory: 1024,
        },
      },
    ],
    routes: [
      {
        src: "/(.*)",
        dest: "src/app.ts",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
        },
      },
    ],
  });
}
