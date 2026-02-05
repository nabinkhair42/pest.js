# PEST.js

<div align="center">
  <p><strong>Progressive Express Starter Template</strong></p>

  [![npm version](https://img.shields.io/npm/v/pest-js-app.svg)](https://www.npmjs.com/package/pest-js-app)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
</div>

---

Scaffold production-ready **Express 5 + TypeScript** projects in seconds.

```bash
npx pest-js-app
```

## Features

- **Express 5** — native async error handling
- **TypeScript** — strict mode, source maps
- **Database** — Prisma, Drizzle, or TypeORM with PostgreSQL, MySQL, or SQLite
- **Docker** — multi-stage Dockerfile + compose with DB health checks
- **Testing** — Jest + Supertest
- **Linting** — ESLint flat config + Prettier + Husky
- **Deploy** — Vercel config included

## Quick Start

```bash
npx pest-js-app
```

Or skip the prompts:

```bash
npx pest-js-app --yes --name my-api --database prisma --db-provider postgresql --docker
```

Then:

```bash
cd my-api
npm run dev
```

## CLI Options

```
--name <name>         Project name (kebab-case)
--database <orm>      prisma | drizzle | typeorm | none
--db-provider <db>    postgresql | mysql | sqlite
--docker              Enable Docker support
--no-docker           Disable Docker support
-y, --yes             Skip all prompts, use defaults
-v, --version         Show version
-h, --help            Show help
```

## Documentation

Full docs at [pestjs.vercel.app/docs](https://pestjs.vercel.app/docs).

## License

MIT
