import { createFileRoute } from "@tanstack/react-router"
import { ChangelogPage } from "../features/changelog/components/ChangelogPage"
import {
  isChangelogArea,
  isChangelogEntryType,
} from "../features/changelog/lib/changelog-client"
import type { ChangelogSearch } from "../features/changelog/types"

export const Route = createFileRoute("/changelog")({
  component: ChangelogRoute,
  validateSearch: (search: Record<string, unknown>): ChangelogSearch => ({
    type: isChangelogEntryType(search.type) ? search.type : undefined,
    area: isChangelogArea(search.area) ? search.area : undefined,
    q: typeof search.q === "string" ? search.q : undefined,
  }),
})

function ChangelogRoute() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

  return (
    <ChangelogPage
      search={search}
      onSearchChange={(nextSearch) => void navigate({ search: nextSearch })}
    />
  )
}
