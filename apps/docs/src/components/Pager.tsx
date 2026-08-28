import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { Icon } from "@workspace/ui/components/icon"
import { cn } from "@workspace/ui/lib/utils"

import type { PagerLinks } from "../lib/navigation"

interface PagerProps extends PagerLinks {
  className?: string
}

export function Pager({ previous, next, className }: PagerProps) {
  if (!previous && !next) return null

  return (
    <nav
      aria-label="Documentation pagination"
      className={cn("mt-12 flex gap-4 border-t border-border pt-6", className)}
    >
      {previous ? (
        <a
          href={previous.route}
          rel="prev"
          className="group flex min-w-0 flex-1 items-center gap-3 rounded-lg bg-surface-sunken p-4 text-start transition-colors hover:bg-surface-interactive focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <Icon icon={ArrowLeft01Icon} size="md" className="shrink-0" />
          <span className="min-w-0">
            <span className="block text-xs text-text-secondary">Previous</span>
            <span className="block truncate text-sm font-medium text-text-primary">
              {previous.title}
            </span>
          </span>
        </a>
      ) : null}
      {next ? (
        <a
          href={next.route}
          rel="next"
          className="group ms-auto flex min-w-0 flex-1 items-center justify-end gap-3 rounded-lg bg-surface-sunken p-4 text-end transition-colors hover:bg-surface-interactive focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <span className="min-w-0">
            <span className="block text-xs text-text-secondary">Next</span>
            <span className="block truncate text-sm font-medium text-text-primary">
              {next.title}
            </span>
          </span>
          <Icon icon={ArrowRight01Icon} size="md" className="shrink-0" />
        </a>
      ) : null}
    </nav>
  )
}
