import { describe, it, expect, vi, beforeAll, afterEach, afterAll } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { http, HttpResponse } from "msw"
import { setupServer } from "msw/node"
import { ChangelogPage } from "./components/ChangelogPage"

const mockChangelogData = {
  releases: [
    {
      version: "0.4.0",
      date: "2026-08-24",
      yanked: false,
      entries: [
        {
          type: "added" as const,
          area: "trade" as const,
          text: "Trigger orders on the trade panel.",
          pr: 512,
          breaking: false,
        },
      ],
    },
  ],
}

const server = setupServer(
  http.get("/changelog.json", () => {
    return HttpResponse.json(mockChangelogData)
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("ChangelogPage - States", () => {
  it("renders skeleton while loading", async () => {
    server.use(
      http.get("/changelog.json", async () => {
        await new Promise((resolve) => setTimeout(resolve, 100))
        return HttpResponse.json(mockChangelogData)
      })
    )

    render(<ChangelogPage />)

    const status = screen.getByRole("status")
    expect(status).toBeInTheDocument()
    expect(status).toHaveAttribute("aria-live", "polite")
  })

  it("renders error state on fetch failure", async () => {
    server.use(
      http.get("/changelog.json", () => {
        return HttpResponse.error()
      })
    )

    render(<ChangelogPage />)

    await waitFor(() => {
      const alert = screen.getByRole("alert")
      expect(alert).toBeInTheDocument()
      expect(alert).toHaveTextContent("Failed to load changelog")
    })
  })

  it("shows retry button and refetches on click", async () => {
    let callCount = 0

    server.use(
      http.get("/changelog.json", () => {
        callCount++
        if (callCount === 1) {
          return HttpResponse.error()
        }
        return HttpResponse.json(mockChangelogData)
      })
    )

    const user = userEvent.setup()
    render(<ChangelogPage />)

    // Wait for error
    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument()
    })

    // Click retry
    const retryBtn = screen.getByRole("button", { name: /try again/i })
    expect(retryBtn).toBeInTheDocument()
    await user.click(retryBtn)

    // Should load successfully
    await waitFor(() => {
      expect(screen.getByText("0.4.0")).toBeInTheDocument()
    })

    expect(callCount).toBe(2)
  })

  it("renders empty state for zero releases", async () => {
    server.use(
      http.get("/changelog.json", () => {
        return HttpResponse.json({ releases: [] })
      })
    )

    render(<ChangelogPage />)

    await waitFor(() => {
      expect(screen.getByText("No releases yet")).toBeInTheDocument()
    })
  })

  it("handles malformed JSON gracefully", async () => {
    server.use(
      http.get("/changelog.json", () => {
        return new HttpResponse("{ invalid", { status: 200 })
      })
    )

    render(<ChangelogPage />)

    await waitFor(() => {
      const alert = screen.getByRole("alert")
      expect(alert).toBeInTheDocument()
      expect(alert).toHaveTextContent("Failed to load changelog")
    })
  })

  it("validates changelog data structure", async () => {
    server.use(
      http.get("/changelog.json", () => {
        return HttpResponse.json({ someOtherField: [] })
      })
    )

    render(<ChangelogPage />)

    await waitFor(() => {
      const alert = screen.getByRole("alert")
      expect(alert).toBeInTheDocument()
      expect(alert).toHaveTextContent("Invalid changelog format")
    })
  })

  it("displays loaded content after successful fetch", async () => {
    render(<ChangelogPage />)

    await waitFor(() => {
      expect(screen.getByText("0.4.0")).toBeInTheDocument()
      expect(screen.getByText("Trigger orders on the trade panel.")).toBeInTheDocument()
    })
  })

  it("preserves header across all states", async () => {
    // Error state
    server.use(
      http.get("/changelog.json", () => HttpResponse.error())
    )

    const { rerender } = render(<ChangelogPage />)
    await waitFor(() => screen.getByRole("alert"))

    let heading = screen.getByRole("heading", { name: /changelog/i })
    expect(heading).toBeInTheDocument()

    // Empty state
    server.resetHandlers()
    server.use(
      http.get("/changelog.json", () =>
        HttpResponse.json({ releases: [] })
      )
    )

    rerender(<ChangelogPage />)
    await waitFor(() => screen.getByText("No releases yet"))

    heading = screen.getByRole("heading", { name: /changelog/i })
    expect(heading).toBeInTheDocument()
  })

  it("skeleton has aria attributes for accessibility", async () => {
    server.use(
      http.get("/changelog.json", async () => {
        await new Promise((resolve) => setTimeout(resolve, 100))
        return HttpResponse.json(mockChangelogData)
      })
    )

    render(<ChangelogPage />)

    const status = screen.getByRole("status")
    expect(status).toHaveAttribute("aria-live", "polite")
    expect(status).toHaveAttribute("aria-label")

    const srOnly = screen.getByText(/loading changelog/i)
    expect(srOnly).toHaveClass("sr-only")
  })
})
