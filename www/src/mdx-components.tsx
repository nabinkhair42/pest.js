import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import {
  Tab,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "fumadocs-ui/components/tabs";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { File, Folder, Files } from "fumadocs-ui/components/files";
import {
  Anthropic,
  Docker,
  DrizzleORM,
  Expressjs,
  GitHub,
  MySQL,
  NPM,
  Pest,
  Pnpm,
  PostgreSQL,
  Prisma,
  SQLite,
  Scira,
  T3Stack,
  TypeScript,
  TypeORM,
  Yarn,
} from "@/components/icons";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Tab,
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
    Step,
    Steps,
    File,
    Folder,
    Files,
    Anthropic,
    Docker,
    DrizzleORM,
    Expressjs,
    GitHub,
    MySQL,
    NPM,
    Pest,
    Pnpm,
    PostgreSQL,
    Prisma,
    SQLite,
    Scira,
    T3Stack,
    TypeScript,
    TypeORM,
    Yarn,
    ...components,
  };
}
