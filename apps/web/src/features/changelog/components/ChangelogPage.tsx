import { useEffect, useMemo } from "react"
import { RssIcon } from "@hugeicons/core-free-icons"
import { AppShell } from "@workspace/ui/components/app-shell"
import { Button } from "@workspace/ui/components/button"
import { Icon } from "@workspace/ui/components/icon"
import { LiveRegion, useAnnouncer } from "@workspace/ui/components/live-region"
import { PageHeader } from "@workspace/ui/components/page-header"
import { EmptyState, ErrorState } from "@workspace/ui/components/states"
import { useChangelog } from "../hooks/use-changelog"
import { useReleaseHash } from "../hooks/use-release-hash"
import { ChangelogSkeleton } from "./ChangelogSkeleton"
import { FilterBar } from "./FilterBar"
import { ReleaseSection } from "./ReleaseSection"
import type { ChangelogSearch } from "../types"
import { Navbar } from "@/ui/Navbar"

const INITIAL_RELEASE_LIMIT = 10

interface ChangelogPageProps {
  search?: ChangelogSearch
  onSearchChange?: (search: ChangelogSearch) => void
}

export function ChangelogPage({
  search = {},
  onSearchChange = () => {},
}: ChangelogPageProps) {
  const changelog = useChangelog()
  const { message, announcementKey, announce } = useAnnouncer()
  const releases = useMemo(
    () => changelog.data?.releases.slice(0, INITIAL_RELEASE_LIMIT) ?? [],
    [changelog.data]
  )
  const activeFilterCount = [search.type, search.area, search.q].filter(
    Boolean
  ).length
  const isFiltered = activeFilterCount > 0

  const filteredReleases = useMemo(
    () =>
      releases
        .map((release) => ({
          ...release,
          entries: release.entries.filter((entry) => {
            if (search.type && entry.type !== search.type) return false
            if (search.area && entry.area !== search.area) return false
            return !(
              search.q &&
              !entry.text.toLowerCase().includes(search.q.toLowerCase())
            )
          }),
        }))
        .filter((release) => release.entries.length > 0),
    [releases, search.area, search.q, search.type]
  )

  useReleaseHash(changelog.isSuccess)

  useEffect(() => {
    if (!changelog.isSuccess) return
    const resultCount = filteredReleases.reduce(
      (sum, release) => sum + release.entries.length,
      0
    )
    const timer = window.setTimeout(
      () =>
        announce(`${resultCount} result${resultCount === 1 ? "" : "s"} found`),
      300
    )
    return () => window.clearTimeout(timer)
  }, [announce, changelog.isSuccess, filteredReleases])

  return (
    <AppShell navbar={<Navbar variant="app" />} maxWidth="3xl">
      <PageHeader
        title="Changelog"
        description="Everything that shipped, newest first."
        actions={
          <Button
            variant="ghost"
            size="sm"
            render={<a href="/changelog.xml" />}
            nativeButton={false}
          >
            <Icon icon={RssIcon} />
            RSS
          </Button>
        }
      />

      {changelog.isPending && <ChangelogSkeleton />}

      {changelog.isError && (
        <ErrorState
          title="Failed to load changelog"
          description={changelog.error.message}
          onRetry={() => void changelog.refetch()}
          retryLabel="Try again"
        />
      )}

      {changelog.isSuccess && releases.length === 0 && (
        <EmptyState
          title="No releases yet"
          description="The changelog is empty. Releases will appear here as they ship."
        />
      )}

      {changelog.isSuccess && releases.length > 0 && (
        <>
          <LiveRegion message={message} announcementKey={announcementKey} />
          <section aria-labelledby="changelog-filters" className="mb-6">
            <h2 id="changelog-filters" className="sr-only">
              Filters and search
            </h2>
            <FilterBar
              search={search}
              onFilterChange={onSearchChange}
              activeFilterCount={activeFilterCount}
            />
          </section>

          {filteredReleases.length > 0 ? (
            <section aria-label="Release history">
              <ul role="list">
                {filteredReleases.map((release) => (
                  <li key={release.version}>
                    <ReleaseSection
                      release={release}
                      isFiltered={isFiltered}
                      highlight={search.q}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ) : (
            <div className="py-12 text-center">
              <p className="mb-2 text-sm text-text-secondary">
                No entries match your filters.
              </p>
              <Button variant="link" onClick={() => onSearchChange({})}>
                Clear all filters
              </Button>
            </div>
          )}
        </>
      )}
    </AppShell>
  )
}
