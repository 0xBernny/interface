import { formatUsd } from "@/shared/lib/format"

type Props = {
  volume24h?: number | null
  openInterest?: number | null
  markPrice?: number | null
  indexPrice?: number | null
}

export function MarketStatsHeader({
  volume24h,
  openInterest,
  markPrice,
  indexPrice,
}: Props) {
  const stats = [
    ["24h Volume", formatUsd(volume24h, { compact: true })],
    ["Open Interest", formatUsd(openInterest, { compact: true })],
    ["Mark Price", formatUsd(markPrice)],
    ["Index Price", formatUsd(indexPrice)],
  ]

  return (
    <dl className="flex items-center gap-6 border-b border-border px-3 py-2">
      {stats.map(([label, value]) => (
        <div key={label}>
          <dt className="text-xs text-muted-foreground">{label}</dt>
          <dd className="font-mono text-sm">{value}</dd>
        </div>
      ))}
    </dl>
  )
}
