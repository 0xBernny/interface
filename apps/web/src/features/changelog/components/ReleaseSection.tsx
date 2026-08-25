import { CopyButton } from "@workspace/ui/components/copy-button"
import { formatDate } from "../utils"
import { releasePermalink, versionToAnchorId } from "../lib/version-anchor"
import { ChangelogEntry } from "./ChangelogEntry"
import type { Release } from "../types"

interface ReleaseSectionProps {
  release: Release
  isFiltered: boolean
  highlight?: string
}

export function ReleaseSection({
  release,
  isFiltered,
  highlight,
}: ReleaseSectionProps) {
  const anchorId = versionToAnchorId(release.version)
  const origin =
    typeof window === "undefined"
      ? "https://so4.market"
      : window.location.origin
  const permalink = releasePermalink(release.version, origin)

  return (
    <section
      id={anchorId}
      tabIndex={-1}
      className="mb-8 scroll-mt-20 border-b border-border pb-8 outline-none last:mb-0 last:border-b-0 last:pb-0 focus-visible:ring-2 focus-visible:ring-ring sm:mb-12 sm:pb-12"
    >
      {/* Release header: responsive layout */}
      <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:gap-4">
        {/* Version and date: stack on mobile, inline on desktop */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
          <div className="flex flex-col gap-1">
            {/* h2 for release - proper heading hierarchy */}
            <h2 className="text-page-title font-bold break-words text-foreground">
              {release.version}
            </h2>
            <p className="text-body-sm text-text-secondary">
              {formatDate(release.date)}
            </p>
          </div>

          {/* Permalink button: 44×44 touch target, keyboard accessible */}
          <CopyButton
            value={permalink}
            label={`Copy permalink for version ${release.version}`}
          />
        </div>

        {/* Version separator */}
        <hr className="border-t border-border" />
      </div>

      {/* Entries list */}
      <ul role="list" className="space-y-1">
        {release.entries.map((entry, idx) => (
          <li key={idx}>
            <ChangelogEntry entry={entry} highlight={highlight} />
          </li>
        ))}
      </ul>

      {isFiltered && (
        <p className="mt-4 text-caption text-text-tertiary">
          Filtered view — some entries hidden
        </p>
      )}
    </section>
  )
}
