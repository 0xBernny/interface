import { createFileRoute } from "@tanstack/react-router"
import { ChangelogPage } from "../features/changelog/components/ChangelogPage"
import { validateChangelogSearch } from "../features/changelog/search"

export const Route = createFileRoute("/changelog")({
  component: ChangelogPage,
  validateSearch: validateChangelogSearch,
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
