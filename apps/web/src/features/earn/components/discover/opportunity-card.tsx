import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Stat } from "@workspace/ui/components/stat"
import { Text } from "@workspace/ui/components/text"
import { cn } from "@workspace/ui/lib/utils"
import { formatPct, formatUsd } from "@/shared/lib/format"
import { TokenIcon } from "@/shared/components/TokenIcon"

export type OpportunityCardProps = {
  name: string
  tokens: string[]
  apy: number
  tvlUsd: number
  isAvailable?: boolean
  onAction?: () => void
  actionLabel?: string
}

export function OpportunityCard({
  name,
  tokens,
  apy,
  tvlUsd,
  isAvailable = true,
  onAction,
  actionLabel = "Earn",
}: OpportunityCardProps) {
  return (
    <Card className={cn("transition-colors", !isAvailable && "opacity-60")}>
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {tokens.map((symbol, i) => (
                <TokenIcon
                  key={`${symbol}-${i}`}
                  symbol={symbol}
                  size={28}
                  className="ring-card"
                />
              ))}
            </div>
            <Text size="lg" weight="semibold" render={<span />}>
              {name}
            </Text>
          </div>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-4">
          <Stat
            label="APR"
            value={formatPct(apy, { sign: false })}
            role="positive"
            size="md"
          />
          <Stat
            label="TVL"
            value={formatUsd(tvlUsd, { compact: true })}
            role="muted"
            size="md"
          />
        </div>

        <Button
          size="lg"
          className="w-full"
          disabled={!isAvailable}
          onClick={() => {
            if (isAvailable) onAction?.()
          }}
        >
          {isAvailable ? actionLabel : "Coming Soon"}
        </Button>
      </CardContent>
    </Card>
  )
}
