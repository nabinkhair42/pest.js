import type { ProjectConfig } from "../types.js";

export function dockerComposeTemplate(config: ProjectConfig): string {
  const lines: string[] = [];

  lines.push(`services:`);
  lines.push(`  app:`);
  lines.push(`    build: .`);
  lines.push(`    ports:`);
  lines.push(`      - "3000:3000"`);
  lines.push(`    env_file:`);
  lines.push(`      - .env`);

  const needsDb =
    config.database !== "none" && config.dbProvider !== "sqlite";

  if (needsDb) {
    lines.push(`    depends_on:`);
    lines.push(`      db:`);
    lines.push(`        condition: service_healthy`);
  }

  lines.push(``);

  if (needsDb && config.dbProvider === "postgresql") {
    lines.push(`  db:`);
    lines.push(`    image: postgres:16-alpine`);
    lines.push(`    ports:`);
    lines.push(`      - "5432:5432"`);
    lines.push(`    environment:`);
    lines.push(`      POSTGRES_USER: user`);
    lines.push(`      POSTGRES_PASSWORD: password`);
    lines.push(`      POSTGRES_DB: mydb`);
    lines.push(`    volumes:`);
    lines.push(`      - db_data:/var/lib/postgresql/data`);
    lines.push(`    healthcheck:`);
    lines.push(`      test: ["CMD-SHELL", "pg_isready -U user -d mydb"]`);
    lines.push(`      interval: 5s`);
    lines.push(`      timeout: 5s`);
    lines.push(`      retries: 5`);
    lines.push(``);
    lines.push(`volumes:`);
    lines.push(`  db_data:`);
  }

  if (needsDb && config.dbProvider === "mysql") {
    lines.push(`  db:`);
    lines.push(`    image: mysql:8.0`);
    lines.push(`    ports:`);
    lines.push(`      - "3306:3306"`);
    lines.push(`    environment:`);
    lines.push(`      MYSQL_ROOT_PASSWORD: password`);
    lines.push(`      MYSQL_USER: user`);
    lines.push(`      MYSQL_PASSWORD: password`);
    lines.push(`      MYSQL_DATABASE: mydb`);
    lines.push(`    volumes:`);
    lines.push(`      - db_data:/var/lib/mysql`);
    lines.push(`    healthcheck:`);
    lines.push(`      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]`);
    lines.push(`      interval: 5s`);
    lines.push(`      timeout: 5s`);
    lines.push(`      retries: 5`);
    lines.push(``);
    lines.push(`volumes:`);
    lines.push(`  db_data:`);
  }

  return lines.join("\n") + "\n";
}
