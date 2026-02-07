import { source } from "@/lib/source";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";

export default function Layout({ children }: LayoutProps<"/docs">) {
  const tree = source.getPageTree();

  return (
    <>
      <Navbar />
      <div className="mx-auto flex max-w-6xl">
        <Sidebar tree={tree} />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </>
  );
}
