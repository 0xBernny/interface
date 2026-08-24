import { headingEntries, internalLinks, loadPages } from "./content"

const pages = await loadPages()
const routeMap = new Map(pages.map((page) => [page.route, page]))
const errors: Array<string> = []

for (const page of pages) {
  for (const link of internalLinks(page.body)) {
    const [route, anchor] = link.split("#")
    const target = routeMap.get(route)
    if (!target) {
      errors.push(`${page.route}: broken link ${link}`)
      continue
    }
    if (anchor) {
      const explicit = new Set(
        headingEntries(target.body).map((entry) => entry.id),
      )
      const generated = new Set(
        [...target.body.matchAll(/^## (.+)$/gm)].map((match) =>
          match[1]
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, ""),
        ),
      )
      if (!explicit.has(anchor) && !generated.has(anchor))
        errors.push(`${page.route}: broken anchor ${link}`)
    }
  }
}

if (errors.length) {
  console.error(errors.join("\n"))
  process.exit(1)
}
console.log(
  `Link check passed: ${pages.length} pages, zero broken internal links.`,
)
