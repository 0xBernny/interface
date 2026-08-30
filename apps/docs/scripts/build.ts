import { mkdir, readdir, rm } from "node:fs/promises"
import { join } from "node:path"

import { $ } from "bun"
import { appRoot, loadPages, slugifyHeading } from "./content.ts"
import { DEFAULT_SITE_URL, generateSeoTags } from "../src/lib/seo.ts"
import {
  formatRelativeTime,
  getGitHubEditUrl,
  isPageStale,
} from "../src/lib/docs-helpers.ts"
import { buildSitemapAndRobots } from "./sitemap.ts"

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

export function extractHeadings(body: string): Array<{
  title: string
  id: string
  level: number
}> {
  const blocks = body.split(/\n\n+/)
  const headings: Array<{ title: string; id: string; level: number }> = []
  for (const block of blocks) {
    const match = block.match(/^(#{2,3}) (.+?)(?: \{#([a-z0-9-]+)\})?$/)
    if (match) {
      const level = match[1].length
      const title = match[2]
      const id = match[3] ?? slugifyHeading(title)
      headings.push({ title, id, level })
    }
  }
  return headings
}

function renderTocHtml(
  headings: Array<{ title: string; id: string; level: number }>
): string {
  if (headings.length < 2) return ""

  const items = headings
    .map((h) => {
      const isH3 = h.level === 3
      const indentClass = isH3 ? "ps-3 text-xs" : ""
      return `<li class="${indentClass}"><a class="block py-0.5 text-text-secondary hover:text-text-primary transition-colors" href="#${h.id}">${escape(h.title)}</a></li>`
    })
    .join("\n")

  return `<aside class="hidden xl:block w-56 shrink-0 py-8 ps-6 sticky top-16 max-h-[calc(100dvh-4rem)] overflow-y-auto" data-pagefind-ignore aria-label="Table of contents"><nav class="space-y-3"><h4 class="text-xs font-semibold text-text-tertiary uppercase tracking-wider">On this page</h4><ul class="space-y-1.5 text-sm">${items}</ul></nav></aside>`
}

function render(body: string) {
  const blocks = body.split(/\n\n+/)
  return blocks
    .map((block) => {
      const heading = block.match(/^(#{2,6}) (.+?)(?: \{#([a-z0-9-]+)\})?$/)
      if (heading) {
        const level = heading[1].length
        const title = heading[2]
        const id = heading[3] ?? slugifyHeading(title)
        return `<h${level} id="${id}"><a class="heading-anchor" href="#${id}" aria-label="Copy link to ${escape(title)}">#</a>${escape(title)}</h${level}>`
      }
      if (block.startsWith("<Steps>") && block.endsWith("</Steps>")) {
        const items = block
          .slice("<Steps>".length, -"</Steps>".length)
          .trim()
          .split("\n")
          .filter((line) => /^\d+\. /.test(line))
          .map((line) => `<li>${renderInline(line.replace(/^\d+\. /, ""))}</li>`)
          .join("")
        return `<ol class="steps">${items}</ol>`
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
// The docs stylesheet is the Vite bundle of `src/app/main.tsx` →
// `src/styles/globals.css` (Tailwind v4 + the shared `@workspace/ui` theme).
// Content pages link the hashed asset so they share one compiled stylesheet
// with the SPA home page.
await $`bunx vite build`.cwd(appRoot)
const stylesheet = (await readdir(join(outputRoot, "assets"))).find(
  (file) => file.startsWith("index-") && file.endsWith(".css")
)
if (!stylesheet) throw new Error("Vite did not emit the docs stylesheet")

for (const page of pages) {
  const directory = join(outputRoot, page.route.slice(1))
  await mkdir(directory, { recursive: true })

  const canonicalRoute = page.route === "/index" ? "/" : page.route
  const sectionName = page.route.split("/")[1] || "Documentation"

  const { headTags, structuredDataHtml } = generateSeoTags({
    title: page.frontmatter.title,
    description: page.frontmatter.description,
    route: canonicalRoute,
    updated: page.frontmatter.updated,
    section: sectionName,
  })

  const headings = extractHeadings(page.body)
  const tocHtml = renderTocHtml(headings)
  const editUrl = getGitHubEditUrl(page.route)
  const relativeDate = formatRelativeTime(page.frontmatter.updated)
  const isStale = isPageStale(page.frontmatter.updated)

  const staleBanner = isStale
    ? `<aside class="my-6 rounded-lg border border-warning/30 bg-warning-subtle p-4 text-sm text-warning-foreground" role="alert">This page was last updated over 6 months ago (<time datetime="${escape(page.frontmatter.updated)}">${escape(page.frontmatter.updated)}</time>). Some information may be outdated.</aside>`
    : ""

  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">${headTags}<link rel="stylesheet" href="/assets/${stylesheet}">${structuredDataHtml}</head><body class="bg-surface-canvas text-text-primary min-h-dvh flex flex-col"><header class="mx-auto flex h-16 w-full max-w-screen-2xl items-center justify-between border-b border-border px-4 md:px-6 lg:px-8" data-pagefind-ignore><a class="text-sm font-semibold text-text-primary" href="/">SO4 docs</a><div class="flex items-center gap-4"><a class="text-sm font-medium text-text-link hover:underline" href="https://so4.market">Open interface</a></div></header><div class="mx-auto flex w-full max-w-screen-2xl flex-1 items-start px-4 md:px-6 lg:px-8"><main class="min-w-0 flex-1 py-8 outline-none lg:px-8 xl:px-12" data-pagefind-body><article class="mx-auto max-w-3xl"><h1 class="mb-6 text-2xl font-semibold text-text-primary">${escape(page.frontmatter.title)}</h1>${staleBanner}${render(page.body)}<div class="mt-12 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-border pt-6 text-sm text-text-secondary" data-pagefind-ignore><span>Last updated <time datetime="${escape(page.frontmatter.updated)}" title="${escape(page.frontmatter.updated)}">${escape(relativeDate)}</time></span><a href="${escape(editUrl)}" target="_blank" rel="noreferrer" class="hover:text-text-primary inline-flex items-center gap-1.5 transition-colors">Edit this page on GitHub ↗</a></div><footer class="docs-print-footer mt-6" data-pagefind-ignore data-print-url="${escape(`${DEFAULT_SITE_URL}${page.route}`)}">Last updated <time datetime="${escape(page.frontmatter.updated)}">${escape(page.frontmatter.updated)}</time></footer></article></main>${tocHtml}</div></body></html>`

  await Bun.write(join(directory, "index.html"), html)
}

// DX-046: Generate sitemap.xml and robots.txt
await buildSitemapAndRobots(DEFAULT_SITE_URL, [
  join(appRoot, "public"),
  outputRoot,
])

console.log(`Built ${pages.length} static documentation routes with TOC, SEO metadata, sitemap.xml, and robots.txt.`)
