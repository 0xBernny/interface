// TODO(GF3-003): curated community tweets/testimonials (static content, no X API).
const CARDS = [
  { handle: "@trader_one", text: "TODO(GF3-003): testimonial copy." },
  { handle: "@trader_two", text: "TODO(GF3-003): testimonial copy." },
  { handle: "@trader_three", text: "TODO(GF3-003): testimonial copy." },
]

function SocialCard({ handle, text }: { handle: string; text: string }) {
  return (
    <div className="flex w-80 shrink-0 flex-col gap-3 rounded-20 border border-hairline border-gmx-slate-600 bg-gmx-slate-800 p-6">
      <div className="flex items-center gap-2">
        <span className="size-8 rounded-full bg-gmx-slate-650" aria-hidden="true" />
        <span className="text-14 font-medium text-white">{handle}</span>
      </div>
      <p className="text-14 text-gmx-slate-400">{text}</p>
    </div>
  )
}

export function SocialSlider() {
  const doubled = [...CARDS, ...CARDS]

  return (
    <div className="relative overflow-hidden">
      <div
        className="flex w-max gap-4 motion-safe:[animation:var(--animate-scroll)] motion-safe:hover:animate-pause"
      >
        {doubled.map((card, i) => (
          <SocialCard key={i} {...card} />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-transparent via-transparent to-gmx-slate-900" />
    </div>
  )
}
