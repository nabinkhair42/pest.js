export const VERSION = "3.0.0";

export const DEPS = {
  express: "^5.1.0",
  cors: "^2.8.5",
  helmet: "^8.0.0",
  dotenv: "^16.4.1",
} as const;

export const DEV_DEPS = {
  "@types/express": "^5.0.6",
  "@types/cors": "^2.8.17",
  "@types/node": "^20.11.5",
  typescript: "^5.7.0",
  "ts-node": "^10.9.2",
  nodemon: "^3.0.3",
  jest: "^29.7.0",
  "ts-jest": "^29.1.0",
  "@types/jest": "^29.5.11",
  supertest: "^7.1.0",
  "@types/supertest": "^6.0.2",
  eslint: "^9.35.0",
  "typescript-eslint": "^8.33.0",
  prettier: "^3.6.2",
  husky: "^9.1.7",
  "lint-staged": "^15.2.0",
} as const;

export const DB_DEPS = {
  prisma: {
    dependencies: {
      "@prisma/client": "^6.9.0",
    },
    devDependencies: {
      prisma: "^6.9.0",
    },
  },
  drizzle: {
    base: {
      dependencies: {
        "drizzle-orm": "^0.44.0",
      },
      devDependencies: {
        "drizzle-kit": "^0.31.0",
      },
    },
    drivers: {
      postgresql: { dependencies: { postgres: "^3.4.5" } },
      mysql: { dependencies: { mysql2: "^3.12.0" } },
      sqlite: { dependencies: { "better-sqlite3": "^11.8.0" }, devDependencies: { "@types/better-sqlite3": "^7.6.12" } },
    },
  },
  typeorm: {
    base: {
      dependencies: {
        typeorm: "^0.3.22",
        "reflect-metadata": "^0.2.2",
      },
    },
    drivers: {
      postgresql: { dependencies: { pg: "^8.13.3" } },
      mysql: { dependencies: { mysql2: "^3.12.0" } },
      sqlite: { dependencies: { "better-sqlite3": "^11.8.0" } },
    },
  },
} as const;

export const DATABASE_URLS: Record<string, Record<string, string>> = {
  postgresql: {
    prisma: "postgresql://user:password@localhost:5432/mydb?schema=public",
    drizzle: "postgresql://user:password@localhost:5432/mydb",
    typeorm: "postgresql://user:password@localhost:5432/mydb",
  },
  mysql: {
    prisma: "mysql://user:password@localhost:3306/mydb",
    drizzle: "mysql://user:password@localhost:3306/mydb",
    typeorm: "mysql://user:password@localhost:3306/mydb",
  },
  sqlite: {
    prisma: "file:./dev.db",
    drizzle: "./dev.db",
    typeorm: "./dev.db",
  },
};

export const DOCKER_DB_PORTS: Record<string, number> = {
  postgresql: 5432,
  mysql: 3306,
};

export const BANNER = `
 ____  _____ ____ _____   _
|  _ \\| ____/ ___|_   _| (_)___
| |_) |  _| \\___ \\ | |   | / __|
|  __/| |___ ___) || | _ | \\__ \\
|_|   |_____|____/ |_|(_)/ |___/
                        |__/
`;
