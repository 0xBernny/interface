import { useId, useState } from "react"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Text } from "@workspace/ui/components/text"
import { cn } from "@workspace/ui/lib/utils"

export type FaqItem = {
  q: string
  a: string
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      className={cn("shrink-0 transition-transform duration-200", open && "rotate-180")}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

function AccordionItem({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  return (
    <div className="border-b border-border/60 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-3 py-3 text-left"
      >
        <Text size="sm" weight="medium" render={<span />} className="leading-snug">
          {item.q}
        </Text>
        <ChevronIcon open={open} />
      </button>

      <div
        id={panelId}
        className={cn(
          "overflow-hidden transition-all duration-200",
          open ? "max-h-96 pb-3" : "max-h-0",
        )}
      >
        <Text size="xs" tone="muted" variant="leading">
          {item.a}
        </Text>
      </div>
    </div>
  )
}

type Props = {
  items: Array<FaqItem>
  title?: string
}

export function FaqAccordion({ items, title = "FAQ" }: Props) {
  return (
    <Card>
      <CardContent className="p-4">
        <Text size="xs" tone="muted" weight="semibold" variant="label" className="mb-1">
          {title}
        </Text>
        <div>
          {items.map((item) => (
            <AccordionItem key={item.q} item={item} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
