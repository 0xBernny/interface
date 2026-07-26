import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Alert, AlertDescription, AlertTitle } from "@workspace/ui/components/alert"
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { LoadingButton } from "@workspace/ui/components/loading-button"
import { NumericText } from "@workspace/ui/components/numeric"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Stat } from "@workspace/ui/components/stat"
import { EmptyState, LoadingState } from "@workspace/ui/components/states"
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
import { useAffiliateReferrals } from "../../hooks/use-referrals-data"
import { useReferralCode } from "../../queries/useReferralCode"
import { useReferralStats } from "../../queries/useReferralStats"
import { useReferralTier } from "../../queries/useReferralTier"
import { createAffiliateCode, validateReferralCode } from "../../lib/referrals"
import { TIERS } from "../../data/tiers"
import { TimePeriodFilter } from "../shared/time-period-filter"
import { StatChartCard } from "../shared/stat-chart-card"
import { TierBadge } from "../shared/tier-badge"
import { TierProgress } from "../shared/tier-progress"
import type { TimePeriod } from "../../hooks/use-referrals-data"
import { formatAddress, formatUsd } from "@/shared/lib/format"
import { queryKeys } from "@/shared/lib/query-keys"
import { useWalletStore } from "@/features/wallet/store/wallet-store"

// ── Create code wizard ──────────────────────────────────────────────────────

