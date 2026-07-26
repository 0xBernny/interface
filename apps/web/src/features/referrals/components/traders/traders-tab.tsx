import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@workspace/ui/components/alert"
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { LoadingButton } from "@workspace/ui/components/loading-button"
import { NumericText } from "@workspace/ui/components/numeric"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Stat } from "@workspace/ui/components/stat"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadRow,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import { Heading, Text } from "@workspace/ui/components/text"
import { useDistributions, useTraderStats } from "../../hooks/use-referrals-data"
import { useReferralStats } from "../../queries/useReferralStats"
import {
  claimRebates,
  setTraderReferralCode,
  validateReferralCode,
} from "../../lib/referrals"
import { TimePeriodFilter } from "../shared/time-period-filter"
import { StatChartCard } from "../shared/stat-chart-card"
import { TierBadge } from "../shared/tier-badge"
import { TIERS } from "../../data/tiers"
import type { TimePeriod } from "../../hooks/use-referrals-data"
import { useWalletStore } from "@/features/wallet/store/wallet-store"
import { formatUsd } from "@/shared/lib/format"

function fmtDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  }).format(new Date(iso))
}

const DISCOUNT_TIER_VOLUME: Record<string, string> = {
  Bronze: "Any volume",
  Silver: "$2.5K+ / mo",
  Gold: "$25K+ / mo",
}

type JoinCodeFormProps = {
  onSuccess: () => void
}

function JoinCodeForm({ onSuccess }: JoinCodeFormProps) {
  const account = useWalletStore((state) => state.address)
  const [code, setCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!account) {
      setError("Connect your wallet first")
      return
    }
    const err = validateReferralCode(code)
    if (err) {
      setError(err)
      return
    }
    setError(null)
    setPending(true)
    try {
      await setTraderReferralCode(account, code.toUpperCase().trim())
      onSuccess()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to apply code")
    } finally {
      setPending(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Alert variant="info" className="mb-6 gap-4">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-info/10">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="8" r="6" />
              <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
            </svg>
          </span>
          <div>
            <AlertTitle>Enter a referral code to receive a fee discount</AlertTitle>
            <AlertDescription className="mt-0.5">
              Get up to <span className="font-semibold text-success">5% off</span> every open and
              close fee. Rewards scale with the affiliate&apos;s tier.
            </AlertDescription>
          </div>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Text
              size="sm"
              tone="muted"
              weight="medium"
              render={<label htmlFor="referral-code" />}
            >
              Referral code
            </Text>
            <div className="flex gap-2">
              <Input
                id="referral-code"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase())
                  setError(null)
                }}
                placeholder="e.g. MYCODE123"
                autoComplete="off"
                spellCheck={false}
                aria-invalid={error ? true : undefined}
                className="h-9 font-mono tracking-widest placeholder:font-sans placeholder:tracking-normal"
              />
              <LoadingButton
                type="submit"
                size="lg"
                className="h-9 shrink-0 px-5"
                isLoading={pending}
                loadingText="Applying…"
                disabled={!code.trim() || !account}
              >
                Apply
              </LoadingButton>
            </div>
            {error && (
              <Text size="xs" tone="danger">
                {error}
              </Text>
            )}
          </div>
        </form>

        <div className="mt-6 border-t border-border pt-4">
          <Text size="xs" tone="muted" weight="semibold" variant="label" className="mb-3">
            Discount tiers
          </Text>
          <div className="grid grid-cols-3 gap-2">
            {TIERS.map((tier) => (
              <Card key={tier.label} variant="muted" className="rounded-lg p-3 text-center">
                <TierBadge tier={tier} />
                <NumericText role="positive" size="lg" weight="bold" className="mt-2 block">
                  {tier.traderDiscountPct}%
                </NumericText>
                <Text size="2xs" tone="muted">
                  {DISCOUNT_TIER_VOLUME[tier.label] ?? "Any volume"}
                </Text>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

type OverviewProps = {
  stats: ReturnType<typeof useTraderStats>["data"]
  rebateStats: ReturnType<typeof useReferralStats>["data"]
  isLoading: boolean
  period: TimePeriod
  onPeriodChange: (p: TimePeriod) => void
  onClaimRebates: () => void
  claiming: boolean
}

function Overview({
  stats,
  rebateStats,
  isLoading,
  period,
  onPeriodChange,
  onClaimRebates,
  claiming,
}: OverviewProps) {
  const claimable = rebateStats?.claimableRebateUsd ?? stats?.claimableRebateUsd ?? 0

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Heading level={3}>Overview</Heading>
        <TimePeriodFilter value={period} onChange={onPeriodChange} />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Skeleton className="h-36 rounded-xl" />
          <Skeleton className="h-36 rounded-xl" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <StatChartCard
            title="Trading volume"
            tooltip="Your total trading volume during this period"
            value={stats?.tradingVolumeUsd ?? 0}
            period={period}
            accent="blue"
          />
          <StatChartCard
            title="Discounts"
            tooltip="Total fee savings from your referral code"
            value={stats?.discountUsd ?? rebateStats?.totalRebatesUsd ?? 0}
            period={period}
            accent="green"
          />
        </div>
      )}

      {claimable > 0 && (
        <Card className="flex flex-wrap items-center justify-between gap-3 rounded-lg px-4 py-3">
          <Stat
            label="Claimable rebates"
            value={formatUsd(claimable)}
            role="positive"
            size="lg"
          />
          <LoadingButton
            size="lg"
            isLoading={claiming}
            loadingText="Claiming…"
            onClick={onClaimRebates}
          >
            Claim rebates
          </LoadingButton>
        </Card>
      )}

      {stats?.lastUpdated && (
        <Text size="xs" tone="muted">
          Last updated:{" "}
          <NumericText role="muted" size="xs">
            {fmtDate(stats.lastUpdated)}
          </NumericText>
        </Text>
      )}
    </div>
  )
}

