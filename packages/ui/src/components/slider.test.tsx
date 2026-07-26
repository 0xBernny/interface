import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "vitest-axe"
import { Slider } from "./slider"

describe("Slider accessibility", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<Slider defaultValue={[50]} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it("supports keyboard navigation", async () => {
    const user = userEvent.setup()
    const { container } = render(<Slider defaultValue={[50]} min={0} max={100} />)

    const slider = container.querySelector("[role='slider']")
    expect(slider).toHaveAttribute("aria-valuemin", "0")
    expect(slider).toHaveAttribute("aria-valuemax", "100")
    expect(slider).toHaveAttribute("aria-valuenow")
  })
})
