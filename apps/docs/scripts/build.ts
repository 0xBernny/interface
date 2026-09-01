import { existsSync } from "node:fs"
import { mkdir, readdir, readFile, rm } from "node:fs/promises"
import { join } from "node:path"

import { $ } from "bun"
import { appRoot, contentRoot, loadPages, loadPagesFrom, slugifyHeading, versionsRoot } from "./content"
import type { Page } from "./content"
import { DEFAULT_SITE_URL } from "../src/lib/seo"
import { renderMermaidFigureHtml } from "../src/lib/mermaid"
import { getReadingTime } from "../src/lib/reading-time"

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

function render(body: string, filePath: string) {
  const blocks = body.split(/\n\n+/)
  return blocks
    .map((block) => {
      if (block.startsWith("```mermaid")) {
        const firstLineEnd = block.indexOf("\n")
        const header = firstLineEnd !== -1 ? block.slice(0, firstLineEnd) : block
        const content = firstLineEnd !== -1 ? block.slice(firstLineEnd + 1).replace(/```$/, "").trim() : ""

        const captionMatch = header.match(/caption=(?:"([^"]+)"|'([^']+)'|([^\s]+))/)
        const titleMatch = header.match(/title=(?:"([^"]+)"|'([^']+)'|([^\s]+))/)
        const caption = captionMatch?.[1] || captionMatch?.[2] || captionMatch?.[3]
        const title = titleMatch?.[1] || titleMatch?.[2] || titleMatch?.[3]

        return renderMermaidFigureHtml(content, { caption, title, file: filePath })
      }
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

function readingMetaHtml(page: Page): string {
  const rt = getReadingTime(page.body)
  if (!rt.shouldShow) return ""
  return `<p class="reading-meta mt-2 text-xs text-text-secondary" data-reading-time>${escape(rt.text)} · Last updated <time datetime="${escape(page.frontmatter.updated)}">${escape(page.frontmatter.updated)}</time></p>`
}

function readingProgressHtml(page: Page): { bar: string; script: string } {
  const rt = getReadingTime(page.body)
  if (!rt.shouldShow) return { bar: "", script: "" }
  const bar = `<div data-reading-progress aria-hidden="true" class="reading-progress" style="position:absolute;bottom:0;left:0;height:2px;width:100%;background:var(--primary);transform:scaleX(0);transform-origin:left;will-change:transform;pointer-events:none"></div>`
  const script = `<script src="/assets/reading-progress.js" defer></script>`
  return { bar, script }
}

const readingProgressStyle = `<style>[data-reading-progress]{transition:none}@media(prefers-reduced-motion:reduce){[data-reading-progress]{transition:none!important;animation:none!important}}</style>`

// DX-050: versioned documentation routing.
//
// The current version renders unprefixed, unchanged from DX-029. Every
// directory under content-versions/<id>/ (produced by
// scripts/snapshot-version.ts; git-ignored, so ordinarily empty in a fresh
// clone) renders under an explicit /<id> prefix alongside it.
async function loadVersionIndex(id: string | null, root: string): Promise<DocVersionIndex> {
  const metaRaw = await readFile(join(root, "meta.json"), "utf8")
  const meta = JSON.parse(metaRaw) as { sections: Array<{ label: string; pages: Array<string> }> }
  return {
    id,
    sections: meta.sections.map((section) => ({
      label: section.label,
      pages: section.pages.map((page) => `/${page}`),
    })),
  }
}

async function discoverVersionIds(): Promise<Array<string>> {
  if (!existsSync(versionsRoot)) return []
  const entries = await readdir(versionsRoot, { withFileTypes: true })
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
}

const versionIds = await discoverVersionIds()
const currentVersionIndex = await loadVersionIndex(null, contentRoot)
const snapshotIndexes = await Promise.all(
  versionIds.map((id) => loadVersionIndex(id, join(versionsRoot, id))),
)
const allVersions: Array<DocVersionIndex> = [currentVersionIndex, ...snapshotIndexes]
const versionLabel = (id: string | null) => id ?? "Current"

// DX-061: cookieless "was this helpful" page feedback — see
// public/assets/feedback-widget.js and routes/api/feedback.post.ts.
function feedbackWidgetHtml(feedbackPath: string) {
  return `<section class="feedback-widget mt-10 border-t border-border pt-6" data-feedback-path="${escape(feedbackPath)}" data-pagefind-ignore aria-labelledby="feedback-heading"><h2 id="feedback-heading" class="mb-2 text-sm font-medium text-text-primary">Was this page helpful?</h2><div class="feedback-controls flex gap-2" role="group" aria-label="Was this page helpful?"><button type="button" class="feedback-yes rounded-sm border border-border px-3 py-1 text-xs text-text-primary">Yes</button><button type="button" class="feedback-no rounded-sm border border-border px-3 py-1 text-xs text-text-primary">No</button></div><div class="feedback-followup mt-2" hidden><label for="feedback-comment" class="mb-1 block text-xs text-text-secondary">Optional: tell us more. Do not include a wallet address, key, or email — we remove anything that looks like one before storing your comment.</label><textarea id="feedback-comment" class="feedback-comment w-full rounded-sm border border-border bg-surface-canvas p-2 text-xs text-text-primary" rows="2" maxlength="500"></textarea><button type="button" class="feedback-submit mt-1 rounded-sm border border-border px-3 py-1 text-xs text-text-primary">Submit</button></div><p class="feedback-status mt-2 text-xs text-text-secondary" role="status" aria-live="polite"></p></section>`
}

function versionPickerHtml(pageVersionId: string | null, pageSections: DocVersionIndex["sections"], route: string) {
  if (allVersions.length <= 1) return ""
  const options = allVersions
    .map((version) => {
      const href =
        version.id === pageVersionId
          ? versionedRoute(pageVersionId, route)
          : resolveVersionSwitchTarget(route, pageSections, version)
      const selected = version.id === pageVersionId ? " selected" : ""
      return `<option value="${escape(href)}"${selected}>${escape(versionLabel(version.id))}</option>`
    })
    .join("")
  return `<label class="sr-only" for="doc-version-picker">Documentation version</label><select id="doc-version-picker" class="doc-version-picker rounded-sm border border-border bg-surface-canvas px-2 py-1 text-xs text-text-primary" aria-label="Documentation version">${options}</select>`
}

function versionBannerHtml(pageVersionId: string, pageSections: DocVersionIndex["sections"], route: string) {
  const currentEquivalent = resolveVersionSwitchTarget(route, pageSections, currentVersionIndex)
  return `<aside class="version-banner border-b border-warning-border bg-warning-subtle px-4 py-2 text-center text-xs text-text-primary" data-pagefind-ignore>You are viewing the archived <strong>${escape(pageVersionId)}</strong> version of these docs, frozen when it was snapshotted. <a class="underline" href="${escape(currentEquivalent)}">View the current version</a>.</aside>`
}

async function renderPage(page: Page, versionId: string | null, sections: DocVersionIndex["sections"]) {
  const outRoute = versionedRoute(versionId, page.route)
  const directory = join(outputRoot, outRoute === "/" ? "" : outRoute.slice(1))
  await mkdir(directory, { recursive: true })

  const isVersioned = versionId !== null
  const robotsTag = isVersioned ? `<meta name="robots" content="noindex">` : ""
  const banner = isVersioned ? versionBannerHtml(versionId, sections, page.route) : ""
  // Pagefind only indexes elements carrying data-pagefind-body when at least
  // one page on the site has one; omitting it on archived pages excludes
  // them from the search index entirely rather than indexing stale prose.
  const mainAttrs = isVersioned ? "" : " data-pagefind-body"
  const picker = versionPickerHtml(versionId, sections, page.route)
  const readingMeta = readingMetaHtml(page)
  const { bar: progressBar, script: progressScript } = readingProgressHtml(page)

  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escape(page.frontmatter.title)} · SO4 docs</title><meta name="description" content="${escape(page.frontmatter.description)}">${robotsTag}<link rel="stylesheet" href="/assets/${stylesheet}">${readingProgressStyle}<script src="/assets/feedback-widget.js" defer></script>${progressScript}${picker ? `<script src="/assets/doc-version-picker.js" defer></script>` : ""}</head><body class="bg-surface-canvas text-text-primary">${banner}<header class="mx-auto flex h-16 max-w-3xl items-center justify-between gap-4 border-b border-border px-4 relative" data-pagefind-ignore>${progressBar}<a class="text-sm font-semibold text-text-primary" href="/">SO4 docs</a><div class="flex items-center gap-4">${picker}<a class="text-sm font-medium text-text-link" href="https://so4.market">Open interface</a></div></header><main class="mx-auto max-w-3xl px-4 py-10"${mainAttrs}><h1 class="mb-2 text-2xl font-semibold text-text-primary">${escape(page.frontmatter.title)}</h1>${readingMeta}${render(page.body)}${feedbackWidgetHtml(outRoute)}<footer class="docs-print-footer" data-pagefind-ignore data-print-url="${escape(`${DEFAULT_SITE_URL}${outRoute}`)}">Last updated <time datetime="${escape(page.frontmatter.updated)}">${escape(page.frontmatter.updated)}</time></footer></main></body></html>`
  await Bun.write(join(directory, "index.html"), html)
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
  const readingMeta = readingMetaHtml(page)
  const { bar: progressBar, script: progressScript } = readingProgressHtml(page)
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escape(page.frontmatter.title)} · SO4 docs</title><meta name="description" content="${escape(page.frontmatter.description)}"><link rel="stylesheet" href="/assets/${stylesheet}">${readingProgressStyle}${progressScript}</head><body class="bg-surface-canvas text-text-primary"><header class="mx-auto flex h-16 max-w-3xl items-center justify-between border-b border-border px-4 relative" data-pagefind-ignore>${progressBar}<a class="text-sm font-semibold text-text-primary" href="/">SO4 docs</a><a class="text-sm font-medium text-text-link" href="https://so4.market">Open interface</a></header><main class="mx-auto max-w-3xl px-4 py-10" data-pagefind-body><h1 class="mb-2 text-2xl font-semibold text-text-primary">${escape(page.frontmatter.title)}</h1>${readingMeta}${render(page.body, page.file)}<footer class="docs-print-footer" data-pagefind-ignore data-print-url="${escape(`${DEFAULT_SITE_URL}${page.route}`)}">Last updated <time datetime="${escape(page.frontmatter.updated)}">${escape(page.frontmatter.updated)}</time></footer></main></body></html>`
  await Bun.write(join(directory, "index.html"), html)
}

let versionedPageCount = 0
for (let i = 0; i < versionIds.length; i++) {
  const id = versionIds[i]
  const snapshotPages = (await loadPagesFrom(join(versionsRoot, id))).filter(
    (page) => page.frontmatter.status !== "draft",
  )
  for (const page of snapshotPages) {
    await renderPage(page, id, snapshotIndexes[i].sections)
    versionedPageCount++
  }
}

console.log(
  `Built ${pages.length} current-version routes` +
    (versionIds.length > 0
      ? ` and ${versionedPageCount} archived routes across ${versionIds.length} version(s) (${versionIds.join(", ")}).`
      : "."),
)
