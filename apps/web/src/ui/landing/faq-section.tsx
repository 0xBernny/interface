import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion"
import type { ReactNode } from "react"

// Same shape as GMX (first answer bulleted, second numbered). Every claim
// here is checked against what the app actually does — see README.md and
// the linked routes — rather than adapted from GMX's own answers, since SO4
// is a different protocol with a different feature set.
const FAQS: Array<{ id: string; question: string; answer: ReactNode }> = [
  {
    id: "yield",
    question: "What makes SO4 a good place to earn yield on my crypto?",
    answer: (
      <ul className="list-disc space-y-1 pl-5">
        <li>Provide liquidity to the GM pools and earn trading fees and funding, paid in real time.</li>
        <li>Stake SO4 for GLV exposure — a diversified position across every pool, one token.</li>
        <li>No lockups: withdraw whenever the pool has capacity, same block.</li>
      </ul>
    ),
  },
  {
    id: "get-started",
    question: "How do I get started on SO4?",
    answer: (
      <ol className="list-decimal space-y-1 pl-5">
        <li>Connect a Stellar wallet — no signup, no email.</li>
        <li>Open Trade and pick BTC, ETH, or XLM to go long or short.</li>
        <li>Or open Earn to deposit into a pool instead of trading directly.</li>
      </ol>
    ),
  },
  {
    id: "cost-efficiency",
    question: "What makes SO4 cost-efficient compared to other perpetual platforms?",
    answer: (
      <p>
        Every position is filled against a single unified pool instead of a fragmented order book,
        so fills don&apos;t depend on order book depth. Fees go to the liquidity that backs your
        trade, not to a separate market maker spread.
      </p>
    ),
  },
  {
    id: "integrate",
    question: "Can I build on top of SO4 or integrate it into my DeFi app?",
    answer: (
      <p>
        SO4 runs on public Soroban contracts — ExchangeRouter, DataStore, SyntheticsReader, and
        OrderVault. There&apos;s no published SDK or integration docs yet; check the{" "}
        <a
          href="https://github.com/SO4-Markets/interface"
          target="_blank"
          rel="noreferrer"
          className="text-gmx-blue-400 underline-offset-4 hover:underline"
        >
          source
        </a>{" "}
        in the meantime.
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
