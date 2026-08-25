import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion"
import type { ReactNode } from "react"

// TODO(GF3-003): real copy — same shape as GMX (first answer bulleted,
// second numbered), SO4-specific wording.
const FAQS: Array<{ id: string; question: string; answer: ReactNode }> = [
  {
    id: "yield",
    question: "What makes so4 one of the best places to earn yield on my crypto?",
    answer: (
      <ul className="list-disc space-y-1 pl-5">
        <li>TODO(GF3-003): reason one</li>
        <li>TODO(GF3-003): reason two</li>
        <li>TODO(GF3-003): reason three</li>
      </ul>
    ),
  },
  {
    id: "get-started",
    question: "How do I get started on so4?",
    answer: (
      <ol className="list-decimal space-y-1 pl-5">
        <li>TODO(GF3-003): step one</li>
        <li>TODO(GF3-003): step two</li>
        <li>TODO(GF3-003): step three</li>
      </ol>
    ),
  },
  {
    id: "cost-efficiency",
    question: "What makes so4 more cost-efficient than other perpetual platforms?",
    answer: <p>TODO(GF3-003): answer copy.</p>,
  },
  {
    id: "integrate",
    question: "Can I build on top of so4 or integrate it into my DeFi app?",
    answer: (
      <p>
        TODO(GF3-003): answer copy, with a link to{" "}
        <a href="#" className="text-gmx-blue-400 underline-offset-4 hover:underline">
          developer docs
        </a>
        .
      </p>
    ),
  },
]

export function FaqSection() {
  return (
    <section className="bg-gmx-slate-900 px-4 py-20 sm:px-10 sm:py-30">
      <div className="mx-auto flex max-w-300 flex-col gap-9 lg:flex-row lg:gap-30">
        <h2 className="text-heading-2 text-white">FAQ</h2>

        {/* The shared accordion already implements GMX's expand mechanic —
            a grid-rows 0fr→1fr transition, no JS height measurement — plus
            the aria-controls/labelledby wiring and focus-visible ring. Only
            the landing's typography and hairline rules are restyled here. */}
        <Accordion type="single" collapsible className="lg:w-200">
          {FAQS.map(({ id, question, answer }) => (
            <AccordionItem
              key={id}
              value={id}
              className="border-b border-hairline border-gmx-slate-600 last:border-b-hairline"
            >
              <AccordionTrigger
                headingLevel={3}
                className="py-7 text-heading-4 text-white hover:text-gmx-blue-400 focus-visible:ring-gmx-blue-400/40 [&_svg]:size-6 [&_svg]:text-gmx-slate-500"
              >
                {question}
              </AccordionTrigger>
              <AccordionContent className="text-description">
                <div className="pt-4 pb-7">{answer}</div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
