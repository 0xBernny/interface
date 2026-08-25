export type ChangelogEntryType = "added" | "changed" | "deprecated" | "removed" | "fixed" | "security"
export type ChangelogArea =
  | "trade"
  | "pools"
  | "earn"
  | "referrals"
  | "faucet"
  | "wallet"
  | "docs"
  | "general"
  | "ci"
  | "internal"

export interface ChangelogEntry {
  type: ChangelogEntryType
  area: ChangelogArea
  text: string
  pr: number | null
  breaking: boolean
}

export interface Release {
  version: string
  date: string
  yanked: boolean
  entries: Array<ChangelogEntry>
}

export interface ChangelogData {
  releases: Array<Release>
  /** True when older releases live in /changelog.archive.json (DX-012). */
  hasArchive?: boolean
}

export type ChangelogSearch = {
  type?: ChangelogEntryType
  area?: ChangelogArea
  q?: string
  /** Show ci/internal entries; URL-backed so the view stays shareable (DX-010). */
  showInternal?: boolean
}
