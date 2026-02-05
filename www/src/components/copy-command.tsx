"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex h-10 items-center gap-2 rounded-md border bg-fd-secondary px-4 font-mono text-sm text-fd-secondary-foreground transition-colors hover:bg-fd-secondary/80"
    >
      <span>$ {command}</span>
      {copied ? (
        <Check className="size-3.5 text-green-500" />
      ) : (
        <Copy className="size-3.5 text-fd-muted-foreground" />
      )}
    </button>
  );
}
