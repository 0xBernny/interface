import { Alert, AlertDescription } from "@workspace/ui/components/alert"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent } from "@workspace/ui/components/card"
import { LoadingButton } from "@workspace/ui/components/loading-button"
import { NumericText } from "@workspace/ui/components/numeric"
import { Stat } from "@workspace/ui/components/stat"
import { Heading, Text } from "@workspace/ui/components/text"
import { FAUCET_TOKENS, type FaucetTokenConfig } from "../data/tokens" // eslint-disable-line import/consistent-type-specifier-style
import { FAUCET_CONTRACT_ID } from "../lib/clients"
import { useFaucetData } from "../hooks/useFaucetData"
import { useClaim } from "../hooks/useClaim"
import { Navbar } from "@/ui/Navbar"
import { TokenIcon } from "@/shared/components/TokenIcon"
import { formatToken } from "@/shared/lib/format"
import { NETWORK } from "@/app/config/network"
import { useWalletStore } from "@/features/wallet/store/wallet-store"
import { useNetwork } from "@/features/wallet/hooks/useNetwork"
import { NetworkMismatchBanner } from "@/features/wallet/components/NetworkMismatchBanner"
import { ConnectButton } from "@/features/wallet/components/ConnectButton"

// ── Token card ────────────────────────────────────────────────────────────────

type TokenCardProps = {
  token: FaucetTokenConfig
  balance: number | undefined
  claimAmount: number | undefined
  lastClaimLedger: number | null | undefined
  cooldownLedgers: number | undefined
  isLoading: boolean
  isPending: boolean
  isDisabled: boolean
  onClaim: (token: FaucetTokenConfig) => void
}

function TokenCard({
  token,
  balance,
  claimAmount,
  lastClaimLedger,
  cooldownLedgers,
  isLoading,
  isPending,
  isDisabled,
  onClaim,
}: TokenCardProps) {
  const cooldownText =
    lastClaimLedger && cooldownLedgers
      ? `Last claim ledger ${lastClaimLedger.toLocaleString()}`
      : "No claim recorded"

  return (
    <Card className="flex min-w-0 flex-col gap-4 rounded-lg p-5">
      <div className="flex items-center gap-3">
        <TokenIcon symbol={token.symbol.replace(/^T/, "")} size={36} />
        <div className="min-w-0">
          <Text size="base" weight="semibold">
            {token.symbol}
          </Text>
          <Text size="sm" tone="muted">
            {token.name}
          </Text>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-muted/40 px-3 py-2.5">
          <Stat
            label="Your balance"
            uppercase
            isLoading={isLoading}
            value={formatToken(balance, token.symbol, { decimals: 4 })}
          />
        </div>

        <div className="rounded-lg bg-muted/40 px-3 py-2.5">
          <Stat
            label="Claim amount"
            uppercase
            isLoading={isLoading}
            value={formatToken(claimAmount, token.symbol, { decimals: 2 })}
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <Text size="sm" tone="muted" truncate>
          {cooldownText}
        </Text>
        <LoadingButton
          variant="outline"
          size="lg"
          className="shrink-0"
          isLoading={isPending}
          loadingText="Claiming"
          disabled={isDisabled}
          onClick={() => onClaim(token)}
        >
          Claim
        </LoadingButton>
      </div>
    </Card>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export function FaucetPage() {
  const address = useWalletStore((state) => state.address)
  const isConnected = useWalletStore((state) => state.status === "connected")
  const { mismatch } = useNetwork()
  const { data, isLoading } = useFaucetData(address)
  const { claimOne, claimAll, pendingTokens, isBulkPending } = useClaim()

  const isTestnet = NETWORK.name === "testnet"
  const claimDisabled = !isConnected || mismatch

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <Navbar variant="app" />
      <NetworkMismatchBanner />

      <div className="mx-auto w-full max-w-2xl px-4 pb-16 pt-8 sm:px-6">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <Heading level={1}>Testnet Faucet</Heading>
            <Badge variant="warning" className="gap-1.5">
              <span className="size-1.5 rounded-full bg-warning" />
              Stellar Testnet
            </Badge>
          </div>
          <Text size="base" tone="muted" className="mt-1.5">
            Claim test tokens to try trading on SO4. Tokens have no real value.
          </Text>
        </header>

        {!isTestnet ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Text size="base" tone="muted">
                The faucet is only available on the Stellar testnet.
              </Text>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Token cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              {FAUCET_TOKENS.map((token) => (
                <TokenCard
                  key={token.symbol}
                  token={token}
                  balance={data?.balances[token.symbol]}
                  claimAmount={data?.claimAmounts[token.symbol]}
                  lastClaimLedger={data?.lastClaimLedgers[token.symbol]}
                  cooldownLedgers={data?.cooldownLedgers}
                  isLoading={isLoading}
                  isPending={pendingTokens.has(token.contractId) || isBulkPending}
                  isDisabled={claimDisabled}
                  onClaim={(selectedToken) => claimOne(selectedToken.contractId)}
                />
              ))}
            </div>

            {/* Claim panel */}
            <Card>
              <CardContent className="flex flex-col gap-4">
                <div>
                  <Text size="base" weight="medium">
                    Claim test tokens
                  </Text>
                  <Text size="md" tone="muted" className="mt-0.5">
                    Receive TUSDC, TWBTC, TETH, and TXLM in a single transaction. A cooldown
                    applies between claims.
                  </Text>
                </div>

                {mismatch && (
                  <Alert variant="warning">
                    <AlertDescription>
                      Switch your wallet to Stellar Testnet to claim.
                    </AlertDescription>
                  </Alert>
                )}

                {!isConnected ? (
                  <div className="flex flex-col items-center gap-2">
                    <Text size="md" tone="muted">
                      Connect your wallet to claim test tokens.
                    </Text>
                    <ConnectButton />
                  </div>
                ) : (
                  <LoadingButton
                    variant="default"
                    size="lg"
                    className="w-full"
                    isLoading={isBulkPending}
                    loadingText="Claiming…"
                    disabled={claimDisabled}
                    onClick={() => claimAll()}
                  >
                    Claim Test Tokens
                  </LoadingButton>
                )}

                {data?.cooldownLedgers != null && data.cooldownLedgers > 0 && (
                  <Text size="sm" tone="muted" className="text-center">
                    Cooldown: {data.cooldownLedgers.toLocaleString()} ledgers between claims
                  </Text>
                )}
              </CardContent>
            </Card>

            {/* Info panel */}
            <Card variant="muted">
              <CardContent className="px-5 py-4">
                <Text size="xs" tone="muted" weight="semibold" variant="label" className="mb-2">
                  Contract addresses
                </Text>
                <dl className="space-y-1.5">
                  {[
                    { label: "Faucet", id: FAUCET_CONTRACT_ID },
                    ...FAUCET_TOKENS.map((token) => ({
                      label: token.symbol,
                      id: token.contractId,
                    })),
                  ].map(({ label, id }) => (
                    <div key={label} className="flex items-center justify-between gap-3">
                      <Text size="sm" tone="muted" render={<dt />} className="w-12 shrink-0">
                        {label}
                      </Text>
                      <NumericText
                        role="muted"
                        size="xs"
                        render={<dd />}
                        className="min-w-0 truncate"
                      >
                        {id}
                      </NumericText>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
