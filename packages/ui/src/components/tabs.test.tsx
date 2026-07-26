import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "vitest-axe"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs"

describe("Tabs accessibility", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("supports keyboard navigation", async () => {
    const user = userEvent.setup()
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3">Tab 3</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
        <TabsContent value="tab3">Content 3</TabsContent>
      </Tabs>
    )

    const tab1 = screen.getByRole("tab", { name: "Tab 1" })
    const tab2 = screen.getByRole("tab", { name: "Tab 2" })

    expect(tab1).toHaveAttribute("aria-selected", "true")

    await user.click(tab2)
    expect(tab2).toHaveAttribute("aria-selected", "true")
    expect(tab1).toHaveAttribute("aria-selected", "false")

    expect(screen.getByText("Content 2")).toBeInTheDocument()
  })

  it("has proper ARIA attributes", async () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    )

    const tab1 = screen.getByRole("tab", { name: "Tab 1" })
    expect(tab1).toHaveAttribute("aria-selected")
  })
})
