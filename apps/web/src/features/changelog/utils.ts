import type { ChangelogEntryType } from "./types"

export const CHANGELOG_TYPES: ChangelogEntryType[] = [
  "added",
  "changed",
  "deprecated",
  "removed",
  "fixed",
  "security",
]

export const CHANGELOG_AREAS = [
  "trade",
  "pools",
  "earn",
  "referrals",
  "faucet",
  "wallet",
  "docs",
  "ci",
  "internal",
]

export function typeToVariant(type: ChangelogEntryType) {
  const map: Record<ChangelogEntryType, string> = {
    added: "success",
    changed: "info",
    deprecated: "warning",
    removed: "danger",
    fixed: "info",
    security: "warning",
  }
  return map[type]
}

export function typeLabel(type: ChangelogEntryType): string {
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

export function createAnchor(version: string): string {
  return `#v${version.replace(/\./g, "-")}`
}
