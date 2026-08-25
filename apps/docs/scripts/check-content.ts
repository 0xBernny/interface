import { readFile } from "node:fs/promises"
import { join } from "node:path"

import { contentRoot, headingEntries, loadPages } from "./content"

const pages = await loadPages()
const errors: Array<string> = []
const routes = new Set(pages.map((page) => page.route))

for (const page of pages) {
  const { description, status, title, updated } = page.frontmatter
  if (!title || title.length > 60)
    errors.push(`${page.route}: title must be 1-60 characters`)
  if (!description || description.length < 50 || description.length > 160) {
    errors.push(`${page.route}: description must be 50-160 characters`)
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(updated))
    errors.push(`${page.route}: updated must be ISO date`)
  if (!["stable", "beta", "draft"].includes(status))
    errors.push(`${page.route}: invalid status`)
}

const meta = JSON.parse(
  await readFile(join(contentRoot, "meta.json"), "utf8"),
) as {
  sections: Array<{ label: string; pages: Array<string> }>
}
const navRoutes = meta.sections.flatMap((section) =>
  section.pages.map((page) => `/${page}`),
)
for (const route of navRoutes)
  if (!routes.has(route)) errors.push(`sidebar references missing ${route}`)
for (const route of routes)
  if (!navRoutes.includes(route)) errors.push(`orphan page ${route}`)

const glossary = pages.find((page) => page.route === "/reference/glossary")
if (!glossary) {
  errors.push("missing glossary")
} else {
  const entries = headingEntries(glossary.body)
  const titles = entries.map((entry) => entry.title)
  const sorted = [...titles].sort((a, b) =>
    a.localeCompare(b, "en", { sensitivity: "base" }),
  )
  if (titles.some((title, index) => title !== sorted[index]))
    errors.push("glossary is not alphabetical")
  for (const entry of entries) {
    const link = entry.answer.match(/\]\((\/[a-z0-9/#-]+)\)/)?.[1]
    if (!link) errors.push(`glossary#${entry.id}: missing onward link`)
    else if (!routes.has(link.split("#")[0]))
      errors.push(`glossary#${entry.id}: missing page ${link}`)
  }
}

const termPages = pages.filter((page) => page.body.includes("<Term id="))
if (termPages.length < 3)
  errors.push("<Term> must be demonstrated on at least three pages")

if (errors.length) {
  console.error(errors.join("\n"))
  process.exit(1)
}
console.log(
  `Content check passed: ${pages.length} pages, zero orphans, alphabetical glossary.`,
)
