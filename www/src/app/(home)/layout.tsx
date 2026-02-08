import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/landing/footer";

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1">{children}</div>
      <div className="page-rails">
        <div className="section-divider" aria-hidden="true" />
        <Footer />
      </div>
    </div>
  );
}
