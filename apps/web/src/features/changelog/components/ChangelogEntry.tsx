import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import type { ChangelogEntry as IChangelogEntry } from "../types"
import { typeToVariant, typeLabel } from "../utils"
import { HighlightedText } from "./HighlightedText"

interface ChangelogEntryProps {
  entry: IChangelogEntry
  highlight?: string
}

export function ChangelogEntry({ entry, highlight }: ChangelogEntryProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between py-3 border-b border-border last:border-b-0">
      {/* Left side: badge and text */}
      <div className="flex flex-col gap-2 min-w-0 flex-1">
        <div className="flex flex-wrap gap-2 items-start">
          <Badge
            variant={typeToVariant(entry.type) as any}
            size="sm"
            className="shrink-0"
          >
            {typeLabel(entry.type)}
          </Badge>
        </div>
        {/* Entry text with highlight support */}
        <p className="text-body text-text-secondary break-words">
          <HighlightedText text={entry.text} query={highlight} />
        </p>
      </div>

      {/* Right side: PR link - touch target 44×44 */}
      {entry.pr && (
        <div className="mt-2 sm:mt-0 sm:ml-4 shrink-0">
          <Button
            variant="link"
            size="sm"
            className="h-11 min-w-11 px-3 text-info hover:text-info/80 transition-colors"
            asChild
          >
            <a
              href={`https://github.com/SO4-Markets/interface/pull/${entry.pr}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center"
            >
              #{entry.pr}
            </a>
          </Button>
        </div>
      )}
    </div>
  )
}
