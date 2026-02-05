import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: 'PEST.js',
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
