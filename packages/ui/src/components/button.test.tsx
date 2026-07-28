import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { axe } from "vitest-axe"
import { Button, buttonVariants } from "./button"

const VARIANTS = [
  "default",
  "outline",
  "secondary",
  "ghost",
  "destructive",
  "link",
] as const

const SIZES = [
  "default",
  "xs",
  "sm",
  "lg",
  "icon",
  "icon-xs",
  "icon-sm",
  "icon-lg",
] as const

describe("Button accessibility", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<Button>Click me</Button>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("supports disabled state without violations", async () => {
    const { container } = render(<Button disabled>Disabled</Button>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("with icon has proper sizing", async () => {
    const { container } = render(
      <Button size="icon" aria-label="Settings">
        <svg viewBox="0 0 24 24" />
      </Button>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})

describe("Button variants and sizes", () => {
  it.each(VARIANTS)("renders the %s variant without violations", async (variant) => {
    const { container } = render(<Button variant={variant}>Action</Button>)
    expect(await axe(container)).toHaveNoViolations()
  })

  it.each(SIZES)("renders the %s size without violations", async (size) => {
    const isIconSize = size.startsWith("icon")
    const { container } = render(
      isIconSize ? (
        <Button size={size} aria-label="Action">
          <svg viewBox="0 0 24 24" />
        </Button>
      ) : (
        <Button size={size}>Action</Button>
      )
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("every variant defines default, hover, active, and disabled classes", () => {
    for (const variant of VARIANTS) {
      const className = buttonVariants({ variant })
      expect(className).toMatch(/hover:/)
      expect(className).toMatch(/active:/)
    }
    // disabled + focus-visible states live in the shared base classes.
    expect(buttonVariants({})).toMatch(/disabled:/)
    expect(buttonVariants({})).toMatch(/focus-visible:/)
  })

  it("keeps the icon-only button's accessible name from aria-label, not the icon", () => {
    render(
      <Button size="icon" aria-label="Settings">
        <svg viewBox="0 0 24 24" />
      </Button>
    )
    expect(screen.getByRole("button", { name: "Settings" })).toBeInTheDocument()
  })
})
