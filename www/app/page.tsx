import { buttonVariants } from "@/components/ui/button";
import { page_routes } from "@/lib/routes-config";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PEST.js - CLI Framework",
  description:
    "Generate Node.js applications with Express.js, TypeScript, and essential configurations using our CLI tool.",
};

export default function Home() {
  const title = "PEST.js";
  const subtitle = "CLI Framework";
  const description =
    "Generate production-ready Node.js applications with Express.js, TypeScript, ESLint, Jest, and essential configurations. Run our CLI tool to create projects instantly.";

  return (
    <div className="flex min-h-[100svh] flex-col items-center justify-center text-center px-4 py-16">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-6">
          <h1 className="text-4xl font-bold sm:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-orange-500">
            {title}
          </h1>
          <p className="text-2xl text-muted-foreground font-medium">
            {subtitle}
          </p>
          <p className="text-lg max-w-3xl mx-auto text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
          <Link
            href={`/docs${page_routes[0]?.href || ""}`}
            className={buttonVariants({
              className:
                "px-10 py-4 text-lg shadow-lg hover:shadow-xl transition-all",
              size: "lg",
            })}
          >
            Get Started
          </Link>
          <Link
            href="/blog"
            className={buttonVariants({
              variant: "secondary",
              className:
                "px-10 py-4 text-lg shadow hover:shadow-md transition-all",
              size: "lg",
            })}
          >
            Read Blog
          </Link>
        </div>
      </div>
    </div>
  );
}
