import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { Stat } from "@workspace/ui/components/stat"
import { Heading, Text } from "@workspace/ui/components/text"
import { DistributionsTable, type DistributionRow } from "./distributions-table"

// TODO: Replace with live data fetched from Stellar event log or subgraph:
//   - Query RewardsDistributor.Distribute events for connected account
//   - Paginate by epoch (weekly snapshots stored in DataStore)
//   - Fields: epochId, timestamp, tokenAmount, tokenAddress, txHash
const MOCK_DISTRIBUTIONS: DistributionRow[] = []

const SCHEDULE_FACTS = [
  { label: "Distribution cycle", value: "Weekly" },
  { label: "Fee allocation", value: "70% to stakers" },
  { label: "Remaining", value: "27% Treasury" },
  { label: "Protocol", value: "3% team" },
]

function InfoCard() {
  return (
    <Card>
      <CardContent>
        <Heading level={3} className="mb-2">
          Fee Distribution Schedule
        </Heading>
        <Text size="sm" tone="muted" variant="leading">
          Protocol fees are collected continuously and distributed weekly to SO4 stakers and
          liquidity providers. Your share is proportional to your staking power (staked amount ×
          duration multiplier). USDC fees are distributed directly; platform fees are used for
          buybacks and distributed as esSO4.
        </Text>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {SCHEDULE_FACTS.map(({ label, value }) => (
            <Stat key={label} label={label} value={value} size="md" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function DistributionsTab() {
  return (
    <div className="space-y-4">
      <InfoCard />

      <Card variant="plain">
        <CardHeader>
          <Heading level={3}>Distribution History</Heading>
        </CardHeader>
        <DistributionsTable distributions={MOCK_DISTRIBUTIONS} />
      </Card>
    </div>
  )
}
