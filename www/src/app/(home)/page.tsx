import { CliSection } from "@/components/landing/cli-section";
import { Cta } from "@/components/landing/cta";
import { Features } from "@/components/landing/features";
import { Hero } from "@/components/landing/hero";
import { TechStack } from "@/components/landing/tech-stack";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PEST.js — Production Express Starter with TypeScript",
  description:
    "Generate production-ready Express 5 + TypeScript projects with Prisma, Drizzle, or TypeORM. Docker, testing, and deployment included.",
  openGraph: {
    title: "PEST.js — Production Express Starter with TypeScript",
    description:
      "Generate production-ready Express 5 + TypeScript projects with Prisma, Drizzle, or TypeORM. Docker, testing, and deployment included.",
  },
};

export default function HomePage() {
  return (
    <div className="page-rails flex flex-col">
      <Hero />
      <div className="section-divider" aria-hidden="true" />
      <TechStack />
      <div className="section-divider" aria-hidden="true" />
      <CliSection />
      <div className="section-divider" aria-hidden="true" />
      <Features />
      <div className="section-divider" aria-hidden="true" />
      <Cta />
    </div>
  );
}
