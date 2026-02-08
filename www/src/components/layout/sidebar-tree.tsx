"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import type {
  Node,
  Item,
  Folder,
  Separator,
} from "fumadocs-core/page-tree";

export function SidebarTree({ nodes }: { nodes: Node[] }) {
  return (
    <ul className="flex flex-col gap-0.5">
      {nodes.map((node, i) => (
        <SidebarNode key={node.$id ?? i} node={node} />
      ))}
    </ul>
  );
}

function SidebarNode({ node }: { node: Node }) {
  if (node.type === "separator") return <SidebarSeparator node={node} />;
  if (node.type === "folder") return <SidebarFolder node={node} />;
  return <SidebarItem node={node} />;
}

function SidebarItem({ node }: { node: Item }) {
  const pathname = usePathname();
  const active = pathname === node.url;

  return (
    <li>
      <Link
        href={node.url}
        className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors ${
          active
            ? "bg-accent font-medium text-foreground"
            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
        }`}
      >
        {node.icon}
        {node.name}
      </Link>
    </li>
  );
}

function SidebarFolder({ node }: { node: Folder }) {
  const pathname = usePathname();
  const isActive =
    node.index?.url === pathname ||
    hasActiveChild(node.children, pathname);
  const [open, setOpen] = useState(node.defaultOpen ?? isActive);

  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors ${
          node.index?.url === pathname
            ? "bg-accent font-medium text-foreground"
            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
        }`}
      >
        {node.icon}
        <span className="flex-1 text-left">{node.name}</span>
        <ChevronRight
          className={`size-3.5 shrink-0 transition-transform ${open ? "rotate-90" : ""}`}
        />
      </button>
      {open && (
        <ul className="ml-3 flex flex-col gap-0.5 border-l border-border pl-2 pt-0.5">
          {node.index && (
            <SidebarItem
              node={{ ...node.index, name: "Overview" }}
            />
          )}
          {node.children.map((child, i) => (
            <SidebarNode key={child.$id ?? i} node={child} />
          ))}
        </ul>
      )}
    </li>
  );
}

function SidebarSeparator({ node }: { node: Separator }) {
  return (
    <li className="mt-4 first:mt-0">
      {node.name && (
        <p className="px-3 py-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {node.name}
        </p>
      )}
    </li>
  );
}

function hasActiveChild(nodes: Node[], pathname: string): boolean {
  return nodes.some((node) => {
    if (node.type === "page") return node.url === pathname;
    if (node.type === "folder") {
      if (node.index?.url === pathname) return true;
      return hasActiveChild(node.children, pathname);
    }
    return false;
  });
}
