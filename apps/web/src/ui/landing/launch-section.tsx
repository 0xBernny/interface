import { Link } from "@tanstack/react-router"

// TODO(GF3-003): confirm the final network list SO4 settles on and swap in
// real chain logos.
const NETWORKS = [
  { name: "Stellar" },
  { name: "Soroban" },
]

function LaunchButton({ name }: { name: string }) {
  return (
    <a
      href="#"
      className="flex items-center justify-between rounded-8 border border-hairline border-gmx-slate-600/20 bg-white px-4 py-3.5 text-gmx-slate-900 shadow-sm transition-colors duration-180 hover:bg-gmx-light-150"
    >
      <span className="flex items-center gap-3">
        <span className="flex size-8 items-center justify-center rounded-full bg-gmx-light-150 text-12 font-medium">
          {name.slice(0, 1)}
        </span>
        <span className="text-14 font-medium">{name}</span>
      </span>
      <span aria-hidden="true">→</span>
    </a>
  )
}

export function LaunchSection() {
  return (
    <section className="bg-white px-4 py-20 text-gmx-slate-900 sm:px-10 sm:py-30">
      <div className="mx-auto flex max-w-300 flex-col gap-6 lg:flex-row">
        <div className="lg:w-1/2">
          <h2 className="text-heading-2">Runs entirely on public chains</h2>
          <p className="mt-4 text-18 text-gmx-slate-500">
            Operates on open, permissionless networks to ensure transparency, decentralization, and
            unrestricted access.
          </p>
          <Link to="/trade" className="btn-landing mt-6 inline-flex rounded-8 px-4 py-2.5 text-14">
            Open app
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:w-1/2 lg:grid-cols-2">
          {NETWORKS.map((n) => (
            <LaunchButton key={n.name} name={n.name} />
          ))}
        </div>
      </div>
    </section>
  )
}
