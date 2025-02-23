"use client";

import { TerminalSquareIcon } from "lucide-react";
import { toast } from "sonner";

export default function CreateAppComponent() {
  return (
    <div className="flex flex-row items-center gap-2 bg-muted p-2 rounded-md mt-8 cursor-copy" onClick={() => {
        navigator.clipboard.writeText("npx create-pestjs-app <project-directory>");
        toast.success("Copied to clipboard");
      }}>
        <TerminalSquareIcon className="w-5 h-5 sm:mr-1 mt-0.5" />
        {"npx create-pestjs-app <project-directory>"}
      </div>
  );
}
