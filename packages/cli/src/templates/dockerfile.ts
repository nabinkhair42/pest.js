import type { ProjectConfig } from "../types.js";

export function dockerfileTemplate(config: ProjectConfig): string {
  const pm = config.packageManager;
  const prismaGenerate =
    config.database === "prisma" ? "\nRUN npx prisma generate" : "";
  const prismaCopy =
    config.database === "prisma"
      ? "\nCOPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma"
      : "";

  if (pm === "pnpm") {
    return `# Build stage
FROM node:20-alpine AS builder

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
${prismaGenerate}
COPY . .
RUN pnpm run build

# Production stage
FROM node:20-alpine AS runner

RUN corepack enable

WORKDIR /app

ENV NODE_ENV=production

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod
${prismaCopy}
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/server.js"]
`;
  }

  if (pm === "yarn") {
    return `# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
${prismaGenerate}
COPY . .
RUN yarn build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production
${prismaCopy}
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/server.js"]
`;
  }

  // npm (default)
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
