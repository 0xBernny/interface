import { Quarter } from "./quarter"
import type { QuarterData } from "./quarter"

// TODO(GF3-003): real milestones/dates for SO4.
const QUARTERS: Array<QuarterData> = [
  {
    label: "Q1",
    items: [
      { text: "Testnet launch", completed: true },
      { text: "Core protocol audit", completed: true },
    ],
    lastCompleted: true,
  },
  {
    label: "Q2",
    items: [
      { text: "Mainnet launch", completed: false },
      { text: "Referrals program", completed: false },
    ],
  },
  {
    label: "Q3",
    items: [
      { text: "Cross-margin", completed: false },
      { text: "Additional markets", completed: false },
    ],
  },
  {
    label: "Q4",
    items: [
      { text: "Governance", completed: false },
      { text: "Ecosystem grants", completed: false },
    ],
  },
]

export function RoadmapSection() {
  return (
    <section className="bg-gmx-slate-900 px-4 pb-20 sm:px-10 sm:pb-30">
      <div className="mx-auto max-w-300">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-heading-2 text-white">Roadmap</h2>
          {/* TODO(GF3-003): link to the real dev-plan writeup */}
          <a
            href="#"
            className="btn-landing hidden shrink-0 rounded-8 px-4 py-2.5 text-14 sm:inline-flex"
          >
            Read more
          </a>
        </div>

        {/* tabIndex makes the horizontal scroller reachable by keyboard —
            a scroll container is only arrow-key scrollable once focused,
            and without this the roadmap is unreachable without a pointer.
            role/aria-label give it a name in the a11y tree now that it is
            a focus stop. */}
        <div
          className="mt-9 flex gap-6 overflow-x-scroll scrollbar-hide focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gmx-blue-400"
          tabIndex={0}
          role="group"
          aria-label="Roadmap timeline, scrollable horizontally"
        >
          {QUARTERS.map((q) => (
            <Quarter key={q.label} {...q} />
          ))}
        </div>

        <a href="#" className="btn-landing mt-6 flex w-full items-center justify-center rounded-8 px-4 py-2.5 text-14 sm:hidden">
          Read more
        </a>
      </div>
    </section>
  )
}
