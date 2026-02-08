import type { Root } from "fumadocs-core/page-tree";
import { SidebarTree } from "./sidebar-tree";

interface SidebarProps {
  tree: Root;
}

export function Sidebar({ tree }: SidebarProps) {
  return (
    <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-60 shrink-0 overflow-y-auto border-r border-dashed lg:block">
      <nav className="px-3 py-4">
        <SidebarTree nodes={tree.children} />
      </nav>
    </aside>
  );
}
