import { resolve } from "node:path"

import { headingEntries, loadPages } from "./content"

const faq = (await loadPages()).find((page) => page.route === "/resources/faq")
if (!faq) throw new Error("FAQ source is missing")
const landing = new Set(faq.frontmatter.landing ?? [])
const entries = headingEntries(faq.body)
  .filter((entry) => landing.has(entry.id))
  .map((entry) => {
    const link = entry.answer.match(/\[([^\]]+)\]\(([^)]+)\)\.$/)
    if (!link)
      throw new Error(`FAQ ${entry.id} must end with one documentation link`)
    return {
      id: entry.id,
      question: entry.title,
      answer: entry.answer.slice(0, link.index).trim(),
      linkLabel: link[1],
      href: link[2],
    }
  })

if (entries.length !== landing.size)
  throw new Error("landing frontmatter names an unknown FAQ entry")

const output = `// Generated from apps/docs/content/resources/faq.mdx. Do not edit.\nexport const LANDING_FAQS = ${JSON.stringify(entries, null, 2)} as const\n`
const target = resolve(
  import.meta.dir,
  "../../web/src/ui/landing/faq.generated.ts",
)

if (process.argv.includes("--check")) {
  const current = await Bun.file(target)
    .text()
    .catch(() => "")
  if (current !== output) {
    console.error(
      "Landing FAQ data is stale. Run: bun run --cwd apps/docs generate:faq",
    )
    process.exit(1)
  }
  console.log("Landing FAQ data matches its MDX source.")
} else {
  await Bun.write(target, output)
  console.log(`Generated ${entries.length} landing FAQ entries.`)
}
