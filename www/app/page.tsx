import CreateAppComponent from "@/components/create-app";
import { buttonVariants } from "@/components/ui/button";
import { page_routes } from "@/lib/routes-config";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PEST.js - Progressive Express Starter Template",
  description: "Unopinionated Express.js template engine that enables seamless scalability, enterprise security, and modern development practices."
};

export default function Home() {
  const title = "PEST.js";
  const subtitle = "Progressive Express Starter Template";
  const description = "Unopinionated Express.js template engine that enables seamless scalability, enterprise security, and modern development practices.";

  return (
    <div className="flex sm:min-h-[85.5vh] min-h-[85vh] flex-col items-center justify-center text-center px-2 sm:py-8 py-12">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold mb-2 sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-orange-500">
          {title}
        </h1>
        <p className="text-xl text-muted-foreground font-medium">{subtitle}</p>
        <p className="mb-8 sm:text-lg max-w-[800px] text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-5 mb-12">
        <Link
          href={`/docs${page_routes[0]?.href || ""}`}
          className={buttonVariants({ 
            className: "px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all",
            size: "lg"
          })}
        >
          Get Started
        </Link>
        <Link
          href="/blog"
          className={buttonVariants({ 
            variant: "secondary", 
            className: "px-8 py-6 text-lg shadow hover:shadow-md transition-all",
            size: "lg"
          })}
        >
          Read Blog
        </Link>
      </div>

      <CreateAppComponent />
    </div>
  );
}