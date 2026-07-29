import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { axe } from "vitest-axe"
import { AppShell } from "./app-shell"

describe("AppShell", () => {
  it("renders children within the content area", () => {
    render(
      <AppShell navbar={<nav data-testid="navbar" />}>
        <p data-testid="content">Page content</p>
      </AppShell>
    )
    expect(screen.getByTestId("navbar")).toBeInTheDocument()
    expect(screen.getByTestId("content")).toBeInTheDocument()
  })

  it("renders banner when provided", () => {
    render(
      <AppShell navbar={<nav />} banner={<div data-testid="banner" />}>
        Content
      </AppShell>
    )
    expect(screen.getByTestId("banner")).toBeInTheDocument()
  })

  it("applies full variant class", () => {
    const { container } = render(
      <AppShell variant="full" navbar={<nav />}>
        Content
      </AppShell>
    )
    const shell = container.querySelector("[data-slot='app-shell']")
    expect(shell).toHaveAttribute("data-variant", "full")
  })

  it("applies constrained variant class by default", () => {
    const { container } = render(
      <AppShell navbar={<nav />}>
        Content
      </AppShell>
    )
    const shell = container.querySelector("[data-slot='app-shell']")
    expect(shell).toHaveAttribute("data-variant", "constrained")
  })

  it("accepts a custom maxWidth", () => {
    const { container } = render(
      <AppShell maxWidth="2xl" navbar={<nav />}>
        Content
      </AppShell>
    )
    const content = container.querySelector("[data-slot='app-shell-content']")
    expect(content).toBeTruthy()
  })

  it("has no accessibility violations", async () => {
    const { container } = render(
      <AppShell navbar={<nav aria-label="Main" />}>
        <main>Content</main>
      </AppShell>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})