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
    <section className="relative overflow-hidden bg-gmx-slate-900">
      {/* TODO(GF3-003): replace with the real chain-constellation background animation */}
      <div
        className="absolute inset-x-0 top-0 h-160 bg-[radial-gradient(circle_at_50%_20%,var(--color-gmx-slate-700),transparent_60%)] sm:h-215"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-160 w-full max-w-300 flex-col justify-end px-4 pt-20 pb-15 sm:min-h-215 sm:px-10 sm:pt-24 sm:pb-20">
        <h1 className="text-heading-1 text-white">
          Trade <AnimatedTitle /> from your wallet
        </h1>

        {/* The CTA + subheadline + 3-stat group only fit on one line once
            there is desktop room for them, so the row is deferred to `lg`.
            Between 640 and 1023 the stats sit on their own line instead of
            being squeezed into a third column (which wrapped every stat
            label onto three lines at 768). */}
        <div className="mt-7 flex flex-col gap-6 border-b border-hairline border-gmx-slate-600 pb-7 lg:flex-row lg:items-end lg:justify-between lg:pb-9">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-9">
            <Link to="/trade" className="btn-landing flex w-full items-center justify-center rounded-8 px-6 py-3 text-14 sm:w-50">
              Trade now
            </Link>

            <p className="text-subheadline sm:w-56.5">
              Decentralised permissionless on-chain exchange with deep liquidity and low costs, live
              since 2026.
            </p>
          </div>

          <div className="flex gap-9 sm:gap-15">
            <Stat label="Traders" value={stats.traders === null ? "-" : shortFormat(stats.traders)} />
            <Stat
              label="Open interest"
              value={stats.openInterest === null ? "-" : shortFormatUsd(stats.openInterest)}
            />
            <VolumeStat value={stats.totalVolume === null ? "-" : shortFormatUsd(stats.totalVolume)} />
          </div>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-300 px-4 sm:px-10">
        <FeatureGrid />
      </div>
    </section>
  )
}
