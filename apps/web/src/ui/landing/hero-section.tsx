import { Link } from "@tanstack/react-router"
import { AnimatedTitle } from "./animated-title"
import { FeatureGrid } from "./feature-grid"
import { useLandingStats } from "./use-landing-stats"
import { shortFormat, shortFormatUsd } from "./utils/formatters"

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-12 text-gmx-slate-400 sm:text-14">{label}</div>
      <div className="mt-1 text-30 font-medium tracking-tight text-white sm:text-40">{value}</div>
    </div>
  )
}

function VolumeStat({ value }: { value: string }) {
  return (
    <a
      href="#"
      target="_blank"
      rel="noreferrer"
      className="group"
    >
      <div className="flex items-center gap-1 text-12 text-gmx-slate-400 transition-colors duration-180 group-hover:text-gmx-blue-300 sm:text-14">
        Total volume
        <span className="transition-transform duration-180 group-hover:translate-x-0.5">→</span>
      </div>
      <div className="mt-1 text-30 font-medium tracking-tight text-white sm:text-40">{value}</div>
    </a>
  )
}

export function HeroSection() {
  const stats = useLandingStats()

  return (
    <section className="relative flex h-[640px] flex-col justify-end overflow-hidden bg-gmx-slate-900 px-4 py-15 sm:h-[860px] sm:px-10 sm:py-20">
      {/* TODO(GF3-003): replace with the real chain-constellation background animation */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,var(--color-gmx-slate-700),transparent_60%)]" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-300">
        <h1 className="text-heading-1 text-white">
          Trade <AnimatedTitle /> from your wallet
        </h1>

        <div className="mt-7 flex flex-col gap-6 border-b border-hairline border-gmx-slate-600 pb-7 sm:flex-row sm:items-end sm:justify-between sm:pb-9">
          <Link to="/trade" className="btn-landing flex w-full items-center justify-center rounded-8 px-6 py-3 text-14 sm:w-[200px]">
            Trade now
          </Link>

          <p className="text-subheadline sm:w-[226px]">
            Decentralised permissionless on-chain exchange with deep liquidity and low costs, live
            since 2026.
          </p>

          <div className="flex gap-9 sm:gap-15">
            <Stat label="Traders" value={stats.traders === null ? "-" : shortFormat(stats.traders)} />
            <Stat
              label="Open interest"
              value={stats.openInterest === null ? "-" : shortFormatUsd(stats.openInterest)}
            />
            <VolumeStat value={stats.totalVolume === null ? "-" : shortFormatUsd(stats.totalVolume)} />
          </div>
        </div>

        <FeatureGrid />
      </div>
    </section>
  )
}
