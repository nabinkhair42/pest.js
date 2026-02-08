import { Docker } from "@/components/icons/docker";
import { DrizzleORM } from "@/components/icons/drizzle";
import { Expressjs } from "@/components/icons/express";
import { Prisma } from "@/components/icons/prisma";
import { TypeORM } from "@/components/icons/typeorm";
import { TypeScript } from "@/components/icons/typescript";
import { AuroraBackground } from "@/components/landing/aurora-bg";
import { CopyCommand } from "@/components/landing/copy-command";
import { StackAvatars } from "@/components/landing/stack-avatars";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const stackIcons = [
  {
    icon: <Expressjs className="size-[60%]" />,
    label: "Express",
    bgColor: "bg-zinc-900",
  },
  {
    icon: <Prisma className="size-[60%]" />,
    label: "Prisma",
    bgColor: "bg-zinc-800",
  },
  {
    icon: <DrizzleORM className="size-[60%]" />,
    label: "Drizzle",
    bgColor: "bg-zinc-800",
  },
  {
    icon: <TypeORM className="size-[60%]" />,
    label: "TypeORM",
    bgColor: "bg-zinc-800",
  },
  {
    icon: <Docker className="size-[60%]" />,
    label: "Docker",
    bgColor: "bg-zinc-800",
  },
  {
    icon: <TypeScript className="size-[60%]" />,
    label: "TypeScript",
    bgColor: "bg-zinc-900",
  },
];

export function Hero() {
  return (
    <section className="relative pb-24 pt-24 sm:pb-32 sm:pt-36">
      <AuroraBackground />
      <div className="relative mx-auto w-full max-w-6xl px-6 flex flex-col gap-5">
        <h1 className="relative text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          Production-grade,
          <br />
          <span className="flex flex-wrap gap-2 items-center">
            Backend with <StackAvatars items={stackIcons} />
          </span>
        </h1>

        <p className="relative text-lg text-muted-foreground max-w-2xl">
          Skip the boilerplate. Generate a production-ready Express 5 +
          TypeScript API with Prisma, Drizzle, or TypeORM, Docker, testing, and
          deployment config included.
        </p>

        <div className="relative flex items-center gap-3 mt-6">
          <Button asChild>
            <Link href="/docs">Get Started</Link>
          </Button>
          <CopyCommand command="npx pest-js-app" />
        </div>
      </div>
    </section>
  );
}
