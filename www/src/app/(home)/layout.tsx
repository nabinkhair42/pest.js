import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';
import { Footer } from '@/components/landing/footer';

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <HomeLayout {...baseOptions()}>
      {children}
      <div className="page-rails">
        <div className="section-divider" aria-hidden="true" />
        <Footer />
      </div>
    </HomeLayout>
  );
}
