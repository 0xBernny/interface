import { Alert } from "@workspace/ui/components/alert"
import { Card } from "@workspace/ui/components/card"
import { NumericText } from "@workspace/ui/components/numeric"
import { Text } from "@workspace/ui/components/text"
import { getNextTier, getTierByLevel } from "../../data/tiers"
import { TierBadge } from "./tier-badge"
import { formatUsd } from "@/shared/lib/format"

type Props = {
  tier: 1 | 2 | 3
  volumeUsd: number
}

export function TierProgress({ tier, volumeUsd }: Props) {
  const current = getTierByLevel(tier)
  const next = getNextTier(tier)

  if (!next) {
    return (
      <Alert variant="warning" aria-label="tier progress" className="items-center py-2.5">
        <TierBadge tier={current} />
        <Text size="sm" weight="medium" render={<span />}>
          Maximum tier reached!
        </Text>
      </Alert>
    )
  }

  const progress = Math.min((volumeUsd / next.minVolumeUsd) * 100, 100)
  const remaining = Math.max(next.minVolumeUsd - volumeUsd, 0)

  return (
    <Card
      role="status"
      aria-label="tier progress"
      className="rounded-lg px-4 py-3"
    >
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <TierBadge tier={current} />
          <Text size="xs" tone="muted" render={<span />}>
            →
          </Text>
          <TierBadge tier={next} />
        </div>
        <NumericText role="muted" size="xs" aria-label="remaining volume">
          {formatUsd(remaining, { compact: true })} more needed
        </NumericText>
      </div>
      <div
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`progress to ${next.label}`}
        className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
      >
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </Card>
  )
}
