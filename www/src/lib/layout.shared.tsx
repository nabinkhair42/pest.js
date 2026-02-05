import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { Pest } from '@/components/icons/pest';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <Pest className="size-5" />
          PEST.js
        </>
      ),
    },
    githubUrl: 'https://github.com/nabinkhair42/pest.js',
    links: [
      {
        text: 'Docs',
        url: '/docs',
      },
      {
        text: 'Changelog',
        url: '/changelog',
      },
    ],
  };
}
