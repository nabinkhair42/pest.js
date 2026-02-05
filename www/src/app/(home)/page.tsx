import Link from "next/link";
import { Expressjs } from "@/components/icons/express";
import { DrizzleORM } from "@/components/icons/drizzle";
import { Docker } from "@/components/icons/docker";
import { TypeScript } from "@/components/icons/typescript";
import { FeatureCard } from "@/components/feature-card";

const features = [
  {
    icon: <Expressjs />,
    title: "Express 5",
    description: "Native async errors, latest middleware APIs.",
  },
  {
    icon: <DrizzleORM />,
    title: "Database ORMs",
    description: "Prisma, Drizzle, or TypeORM. Your choice.",
  },
  {
    icon: <Docker />,
    title: "Docker Ready",
    description: "Multi-stage Dockerfile and compose with DB services.",
  },
  {
    icon: <TypeScript />,
    title: "TypeScript",
    description: "Strict config, ESLint flat config, Prettier, Jest.",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
      <div className="max-w-2xl">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          PEST.js
        </h1>
        <p className="mb-2 text-lg text-fd-muted-foreground">
          Progressive Express Starter Template
        </p>
        <p className="mx-auto mb-8 max-w-lg text-fd-muted-foreground">
          Generate production-ready Express 5 + TypeScript projects. Choose your
          database, add Docker, and start coding in seconds.
        </p>

        <div className="mb-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/docs"
            className="inline-flex h-10 items-center rounded-md bg-fd-primary px-6 text-sm font-medium text-fd-primary-foreground transition-colors hover:bg-fd-primary/90"
          >
            Get Started
          </Link>
          <div className="inline-flex h-10 items-center gap-2 rounded-md border bg-fd-secondary px-4 font-mono text-sm text-fd-secondary-foreground">
            npx pest-js
          </div>
        </div>

        <div className="mx-auto grid max-w-xl gap-4 text-left sm:grid-cols-2">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </div>
  );
}
