"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSearchContext } from "fumadocs-ui/contexts/search";
import { Search, Star } from "lucide-react";
import { Pest } from "@/components/icons/pest";
import { GitHub } from "@/components/icons/github";
import { Button } from "../ui/button";

const navLinks = [
  { href: "/docs", label: "Docs" },
  { href: "/changelog", label: "Changelog" },
];

interface NavbarProps {
  sidebarTrigger?: React.ReactNode;
  stars?: number | null;
}

export function Navbar({ sidebarTrigger, stars }: NavbarProps) {
  const pathname = usePathname();
  const { setOpenSearch } = useSearchContext();

  return (
    <header className="sticky top-0 z-40 h-14 border-b bg-background">
      <div className="mx-auto flex h-full max-w-6xl items-center px-4 lg:px-0">
        {sidebarTrigger}
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Pest className="size-5" />
          <span className="font-semibold">PEST.js</span>
        </Link>

        {/* Nav links: always visible on non-docs, hidden on mobile for docs (sidebar handles it) */}
        <nav
          className={`ml-4 items-center gap-3 sm:ml-6 sm:gap-4 ${
            sidebarTrigger ? "hidden md:flex" : "flex"
          }`}
        >
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors ${
                pathname.startsWith(link.href)
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
          <Button
            type="button"
            variant={"ghost"}
            onClick={() => setOpenSearch(true)}
            className="inline-flex size-8 items-center justify-center rounded-md sm:size-9"
            aria-label="Search"
          >
            <Search className="size-4" />
          </Button>
          <Link
            href="https://github.com/nabinkhair42/pest.js"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 items-center gap-2 rounded-lg border bg-card px-3 text-sm transition-colors hover:bg-accent"
          >
            <GitHub className="size-3.5" />
            {stars != null && (
              <>
                <span className="h-3.5 w-px bg-border" aria-hidden="true" />
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground tabular-nums">
                  <Star className="size-3 fill-yellow-500 text-yellow-500" />
                  {stars >= 1000
                    ? `${(stars / 1000).toFixed(1)}k`
                    : stars}
                </span>
              </>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
