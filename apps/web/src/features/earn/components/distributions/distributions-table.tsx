import { Badge } from "@workspace/ui/components/badge"
import { NumericText } from "@workspace/ui/components/numeric"
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
import type { BadgeVariant } from "../../lib/badges"
import { formatUsd } from "@/shared/lib/format"

// ── Types ────────────────────────────────────────────────────────────────────

export type DistributionStatus =
  | "distributed"
  | "pending"
  | "upcoming"
  | "claim"
  | "claimed"

export type DistributionRow = {
  epoch: string
  date: string
  amountUsd: number
  token: string
  status: DistributionStatus
  txHash?: string
}

// ── Status mapping ───────────────────────────────────────────────────────────

const STATUS_VARIANT = {
  distributed: "success",
  pending: "warning",
  upcoming: "muted",
  claim: "info",
  claimed: "success",
} as const satisfies Record<DistributionStatus, BadgeVariant>

const STATUS_LABEL: Record<DistributionStatus, string> = {
  distributed: "Distributed",
  pending: "Pending",
  upcoming: "Upcoming",
  claim: "Claim",
  claimed: "Claimed",
}

// ── Main component ───────────────────────────────────────────────────────────

type DistributionsTableProps = {
  /** Rows to render. An empty array triggers the empty-state message. */
  distributions: Array<DistributionRow>
  /** Fires when the user clicks a "Claim" badge. Receives the epoch id. */
  onClaim?: (epochId: string) => void
}

/**
 * Presentational table listing reward distributions.
 *
 * Columns: Epoch · Date · Amount (USD) · Token · Status · Tx
 *
 * The `status` field drives what renders in the Status column:
 *  - `"claim"` → interactive Claim button (fires `onClaim`)
 *  - everything else → static badge
 */
export function DistributionsTable({ distributions, onClaim }: DistributionsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableHeadRow>
          <TableHead>Epoch</TableHead>
          <TableHead>Date</TableHead>
          <TableHead align="right">Amount</TableHead>
          <TableHead>Token</TableHead>
          <TableHead>Status</TableHead>
          <TableHead align="right">Tx</TableHead>
        </TableHeadRow>
      </TableHeader>
      <TableBody>
        {distributions.length > 0 ? (
          distributions.map((row) => (
            <TableRow key={`${row.epoch}-${row.token}`}>
              <TableCell>
                <NumericText role="muted">{row.epoch}</NumericText>
              </TableCell>
              <TableCell className="text-muted-foreground">{row.date}</TableCell>
              <TableCell align="right">
                <NumericText>{formatUsd(row.amountUsd)}</NumericText>
              </TableCell>
              <TableCell>
                <NumericText>{row.token}</NumericText>
              </TableCell>
              <TableCell>
                {row.status === "claim" ? (
                  <Badge
                    variant={STATUS_VARIANT.claim}
                    render={<button type="button" onClick={() => onClaim?.(row.epoch)} />}
                  >
                    Claim
                  </Badge>
                ) : (
                  <Badge variant={STATUS_VARIANT[row.status]}>
                    {STATUS_LABEL[row.status]}
                  </Badge>
                )}
              </TableCell>
              <TableCell align="right">
                <NumericText role="muted" className={row.txHash ? undefined : "opacity-50"}>
                  {row.txHash ? `${row.txHash.slice(0, 8)}…` : "—"}
                </NumericText>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableEmptyRow colSpan={6}>
            <EmptyState
              title="No distributions yet"
              description="Your distribution history will appear here once the protocol goes live"
            />
          </TableEmptyRow>
        )}
      </TableBody>
    </Table>
  )
}
