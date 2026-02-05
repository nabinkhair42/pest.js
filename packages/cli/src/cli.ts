import * as p from "@clack/prompts";
import { resolve } from "node:path";
import { spawn } from "node:child_process";
import type { ProjectConfig, DatabaseORM, DatabaseProvider, PackageManager } from "./types.js";
import { VERSION, BANNER } from "./constants.js";
import { generateProject } from "./generators/index.js";
import { getDependencies } from "./generators/package-json.js";
import { gitInit, getGitUser } from "./utils/git.js";
import { validateProjectName } from "./utils/validation.js";

interface CliArgs {
  yes: boolean;
  name?: string;
  database?: DatabaseORM;
  dbProvider?: DatabaseProvider;
  docker?: boolean;
  packageManager?: PackageManager;
}

export function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = { yes: false };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--yes" || arg === "-y") {
      args.yes = true;
    } else if (arg === "--name" && argv[i + 1]) {
      args.name = argv[++i];
    } else if (arg === "--database" && argv[i + 1]) {
      args.database = argv[++i] as DatabaseORM;
    } else if (arg === "--db-provider" && argv[i + 1]) {
      args.dbProvider = argv[++i] as DatabaseProvider;
    } else if (arg === "--docker") {
      args.docker = true;
    } else if (arg === "--no-docker") {
      args.docker = false;
    } else if (arg === "--package-manager" && argv[i + 1]) {
      args.packageManager = argv[++i] as PackageManager;
    } else if (arg === "--version" || arg === "-v") {
      console.log(`pest-js-app v${VERSION}`);
      process.exit(0);
    } else if (arg === "--help" || arg === "-h") {
      printHelp();
      process.exit(0);
    }
  }

  return args;
}

function printHelp(): void {
  console.log(`
${BANNER}
  pest-js-app v${VERSION} - Progressive Express Starter Template

  Usage:
    npx pest-js-app [options]

  Options:
    --name <name>              Project name (kebab-case)
    --database <orm>           Database ORM: prisma | drizzle | typeorm | none
    --db-provider <db>         Database provider: postgresql | mysql | sqlite
    --docker                   Enable Docker support
    --no-docker                Disable Docker support
    --package-manager <pm>     Package manager: npm | pnpm | yarn
    -y, --yes                  Use defaults for all prompts (non-interactive)
    -v, --version              Show version
    -h, --help                 Show help

  Examples:
    npx pest-js-app
    npx pest-js-app --yes --name my-api
    npx pest-js-app --name my-api --database prisma --db-provider postgresql --docker
    npx pest-js-app --yes --name my-api --package-manager pnpm
`);
}

function getInstallArgs(pm: PackageManager, deps: string[], dev: boolean): { cmd: string; args: string[] } {
  switch (pm) {
    case "pnpm":
      return { cmd: "pnpm", args: ["add", ...(dev ? ["-D"] : []), ...deps] };
    case "yarn":
      return { cmd: "yarn", args: ["add", ...(dev ? ["-D"] : []), ...deps] };
    default:
      return { cmd: "npm", args: ["install", ...(dev ? ["-D"] : []), ...deps] };
  }
}

function runCommand(cmd: string, args: string[], cwd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd, stdio: "ignore" });
    child.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`Exit code ${code}`))));
    child.on("error", reject);
  });
}

