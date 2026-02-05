import type { GeneratorContext } from "../../types.js";
import { writeFile } from "../../utils/fs.js";

const TYPEORM_TYPES: Record<string, string> = {
  postgresql: "postgres",
  mysql: "mysql",
  sqlite: "better-sqlite3",
};

export function generateTypeormDatabase(ctx: GeneratorContext): void {
  const { config, projectDir } = ctx;
  const dbType = TYPEORM_TYPES[config.dbProvider] ?? "postgres";

  // src/db/data-source.ts
  if (config.dbProvider === "sqlite") {
    writeFile(
      projectDir,
      "src/db/data-source.ts",
      `import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/user.js";

export const AppDataSource = new DataSource({
  type: "${dbType}",
  database: process.env.DATABASE_URL || "./dev.db",
  synchronize: process.env.NODE_ENV !== "production",
  logging: process.env.NODE_ENV !== "production",
  entities: [User],
  migrations: ["src/db/migrations/*.ts"],
});
`
    );
  } else {
    writeFile(
      projectDir,
      "src/db/data-source.ts",
      `import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/user.js";

export const AppDataSource = new DataSource({
  type: "${dbType}",
  url: process.env.DATABASE_URL,
  synchronize: process.env.NODE_ENV !== "production",
  logging: process.env.NODE_ENV !== "production",
  entities: [User],
  migrations: ["src/db/migrations/*.ts"],
});
`
    );
  }

  // src/db/index.ts
  writeFile(
    projectDir,
    "src/db/index.ts",
    `import { AppDataSource } from "./data-source.js";

export async function initializeDatabase(): Promise<void> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    console.log("Database connection established");
  }
}

export { AppDataSource };
`
  );

  // src/db/entities/user.ts - example entity
  writeFile(
    projectDir,
    "src/db/entities/user.ts",
    `import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
`
  );
}
