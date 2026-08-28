import React from "react"
import { cn } from "@workspace/ui/lib/utils"

export interface TocEntry {
  title: string
  id: string
  level?: number
}

export interface TocProps {
  entries: TocEntry[]
  activeId?: string
  className?: string
}

export function Toc({ entries, activeId, className }: TocProps) {
  if (entries.length === 0) return null

  return (
    <nav
      aria-label="Table of contents"
      className={cn("w-56 flex-shrink-0 text-sm space-y-3 p-4 border-l border-border", className)}
    >
      <h4 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
        On this page
      </h4>
      <ul className="space-y-2">
        {entries.map((entry) => {
          const isActive = activeId === entry.id
          return (
            <li
              key={entry.id}
              className={cn(entry.level === 3 ? "pl-3" : entry.level === 4 ? "pl-6" : "")}
            >
              <a
                href={`#${entry.id}`}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "block text-sm transition-colors hover:text-text-primary",
                  isActive
                    ? "text-text-accent font-semibold"
                    : "text-text-secondary font-normal",
                )}
              >
                {entry.title}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