function DistributionsHistory() {
  const { data: distributions = [], isLoading } = useDistributions()

  if (isLoading) {
    return <Skeleton className="h-32 rounded-xl" />
  }

  if (distributions.length === 0) {
    return null
  }

  return (
    <Card variant="plain">
      <CardHeader>
        <Heading level={3}>Rebate history</Heading>
      </CardHeader>
      <Table>
        <TableHeader>
          <TableHeadRow>
            <TableHead>Epoch</TableHead>
            <TableHead>Date</TableHead>
            <TableHead align="right">Amount</TableHead>
          </TableHeadRow>
        </TableHeader>
        <TableBody>
          {distributions.map((d) => (
            <TableRow key={d.id} interactive={false}>
              <TableCell className="py-3">
                <NumericText role="muted">{d.epoch}</NumericText>
              </TableCell>
              <TableCell className="py-3 text-muted-foreground">{d.date}</TableCell>
              <TableCell align="right" className="py-3">
                <NumericText>{formatUsd(d.amountUsd)}</NumericText>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}

type Props = {
  onCodeApplied: () => void
}

export function TradersTab({ onCodeApplied }: Props) {
  const account = useWalletStore((state) => state.address)
  const [period, setPeriod] = useState<TimePeriod>("total")
  const [claiming, setClaiming] = useState(false)

  const { data: stats, isLoading, refetch } = useTraderStats(period)
  const { data: rebateStats, isLoading: rebateLoading } = useReferralStats(
    stats?.referralCode ?? null,
    period,
  )

  const hasCode = Boolean(stats?.referralCode)

  async function handleClaimRebates() {
    if (!account) return
    const epochs =
      rebateStats && rebateStats.claimableRebateUsd > 0
        ? ["latest"]
        : stats?.claimableRebateUsd
          ? ["latest"]
          : []
    if (epochs.length === 0) return

    setClaiming(true)
    try {
      await claimRebates(account, epochs)
      await refetch()
    } finally {
      setClaiming(false)
    }
  }

  return (
    <div className="space-y-5">
      {!hasCode && !isLoading && <JoinCodeForm onSuccess={onCodeApplied} />}
      <Overview
        stats={stats}
        rebateStats={rebateStats}
        isLoading={isLoading || rebateLoading}
        period={period}
        onPeriodChange={setPeriod}
        onClaimRebates={() => void handleClaimRebates()}
        claiming={claiming}
      />
      <DistributionsHistory />
    </div>
  )
}
