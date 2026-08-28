import { GlobalRegistrator } from "@happy-dom/global-registrator"

import { test, expect, afterEach, afterAll, beforeAll } from "bun:test"
import {
  cleanup,
  render,
  act,
  fireEvent,
  waitFor,
} from "@testing-library/react"
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
import { DocsLayout } from "../src/components/DocsLayout"
import { Tab, Tabs as DocsTabs } from "../src/mdx/Tabs"

beforeAll(() => {
  GlobalRegistrator.register()
})

afterAll(() => {
  GlobalRegistrator.unregister()
})

afterEach(() => {
  cleanup()
  window.localStorage.clear()
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
  const inlineCode = codes.find((c) => c.textContent === "inline code")
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
  const tableContainer = container.querySelector(
    "[data-slot='table-container']"
  )
  if (!tableContainer) {
    console.log("HTML Output:", container.innerHTML)
  }
  expect(tableContainer).not.toBeNull()
  expect(tableContainer?.className).toContain("overflow-x-auto")
  expect(tableContainer?.querySelector("table")).not.toBeNull()
})

function SyncedTabs() {
  return (
    <>
      <DocsTabs groupId="manager">
        <Tab label="bun">Bun first</Tab>
        <Tab label="npm">npm first</Tab>
      </DocsTabs>
      <DocsTabs groupId="manager">
        <Tab label="bun">Bun second</Tab>
        <Tab label="npm">npm second</Tab>
      </DocsTabs>
    </>
  )
}

test("DocsLayout exposes landmarks and a working skip link", () => {
  const result = render(
    <DocsLayout
      header={<a href="/">SO4 docs</a>}
      sidebar={<nav aria-label="Documentation">Sidebar</nav>}
      toc={
        <ol>
          <li>
            <a href="#intro">Introduction</a>
          </li>
        </ol>
      }
      footer="Footer"
    >
      <h1 id="intro">Introduction</h1>
    </DocsLayout>
  )

  const main = result.getByRole("main")
  const skipLink = result.getByRole("link", { name: "Skip to main content" })
  expect(main.id).toBe("main-content")
  expect(main.getAttribute("tabindex")).toBe("-1")
  expect(result.getByRole("contentinfo")).toBeDefined()

  fireEvent.click(skipLink)
  expect(document.activeElement).toBe(main)
})

test("MDX tabs sync groups, persist selection, and keep every panel", async () => {
  const result = render(<SyncedTabs />)
  const npmTabs = result.getAllByRole("tab", { name: "npm" })
  fireEvent.click(npmTabs[0])

  await waitFor(() => {
    expect(npmTabs[0].getAttribute("aria-selected")).toBe("true")
    expect(npmTabs[1].getAttribute("aria-selected")).toBe("true")
  })
  expect(window.localStorage.getItem("so4-docs-tabs:manager")).toBe("npm")
  expect(result.getByText("npm first")).toBeDefined()
  expect(result.getByText("npm second")).toBeDefined()
})

test("MDX tabs restore a persisted selection", async () => {
  window.localStorage.setItem("so4-docs-tabs:manager", "npm")
  const result = render(<SyncedTabs />)

  await waitFor(() => {
    for (const tab of result.getAllByRole("tab", { name: "npm" })) {
      expect(tab.getAttribute("aria-selected")).toBe("true")
    }
  })
})

test("MDX tabs fall back to the first option when storage is unavailable", async () => {
  const storage = window.localStorage
  const originalGetItem = storage.getItem.bind(storage)
  Object.defineProperty(storage, "getItem", {
    configurable: true,
    value: () => {
      throw new Error("storage disabled")
    },
  })

  try {
    const result = render(<SyncedTabs />)
    await waitFor(() => {
      for (const tab of result.getAllByRole("tab", { name: "bun" })) {
        expect(tab.getAttribute("aria-selected")).toBe("true")
      }
    })
  } finally {
    Object.defineProperty(storage, "getItem", {
      configurable: true,
      value: originalGetItem,
    })
  }
})
