# PEST.js

<div align="center">
  <img src="/assets/pestjs-logo.png" alt="PEST.js Logo" width="200" height="200"/>

  <p><strong>Progressive Express Starter Template</strong></p>

  [![npm version](https://img.shields.io/npm/v/pest-js-app.svg)](https://www.npmjs.com/package/pest-js-app)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
</div>

---

Scaffold production-ready **Express 5 + TypeScript** projects in seconds. Pick a database ORM, add Docker, and start building.

```bash
npx pest-js-app
```

## Why PEST.js?

Starting a new Express project means wiring up TypeScript, linting, testing, error handling, env config, and more — every single time. PEST.js does all of that in one command.

- **Express 5** — native async error handling, no wrappers needed
- **TypeScript** — strict mode, path resolution, source maps
- **Database** — Prisma, Drizzle, or TypeORM with PostgreSQL, MySQL, or SQLite
- **Docker** — multi-stage Dockerfile + compose with DB health checks
- **Testing** — Jest + Supertest with real HTTP assertions
- **Linting** — ESLint flat config + Prettier, pre-commit hooks via Husky
- **Deploy** — Vercel config included out of the box

## Quick Start

```bash
npx pest-js-app
```

Follow the interactive prompts — or skip them entirely:

```bash
npx pest-js-app --yes --name my-api --database prisma --db-provider postgresql --docker
```

Then:

```bash
cd my-api
npm run dev
```

Your API is running at `http://localhost:3000`.

## CLI Options

```
Usage: npx pest-js-app [options]

Options:
  --name <name>         Project name (kebab-case)
  --database <orm>      prisma | drizzle | typeorm | none
  --db-provider <db>    postgresql | mysql | sqlite
  --docker              Enable Docker support
  --no-docker           Disable Docker support
  -y, --yes             Skip all prompts, use defaults
  -v, --version         Show version
  -h, --help            Show help
```

## What Gets Generated

```
my-api/
├── src/
│   ├── app.ts                  Express app (routes + middleware)
│   ├── server.ts               Server entry point
│   ├── config/env.ts           Typed environment variables
│   ├── routes/health.ts        Health check endpoint
│   ├── middleware/
│   │   └── error-handler.ts    Global error handler
│   ├── db/                     Database setup (if selected)
│   └── lib/prisma.ts           Prisma client (if selected)
├── tests/app.test.ts           Supertest tests
├── Dockerfile                  Multi-stage build (if Docker)
├── docker-compose.yml          App + DB services (if Docker)
├── tsconfig.json
├── eslint.config.mjs
├── jest.config.js
├── .prettierrc
└── vercel.json
```

## Scripts in Generated Project

| Script | Description |
|--------|-------------|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Compile TypeScript |
| `npm start` | Run production build |
| `npm test` | Run tests |
| `npm run lint` | Lint with ESLint |
| `npm run format` | Format with Prettier |
| `npm run db:migrate` | Run migrations (if DB) |
| `npm run db:studio` | Database GUI (if DB) |

## Documentation

Full docs at [pestjs.vercel.app/docs](https://pestjs.vercel.app/docs).

## Contributing

Contributions welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT

## Star History

<a href="https://starchart.cc/nabinkhair42/pest.js">
  <img src="https://starchart.cc/nabinkhair42/pest.js.svg?variant=adaptive" alt="Star History Chart" width="100%" />
</a>
