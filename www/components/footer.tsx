import Link from "next/link";
import { MainLogo } from "./logo";

export function Footer() {
  return (
    <footer className="border-t w-full h-16">
      <div className="container flex items-center sm:justify-between justify-center sm:gap-0 gap-4 h-full text-muted-foreground text-sm flex-wrap sm:py-0 py-3 max-sm:px-4">
        <div className="flex items-center gap-3">
          <MainLogo />
          <p className="text-center">
            Under Development by <Link href="https://github.com/nabinkhair42" className="underline underline-offset-2">nabinkhair</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}


