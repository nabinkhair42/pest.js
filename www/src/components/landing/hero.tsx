import { AuroraBackground } from "@/components/landing/aurora-bg";
import { CopyCommand } from "@/components/landing/copy-command";
import { Expressjs } from "@/components/icons/express";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative flex flex-col items-center px-4 pb-24 pt-24 text-center sm:pb-32 sm:pt-36">
      <AuroraBackground />

      <Link href="/changelog">
        <Badge
          variant="outline"
          className="relative mb-6 cursor-pointer transition-colors hover:bg-fd-accent"
        >
          v3.3.2 &mdash; 80 tests passing
        </Badge>
      </Link>

      <h1 className="relative max-w-3xl text-5xl font-bold tracking-tighter sm:text-6xl lg:text-7xl">
        Build <Expressjs className="inline-block size-[0.65em] align-[-0.05em]" /> Express APIs
        <br />
        <span className="text-fd-muted-foreground">
          in seconds, not hours
        </span>
      </h1>

      <p className="relative mx-auto mt-6 max-w-xl text-lg text-fd-muted-foreground">
        Generate production-ready Express 5 + TypeScript projects with your
        choice of database, Docker, and testing. All wired up and ready to go.
      </p>

      <div className="relative mt-10 flex flex-col items-center gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/docs">Get Started</Link>
        </Button>
        <CopyCommand command="npx pest-js-app" />
      </div>
    </section>
  );
}
