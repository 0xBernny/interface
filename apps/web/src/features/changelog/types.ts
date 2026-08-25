export type ChangelogEntryType = "added" | "changed" | "deprecated" | "removed" | "fixed" | "security"
export type ChangelogArea = "trade" | "pools" | "earn" | "referrals" | "faucet" | "wallet" | "docs" | "ci" | "internal"

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
  entries: ChangelogEntry[]
}

export interface ChangelogData {
  releases: Release[]
}

export type ChangelogSearch = {
  type?: ChangelogEntryType
  area?: ChangelogArea
  q?: string
}
