import { createFileRoute } from "@tanstack/react-router"
import { ChangelogPage } from "../features/changelog/components/ChangelogPage"
import type { ChangelogSearch } from "../features/changelog/types"

export const Route = createFileRoute("/changelog")({
  component: ChangelogPage,
  validateSearch: (search: Record<string, unknown>): ChangelogSearch => ({
    type:
      search.type === "added" ||
      search.type === "changed" ||
      search.type === "deprecated" ||
      search.type === "removed" ||
      search.type === "fixed" ||
      search.type === "security"
        ? search.type
        : undefined,
    area:
      [
        "trade",
        "pools",
        "earn",
        "referrals",
        "faucet",
        "wallet",
        "docs",
        "ci",
        "internal",
      ].includes(search.area as string)
        ? (search.area as any)
        : undefined,
    q: typeof search.q === "string" ? search.q : undefined,
  }),
})
