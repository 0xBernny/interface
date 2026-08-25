import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import type { Release } from "../types"
import { formatDate, createAnchor, typeToVariant, typeLabel } from "../utils"
import { ChangelogEntry } from "./ChangelogEntry"
import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { Icon } from "@workspace/ui/components/icon"
import { useState } from "react"

interface ReleaseSectionProps {
  release: Release
  isFiltered: boolean
  highlight?: string
}

export function ReleaseSection({ release, isFiltered, highlight }: ReleaseSectionProps) {
  const [copied, setCopied] = useState(false)
  const anchor = createAnchor(release.version)

  const handleCopyPermalink = () => {
    const url = `${window.location.origin}/changelog${anchor}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section
      id={anchor.slice(1)}
      className="mb-8 sm:mb-12 pb-8 sm:pb-12 border-b border-border last:border-b-0 last:mb-0 last:pb-0"
    >
      {/* Release header: responsive layout */}
      <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8">
        {/* Version and date: stack on mobile, inline on desktop */}
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 sm:gap-4">
          <div className="flex flex-col gap-1">
            {/* h2 for release - proper heading hierarchy */}
            <h2 className="text-page-title font-bold text-foreground break-words">
              {release.version}
            </h2>
            <p className="text-body-sm text-text-secondary">
              {formatDate(release.date)}
            </p>
          </div>

          {/* Permalink button: 44×44 touch target, keyboard accessible */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyPermalink}
            className="h-11 w-11 p-0 flex-shrink-0 justify-center items-center focus-visible:ring-2"
            title={`Copy permalink for version ${release.version}`}
            aria-label={`Copy permalink for version ${release.version}`}
          >
            <Icon>
              {copied ? <Tick02Icon className="text-success" /> : <Copy01Icon />}
            </Icon>
          </Button>
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
        <p className="text-caption text-text-tertiary mt-4">
          Filtered view — some entries hidden
        </p>
      )}
    </section>
  )
}
