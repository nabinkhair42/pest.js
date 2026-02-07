"use client";

import { useActiveAnchor } from "fumadocs-core/toc";
import type { TOCItemType } from "fumadocs-core/server";

interface TOCProps {
  items: TOCItemType[];
}

export function TOC({ items }: TOCProps) {
  const activeId = useActiveAnchor();

  if (items.length === 0) return null;

  return (
    <aside className="sticky top-24 hidden w-56 shrink-0 xl:block">
      <p className="mb-3 text-xs font-medium uppercase tracking-widest text-fd-muted-foreground">
        On this page
      </p>
      <ul className="flex flex-col text-sm">
        {items.map((item) => {
          const id = item.url.slice(1); // remove leading #
          const active = activeId === id;

          return (
            <li key={item.url}>
              <a
                href={item.url}
                className={`block border-l-2 py-1.5 transition-colors ${
                  item.depth > 2 ? "pl-6" : "pl-3"
                } ${
                  active
                    ? "border-fd-foreground font-medium text-fd-foreground"
                    : "border-fd-border text-fd-muted-foreground hover:text-fd-foreground"
                }`}
              >
                {item.title}
              </a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
