import { useMemo, useState } from "react"
import { cn } from "@workspace/ui/lib/utils"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input"
import { LoadingButton } from "@workspace/ui/components/loading-button"
import { NumericText } from "@workspace/ui/components/numeric"
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
import { Text } from "@workspace/ui/components/text"
import { usePoolsApy } from "../../hooks/use-earn-data"
import { depositGLV, depositGM } from "../../lib/earn"
import { useMarketPoolAmounts } from "../../hooks/useMarketPoolAmounts"
import { useGLVVaultData, useGMPoolData, useStakingInfo } from "../../queries"
import { POOL_KIND_BADGE } from "../../lib/badges"
import { formatPct, formatToken, formatUsd } from "@/shared/lib/format"
import { fromSorobanAmount } from "@/shared/lib/bignum"
import { TokenIcon } from "@/shared/components/TokenIcon"
import { useWalletStore } from "@/features/wallet/store/wallet-store"

type Filter = "all" | "glv" | "gm"
type SortKey = "apy" | "tvl"

function PoolCompositionBar({ longPct, shortPct }: { longPct: number; shortPct: number }) {
  return (
    <div className="space-y-1">
      <div className="flex h-1.5 w-20 overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-long/70" style={{ width: `${longPct}%` }} />
        <div className="h-full bg-warning/70" style={{ width: `${shortPct}%` }} />
      </div>
      <Text size="2xs" tone="muted">
        {longPct}% / {shortPct}%
      </Text>
    </div>
  )
}

type ToggleButtonProps = {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}

function FilterButton({ active, onClick, children }: ToggleButtonProps) {
  return (
    <Button
      variant="ghost"
      size="lg"
      onClick={onClick}
      aria-pressed={active}
      className={cn(active && "bg-background text-foreground shadow-sm")}
    >
      {children}
    </Button>
  )
}

function SortButton({ active, onClick, children }: ToggleButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      aria-pressed={active}
      className={cn(active ? "font-semibold text-foreground" : "text-muted-foreground")}
    >
      {children}
    </Button>
  )
}

type DepositTarget = { id: string; kind: "gm" | "glv"; name: string }

