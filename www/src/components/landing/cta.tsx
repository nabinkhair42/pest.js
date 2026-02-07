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
          Ready to start?
        </h2>
        <p className="mt-4 max-w-md text-fd-muted-foreground">
          Stop writing boilerplate. Generate it.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/docs">Get Started</Link>
          </Button>
          <CopyCommand command="npx pest-js-app" />
        </div>
      </div>
    </section>
  );
}
