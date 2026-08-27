import { mkdir, rm } from "node:fs/promises"
import { join } from "node:path"

import { $ } from "bun"
import { appRoot, loadPages } from "./content"

await $`bun run ${join(appRoot, "scripts/check-content.ts")}`
await $`bun run ${join(appRoot, "scripts/check-links.ts")}`
await $`bun run ${join(appRoot, "scripts/generate-faq.ts")} --check`
await $`bun run ${join(appRoot, "../../scripts/generate-design-tokens.ts")} --check`
await $`bun run ${join(appRoot, "../../scripts/generate-errors-reference.ts")} --check`

const pages = (await loadPages()).filter(
  (page) => page.frontmatter.status !== "draft",
)
const outputRoot = join(appRoot, ".nitro-static")

function escape(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
}

function renderInline(value: string) {
  return value
    .replace(
      /<Term id="([a-z0-9-]+)">([^<]+)<\/Term>/g,
      '<a href="/reference/glossary#$1">$2</a>',
    )
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
}

function render(body: string) {
  const blocks = body.split(/\n\n+/)
  return blocks
    .map((block) => {
      const heading = block.match(/^## (.+?)(?: \{#([a-z0-9-]+)\})?$/)
      if (heading) {
        const id =
          heading[2] ??
          heading[1]
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")
        return `<h2 id="${id}">${escape(heading[1])}</h2>`
      }
      if (block.startsWith("> "))
        return `<aside>${renderInline(block.replace(/^> ?/gm, ""))}</aside>`
      if (block.startsWith("- "))
        return `<ul>${block
          .split("\n")
          .map((line) => `<li>${renderInline(line.slice(2))}</li>`)
          .join("")}</ul>`
      return `<p>${renderInline(block)}</p>`
    })
    .join("\n")
}

await rm(outputRoot, { recursive: true, force: true })
for (const page of pages) {
  const directory = join(outputRoot, page.route.slice(1))
  await mkdir(directory, { recursive: true })
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escape(page.frontmatter.title)} · SO4 docs</title><meta name="description" content="${escape(page.frontmatter.description)}"><style>:root{font:16px/1.65 system-ui;color:#17191d;background:#fff}body{margin:0}header,main{max-width:760px;margin:auto;padding:24px}header{display:flex;justify-content:space-between;border-bottom:1px solid #ddd}a{color:#3156c8}h1{font-size:2.4rem;line-height:1.1}h2{margin-top:2.5rem}aside{border-left:4px solid #d99b16;background:#fff8df;padding:16px}code{background:#eee;padding:2px 5px}@media print{header{display:none}main{max-width:none;padding:0}a{color:inherit;text-decoration:none}aside{break-inside:avoid;background:none;border:1px solid #777}h2{break-after:avoid}}</style></head><body><header data-pagefind-ignore><a href="/">SO4 docs</a><a href="https://so4.market">Open interface</a></header><main data-pagefind-body><h1>${escape(page.frontmatter.title)}</h1>${render(page.body)}</main></body></html>`
  await Bun.write(join(directory, "index.html"), html)
}

console.log(`Built ${pages.length} static documentation routes.`)
