// TODO(GF3-003): swap in real partner/infra SVG logos.
const SPONSORS = ["Stellar", "Soroban", "Reflector", "Blend"]

export function SponsorsSection() {
  return (
    <section className="border-t border-hairline border-gmx-sponsors-border bg-gmx-light-150 px-4 py-20 text-gmx-slate-900 sm:px-10 sm:py-15">
      <div className="mx-auto flex max-w-300 flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-40 font-medium tracking-[-1.28px]">Supported by</p>
          <p className="mt-1 text-18 font-medium tracking-[-0.576px] text-gmx-slate-500">
            Stellar &amp; Soroban ecosystem partners
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {SPONSORS.map((name) => (
            <div
              key={name}
              className="flex h-20 items-center justify-center rounded-12 bg-white px-4 text-14 font-medium text-gmx-slate-900"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
