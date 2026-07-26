import { useState } from "react"
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { LoadingButton } from "@workspace/ui/components/loading-button"
import { NumericText } from "@workspace/ui/components/numeric"
import { Stat } from "@workspace/ui/components/stat"
import { EmptyState } from "@workspace/ui/components/states"
import {
  Table,
  TableBody,
  TableCell,
  TableEmptyRow,
  TableHead,
  TableHeadRow,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { Heading, Text } from "@workspace/ui/components/text"
import { useAffiliateStats, useDistributions } from "../../hooks/use-referrals-data"
import { claimDistribution } from "../../lib/referrals"
import { useWalletStore } from "@/features/wallet/store/wallet-store"
import { formatToken, formatUsd } from "@/shared/lib/format"

const SCHEDULE_FACTS = [
  { label: "Distribution cycle", value: "Weekly (Thu)" },
  { label: "Payment token", value: "USDC" },
  { label: "Claim window", value: "No expiry" },
]

function LockIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

export function DistributionsTab() {
  const account = useWalletStore((state) => state.address)
  const { data: distributions = [], isLoading } = useDistributions()
  const { data: affiliateStats } = useAffiliateStats()
  const [claiming, setClaiming] = useState<string | null>(null)

  const hasAffiliateCode = Boolean(affiliateStats?.code)

  async function handleClaim(id: string) {
    if (!account) return
    setClaiming(id)
    try {
      await claimDistribution(account, id)
    } finally {
      setClaiming(null)
    }
  }

  if (!hasAffiliateCode && !isLoading) {
    return (
      <Card variant="dashed" className="flex min-h-64 items-center justify-center">
        <EmptyState
          icon={<LockIcon />}
          title="Register an affiliate code to access distributions"
          description="Switch to the Affiliates tab and create your code to unlock this section."
        />
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Info card */}
      <Card>
        <CardContent>
          <Heading level={3} className="mb-2">
            Commission Distributions
          </Heading>
          <Text size="sm" tone="muted" variant="leading">
            Commissions from your referrals' trading fees are distributed weekly every Thursday.
            Payments are made in USDC directly to your wallet. Unclaimed distributions accumulate
            and can be claimed at any time.
          </Text>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {SCHEDULE_FACTS.map(({ label, value }) => (
              <Stat key={label} label={label} value={value} size="md" />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Distributions table */}
      <Card variant="plain">
        <CardHeader>
          <Heading level={3}>History</Heading>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableHeadRow>
              <TableHead>Epoch</TableHead>
              <TableHead>Date</TableHead>
              <TableHead align="right">Amount</TableHead>
              <TableHead>Token</TableHead>
              <TableHead align="right">USD value</TableHead>
              <TableHead align="right">Action</TableHead>
            </TableHeadRow>
          </TableHeader>
          <TableBody>
            {distributions.length > 0 ? (
              distributions.map((d) => (
                <TableRow key={d.id}>
                  <TableCell>
                    <NumericText role="muted">{d.epoch}</NumericText>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{d.date}</TableCell>
                  <TableCell align="right">
                    <NumericText>{formatToken(d.amount, d.token)}</NumericText>
                  </TableCell>
                  <TableCell>
                    <NumericText>{d.token}</NumericText>
                  </TableCell>
                  <TableCell align="right">
                    <NumericText role="accent">{formatUsd(d.amountUsd)}</NumericText>
                  </TableCell>
                  <TableCell align="right">
                    <LoadingButton
                      size="xs"
                      isLoading={claiming === d.id}
                      loadingText="Claiming"
                      onClick={() => void handleClaim(d.id)}
                    >
                      Claim
                    </LoadingButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableEmptyRow colSpan={6}>
                <EmptyState
                  title="No distributions yet"
                  description="Commissions will appear here after your first weekly distribution"
                />
              </TableEmptyRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
