import { GlobalRegistrator } from "@happy-dom/global-registrator"
GlobalRegistrator.register()


import { test, expect, afterEach, afterAll } from "bun:test"
import { cleanup, render, act } from "@testing-library/react"
import { components } from "../src/mdx/components"
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

  // Verify Heading 1 (Typography via Heading)
  const h1 = container!.querySelector("h1")
  expect(h1).not.toBeNull()
  expect(h1?.className).toContain("text-22")
  expect(h1?.className).toContain("font-semibold")
  
  // Verify blockquote (Callout)
  const callout = container.querySelector("[role='status']")
  expect(callout).not.toBeNull()
  expect(callout?.textContent).toContain("This is a blockquote.")

  // Verify inline code
  const codes = Array.from(container.querySelectorAll("code"))
  const inlineCode = codes.find(c => c.textContent === "inline code")
  expect(inlineCode).not.toBeUndefined()
  expect(inlineCode?.className).toContain("bg-surface-sunken")

  // Verify internal link
  const internalLink = container.querySelector("a[href='/foo']")
  expect(internalLink).not.toBeNull()
  expect(internalLink?.className).toContain("hover:underline")
  
  // Verify external link
  const externalLink = container.querySelector("a[href='https://example.com']")
  expect(externalLink).not.toBeNull()
  expect(externalLink?.getAttribute("target")).toBe("_blank")
  expect(externalLink?.getAttribute("rel")).toBe("noopener noreferrer")
  expect(externalLink?.querySelector("svg")).not.toBeNull() // Arrow icon

  // Verify table structure
  const tableContainer = container.querySelector("[data-slot='table-container']")
  if (!tableContainer) {
    console.log("HTML Output:", container.innerHTML)
  }
  expect(tableContainer).not.toBeNull()
  expect(tableContainer?.className).toContain("overflow-x-auto")
  expect(tableContainer?.querySelector("table")).not.toBeNull()
})
