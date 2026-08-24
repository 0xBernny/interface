import { readdir } from "node:fs/promises"
import { join, relative, resolve } from "node:path"

export const appRoot = resolve(import.meta.dir, "..")
export const contentRoot = join(appRoot, "content")

export type Frontmatter = {
  title: string
  description: string
  updated: string
  status: "stable" | "beta" | "draft"
  landing?: Array<string>
}

export type Page = {
  file: string
  route: string
  frontmatter: Frontmatter
  body: string
}

async function walk(directory: string): Promise<Array<string>> {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name)
      return entry.isDirectory() ? walk(path) : Promise.resolve([path])
    }),
  )
  return files.flat()
}

function parseValue(value: string): string | Array<string> {
  if (value.startsWith("[") && value.endsWith("]")) {
    return value
      .slice(1, -1)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  }
  return value
}

export function parsePage(file: string, source: string): Page {
  const match = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) throw new Error(`${file}: missing frontmatter`)

  const values: Record<string, string | Array<string>> = {}
  for (const line of match[1].split("\n")) {
    const separator = line.indexOf(":")
    if (separator < 1)
      throw new Error(`${file}: invalid frontmatter line: ${line}`)
    values[line.slice(0, separator)] = parseValue(
      line.slice(separator + 1).trim(),
    )
  }

  return {
    file,
    route: `/${relative(contentRoot, file)
      .replace(/\.mdx$/, "")
      .replaceAll("\\", "/")}`,
    frontmatter: values as Frontmatter,
    body: match[2].trim(),
  }
}

export async function loadPages(): Promise<Array<Page>> {
  const files = (await walk(contentRoot)).filter((file) =>
    file.endsWith(".mdx"),
  )
  return Promise.all(
    files.map(async (file) => parsePage(file, await Bun.file(file).text())),
  )
}

export function headingEntries(body: string) {
  return [
    ...body.matchAll(
      /^## (.+?) \{#([a-z0-9-]+)\}\n\n([\s\S]*?)(?=\n\n## |$)/gm,
    ),
  ].map(([, title, id, answer]) => ({ title, id, answer: answer.trim() }))
}

export function internalLinks(body: string) {
  const markdown = [...body.matchAll(/\]\((\/[a-z0-9/#-]+)\)/gi)].map(
    (match) => match[1],
  )
  const terms = [...body.matchAll(/<Term id="([a-z0-9-]+)">/g)].map(
    (match) => `/reference/glossary#${match[1]}`,
  )
  return [...markdown, ...terms]
}
