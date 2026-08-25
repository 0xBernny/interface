import { useEffect, useState, useCallback, useMemo } from "react"
import { useSearch } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import { Rss01Icon } from "@hugeicons/core-free-icons"
import { Icon } from "@workspace/ui/components/icon"
import { ErrorState, EmptyState } from "@workspace/ui/components/states"
import { LiveRegion, useAnnouncer } from "@workspace/ui/components/live-region"
import type { ChangelogData, ChangelogSearch } from "../types"
import { FilterBar } from "./FilterBar"
import { ReleaseSection } from "./ReleaseSection"
import { ChangelogSkeleton } from "./ChangelogSkeleton"
import { useNavigate } from "@tanstack/react-router"

function validateChangelogData(data: unknown): data is ChangelogData {
  if (!data || typeof data !== "object") return false
  const obj = data as Record<string, unknown>
  if (!Array.isArray(obj.releases)) return false
  return obj.releases.every(
    (r: unknown) =>
      r &&
      typeof r === "object" &&
      "version" in r &&
      "date" in r &&
      "yanked" in r &&
      "entries" in r &&
      Array.isArray((r as any).entries)
  )
}

export function ChangelogPage() {
  const search = useSearch({ from: "/changelog" }) as ChangelogSearch
  const navigate = useNavigate({ from: "/changelog" })
  const [data, setData] = useState<ChangelogData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchChangelog = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/changelog.json")
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to load changelog`)
      }
      const json = await res.json()
      if (!validateChangelogData(json)) {
        throw new Error("Invalid changelog format: missing or malformed releases")
      }
      setData(json)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchChangelog()
  }, [fetchChangelog])

  const handleFilterChange = (newSearch: ChangelogSearch) => {
    navigate({ search: newSearch })
  }

  // Live region announcements with debouncing
  const { message, announcementKey, announce } = useAnnouncer()

  const filteredReleases = data.releases.filter((release) => {
    const entries = release.entries.filter((entry) => {
      if (search.type && entry.type !== search.type) return false
      if (search.area && entry.area !== search.area) return false
      if (
        search.q &&
        !entry.text.toLowerCase().includes(search.q.toLowerCase())
      ) {
        return false
      }
      return true
    })
    return entries.length > 0
  })

  const activeFilterCount = [search.type, search.area, search.q].filter(
    Boolean
  ).length

  const isFiltered = activeFilterCount > 0

  // Announce filter results with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      const resultCount = filteredReleases.reduce(
        (sum, release) => sum + release.entries.length,
        0
      )
      announce(`${resultCount} result${resultCount !== 1 ? "s" : ""} found`)
    }, 300)

    return () => clearTimeout(timer)
  }, [filteredReleases, announce])

  // Debounced search parameter update
  useEffect(() => {
    // This is handled by the input onChange which calls handleFilterChange
    // No additional debouncing needed - the timer below debounces URL updates
  }, [search.q])
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="px-[var(--gutter-page-sm)] md:px-[var(--gutter-page-md)] lg:px-[var(--gutter-page-lg)] pt-6 md:pt-8 lg:pt-10 pb-4 md:pb-6 border-b border-border">
          <div className="max-w-4xl mx-auto flex flex-col gap-2">
            <div className="h-10 w-48 bg-muted rounded animate-pulse" />
            <div className="h-4 w-96 bg-muted rounded animate-pulse" />
          </div>
        </div>
        <div className="px-[var(--gutter-page-sm)] md:px-[var(--gutter-page-md)] lg:px-[var(--gutter-page-lg)] py-6 md:py-8 max-w-4xl mx-auto">
          <ChangelogSkeleton />
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="px-[var(--gutter-page-sm)] md:px-[var(--gutter-page-md)] lg:px-[var(--gutter-page-lg)] pt-6 md:pt-8 lg:pt-10 pb-4 md:pb-6 border-b border-border">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-display-sm md:text-display font-bold text-foreground mb-2">
              Changelog
            </h1>
            <p className="text-body text-text-secondary">
              Everything that shipped, newest first.
            </p>
          </div>
        </div>
        <div className="px-[var(--gutter-page-sm)] md:px-[var(--gutter-page-md)] lg:px-[var(--gutter-page-lg)] py-6 md:py-8 max-w-4xl mx-auto">
          <ErrorState
            title="Failed to load changelog"
            description={error}
            onRetry={fetchChangelog}
            retryLabel="Try again"
          />
        </div>
      </div>
    )
  }

  // Empty state
  if (!data || data.releases.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="px-[var(--gutter-page-sm)] md:px-[var(--gutter-page-md)] lg:px-[var(--gutter-page-lg)] pt-6 md:pt-8 lg:pt-10 pb-4 md:pb-6 border-b border-border">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-display-sm md:text-display font-bold text-foreground mb-2">
              Changelog
            </h1>
            <p className="text-body text-text-secondary">
              Everything that shipped, newest first.
            </p>
          </div>
        </div>
        <div className="px-[var(--gutter-page-sm)] md:px-[var(--gutter-page-md)] lg:px-[var(--gutter-page-lg)] py-6 md:py-8 max-w-4xl mx-auto">
          <EmptyState
            title="No releases yet"
            description="The changelog is empty. Releases will appear here as they ship."
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Page header with safe area padding */}
      <div className="px-[var(--gutter-page-sm)] md:px-[var(--gutter-page-md)] lg:px-[var(--gutter-page-lg)] pt-6 md:pt-8 lg:pt-10 pb-4 md:pb-6 border-b border-border">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-display-sm md:text-display font-bold text-foreground mb-2 break-words">
              Changelog
            </h1>
            <p className="text-body text-text-secondary">
              Everything that shipped, newest first.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-11 px-3 flex-shrink-0"
            asChild
          >
            <a href="/changelog.xml" className="flex items-center gap-2">
              <Icon>
                <Rss01Icon />
              </Icon>
              <span>RSS</span>
            </a>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="px-[var(--gutter-page-sm)] md:px-[var(--gutter-page-md)] lg:px-[var(--gutter-page-lg)] py-6 md:py-8 max-w-4xl mx-auto">
        {/* Live region for filter announcements */}
        <LiveRegion message={message} announcementKey={announcementKey} />

        {/* Filter region - landmark */}
        <region aria-labelledby="filter-heading" className="mb-6">
          <h2 id="filter-heading" className="sr-only">
            Filters and search
          </h2>
          <FilterBar
            search={search}
            onFilterChange={handleFilterChange}
            activeFilterCount={activeFilterCount}
          />
        </region>

        {/* Releases list */}
        {filteredReleases.length > 0 ? (
          <section aria-label="Release history" className="space-y-0">
            <ul role="list" className="space-y-0">
              {filteredReleases.map((release) => (
                <li key={release.version}>
                  <ReleaseSection
                    release={{
                      ...release,
                      entries: isFiltered
                        ? release.entries.filter((entry) => {
                            if (search.type && entry.type !== search.type)
                              return false
                            if (search.area && entry.area !== search.area)
                              return false
                            if (
                              search.q &&
                              !entry.text
                                .toLowerCase()
                                .includes(search.q.toLowerCase())
                            ) {
                              return false
                            }
                            return true
                          })
                        : release.entries,
                    }}
                    isFiltered={isFiltered}
                    highlight={search.q}
                  />
                </li>
              ))}
            </ul>
          </section>
        ) : (
          <div className="py-12 text-center">
            <p className="text-body text-text-secondary mb-2">
              No entries match your filters.
            </p>
            <Button
              variant="link"
              onClick={() => handleFilterChange({})}
              className="h-9 px-3"
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
