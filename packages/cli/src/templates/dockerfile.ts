import type { ProjectConfig } from "../types.js";

export function dockerfileTemplate(config: ProjectConfig): string {
  const prismaGenerate =
    config.database === "prisma" ? "\nRUN npx prisma generate" : "";
  const prismaCopy =
    config.database === "prisma"
      ? "\nCOPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma"
      : "";

  return `# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci
${prismaGenerate}
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev
${prismaCopy}
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/server.js"]
`;
}

export function dockerignoreTemplate(): string {
  return `node_modules
dist
.env
.git
coverage
*.log
.DS_Store
`;
}
