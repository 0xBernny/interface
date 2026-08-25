import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { HttpResponse, http } from "msw"
import { ChangelogPage } from "./components/ChangelogPage"
import { server } from "@/test/msw/server"

vi.mock("@/ui/Navbar", () => ({
  Navbar: () => <nav aria-label="Primary" />,
}))

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

beforeEach(() => {
  server.use(
    http.get("/changelog.json", () => HttpResponse.json(mockChangelogData))
  )
})

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <ChangelogPage />
    </QueryClientProvider>
  )
}

describe("ChangelogPage - States", () => {
  it("renders skeleton while loading", () => {
    server.use(
      http.get("/changelog.json", async () => {
        await new Promise((resolve) => setTimeout(resolve, 100))
        return HttpResponse.json(mockChangelogData)
      })
    )

    renderPage()

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

    renderPage()

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
    renderPage()

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

    expect(callCount).toBeGreaterThanOrEqual(2)
  })

  it("renders empty state for zero releases", async () => {
    server.use(
      http.get("/changelog.json", () => {
        return HttpResponse.json({ releases: [] })
      })
    )

    renderPage()

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

    renderPage()

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

    renderPage()

    await waitFor(() => {
      const alert = screen.getByRole("alert")
      expect(alert).toBeInTheDocument()
      expect(alert).toHaveTextContent("Invalid changelog format")
    })
  })

  it("displays loaded content after successful fetch", async () => {
    renderPage()

    await waitFor(() => {
      expect(screen.getByText("0.4.0")).toBeInTheDocument()
      expect(
        screen.getByText("Trigger orders on the trade panel.")
      ).toBeInTheDocument()
    })
  })

  it("bounds the initial page to the ten newest releases", async () => {
    server.use(
      http.get("/changelog.json", () =>
        HttpResponse.json({
          releases: Array.from({ length: 11 }, (_, index) => ({
            version: `1.${10 - index}.0`,
            date: "2026-08-24",
            yanked: false,
            entries: [
              {
                type: "added",
                area: "trade",
                text: `Release ${10 - index}.`,
                pr: index + 1,
                breaking: false,
              },
            ],
          })),
        })
      )
    )

    renderPage()

    expect(await screen.findByText("1.10.0")).toBeInTheDocument()
    expect(screen.queryByText("1.0.0")).not.toBeInTheDocument()
  })

  it("copies an absolute release permalink", async () => {
    const user = userEvent.setup()
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    })
    renderPage()

    await user.click(
      await screen.findByRole("button", {
        name: "Copy permalink for version 0.4.0",
      })
    )

    expect(writeText).toHaveBeenCalledWith(
      "http://localhost:3000/changelog#v0-4-0"
    )
  })

  it("preserves header across all states", async () => {
    // Error state
    server.use(http.get("/changelog.json", () => HttpResponse.error()))

    const { unmount } = renderPage()
    await waitFor(() => screen.getByRole("alert"))

    let heading = screen.getByRole("heading", { name: /changelog/i })
    expect(heading).toBeInTheDocument()

    // Empty state
    server.resetHandlers()
    server.use(
      http.get("/changelog.json", () => HttpResponse.json({ releases: [] }))
    )

    unmount()
    renderPage()
    await waitFor(() => screen.getByText("No releases yet"))

    heading = screen.getByRole("heading", { name: /changelog/i })
    expect(heading).toBeInTheDocument()
  })

  it("skeleton has aria attributes for accessibility", () => {
    server.use(
      http.get("/changelog.json", async () => {
        await new Promise((resolve) => setTimeout(resolve, 100))
        return HttpResponse.json(mockChangelogData)
      })
    )

    renderPage()

    const status = screen.getByRole("status")
    expect(status).toHaveAttribute("aria-live", "polite")
    expect(status).toHaveAttribute("aria-label")

    const srOnly = screen.getByText(/loading changelog/i)
    expect(srOnly).toHaveClass("sr-only")
  })
})
