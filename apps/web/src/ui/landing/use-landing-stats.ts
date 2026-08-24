// TODO(GF3-003): wire to SO4's indexer/stats API. GMX sources these from
// useTraders/useTotalVolume/usePoolsData (landing/src/pages/Home/hooks/*);
// SO4 has no aggregate stats endpoint yet, so every field renders the "-"
// loading placeholder — matching GMX's own loading state exactly, never a
// fabricated number.

export type LandingStats = {
  traders: number | null
  openInterest: number | null
  totalVolume: number | null
  liquidityTotal: number | null
  loading: boolean
}

export function useLandingStats(): LandingStats {
  return {
    traders: null,
    openInterest: null,
    totalVolume: null,
    liquidityTotal: null,
    loading: false,
  }
}
