import { FaqItem } from "./faq-item"

// TODO(GF3-003): real copy — same shape as GMX (first answer bulleted,
// second numbered), SO4-specific wording.
const FAQS: Array<{ question: string; answer: React.ReactNode }> = [
  {
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
    question: "What makes so4 more cost-efficient than other perpetual platforms?",
    answer: <p>TODO(GF3-003): answer copy.</p>,
  },
  {
    question: "Can I build on top of so4 or integrate it into my DeFi app?",
    answer: (
      <p>
        TODO(GF3-003): answer copy, with a link to{" "}
        <a href="#" className="text-gmx-blue-400">
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
        <div className="flex flex-col gap-3 lg:w-[800px]">
          {FAQS.map((faq) => (
            <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  )
}
