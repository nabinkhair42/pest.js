export type EachRoute = {
  title: string;
  href: string;
  noLink?: true; 
  items?: EachRoute[];
  tag?: string;
};

export const ROUTES: EachRoute[] = [
  {
    title: "Getting Started",
    href: "/getting-started",
    noLink:true,
    items: [
      { title: "Introduction", href: "/introduction" },
      { title: "Core Principles", href: "/core-principles" },
      { title: "How PEST.js Works", href: "/how-pestjs-works" },
      { title: "Project Structure", href: "/project-structure" },
      { title: "Configuration Guide", href: "/configuration-guide" },
    ],
  },
];

type Page = { title: string; href: string };

function getRecurrsiveAllLinks(node: EachRoute) {
  const ans: Page[] = [];
  if (!node.noLink) {
    ans.push({ title: node.title, href: node.href });
  }
  node.items?.forEach((subNode) => {
    const temp = { ...subNode, href: `${node.href}${subNode.href}` };
    ans.push(...getRecurrsiveAllLinks(temp));
  });
  return ans;
}

export const page_routes = ROUTES.map((it) => getRecurrsiveAllLinks(it)).flat();
