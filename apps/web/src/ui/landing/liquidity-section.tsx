import { Link } from "@tanstack/react-router"
import { PoolCard } from "./pool-card"
import { useLandingStats } from "./use-landing-stats"
import { cleanFormatUsd } from "./utils/formatters"

// TODO(GF3-003): source from SO4's pools API/indexer once available; these
// mirror GMX's own example pools shape (name/description/APR) as placeholders.
const POOLS = [
  { name: "SO4", description: "Stake for rewards and governance rights", apr: null },
  { name: "SLV", description: "Steady returns without management", apr: 0.1465 },
  { name: "SM", description: "Invest with control over risk and reward", apr: 0.3582 },
]

export function LiquiditySection() {
  const stats = useLandingStats()

  return (
    <section className="bg-gmx-light-150 px-4 py-20 text-gmx-slate-900 sm:px-10 sm:py-30">
      <div className="mx-auto max-w-300">
        <h2 className="text-heading-2">
          {stats.liquidityTotal === null ? "-" : cleanFormatUsd(stats.liquidityTotal)} in liquidity
        </h2>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* TODO(GF3-003): real user count once the indexer exposes it */}
          <p className="text-18 font-medium tracking-[-0.896px] sm:text-28">Join our users earning real yield</p>
          <Link to="/earn" className="btn-landing inline-flex shrink-0 rounded-8 px-4 py-2.5 text-14">
            Start earning
          </Link>
        </div>

        <div className="mt-9 flex flex-col gap-4 lg:flex-row">
          {POOLS.map((pool) => (
            <PoolCard key={pool.name} {...pool} />
          ))}
        </div>
      </div>
    </section>
  )
}
