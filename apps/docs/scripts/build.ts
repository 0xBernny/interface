import { mkdir, readdir, rm } from "node:fs/promises"
import { join } from "node:path"

import { $ } from "bun"
import { appRoot, loadPages } from "./content"
import { appRoot, loadPages, slugifyHeading } from "./content"

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
const themeBootstrap = `<script>(function(){var key="so4-docs-theme";var saved=localStorage.getItem(key);var theme=saved||"system";var dark=theme==="dark"||(theme==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",dark);document.documentElement.dataset.theme=dark?"dark":"light"})()</script>`
const pageScript = `<script>document.addEventListener("click",function(event){var anchor=event.target.closest(".heading-anchor");if(anchor){event.preventDefault();var url=location.href.split("#")[0]+anchor.getAttribute("href");navigator.clipboard?.writeText(url);history.replaceState(null,"",anchor.getAttribute("href"))}var toggle=event.target.closest("[data-theme-toggle]");if(toggle){var dark=!document.documentElement.classList.contains("dark");document.documentElement.classList.toggle("dark",dark);document.documentElement.dataset.theme=dark?"dark":"light";localStorage.setItem("so4-docs-theme",dark?"dark":"light")}var search=event.target.closest("[data-search-open]");if(search){document.querySelector("[data-search-dialog]").showModal();document.querySelector("[data-search-input]").focus()}});document.querySelector("[data-search-input]")?.addEventListener("input",async function(event){var q=event.target.value.trim();var out=document.querySelector("[data-search-results]");if(!q){out.innerHTML="";return}var pagefind=await import("/pagefind/pagefind.js");var results=await pagefind.search(q);out.innerHTML="";for(var item of results.results.slice(0,8)){var data=await item.data();var link=document.createElement("a");link.href=data.url;link.textContent=data.meta?.title||data.url;out.append(link)}})</script>`
await rm(outputRoot, { recursive: true, force: true })
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width">${themeBootstrap}<title>${escape(page.frontmatter.title)} · SO4 docs</title><meta name="description" content="${escape(page.frontmatter.description)}"><style>:root{font:16px/1.65 system-ui;color:#17191d;background:#fff}:root.dark{color:#f5f5f5;background:#17191d}body{margin:0}header,main{max-width:760px;margin:auto;padding:24px}header{display:flex;justify-content:space-between;gap:16px;border-bottom:1px solid currentColor}header nav{display:flex;gap:12px}button{font:inherit;color:inherit;background:transparent;border:1px solid currentColor;padding:4px 8px;cursor:pointer}a{color:#3156c8}.dark a{color:#9ab4ff}h1{font-size:2.4rem;line-height:1.1}h2,h3,h4,h5,h6{margin-top:2.5rem}.heading-anchor{opacity:0;margin-right:8px;text-decoration:none}.heading-anchor:focus,.heading-anchor:hover{opacity:1}.steps{counter-reset:steps;list-style:none;padding:0}.steps li{counter-increment:steps;border-left:2px solid #3156c8;padding:8px 0 8px 36px;position:relative}.steps li:before{content:counter(steps);position:absolute;left:-14px;background:#3156c8;color:white;border-radius:50%;width:26px;height:26px;text-align:center;line-height:26px}aside{border-left:4px solid #d99b16;background:#fff8df;padding:16px}code{background:#eee;padding:2px 5px}dialog{color:inherit;background:Canvas;max-width:600px;width:calc(100% - 48px)}[data-search-results]{display:grid;gap:8px;padding-top:12px}@media print{header{display:none}main{max-width:none;padding:0}a{color:inherit;text-decoration:none}aside{break-inside:avoid;background:none;border:1px solid #777}h2,h3,h4,h5,h6{break-after:avoid}}</style></head><body><header data-pagefind-ignore><a href="/">SO4 docs</a><nav><button type="button" data-search-open>Search</button><button type="button" data-theme-toggle aria-label="Toggle theme">Theme</button></nav></header><dialog data-search-dialog><form method="dialog"><input data-search-input aria-label="Search documentation" placeholder="Search documentation"><button>Close</button></form><div data-search-results></div></dialog><main data-pagefind-body><h1>${escape(page.frontmatter.title)}</h1>${render(page.body)}</main>${pageScript}</body></html>`
for (const page of pages) {
  const directory = join(outputRoot, page.route.slice(1))
  await mkdir(directory, { recursive: true })
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escape(page.frontmatter.title)} · SO4 docs</title><meta name="description" content="${escape(page.frontmatter.description)}"><link rel="stylesheet" href="/assets/${stylesheet}"></head><body class="bg-surface-canvas text-text-primary"><header class="mx-auto flex h-16 max-w-3xl items-center justify-between border-b border-border px-4" data-pagefind-ignore><a class="text-sm font-semibold text-text-primary" href="/">SO4 docs</a><a class="text-sm font-medium text-text-link" href="https://so4.market">Open interface</a></header><main class="mx-auto max-w-3xl px-4 py-10" data-pagefind-body><h1 class="mb-6 text-2xl font-semibold text-text-primary">${escape(page.frontmatter.title)}</h1>${render(page.body)}</main></body></html>`
  await Bun.write(join(directory, "index.html"), html)
}

console.log(`Built ${pages.length} static documentation routes.`)
