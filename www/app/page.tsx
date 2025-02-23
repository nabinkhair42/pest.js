import CreateAppComponent from "@/components/create-app";
import { buttonVariants } from "@/components/ui/button";
import { page_routes } from "@/lib/routes-config";
import Link from "next/link";

export default function Home() {
  const title = "PEST.js";
  const description = "Unopinionated Express.js template engine that enables seamless scalability, enterprise security, and modern development practices.";

  return (
    <div className="flex sm:min-h-[85.5vh] min-h-[85vh] flex-col items-center justify-center text-center px-2 sm:py-8 py-12">
      <h1 className="text-3xl font-bold mb-4 sm:text-6xl">{title}</h1>
      <p className="mb-8 sm:text-lg max-w-[800px] text-muted-foreground">{description}</p>
      <div className="flex flex-row items-center gap-5">
        <Link
          href={`/docs${page_routes[0]?.href || ""}`}
          className={buttonVariants({ className: "px-6", size: "lg" })}
        >
          Get Started
        </Link>
        <Link
          href="/blog"
          className={buttonVariants({ variant: "secondary", className: "px-6", size: "lg" })}
        >
          Read Blog
        </Link>
      </div>
      <CreateAppComponent />
    </div>
  );
}