function CreateCodeForm({ onSuccess }: { onSuccess: () => void }) {
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
    if (err) { setError(err); return }
    setError(null)
    setPending(true)
    try {
      await createAffiliateCode(account, code.toUpperCase().trim())
      onSuccess()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to create code")
    } finally {
      setPending(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        {/* How it works */}
        <Alert variant="info" className="mb-6 gap-4">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-info/10">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </span>
          <div>
            <AlertTitle>Create a code and start earning commissions</AlertTitle>
            <AlertDescription className="mt-0.5">
              Earn up to <span className="font-semibold">15%</span> of trading fees from every
              user who joins with your code. Tier up as your referrals grow.
            </AlertDescription>
          </div>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Text
              size="sm"
              tone="muted"
              weight="medium"
              render={<label htmlFor="affiliate-code" />}
            >
              Choose your referral code
            </Text>
            <div className="flex gap-2">
              <Input
                id="affiliate-code"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, ""))
                  setError(null)
                }}
                placeholder="e.g. MYCODE123"
                maxLength={16}
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
                loadingText="Creating…"
                disabled={!code.trim()}
              >
                Create
              </LoadingButton>
            </div>
            <div className="flex items-center justify-between gap-2">
              {error
                ? <Text size="xs" tone="danger">{error}</Text>
                : <Text size="xs" tone="muted">Letters, numbers, and underscores only. Max 16 chars.</Text>
              }
              <NumericText role="muted" size="xs" className="opacity-60">
                {code.length}/16
              </NumericText>
            </div>
          </div>
        </form>

        {/* Tier table */}
        <div className="mt-6 border-t border-border pt-5">
          <Text size="xs" tone="muted" weight="semibold" variant="label" className="mb-3">
            Commission tiers
          </Text>
          <Card variant="plain" className="rounded-lg">
            <Table>
              <TableHeader>
                <TableHeadRow>
                  <TableHead className="px-4 py-2.5">Tier</TableHead>
                  <TableHead className="px-4 py-2.5">Volume (30d)</TableHead>
                  <TableHead align="right" className="px-4 py-2.5">Commission</TableHead>
                  <TableHead align="right" className="px-4 py-2.5">Trader discount</TableHead>
                </TableHeadRow>
              </TableHeader>
              <TableBody>
                {TIERS.map((tier) => (
                  <TableRow key={tier.level} interactive={false}>
                    <TableCell className="px-4 py-3">
                      <TierBadge tier={tier} />
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <NumericText role="muted">
                        {tier.minVolumeUsd === 0 ? "Any" : `≥ ${formatUsd(tier.minVolumeUsd, { compact: true })}`}
                      </NumericText>
                    </TableCell>
                    <TableCell align="right" className="px-4 py-3">
                      <NumericText role="accent" weight="semibold">
                        {tier.affiliateCommissionPct}%
                      </NumericText>
                    </TableCell>
                    <TableCell align="right" className="px-4 py-3">
                      <NumericText role="positive" weight="semibold">
                        {tier.traderDiscountPct}%
                      </NumericText>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}

// ── Dashboard (when code exists) ────────────────────────────────────────────

function ReferralsTable() {
  const { data: referrals = [], isLoading } = useAffiliateReferrals()

  return (
    <Card variant="plain">
      <CardHeader>
        <Heading level={3}>Referrals</Heading>
      </CardHeader>
      {isLoading ? (
        <LoadingState rows={2} label="Loading referrals" />
      ) : referrals.length === 0 ? (
        <EmptyState
          title="No referrals yet"
          description="Share your code to start earning commissions"
        />
      ) : (
        <Table>
          <TableHeader>
            <TableHeadRow>
              <TableHead>Account</TableHead>
              <TableHead align="right">Volume</TableHead>
              <TableHead align="right">Commission</TableHead>
              <TableHead>Since</TableHead>
            </TableHeadRow>
          </TableHeader>
          <TableBody>
            {referrals.map((r) => (
              <TableRow key={r.account}>
                <TableCell className="py-3">
                  <NumericText>{formatAddress(r.account)}</NumericText>
                </TableCell>
                <TableCell align="right" className="py-3">
                  <NumericText>{formatUsd(r.volumeUsd, { compact: true })}</NumericText>
                </TableCell>
                <TableCell align="right" className="py-3">
                  <NumericText role="accent">
                    {formatUsd(r.commissionUsd, { compact: true })}
                  </NumericText>
                </TableCell>
                <TableCell className="py-3 text-muted-foreground">{r.registeredAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  )
}

export function AffiliatesTab() {
  const queryClient = useQueryClient()
  const [period, setPeriod] = useState<TimePeriod>("total")
  const { data: code, isLoading: codeLoading } = useReferralCode()
  const { data: tier } = useReferralTier()
  const { data: stats, isLoading: statsLoading } = useReferralStats(code ?? null, period)
  const hasCode = Boolean(code)
  const isLoading = codeLoading || statsLoading

  function handleCodeCreated() {
    void queryClient.invalidateQueries({ queryKey: queryKeys.referrals.code(null) })
    void queryClient.invalidateQueries({ queryKey: queryKeys.referrals.stats(code ?? null, period) })
  }

  if (!hasCode && !codeLoading) {
    return <CreateCodeForm onSuccess={handleCodeCreated} />
  }

  return (
    <div className="space-y-5">
      {/* Tier progress */}
      <TierProgress tier={tier ?? 1} volumeUsd={stats?.totalVolumeUsd ?? 0} />

      {/* Overview */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Heading level={3}>Overview</Heading>
          <TimePeriodFilter value={period} onChange={setPeriod} />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Skeleton className="h-36 rounded-xl" />
            <Skeleton className="h-36 rounded-xl" />
            <Skeleton className="h-36 rounded-xl" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Card className="flex flex-col justify-center px-5 py-4">
              <Stat
                label="Total referrals"
                value={stats?.totalTraders ?? 0}
                size="xl"
                weight="semibold"
              />
            </Card>
            <StatChartCard
              title="Referred volume"
              tooltip="Total trading volume generated by your referrals"
              value={stats?.totalVolumeUsd ?? 0}
              period={period}
              accent="blue"
            />
            <StatChartCard
              title="Commissions"
              tooltip="Total fees earned from your referrals' trades"
              value={stats?.totalRebatesUsd ?? 0}
              period={period}
              accent="green"
            />
          </div>
        )}
      </div>

      <ReferralsTable />
    </div>
  )
}
