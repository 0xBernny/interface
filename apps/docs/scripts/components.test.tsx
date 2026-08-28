import React from "react"
import { GlobalRegistrator } from "@happy-dom/global-registrator"
import { test, expect, afterEach, afterAll, beforeAll } from "bun:test"
import { cleanup, render, act } from "@testing-library/react"
import { components } from "../src/mdx/components"
import { Sidebar } from "../src/components/Sidebar"
import { Toc } from "../src/components/Toc"
import { Pager } from "../src/components/Pager"
import * as jsxRuntime from "react/jsx-runtime"
import { compile, run } from "@mdx-js/mdx"
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router"
import { shikiPlugin } from "../src/lib/rehype-shiki"
import remarkGfm from "remark-gfm"

beforeAll(() => {
  GlobalRegistrator.register()
})

afterAll(() => {
  GlobalRegistrator.unregister()
})

afterEach(() => {
  cleanup()
})

const mdxFixture = `
# Heading 1

## Heading 2

This is a paragraph with some \`inline code\`.

> This is a blockquote.

| Column 1 | Column 2 |
| -------- | -------- |
| Value 1  | Value 2  |

Here is an [internal link](/foo) and an [external link](https://example.com).

- Item 1
- Item 2

---

![Alt text](/image.png)
`

test("MDX components map renders kitchen-sink fixture correctly", async () => {
  const compiled = await compile(mdxFixture, {
    outputFormat: "function-body",
    remarkPlugins: [remarkGfm],
    rehypePlugins: [shikiPlugin],
  })

  const { default: MDXContent } = await run(String(compiled), {
    ...jsxRuntime,
  })

  const rootRoute = createRootRoute({
    component: () => <MDXContent components={components} />,
  })

  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory(),
  })

  let container: HTMLElement
  await act(async () => {
    const result = render(<RouterProvider router={router} />)
    container = result.container
  })

  const h1 = container!.querySelector("h1")
  expect(h1).not.toBeNull()

  const callout = container.querySelector("[role='status']")
  expect(callout).not.toBeNull()

  const codes = Array.from(container.querySelectorAll("code"))
  const inlineCode = codes.find(c => c.textContent === "inline code")
  expect(inlineCode).not.toBeUndefined()

  const internalLink = container.querySelector("a[href='/foo']")
  expect(internalLink).not.toBeNull()

  const externalLink = container.querySelector("a[href='https://example.com']")
  expect(externalLink).not.toBeNull()
})

test("Sidebar renders section headers and links correctly", () => {
  const sections = [
    {
      label: "Overview",
      pages: [
        { route: "/get-started/introduction", title: "Introduction" },
        { route: "/get-started/quickstart", title: "Quickstart", status: "beta" as const },
      ],
    },
  ]

  const rootRoute = createRootRoute({
    component: () => <Sidebar sections={sections} currentRoute="/get-started/introduction" />,
  })
  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory(),
  })

  let container: HTMLElement
  render(<RouterProvider router={router} />)

  const activeLink = document.querySelector("a[aria-current='page']")
  expect(activeLink).not.toBeNull()
  expect(activeLink?.textContent).toContain("Introduction")
})

test("Toc renders table of contents anchors", () => {
  const entries = [
    { title: "Overview", id: "overview", level: 2 },
    { title: "Architecture", id: "architecture", level: 3 },
  ]
  const { container } = render(<Toc entries={entries} activeId="architecture" />)

  const activeAnchor = container.querySelector("a[aria-current='location']")
  expect(activeAnchor).not.toBeNull()
  expect(activeAnchor?.textContent).toBe("Architecture")
})

test("Pager renders previous and next navigation buttons", () => {
  const prev = { title: "Introduction", route: "/get-started/introduction" }
  const next = { title: "Wallets", route: "/get-started/wallets" }

  const rootRoute = createRootRoute({
    component: () => <Pager prev={prev} next={next} />,
  })
  const router = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory(),
  })

  render(<RouterProvider router={router} />)

  const prevLink = document.querySelector("a[rel='prev']")
  const nextLink = document.querySelector("a[rel='next']")

  expect(prevLink).not.toBeNull()
  expect(nextLink).not.toBeNull()
  expect(prevLink?.textContent).toContain("Introduction")
  expect(nextLink?.textContent).toContain("Wallets")
})
