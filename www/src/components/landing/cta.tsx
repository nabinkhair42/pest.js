import { AuroraBackground } from "@/components/landing/aurora-bg";
import { CopyCommand } from "@/components/landing/copy-command";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Cta() {
  return (
    <section className="relative">
      <AuroraBackground />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-6 py-20 text-center sm:py-28">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Your next API is one command away.
        </h2>
        <p className="mt-3 text-lg text-muted-foreground">
          Configured. Tested. Dockerized.
        </p>

        <div className="mt-10 flex gap-4">
          <CopyCommand command="npx pest-js-app" />
        <Button variant="link" asChild>
          <Link href="/docs">Read the Docs</Link>
        </Button>
        </div>

      </div>
    </section>
  );
}
