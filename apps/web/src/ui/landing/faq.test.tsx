import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { LandingFaq } from "./faq"
import { LANDING_FAQS } from "./faq.generated"

describe("LandingFaq", () => {
  it("renders every generated entry and reveals its documentation link", async () => {
    const user = userEvent.setup()
    render(<LandingFaq />)
    for (const item of LANDING_FAQS) {
      expect(
        screen.getByRole("button", { name: item.question }),
      ).toBeInTheDocument()
    }
    await user.click(
      screen.getByRole("button", { name: LANDING_FAQS[0].question }),
    )
    expect(
      screen.getByRole("link", { name: LANDING_FAQS[0].linkLabel }),
    ).toHaveAttribute("href", `https://docs.so4.market${LANDING_FAQS[0].href}`)
  })
})
