import { GitHub } from "@/components/icons/github";
import { NPM } from "@/components/icons/npm";
import { Pest } from "@/components/icons/pest";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="rail-bounded">
      {/* Top row — brand + link columns with dashed internal borders */}
      <div className="grid grid-cols-2 sm:grid-cols-3">
        {/* Brand */}
        <div className="col-span-2 px-6 py-10 sm:col-span-1">
          <div className="flex items-center gap-2">
            <Pest className="size-5" />
            <span className="font-semibold">PEST.js</span>
          </div>
          <p className="mt-2 text-sm text-fd-muted-foreground">
            Generate Express APIs
            <br />
            in seconds, not hours.
          </p>
        </div>

        {/* Product links */}
        <div className="border-t border-dashed px-6 py-10 sm:border-l sm:border-t-0">
          <p className="text-xs font-medium uppercase tracking-widest text-fd-muted-foreground">
            Product
          </p>
          <nav className="mt-4 flex flex-col gap-3">
            <Link
              href="/docs"
              className="text-sm text-fd-muted-foreground transition-colors hover:text-fd-foreground"
            >
              Documentation
            </Link>
            <Link
              href="/changelog"
              className="text-sm text-fd-muted-foreground transition-colors hover:text-fd-foreground"
            >
              Changelog
            </Link>
          </nav>
        </div>

        {/* Community links */}
        <div className="border-t border-dashed px-6 py-10 sm:border-l sm:border-t-0">
          <p className="text-xs font-medium uppercase tracking-widest text-fd-muted-foreground">
            Community
          </p>
          <nav className="mt-4 flex flex-col gap-3">
            <a
              href="https://github.com/nabinkhair42/pest.js"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-fd-muted-foreground transition-colors hover:text-fd-foreground"
            >
              <GitHub className="size-3.5" />
              GitHub
            </a>
            <a
              href="https://www.npmjs.com/package/pest-js-app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-fd-muted-foreground transition-colors hover:text-fd-foreground"
            >
              <NPM className="size-3.5" />
              npm
            </a>
          </nav>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between border-t border-dashed px-6 py-6">
        <p className="text-xs text-fd-muted-foreground">
          Built by{" "}
          <a
            href="https://nabinkhair.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-yellow-400"
          >
            Nabin Khair
          </a>
        </p>
        <p className="text-xs text-fd-muted-foreground">
          Built at{" "}
          <a
            href="https://github.com/codixra"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-fd-muted-foreground transition-colors hover:text-yellow-400"
          >
            Codixra Lab
          </a>
        </p>
      </div>
    </footer>
  );
}
