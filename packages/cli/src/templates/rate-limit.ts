export function rateLimitTemplate(): string {
  const lines: string[] = [];

  lines.push('import rateLimit from "express-rate-limit";');
  lines.push('import { env } from "../config/env.js";');
  lines.push("");
  lines.push("/**");
  lines.push(" * Global rate limiter applied to all routes.");
  lines.push(" * Configurable via RATE_LIMIT_WINDOW_MS and RATE_LIMIT_MAX env vars.");
  lines.push(" */");
  lines.push("export const globalLimiter = rateLimit({");
  lines.push("  windowMs: env.RATE_LIMIT_WINDOW_MS,");
  lines.push("  limit: env.RATE_LIMIT_MAX,");
  lines.push("  standardHeaders: true,");
  lines.push("  legacyHeaders: false,");
  lines.push('  skip: () => env.NODE_ENV === "test",');
  lines.push("});");
  lines.push("");
  lines.push("/**");
  lines.push(" * Create a custom rate limiter for specific routes.");
  lines.push(" * @example");
  lines.push(" * const authLimiter = createLimiter({ windowMs: 15 * 60 * 1000, limit: 5 });");
  lines.push(" * router.post('/login', authLimiter, loginHandler);");
  lines.push(" */");
  lines.push("export function createLimiter(options: { windowMs: number; limit: number }) {");
  lines.push("  return rateLimit({");
  lines.push("    ...options,");
  lines.push("    standardHeaders: true,");
  lines.push("    legacyHeaders: false,");
  lines.push("  });");
  lines.push("}");
  lines.push("");

  return lines.join("\n");
}
