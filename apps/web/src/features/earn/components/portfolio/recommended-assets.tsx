import { useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Card } from "@workspace/ui/components/card"
import { LoadingButton } from "@workspace/ui/components/loading-button"
import { NumericText } from "@workspace/ui/components/numeric"
import { Heading, Text } from "@workspace/ui/components/text"
import { TokenAvatar } from "@workspace/ui/components/token-avatar"
import { GLV_VAULTS, GM_POOLS } from "../../data/pools"
import { buySO4, depositGLV, depositGM } from "../../lib/earn"
import { formatPct } from "@/shared/lib/format"

function LightningIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="text-primary">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  )
}

function ExternalLinkIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

function SO4LogoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-primary">
      <path
        d="M4 6 L12 2 L20 6 L20 14 L12 18 L4 14 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <path d="M12 2 L12 18" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 6 L20 14" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
      <path d="M20 6 L4 14" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
    </svg>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text size="xs" tone="muted" weight="medium" variant="label" render={<span />}>
      {children}
    </Text>
  )
}

function SO4Card() {
  const [pending, setPending] = useState(false)

  function handleBuy() {
    setPending(true)
    buySO4()
    setTimeout(() => setPending(false), 500)
  }

  return (
    <Card className="flex flex-col justify-between gap-5 p-4">
      <SectionLabel>SO4</SectionLabel>
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
          <SO4LogoIcon />
        </div>
        <div>
          <Text size="md" weight="semibold">
            SO4
          </Text>
          <Text size="xs" tone="muted">
            Accumulating…
          </Text>
        </div>
      </div>
      <LoadingButton
        size="lg"
        className="w-full"
        isLoading={pending}
        loadingText="Opening"
        onClick={handleBuy}
      >
        Buy SO4
      </LoadingButton>
    </Card>
  )
}

function GlvCard() {
  const vault = GLV_VAULTS[0]
  const [pending, setPending] = useState(false)

  async function handleEarn() {
    setPending(true)
    try {
      // TODO: pass real account + actual deposit amount from modal
      await depositGLV("DUMMY_ACCOUNT", `${vault.name} [${vault.displayPair}]`, 0)
    } finally {
      setPending(false)
    }
  }

  return (
    <Card className="flex flex-col justify-between gap-4 p-4">
      <SectionLabel>GLV vaults</SectionLabel>
      <div className="flex items-center gap-3">
        <TokenAvatar symbol="GLV" size="md" />
        <div className="min-w-0 flex-1">
          <Text size="md" weight="semibold">
            {vault.name}{" "}
            <Text tone="muted" render={<span />}>
              [{vault.displayPair}]
            </Text>
          </Text>
          <div className="flex items-baseline gap-1">
            <NumericText role="positive" size="lg" weight="bold">
              {formatPct(vault.apy, { sign: false })}
            </NumericText>
            <Text size="2xs" tone="muted" render={<span />}>
              Performance APY
            </Text>
          </div>
        </div>
        <LoadingButton
          size="lg"
          className="shrink-0"
          isLoading={pending}
          loadingText="Depositing"
          onClick={() => void handleEarn()}
        >
          Earn
        </LoadingButton>
      </div>
    </Card>
  )
}

function GmCard() {
  const topPools = [...GM_POOLS].sort((a, b) => b.apy - a.apy).slice(0, 2)
  const [pending, setPending] = useState<string | null>(null)

  async function handleEarn(poolId: string, poolName: string) {
    setPending(poolId)
    try {
      // TODO: pass real account + actual deposit amount from modal
      await depositGM("DUMMY_ACCOUNT", poolName, 0)
    } finally {
      setPending(null)
    }
  }

  return (
    <Card className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <SectionLabel>GM pools</SectionLabel>
        <Button variant="ghost" size="xs" className="gap-1">
          Explore more
          <ExternalLinkIcon />
        </Button>
      </div>

      <div className="space-y-3">
        {topPools.map((pool) => (
          <div key={pool.id} className="flex items-center gap-3">
            <TokenAvatar symbol={pool.longToken} size="sm" />
            <div className="min-w-0 flex-1">
              <Text size="sm" weight="medium">
                {pool.name}
              </Text>
              <Text size="2xs" tone="muted">
                [{pool.longToken}-{pool.shortToken}]
              </Text>
            </div>
            <div className="shrink-0 text-right">
              <NumericText role="positive" size="md" weight="bold">
                {formatPct(pool.apy, { sign: false })}
              </NumericText>
              <Text size="2xs" tone="muted">
                Performance APY
              </Text>
            </div>
            <LoadingButton
              size="sm"
              className="shrink-0 px-3"
              isLoading={pending === pool.id}
              loadingText="Depositing"
              onClick={() => void handleEarn(pool.id, pool.name)}
            >
              Earn
            </LoadingButton>
          </div>
        ))}
      </div>
    </Card>
  )
}

export function RecommendedAssets() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <LightningIcon />
        <Heading level={2}>Recommended</Heading>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SO4Card />
        <GlvCard />
        <GmCard />
      </div>
    </div>
  )
}
