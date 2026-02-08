import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { AuroraBackground } from "@/components/landing/aurora-bg";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type ChangelogEntry = {
  version: string;
  date: string;
  title: string;
  description: string;
  items?: string[];
  image?: string;
  button?: {
    url: string;
    text: string;
  };
};

export interface Changelog1Props {
  className?: string;
  title?: string;
  description?: string;
  entries?: ChangelogEntry[];
}

const Changelog1 = ({
  title = "Changelog",
  description = "Get the latest updates and improvements to our platform.",
  entries = [],
}: Changelog1Props) => {
  return (
    <div className="page-rails">
      {/* Header with aurora */}
      <section className="relative">
        <AuroraBackground />
        <div className="rail-bounded px-6 py-20 sm:py-28">
          <h1 className="relative text-4xl font-bold tracking-tight md:text-5xl">
            {title}
          </h1>
          <p className="relative mt-4 max-w-lg text-lg text-fd-muted-foreground">
            {description}
          </p>
        </div>
      </section>

      {/* Entries */}
      {entries.map((entry) => (
        <div key={entry.version}>
          <div className="section-divider" aria-hidden="true" />
          <div className="rail-bounded grid gap-0 lg:grid-cols-[220px_1fr]">
            {/* Left — sticky version + date */}
            <div className="px-6 pt-12 pb-4 lg:sticky lg:top-24 lg:self-start lg:py-16">
              <Badge variant="outline" className="text-xs">
                {entry.version}
              </Badge>
              <p className="mt-2 text-xs font-medium text-fd-muted-foreground">
                {entry.date}
              </p>
            </div>

            {/* Right — content with dashed divider */}
            <div className="px-6 pb-12 lg:border-l lg:border-dashed lg:py-16 lg:pl-8">
              <h2 className="text-lg font-bold leading-tight md:text-2xl">
                {entry.title}
              </h2>
              <p className="mt-3 text-sm text-fd-muted-foreground md:text-base">
                {entry.description}
              </p>
              {entry.items && entry.items.length > 0 && (
                <ul className="mt-4 ml-4 space-y-1.5 text-sm text-fd-muted-foreground md:text-base">
                  {entry.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="list-disc">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {entry.image ? (
                <>
                  <Image
                    src={`${entry.image}.png`}
                    alt={`${entry.version} visual`}
                    width={800}
                    height={450}
                    className="mt-8 w-full rounded-lg dark:hidden"
                  />
                  <Image
                    src={`${entry.image}-dark.png`}
                    alt={`${entry.version} visual dark`}
                    width={800}
                    height={450}
                    className="mt-8 hidden w-full rounded-lg dark:block"
                  />
                </>
              ) : null}
              {entry.button ? (
                <Button variant="link" asChild>
                  <a
                    href={entry.button.url}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {entry.button.text}{" "}
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export { Changelog1 };
