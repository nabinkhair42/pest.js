# PEST.js - Progressive Express Starter Template

<div align="center">
  <img src="/assets/pestjs-logo.png" alt="PEST.js Logo" width="200" height="200"/>

  <p><strong>Progressive • Elegant • Structured • TypeScript</strong></p>
</div>

## Overview

PEST.js is a **CLI scaffolding tool** that generates production-ready Node.js + Express 5 applications with TypeScript. Choose your database ORM, add Docker support, and start coding in seconds.

## Features

- **Express 5**: Latest Express with native async error handling
- **TypeScript-First**: Strict TypeScript configuration out of the box
- **Database Support**: Choose Prisma, Drizzle, or TypeORM with PostgreSQL, MySQL, or SQLite
- **Docker Ready**: Optional Dockerfile and docker-compose with database services
- **Testing Ready**: Jest + Supertest with real HTTP assertions
- **Modern Linting**: ESLint flat config with TypeScript support
- **Interactive CLI**: Beautiful prompts with non-interactive CI mode
- **Vercel Ready**: Deployment configuration included

## Quick Start

### Using npx (recommended)

```bash
npx pest-js
```

### Global install

```bash
npm i -g pest-js
pest-js
```

### Non-interactive mode (CI)

```bash
npx pest-js --yes --name my-api --database prisma --db-provider postgresql --docker
```

## CLI Options

| Option | Description |
|--------|-------------|
| `--name <name>` | Project name (kebab-case) |
| `--database <orm>` | `prisma` \| `drizzle` \| `typeorm` \| `none` |
| `--db-provider <db>` | `postgresql` \| `mysql` \| `sqlite` |
| `--docker` / `--no-docker` | Enable/disable Docker support |
| `-y, --yes` | Use defaults (non-interactive) |
| `-v, --version` | Show version |
| `-h, --help` | Show help |

## Generated Project Structure

```
your-project/
├── src/
│   ├── app.ts                    # Express application
│   ├── server.ts                 # Server entry point
│   ├── config/
│   │   └── env.ts                # Typed environment config
│   ├── routes/
│   │   └── health.ts             # Health check route
│   ├── middleware/
│   │   └── error-handler.ts      # Error handling middleware
│   ├── db/                       # Database (if selected)
│   │   ├── index.ts
│   │   └── schema.ts             # or data-source.ts / entities/
│   └── lib/
│       └── prisma.ts             # Prisma client (if selected)
├── tests/
│   └── app.test.ts               # Supertest-based tests
├── prisma/                       # Prisma schema (if selected)
├── Dockerfile                    # Multi-stage build (if Docker)
├── docker-compose.yml            # App + DB services (if Docker)
└── [config files]                # tsconfig, eslint, prettier, jest, etc.
```

## Available Scripts (in generated project)

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Start production server |
| `npm test` | Run tests with Jest |
| `npm run lint` | Lint with ESLint |
| `npm run format` | Format with Prettier |
| `npm run db:migrate` | Run database migrations (if DB selected) |
| `npm run db:studio` | Open database GUI (Prisma/Drizzle) |

## Repository Structure

```
pest.js/
├── packages/
│   └── cli/                      # CLI package (published as pest-js)
│       ├── src/
│       │   ├── index.ts           # Entry point
│       │   ├── cli.ts             # Prompt orchestration
│       │   ├── types.ts           # Type definitions
│       │   ├── constants.ts       # Versions and defaults
│       │   ├── generators/        # Project generators
│       │   │   ├── database/      # ORM-specific generators
│       │   │   └── ...
│       │   ├── templates/         # File templates
│       │   └── utils/             # Utilities
│       ├── package.json
│       └── tsup.config.ts
├── www/                           # Documentation website
├── pnpm-workspace.yaml
└── package.json
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
