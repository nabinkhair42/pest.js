import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/landing/footer";

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Navbar />
      {children}
      <div className="page-rails">
        <div className="section-divider" aria-hidden="true" />
        <Footer />
      </div>
    </>
  );
}
