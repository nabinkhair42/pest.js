"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useSearchContext } from "fumadocs-ui/contexts/search";
import { Moon, Sun, Search } from "lucide-react";
import { Pest } from "@/components/icons/pest";
import { GitHub } from "@/components/icons/github";

const navLinks = [
  { href: "/docs", label: "Docs" },
  { href: "/changelog", label: "Changelog" },
];

interface NavbarProps {
  sidebarTrigger?: React.ReactNode;
}

export function Navbar({ sidebarTrigger }: NavbarProps) {
  const pathname = usePathname();
  const { setOpenSearch } = useSearchContext();
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 h-14 border-b bg-fd-background/80 backdrop-blur">
      <div className="mx-auto flex h-full max-w-6xl items-center px-6">
        {sidebarTrigger}
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Pest className="size-5" />
          PEST.js
        </Link>

        <nav className="ml-6 hidden items-center gap-4 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors ${
                pathname.startsWith(link.href)
                  ? "text-fd-foreground"
                  : "text-fd-muted-foreground hover:text-fd-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => setOpenSearch(true)}
            className="inline-flex size-9 items-center justify-center rounded-md text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-foreground"
            aria-label="Search"
          >
            <Search className="size-4" />
          </button>
          <button
            type="button"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
            className="inline-flex size-9 items-center justify-center rounded-md text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-foreground"
            aria-label="Toggle theme"
          >
            <Sun className="size-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute size-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
          </button>
          <a
            href="https://github.com/nabinkhair42/pest.js"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex size-9 items-center justify-center rounded-md text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-foreground"
            aria-label="GitHub"
          >
            <GitHub className="size-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
