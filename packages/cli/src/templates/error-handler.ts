export function errorHandlerTemplate(): string {
  return `import type { ErrorRequestHandler } from "express";
import { AppError } from "../lib/errors.js";
import { ZodError } from "zod";
import { logger } from "../lib/logger.js";
import { env } from "../config/env.js";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    logger.error({ err, statusCode: err.statusCode }, err.message);
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  if (err instanceof ZodError) {
    logger.warn({ issues: err.issues }, "Validation error");
    res.status(400).json({ error: "Validation failed", issues: err.issues });
    return;
  }

  logger.error(err);

  const status = err.status || err.statusCode || 500;
  const message =
    env.NODE_ENV === "production"
      ? "Internal Server Error"
      : err.message || "Internal Server Error";

  res.status(status).json({ error: message });
};
`;
}
