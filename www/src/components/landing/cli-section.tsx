import { AuroraBackground } from "@/components/landing/aurora-bg";
import { TerminalDemo } from "@/components/landing/terminal-demo";

export function CliSection() {
  return (
    <section className="relative">
      <div className="absolute inset-0" aria-hidden="true" />

      <div className="rail-bounded relative grid gap-0 lg:grid-cols-[1fr_1.6fr]">
        {/* Left — text (sticky while terminal scrolls) */}
        <div className="px-6 py-16 lg:sticky lg:top-24 lg:self-start lg:py-24">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            CLI
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
            One command.
            <br />
            Full project.
          </h2>
          <p className="mt-4 max-w-sm text-muted-foreground">
            Interactive prompts guide you through every choice &mdash;
            database, Docker, package manager, and more. Or pass flags for CI.
          </p>
        </div>

        {/* Right — terminal with full-height dashed divider */}
        <div className="relative lg:border-l lg:border-dashed py-12 lg:py-24">
          <AuroraBackground fill />
          <div className="relative px-6 lg:pl-6">
            <TerminalDemo />
          </div>
        </div>
      </div>
    </section>
  );
}
