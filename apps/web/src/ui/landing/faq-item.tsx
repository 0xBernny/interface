import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Icon } from "@workspace/ui/components/icon"
import { Cancel01Icon } from "@hugeicons/core-free-icons"
import type { ReactNode } from "react"

export function FaqItem({ question, answer }: { question: string; answer: ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-hairline border-gmx-slate-600 py-7">
      <Button
        type="button"
        variant="ghost"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="h-auto w-full justify-between gap-4 rounded-none bg-transparent p-0 text-left text-heading-4 text-white hover:bg-transparent hover:text-gmx-blue-400"
      >
        {question}
        <Icon
          icon={Cancel01Icon}
          size="md"
          className={`shrink-0 text-gmx-slate-500 transition-transform duration-180 ${open ? "" : "rotate-45"}`}
        />
      </Button>
      <div className={open ? "faq-row-open" : "faq-row-closed"}>
        <div className="overflow-hidden">
          <div className="pt-4 text-description">{answer}</div>
        </div>
      </div>
    </div>
  )
}
