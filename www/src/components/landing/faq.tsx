"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "Is PEST.js a framework?",
    answer:
      "No. PEST.js is a project generator. It scaffolds a standard Express 5 + TypeScript project and gets out of the way. The generated code is yours to modify however you want with no runtime dependency on PEST.js.",
  },
  {
    question: "Can I customize the generated code?",
    answer:
      "Everything. The output is plain TypeScript files, not a locked-down template. Change the folder structure, swap middleware, add routes, remove what you don't need. There is no abstraction layer between you and Express.",
  },
  {
    question: "Which databases are supported?",
    answer:
      "PostgreSQL, MySQL, and SQLite through your choice of ORM: Prisma, Drizzle, or TypeORM. You can also skip the database entirely and add one later.",
  },
  {
    question: "Does it work on Windows?",
    answer:
      "Yes. The CLI runs on Windows, macOS, and Linux. Dockerfile and Docker Compose configs are generated cross-platform. Git hooks use LF line endings and skip chmod on Windows.",
  },
  {
    question: "What Node.js versions are supported?",
    answer:
      "Node.js 18 and above. The generated Dockerfile uses node:20-slim by default, but you can change it to any version you prefer.",
  },
  {
    question: "Can I use it in CI or automation?",
    answer:
      "Yes. Pass the --yes flag to skip all prompts and use defaults, or combine it with --name, --database, --dialect, and --docker flags to configure everything non-interactively.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section>
      <div className="rail-bounded grid gap-0 lg:grid-cols-[1fr_1.6fr]">
        {/* Left — sticky label */}
        <div className="px-6 py-16 lg:sticky lg:top-24 lg:self-start lg:py-24">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            FAQ
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
            Common questions
          </h2>
          <p className="mt-4 max-w-sm text-muted-foreground">
            Everything you need to know before getting started.
          </p>
        </div>

        {/* Right — accordion list */}
        <div className="lg:border-l lg:border-dashed py-12 lg:py-24">
          {faqs.map((faq, i) => (
            <div
              key={faq.question}
              className={i > 0 ? "border-t border-dashed" : ""}
            >
              <button
                type="button"
                onClick={() =>
                  setOpenIndex(openIndex === i ? null : i)
                }
                className="flex w-full items-center justify-between px-6 py-5 text-left"
              >
                <span className="font-medium">{faq.question}</span>
                <ChevronDown
                  className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`grid transition-all duration-200 ease-out ${
                  openIndex === i
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
