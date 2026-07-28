import { describe, expect, it } from "vitest"
import { render } from "@testing-library/react"
import { axe } from "vitest-axe"
import { Button } from "./button"

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
