"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import type { Node, Item, Folder, Separator } from "fumadocs-core/page-tree";

export function SidebarTree({
  nodes,
  level = 0,
}: {
  nodes: Node[];
  level?: number;
}) {
  return (
    <ul className="flex flex-col gap-0.5">
      {nodes.map((node, i) => (
        <SidebarNode key={node.$id ?? i} node={node} level={level} />
      ))}
    </ul>
  );
}

function SidebarNode({ node, level }: { node: Node; level: number }) {
  if (node.type === "separator") return <SidebarSeparator node={node} />;
  if (node.type === "folder")
    return <SidebarFolder node={node} level={level} />;
  return <SidebarItem node={node} />;
}

function SidebarItem({ node }: { node: Item }) {
  const pathname = usePathname();
  const active = pathname === node.url;

  return (
    <li>
      <Link
        href={node.url}
        className={`flex items-center gap-2 rounded-md px-3 py-1.5 ml-2 text-sm transition-colors ${
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

function SidebarFolder({ node, level }: { node: Folder; level: number }) {
  const pathname = usePathname();
  const isActive =
    node.index?.url === pathname || hasActiveChild(node.children, pathname);
  const [open, setOpen] = useState(node.defaultOpen ?? isActive);

  // Top-level folders render as section headers (always open, not collapsible)
  if (level === 0) {
    return (
      <li className="mt-6 first:mt-0">
        <p className="inline-flex items-center gap-2 px-3 mb-1.5 text-sm font-medium">
          {node.icon}
          {node.name}
        </p>
        <ul className="flex flex-col gap-0.5">
          {node.index && (
            <SidebarItem node={{ ...node.index, name: "Overview" }} />
          )}
          {node.children.map((child, i) => (
            <SidebarNode key={child.$id ?? i} node={child} level={level + 1} />
          ))}
        </ul>
      </li>
    );
  }

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
            <SidebarItem node={{ ...node.index, name: "Overview" }} />
          )}
          {node.children.map((child, i) => (
            <SidebarNode key={child.$id ?? i} node={child} level={level + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

function SidebarSeparator({ node }: { node: Separator }) {
  if (!node.name) return null;

  return (
    <li className="mt-6 first:mt-0">
      <p className="inline-flex items-center gap-2 px-3 mb-1.5 text-sm font-medium">
        {node.icon}
        {node.name}
      </p>
    </li>
  );
}

function hasActiveChild(nodes: Node[], pathname: string): boolean {
  return nodes.some(node => {
    if (node.type === "page") return node.url === pathname;
    if (node.type === "folder") {
      if (node.index?.url === pathname) return true;
      return hasActiveChild(node.children, pathname);
    }
    return false;
  });
}