export function DiscoverTab() {
  const { gmPools, glvVaults } = usePoolsApy()
  const { data: stakingInfo } = useStakingInfo()
  const account = useWalletStore((state) => state.address)
  const [filter, setFilter] = useState<Filter>("all")
  const [sort, setSort] = useState<SortKey>("apy")
  const [pending, setPending] = useState<string | null>(null)
  const [depositTarget, setDepositTarget] = useState<DepositTarget | null>(null)
  const [depositAmount, setDepositAmount] = useState("")

  const rows = useMemo(() => {
    const combined = [
      ...glvVaults.map((v) => ({
        id: v.id,
        marketAddress: "",
        vaultAddress: v.id,
        name: `${v.name} [${v.displayPair}]`,
        kind: "glv" as const,
        longToken: "GLV",
        apy: v.apy,
        tvlUsd: v.tvlUsd,
        longPct: undefined as number | undefined,
        shortPct: undefined as number | undefined,
      })),
      ...gmPools.map((p) => ({
        id: p.id,
        marketAddress: p.marketAddress,
        vaultAddress: "",
        name: p.name,
        kind: "gm" as const,
        longToken: p.longToken,
        apy: p.apy,
        tvlUsd: p.tvlUsd,
        longPct: p.longPct,
        shortPct: p.shortPct,
      })),
    ]

    return combined
      .filter((r) => filter === "all" || r.kind === filter)
      .sort((a, b) => (sort === "apy" ? b.apy - a.apy : b.tvlUsd - a.tvlUsd))
  }, [gmPools, glvVaults, filter, sort])

  function handleEarn(id: string, kind: "gm" | "glv", name: string) {
    setDepositTarget({ id, kind, name })
    setDepositAmount("")
  }

  async function handleConfirmDeposit() {
    if (!depositTarget || !account) return
    const amount = parseFloat(depositAmount)
    if (!isFinite(amount) || amount <= 0) return
    setPending(depositTarget.id)
    setDepositTarget(null)
    try {
      if (depositTarget.kind === "gm") await depositGM(account, depositTarget.name, amount)
      else await depositGLV(account, depositTarget.name, amount)
    } finally {
      setPending(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* Controls bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center rounded-lg border border-border bg-muted/40 p-0.5">
          <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>
            All
          </FilterButton>
          <FilterButton active={filter === "glv"} onClick={() => setFilter("glv")}>
            GLV
          </FilterButton>
          <FilterButton active={filter === "gm"} onClick={() => setFilter("gm")}>
            GM
          </FilterButton>
        </div>

        <div className="ml-auto flex items-center gap-1">
          <Text size="sm" tone="muted" render={<span />}>
            Sort
          </Text>
          <SortButton active={sort === "apy"} onClick={() => setSort("apy")}>
            APY {sort === "apy" && "↓"}
          </SortButton>
          <Text size="sm" tone="subtle" render={<span />}>
            ·
          </Text>
          <SortButton active={sort === "tvl"} onClick={() => setSort("tvl")}>
            TVL {sort === "tvl" && "↓"}
          </SortButton>
        </div>
      </div>

      {/* Your deposit summary */}
      {stakingInfo && (stakingInfo.stakedSO4 > 0n || stakingInfo.stakedEsSO4 > 0n || stakingInfo.stakedMultiplierPoints > 0n) && (
        <Card>
          <CardContent className="p-4">
            <Text size="sm" tone="muted" weight="semibold" className="mb-2">
              Your Deposit
            </Text>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Stat
                label="Staked SO4"
                size="md"
                value={formatToken(fromSorobanAmount(stakingInfo.stakedSO4, 7), "SO4")}
              />
              <Stat
                label="Staked esSO4"
                size="md"
                value={formatToken(fromSorobanAmount(stakingInfo.stakedEsSO4, 7), "esSO4")}
              />
              <Stat
                label="Multiplier Points"
                size="md"
                value={formatToken(fromSorobanAmount(stakingInfo.stakedMultiplierPoints, 7), "MP")}
              />
              <Stat
                label="Pending Rewards"
                size="md"
                role="positive"
                value={formatToken(fromSorobanAmount(stakingInfo.pendingEsSO4Rewards, 7), "esSO4")}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pool table */}
      <Card variant="plain">
        <Table>
          <TableHeader>
            <TableHeadRow>
              <TableHead>Pool</TableHead>
              <TableHead>Type</TableHead>
              <TableHead align="right">APY</TableHead>
              <TableHead align="right">TVL</TableHead>
              <TableHead align="right">Position</TableHead>
              <TableHead>Composition</TableHead>
              <TableHead align="right">Action</TableHead>
            </TableHeadRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <DiscoverRow
                key={row.id}
                row={row}
                pending={pending}
                onEarn={handleEarn}
              />
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Legend */}
      <div className="flex items-center gap-5 px-1">
        <Text size="xs" tone="muted" render={<span />} className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-long/70" />
          Long token
        </Text>
        <Text size="xs" tone="muted" render={<span />} className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-warning/70" />
          Short token
        </Text>
        <Text size="xs" tone="muted" className="ml-auto">
          APY based on trailing 30-day performance
        </Text>
      </div>

      {/* Deposit modal */}
      <Dialog
        open={depositTarget !== null}
        onOpenChange={(open) => { if (!open) setDepositTarget(null) }}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>
              Deposit into {depositTarget?.name ?? ""}
            </DialogTitle>
          </DialogHeader>

          {!account ? (
            <Text size="base" tone="muted" className="py-4 text-center">
              Connect your wallet to deposit.
            </Text>
          ) : (
            <div className="space-y-3 py-2">
              <Text size="sm" tone="muted" render={<label htmlFor="deposit-amount" />}>
                Amount (USD)
              </Text>
              <Input
                id="deposit-amount"
                type="number"
                min="0"
                step="any"
                placeholder="0.00"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="tabular-nums"
                autoFocus
              />
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDepositTarget(null)}
            >
              Cancel
            </Button>
            {account && (
              <Button
                size="sm"
                disabled={!depositAmount || parseFloat(depositAmount) <= 0}
                onClick={() => void handleConfirmDeposit()}
              >
                Deposit
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function DiscoverRow({
  row,
  pending,
  onEarn,
}: {
  row: {
    id: string
    marketAddress: string
    vaultAddress: string
    name: string
    kind: "glv" | "gm"
    longToken: string
    apy: number
    tvlUsd: number
    longPct: number | undefined
    shortPct: number | undefined
  }
  pending: string | null
  onEarn: (id: string, kind: "gm" | "glv", name: string) => void
}) {
  const { data: poolAmounts } = useMarketPoolAmounts(row.marketAddress)
  const { data: gmPoolData } = useGMPoolData(row.marketAddress)
  const { data: glvVaultData } = useGLVVaultData(row.vaultAddress)
  const liveData = row.kind === "gm" ? gmPoolData : glvVaultData
  const tvl = row.kind === "gm" ? (poolAmounts?.poolValueUsd ?? liveData?.tvlUsd ?? row.tvlUsd) : (liveData?.tvlUsd ?? row.tvlUsd)
  const apy = liveData?.apr ?? row.apy
  const longPct = row.kind === "gm" ? (gmPoolData?.longPct ?? row.longPct) : row.longPct
  const shortPct = row.kind === "gm" ? (gmPoolData?.shortPct ?? row.shortPct) : row.shortPct
  const userBalance = row.kind === "gm"
    ? fromSorobanAmount(gmPoolData?.userGmBalance ?? 0n, 7)
    : fromSorobanAmount(glvVaultData?.userGlvBalance ?? 0n, 7)

  return (
    <TableRow>
      <TableCell className="py-4">
        <div className="flex items-center gap-3">
          <TokenIcon symbol={row.longToken} size={32} />
          <span className="font-medium">{row.name}</span>
        </div>
      </TableCell>
      <TableCell className="py-4">
        <Badge variant={POOL_KIND_BADGE[row.kind]}>{row.kind.toUpperCase()}</Badge>
      </TableCell>
      <TableCell align="right" className="py-4">
        <NumericText role="positive" weight="semibold">
          {formatPct(apy, { sign: false })}
        </NumericText>
      </TableCell>
      <TableCell align="right" className="py-4">
        <NumericText role="muted">{formatUsd(tvl, { compact: true })}</NumericText>
      </TableCell>
      <TableCell align="right" className="py-4">
        <NumericText role="muted">
          {userBalance > 0 ? userBalance.toLocaleString(undefined, { maximumFractionDigits: 4 }) : "0"}
        </NumericText>
      </TableCell>
      <TableCell className="py-4">
        {longPct !== undefined ? (
          <PoolCompositionBar longPct={longPct} shortPct={shortPct ?? 0} />
        ) : (
          <Text size="xs" tone="muted" render={<span />}>
            Diversified
          </Text>
        )}
      </TableCell>
      <TableCell align="right" className="py-4">
        <LoadingButton
          size="xs"
          isLoading={pending === row.id}
          loadingText="Depositing"
          onClick={() => onEarn(row.id, row.kind, row.name)}
        >
          Earn
        </LoadingButton>
      </TableCell>
    </TableRow>
  )
}
