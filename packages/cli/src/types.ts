export type DatabaseORM = "prisma" | "drizzle" | "typeorm" | "none";

export type DatabaseProvider = "postgresql" | "mysql" | "sqlite";

export interface ProjectConfig {
  name: string;
  description: string;
  author: string;
  database: DatabaseORM;
  dbProvider: DatabaseProvider;
  docker: boolean;
  git: boolean;
  install: boolean;
}

export interface GeneratorContext {
  config: ProjectConfig;
  projectDir: string;
}
