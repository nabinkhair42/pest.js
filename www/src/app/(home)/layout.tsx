import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/landing/footer";
import { getGitHubStars } from "@/lib/github";

export default async function Layout({ children }: LayoutProps<"/">) {
  const stars = await getGitHubStars();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar stars={stars} />
      <div className="flex-1">{children}</div>
      <div className="page-rails">
        <div className="section-divider" aria-hidden="true" />
        <Footer />
      </div>
    </div>
  );
}
