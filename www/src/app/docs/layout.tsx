import { source } from "@/lib/source";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNavTrigger } from "@/components/layout/mobile-nav";
import { Footer } from "@/components/landing/footer";

export default function Layout({ children }: LayoutProps<"/docs">) {
  const tree = source.getPageTree();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar
        sidebarTrigger={<MobileNavTrigger nodes={tree.children} />}
      />
      <div className="page-rails flex-1">
        <div className="rail-bounded flex">
          <Sidebar tree={tree} />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
      <div className="page-rails">
        <div className="section-divider" aria-hidden="true" />
        <Footer />
      </div>
    </div>
  );
}
