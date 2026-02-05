import { Changelog1 } from "@/components/changelog1";
import type { ChangelogEntry } from "@/components/changelog1";

const entries: ChangelogEntry[] = [
  {
    version: "v3.1.2",
    date: "5 February 2026",
    title: "Async install with animated spinner",
    description:
      "Fixed the dependency installation step that was freezing the CLI. Now uses async spawn so the spinner animates while npm installs packages.",
    items: [
      "Replaced execSync with async spawn for non-blocking installs",
      "Spinner now shows progress during dependency installation",
      "Separate status messages for dependencies and dev dependencies",
    ],
  },
  {
    version: "v3.1.1",
    date: "5 February 2026",
    title: "npm package README",
    description:
      "Added a README to the CLI package so it displays correctly on the npm registry page.",
  },
  {
    version: "v3.1.0",
    date: "5 February 2026",
    title: "Latest dependencies & simplified CI",
    description:
      "Dependencies are now resolved to their latest versions at project creation time instead of using hardcoded versions. CI workflows were simplified.",
    items: [
      "npm resolves latest dependency versions during project generation",
      "Replaced ts-node + nodemon with tsx for dev server",
      "Simplified GitHub Actions from 7 checks to 2",
      "Streamlined release workflow with automated npm publish via git tags",
      "Updated community files (SECURITY, CONTRIBUTING, CODE_OF_CONDUCT)",
      "Added star history chart to README",
    ],
  },
  {
    version: "v3.0.0",
    date: "4 February 2026",
    title: "Complete rewrite in TypeScript",
    description:
      "PEST.js has been completely rewritten from a Bash script to a TypeScript CLI published as an npm package. Generated projects now use Express 5 with full TypeScript support.",
    items: [
      "Interactive CLI powered by @clack/prompts",
      "Express 5 with native async error handling",
      "Database ORM selection — Prisma, Drizzle, or TypeORM",
      "PostgreSQL, MySQL, and SQLite provider support",
      "Docker support with multi-stage builds and compose",
      "Jest + Supertest testing setup",
      "ESLint flat config + Prettier + Husky pre-commit hooks",
      "Vercel deployment config included",
      "Non-interactive mode with --yes flag for CI usage",
      "Published to npm as pest-js-app",
    ],
    button: {
      url: "https://github.com/nabinkhair42/pest.js/releases/tag/v3.0.0",
      text: "View release",
    },
  },
  {
    version: "v2.0.0",
    date: "6 August 2025",
    title: "Modular Bash CLI with CI/CD",
    description:
      "Major refactor of the CLI into a modular Bash architecture with separate generator scripts. Added comprehensive CI/CD workflows and code quality tooling.",
    items: [
      "Modular CLI architecture with separate generator scripts",
      "GitHub Actions CI/CD workflows for testing and releases",
      "Husky git hooks with commitlint for conventional commits",
      "Prettier code formatting with sensible defaults",
      "Jest testing setup with TypeScript support",
      "Vercel deployment configuration",
      "Documentation website introduced",
    ],
    button: {
      url: "https://github.com/nabinkhair42/pest.js/releases/tag/v2.0.0",
      text: "View release",
    },
  },
  {
    version: "v1.0.0",
    date: "18 February 2025",
    title: "Initial release",
    description:
      "First version of PEST.js — a Bash setup script that scaffolds Express + TypeScript projects with database support, linting, formatting, and testing.",
    items: [
      "Bash-based project scaffolding script",
      "Express + TypeScript project generation",
      "Database connection handling for test environments",
      "ESLint and Prettier configuration",
      "Jest test setup",
      "Multi-OS setup instructions",
      "CI workflow for project validation",
    ],
  },
];

export const metadata = {
  title: "Changelog",
  description: "Latest updates and improvements to PEST.js.",
};

export default function ChangelogPage() {
  return (
    <Changelog1
      title="Changelog"
      description="Latest updates and improvements to PEST.js."
      entries={entries}
    />
  );
}
