import type changelogJson from "../../../public/changelog.json"

/**
 * The response model is derived from the generated DX-005 JSON artifact. This
 * keeps the UI coupled to the producer's shape instead of maintaining a second
 * release interface by hand.
 */
export type ChangelogData = typeof changelogJson
export type Release = ChangelogData["releases"][number]
export type ChangelogEntry = Release["entries"][number]

export const CHANGELOG_ENTRY_TYPES = [
  "added",
  "changed",
  "deprecated",
  "removed",
  "fixed",
  "security",
] as const

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
] as const

export type ChangelogEntryType = (typeof CHANGELOG_ENTRY_TYPES)[number]
export type ChangelogArea = (typeof CHANGELOG_AREAS)[number]

export type ChangelogSearch = {
  type?: ChangelogEntryType
  area?: ChangelogArea
  q?: string
}
