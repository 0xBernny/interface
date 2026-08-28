export type DocsPageKind = "short" | "long" | "tabs" | "search"

export interface DocsPage {
  slug: string
  title: string
  description: string
  section: string
  kind: DocsPageKind
}

export const docsPages: Array<DocsPage> = [
  {
    slug: "/",
    title: "SO4 Docs",
    description: "Start here for SO4 Markets documentation.",
    section: "Start",
    kind: "short",
  },
  {
    slug: "/concepts/risk",
    title: "Risk Basics",
    description: "Short overview of margin, liquidation, and funding risks.",
    section: "Concepts",
    kind: "short",
  },
  {
    slug: "/developers/architecture",
    title: "Architecture",
    description: "Long-form overview of the SO4 docs and trading architecture.",
    section: "Developers",
    kind: "long",
  },
  {
    slug: "/reference/code-groups",
    title: "Code Groups",
    description: "Reference page with tabs and grouped code examples.",
    section: "Reference",
    kind: "tabs",
  },
  {
    slug: "/search",
    title: "Search Results",
    description: "Representative search results page.",
    section: "Resources",
    kind: "search",
  },
]

export function getPager(slug: string): {
  previous?: DocsPage
  next?: DocsPage
} {
  const index = docsPages.findIndex((page) => page.slug === slug)
  return {
    previous: index > 0 ? docsPages[index - 1] : undefined,
    next:
      index >= 0 && index < docsPages.length - 1
        ? docsPages[index + 1]
        : undefined,
  }
}
