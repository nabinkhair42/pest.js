"use client";

import type { ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StackItem {
  icon: ReactNode;
  label: string;
  bgColor: string;
}

interface StackAvatarsProps {
  items: StackItem[];
}

export function StackAvatars({ items }: StackAvatarsProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <span className="inline-flex align-[-0.15em]">
        {items.map((item, i) => (
          <Tooltip key={item.label}>
            <TooltipTrigger asChild>
              <span
                className={`inline-flex size-[0.75em] cursor-default items-center justify-center rounded-full border lg:border-2 border-foreground transition-transform hover:scale-110 ${item.bgColor}`}
                style={{
                  marginLeft: i > 0 ? "-0.15em" : 0,
                  zIndex: items.length - i,
                }}
              >
                {item.icon}
              </span>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs font-medium">
              {item.label}
            </TooltipContent>
          </Tooltip>
        ))}
      </span>
    </TooltipProvider>
  );
}
