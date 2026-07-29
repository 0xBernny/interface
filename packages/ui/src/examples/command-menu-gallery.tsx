import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Home01Icon,
  Search01Icon,
  Settings01Icon,
} from "@hugeicons/core-free-icons"

import { Button } from "@workspace/ui/components/button"
import { CommandMenu, type CommandMenuGroup } from "@workspace/ui/components/command-menu"
import { Kbd } from "@workspace/ui/components/kbd"

export function CommandMenuGallery() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [lastAction, setLastAction] = useState("No command selected")

  const groups: CommandMenuGroup[] = [
    {
      id: "navigation",
      label: "Navigation",
      items: [
        {
          id: "open-dashboard",
          label: "Open dashboard",
          description: "View account activity and positions",
          icon: <HugeiconsIcon icon={Home01Icon} strokeWidth={2} />,
          shortcut: ["⌘", "1"],
          onSelect: () => setLastAction("Opened dashboard"),
        },
        {
          id: "search-markets",
          label: "Search markets",
          description: "Find a market by name or symbol",
          icon: <HugeiconsIcon icon={Search01Icon} strokeWidth={2} />,
          shortcut: ["⌘", "K"],
          onSelect: () => setLastAction("Started market search"),
        },
      ],
    },
    {
      id: "preferences",
      label: "Preferences",
      items: [
        {
          id: "open-settings",
          label: "Open settings",
          description: "Manage application preferences",
          icon: <HugeiconsIcon icon={Settings01Icon} strokeWidth={2} />,
          shortcut: ["⌘", ","],
          onSelect: () => setLastAction("Opened settings"),
        },
      ],
    },
  ]

  return (
    <section className="flex max-w-xl flex-col gap-3 rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-sm font-medium">Command menu</h2>
          <p className="text-xs text-muted-foreground">A keyboard-first command surface.</p>
        </div>
        <Button type="button" variant="outline" onClick={() => setOpen(true)}>
          Open menu <Kbd>⌘ K</Kbd>
        </Button>
      </div>
      <p aria-live="polite" className="text-xs text-muted-foreground">
        {lastAction}
      </p>
      <CommandMenu
        open={open}
        onOpenChange={setOpen}
        query={query}
        onQueryChange={setQuery}
        groups={groups}
      />
    </section>
  )
}