export async function runCli(args: CliArgs): Promise<void> {
  p.intro(`${BANNER}\n  v${VERSION} - Progressive Express Starter Template`);

  let config: ProjectConfig;

  if (args.yes) {
    config = {
      name: args.name || "my-app",
      description: "A PEST.js application",
      author: getGitUser() || "developer",
      database: args.database || "none",
      dbProvider: args.dbProvider || "postgresql",
      docker: args.docker ?? (args.database !== undefined && args.database !== "none"),
      git: true,
      install: true,
      packageManager: args.packageManager || "npm",
    };
  } else {
    config = await collectInteractiveConfig(args);
  }

  // Validate name
  const nameError = validateProjectName(config.name);
  if (nameError) {
    p.cancel(nameError);
    process.exit(1);
  }

  const projectDir = resolve(config.name);

  // Generate project
  const s = p.spinner();
  s.start("Creating project structure");

  const ctx = { config, projectDir };
  generateProject(ctx);

  s.stop("Project structure created");

  // Git init
  if (config.git) {
    s.start("Initializing git repository");
    gitInit(projectDir);
    s.stop("Git repository initialized");
  }

  // Install dependencies
  if (config.install) {
    const { deps, devDeps } = getDependencies(config);
    const pm = config.packageManager;
    s.start("Installing dependencies");
    try {
      const prodCmd = getInstallArgs(pm, deps, false);
      await runCommand(prodCmd.cmd, prodCmd.args, projectDir);
      s.message("Installing dev dependencies");
      const devCmd = getInstallArgs(pm, devDeps, true);
      await runCommand(devCmd.cmd, devCmd.args, projectDir);
      s.stop("Dependencies installed");
    } catch {
      s.stop(`Failed to install dependencies - run '${pm} install' manually`);
    }
  }

  // Show next steps
  const pmRun = config.packageManager === "npm" ? "npm run" : config.packageManager;
  const nextSteps = [
    `cd ${config.name}`,
    ...(!config.install ? [`${config.packageManager} install`] : []),
    `${pmRun} dev`,
  ];

  if (config.database === "prisma") {
    nextSteps.push("npx prisma migrate dev --name init");
  } else if (config.database === "drizzle") {
    nextSteps.push(`${pmRun} db:push`);
  }

  p.note(nextSteps.join("\n"), "Next steps");

  p.outro("Happy coding!");
}

async function collectInteractiveConfig(args: CliArgs): Promise<ProjectConfig> {
  const name = await p.text({
    message: "Project name",
    placeholder: "my-app",
    defaultValue: args.name || "my-app",
    validate: (value) => validateProjectName(value),
  });

  if (p.isCancel(name)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  const description = await p.text({
    message: "Project description",
    placeholder: "A PEST.js application",
    defaultValue: "A PEST.js application",
  });

  if (p.isCancel(description)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  const defaultAuthor = getGitUser() || "developer";
  const author = await p.text({
    message: "Author",
    placeholder: defaultAuthor,
    defaultValue: defaultAuthor,
  });

  if (p.isCancel(author)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  const database = await p.select({
    message: "Database ORM",
    options: [
      { value: "none" as const, label: "None", hint: "No database" },
      { value: "prisma" as const, label: "Prisma", hint: "Type-safe ORM with migrations" },
      { value: "drizzle" as const, label: "Drizzle", hint: "Lightweight SQL-first ORM" },
      { value: "typeorm" as const, label: "TypeORM", hint: "Decorator-based ORM" },
    ],
  });

  if (p.isCancel(database)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  let dbProvider: DatabaseProvider = "postgresql";

  if (database !== "none") {
    const provider = await p.select({
      message: "Database provider",
      options: [
        { value: "postgresql" as const, label: "PostgreSQL", hint: "Recommended for production" },
        { value: "mysql" as const, label: "MySQL" },
        { value: "sqlite" as const, label: "SQLite", hint: "File-based, great for development" },
      ],
    });

    if (p.isCancel(provider)) {
      p.cancel("Operation cancelled.");
      process.exit(0);
    }

    dbProvider = provider;
  }

  const defaultDocker = database !== "none";
  const docker = await p.confirm({
    message: "Add Docker support?",
    initialValue: defaultDocker,
  });

  if (p.isCancel(docker)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  const packageManager = await p.select({
    message: "Package manager",
    options: [
      { value: "npm" as const, label: "npm", hint: "Default" },
      { value: "pnpm" as const, label: "pnpm", hint: "Fast, disk efficient" },
      { value: "yarn" as const, label: "yarn", hint: "Reliable, feature rich" },
    ],
  });

  if (p.isCancel(packageManager)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  const git = await p.confirm({
    message: "Initialize git repository?",
    initialValue: true,
  });

  if (p.isCancel(git)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  const install = await p.confirm({
    message: "Install dependencies now?",
    initialValue: true,
  });

  if (p.isCancel(install)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  return {
    name: name as string,
    description: description as string,
    author: author as string,
    database: database as DatabaseORM,
    dbProvider,
    docker: docker as boolean,
    git: git as boolean,
    install: install as boolean,
    packageManager: packageManager as PackageManager,
  };
}
