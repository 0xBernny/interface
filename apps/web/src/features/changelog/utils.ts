import {
  CHANGELOG_AREAS,
  CHANGELOG_ENTRY_TYPES
  
} from "./types"
import { isChangelogEntryType } from "./lib/changelog-client"
import type {ChangelogEntryType} from "./types";
import type { StatusVariant } from "@workspace/ui/components/status-badge"

export const CHANGELOG_TYPES = CHANGELOG_ENTRY_TYPES

export function typeToVariant(type: string): StatusVariant {
  const map: Record<ChangelogEntryType, StatusVariant> = {
    added: "success",
    changed: "info",
    fixed: "info-subtle",
    deprecated: "muted",
    removed: "danger-subtle",
    security: "warning",
  }

  return isChangelogEntryType(type) ? map[type] : "neutral"
}

export function typeLabel(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1)
}

export function areaLabel(area: string): string {
  const map: Record<string, string> = {
    trade: "Trading",
    pools: "Pools",
    earn: "Earn",
    referrals: "Referrals",
    faucet: "Faucet",
    wallet: "Wallet",
    docs: "Documentation",
    ci: "CI",
    internal: "Internal",
  }
  return map[area] || area
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export { CHANGELOG_AREAS }
