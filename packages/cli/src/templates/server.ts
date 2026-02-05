export function serverTemplate(): string {
  return [
    'import app from "./app.js";',
    'import { env } from "./config/env.js";',
    "",
    "app.listen(env.PORT, () => {",
    "  console.log(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);",
    "});",
    "",
  ].join("\n");
}
