import { IconBox } from "./icon-box"
import { percentFormat } from "./utils/formatters"

export type PoolCardData = {
  name: string
  description: string
  apr: number | null
}

function CoinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="9" />
      <path d="M9 12h6M12 9v6" />
    </svg>
  )
}

export function PoolCard({ name, description, apr }: PoolCardData) {
  return (
    <div className="group relative flex h-50 w-full flex-1 flex-col justify-between overflow-hidden rounded-20 bg-gmx-slate-800 p-6 transition-transform duration-180 hover:-translate-y-1 lg:h-95 lg:max-w-96 lg:p-9">
      {/* TODO(GF3-003): replace with the real gradient cover + parallax lines + coin illustration */}
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,var(--color-gmx-blue-400)/0.15,transparent_60%)] transition-transform duration-300 group-hover:scale-105"
        aria-hidden="true"
      />

      <div className="relative">
        <IconBox>
          <CoinIcon />
        </IconBox>
        <h3 className="mt-6 text-24 font-medium tracking-[-0.896px] text-white lg:mt-9">{name}</h3>
        <p className="mt-2 text-14 text-gmx-slate-400">{description}</p>
      </div>

      <div className="relative text-14 text-gmx-slate-400">
        {apr === null ? "Accumulating..." : percentFormat(apr)}
      </div>
    </div>
  )
}
