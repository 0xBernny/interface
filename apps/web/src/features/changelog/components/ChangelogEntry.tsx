import { Button } from "@workspace/ui/components/button"
import { HighlightedText } from "./HighlightedText"
import { ChangelogCategoryBadge } from "./ChangelogCategoryBadge"
import type { ChangelogEntry as IChangelogEntry } from "../types"

interface ChangelogEntryProps {
  entry: IChangelogEntry
  highlight?: string
}

export function ChangelogEntry({ entry, highlight }: ChangelogEntryProps) {
  return (
    <div className="flex flex-col gap-2 border-b border-border py-3 last:border-b-0 sm:flex-row sm:items-start sm:justify-between">
      {/* Left side: badge and text */}
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-start gap-2">
          <ChangelogCategoryBadge type={entry.type} breaking={entry.breaking} />
        </div>
        {/* Entry text with highlight support */}
        <p className="text-body break-words text-text-secondary">
          <HighlightedText text={entry.text} query={highlight} />
        </p>
      </div>

      {/* Right side: PR link - touch target 44×44 */}
      {entry.pr && (
        <div className="mt-2 shrink-0 sm:mt-0 sm:ml-4">
          <Button
            variant="link"
            size="sm"
            className="h-11 min-w-11 px-3 text-info transition-colors hover:text-info/80"
            render={
              <a
                href={`https://github.com/SO4-Markets/interface/pull/${entry.pr}`}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
            nativeButton={false}
          >
            #{entry.pr}
          </Button>
        </div>
      )}
    </div>
  )
}
