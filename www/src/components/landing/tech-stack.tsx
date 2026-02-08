import { Docker } from "@/components/icons/docker";
import { DrizzleORM } from "@/components/icons/drizzle";
import { Eslint } from "@/components/icons/eslint";
import { Expressjs } from "@/components/icons/express";
import { Jest } from "@/components/icons/jest";
import { Pino } from "@/components/icons/pino";
import { Prisma } from "@/components/icons/prisma";
import { TypeORM } from "@/components/icons/typeorm";
import { TypeScript } from "@/components/icons/typescript";
import { Zod } from "@/components/icons/zod";

const techStack = [
  { name: "Express", icon: <Expressjs className="size-8" /> },
  { name: "TypeScript", icon: <TypeScript className="size-8" /> },
  { name: "Prisma", icon: <Prisma className="size-8" /> },
  { name: "Drizzle", icon: <DrizzleORM className="size-8" /> },
  { name: "TypeORM", icon: <TypeORM className="size-8" /> },
  { name: "Docker", icon: <Docker className="size-8" /> },
  { name: "Jest", icon: <Jest className="size-8" /> },
  { name: "ESLint", icon: <Eslint className="size-8" /> },
  { name: "Pino", icon: <Pino className="size-8" /> },
  { name: "Zod", icon: <Zod className="size-8" /> },
];

export function TechStack() {
  return (
    <section>
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="pb-6 pt-16">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Tech Stack
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
            Built with the best tools
          </h2>
          <p className="mt-2 max-w-lg text-muted-foreground">
            Every project comes preconfigured with industry-standard tooling.
          </p>
        </div>
      </div>

      {/* Single flat grid: 2 cols mobile, 5 cols desktop — all rows fill evenly */}
      <div className="rail-bounded border-t">
        <div className="grid grid-cols-2 sm:grid-cols-5">
          {techStack.map((tech, i) => (
            <div
              key={tech.name}
              className={`flex flex-col items-center justify-center gap-3 py-10
                ${i % 5 !== 0 ? "sm:border-l sm:border-dashed" : ""}
                ${i % 2 !== 0 ? "max-sm:border-l max-sm:border-dashed" : ""}
                ${i >= 5 ? "sm:border-t sm:border-dashed" : ""}
                ${i >= 2 ? "max-sm:border-t max-sm:border-dashed" : ""}
              `}
            >
              <div className="inline-flex size-12 items-center justify-center rounded-xl border bg-card [&>svg]:size-6 [&>img]:size-6">
                {tech.icon}
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
