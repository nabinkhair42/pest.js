"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, XIcon } from "lucide-react";
import type { Node } from "fumadocs-core/page-tree";
import { SidebarTree } from "./sidebar-tree";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";

interface MobileNavProps {
  nodes: Node[];
}

export function MobileNavTrigger({ nodes }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Close on navigation
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  return (
    <Drawer direction="bottom" open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          type="button"
          variant={"ghost"}
          size={"icon-sm"}
          className="mr-1 inline-flex sm:mr-2 sm:size-9 lg:hidden"
          aria-label="Toggle sidebar"
        >
          {open ? <XIcon /> : <Menu />}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="top-50 rounded-none bg-background/20 backdrop-blur-xl">
        <DrawerTitle className="sr-only">Open Navigation</DrawerTitle>
        <nav className="overflow-y-auto px-3 py-4">
          <SidebarTree nodes={nodes} />
        </nav>
      </DrawerContent>
    </Drawer>
  );
}
