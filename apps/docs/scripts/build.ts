import { mkdir, readdir, rm } from "node:fs/promises"
import { join } from "node:path"

import { $ } from "bun"
import { appRoot, loadPages } from "./content"

await $`bun run ${join(appRoot, "scripts/check-content.ts")}`
await $`bun run ${join(appRoot, "scripts/check-links.ts")}`
await $`bun run ${join(appRoot, "scripts/generate-faq.ts")} --check`
await $`bun run ${join(appRoot, "../../scripts/generate-design-tokens.ts")} --check`
await $`bun run ${join(appRoot, "../../scripts/generate-errors-reference.ts")} --check`

const pages = (await loadPages()).filter(
  (page) => page.frontmatter.status !== "draft"
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
      '<a href="/reference/glossary#$1">$2</a>'
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
        return `<h2 class="mt-10 text-xl font-semibold text-text-primary" id="${id}">${escape(heading[1])}</h2>`
      }
      if (block.startsWith("> "))
        return `<aside class="my-6 rounded-lg bg-warning-subtle p-4 text-sm text-text-primary">${renderInline(block.replace(/^> ?/gm, ""))}</aside>`
      if (block.startsWith("- "))
        return `<ul class="mb-4 list-disc space-y-2 ps-6 text-sm text-text-primary">${block
          .split("\n")
          .map((line) => `<li>${renderInline(line.slice(2))}</li>`)
          .join("")}</ul>`
      return `<p class="mb-4 text-sm leading-7 text-text-primary">${renderInline(block)}</p>`
    })
    .join("\n")
}

await rm(outputRoot, { recursive: true, force: true })
await $`bunx vite build`.cwd(appRoot)
const stylesheet = (await readdir(join(outputRoot, "assets"))).find(
  (file) => file.startsWith("index-") && file.endsWith(".css")
)
if (!stylesheet) throw new Error("Vite did not emit the docs stylesheet")

for (const page of pages) {
  const directory = join(outputRoot, page.route.slice(1))
  await mkdir(directory, { recursive: true })
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escape(page.frontmatter.title)} · SO4 docs</title><meta name="description" content="${escape(page.frontmatter.description)}"><link rel="stylesheet" href="/assets/${stylesheet}"></head><body class="bg-surface-canvas text-text-primary"><header class="mx-auto flex h-16 max-w-3xl items-center justify-between border-b border-border px-4" data-pagefind-ignore><a class="text-sm font-semibold text-text-primary" href="/">SO4 docs</a><a class="text-sm font-medium text-text-link" href="https://so4.market">Open interface</a></header><main class="mx-auto max-w-3xl px-4 py-10" data-pagefind-body><h1 class="mb-6 text-2xl font-semibold text-text-primary">${escape(page.frontmatter.title)}</h1>${render(page.body)}</main></body></html>`
  await Bun.write(join(directory, "index.html"), html)
}

console.log(`Built ${pages.length} static documentation routes.`)
