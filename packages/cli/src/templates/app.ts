import type { ProjectConfig } from "../types.js";

export function appTemplate(config: ProjectConfig): string {
  return `import express from "express";
import cors from "cors";
import helmet from "helmet";
import { healthRouter } from "./routes/health.js";
import { errorHandler } from "./middleware/error-handler.js";
import { env } from "./config/env.js";

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (_req, res) => {
  res.json({
    message: "Welcome to ${config.name} API",
    version: "1.0.0",
    environment: env.NODE_ENV,
  });
});

app.use("/health", healthRouter);

// 404 handler
app.all("*path", (_req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Error handler
app.use(errorHandler);

export default app;
`;
}
