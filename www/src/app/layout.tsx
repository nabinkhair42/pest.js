import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://pestjs.vercel.app'),
  title: {
    default: 'PEST.js',
    template: '%s | PEST.js',
  },
  description:
    'Generate production-ready Express 5 + TypeScript projects with database ORM and Docker support.',
  keywords: [
    'express',
    'typescript',
    'node.js',
    'backend',
    'api',
    'generator',
    'cli',
    'prisma',
    'drizzle',
    'typeorm',
    'docker',
    'scaffold',
  ],
  authors: [{ name: 'Nabin Khair', url: 'https://github.com/nabinkhair42' }],
  creator: 'Nabin Khair',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'PEST.js',
    title: 'PEST.js',
    description:
      'Generate production-ready Express 5 + TypeScript projects with database ORM and Docker support.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PEST.js — Production Express Starter with TypeScript',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PEST.js',
    description:
      'Generate production-ready Express 5 + TypeScript projects with database ORM and Docker support.',
    images: ['/og-image.png'],
  },
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${inter.className}`} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider
          theme={{
            defaultTheme: "dark",
            enableSystem: false,
            forcedTheme: "dark",
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
