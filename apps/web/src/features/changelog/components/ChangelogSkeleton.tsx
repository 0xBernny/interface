import { Skeleton } from "@workspace/ui/components/skeleton"

export function ChangelogSkeleton() {
  return (
    <div
      className="space-y-8"
      role="status"
      aria-live="polite"
      aria-label="Loading changelog"
    >
      <span className="sr-only">Loading changelog entries…</span>

      {/* Filter bar skeleton */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={`chip-${i}`} className="h-9 w-20" />
          ))}
        </div>
        <Skeleton className="h-9 w-48 hidden md:block" />
      </div>

      {/* Release sections - 3 releases with consistent heights */}
      {Array.from({ length: 3 }).map((_, releaseIdx) => (
        <div key={`release-${releaseIdx}`} className="pb-8 border-b border-border">
          {/* Release header */}
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 sm:gap-4 mb-6">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-11 w-11 flex-shrink-0" />
          </div>

          {/* Version separator */}
          <Skeleton className="h-px w-full mb-6" />

          {/* Changelog entries - 3 per release */}
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((__, entryIdx) => (
              <div key={`entry-${entryIdx}`} className="py-3 flex flex-col sm:flex-row gap-3">
                <div className="flex-1 min-w-0 space-y-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
                <Skeleton className="h-11 w-12 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
