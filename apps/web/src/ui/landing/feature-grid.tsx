import { Link } from "@tanstack/react-router"
import { Icon } from "@workspace/ui/components/icon"
import { Tick02Icon } from "@hugeicons/core-free-icons"
import { IconBox } from "./icon-box"

const CHIPS = ["No deposits required", "Trade from your wallet", "No loss of fund ownership"]

function GearsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="9" cy="9" r="3" />
      <circle cx="17" cy="17" r="2.5" />
      <path d="M9 3v2m0 8v2m6-6h-2M5 9H3m4.24-4.24L5.83 3.34m6.34 6.34 1.41-1.41" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 2 4 6v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V6l-8-4z" />
    </svg>
  )
}

export function FeatureGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 py-20 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-3 lg:py-30">
      {/* Guaranteed liquidity */}
      <div className="rounded-20 border border-hairline border-gmx-slate-600 bg-gmx-slate-800 p-9">
        <IconBox>
          <GearsIcon />
        </IconBox>
        <div className="mt-9 border-t border-hairline border-gmx-slate-600 pt-6">
          <p className="text-12 uppercase tracking-[0.864px] text-gmx-slate-500">Trade with confidence</p>
          <h3 className="mt-2 text-heading-4 text-white">Guaranteed liquidity</h3>
          <p className="mt-3 text-description">
            Benefit from up to 100x leverage and guaranteed on-chain liquidity that&apos;s not dependent
            on order book depth.
          </p>
        </div>
      </div>

      {/* Stay safe from liquidations — blue card, spans 2 rows */}
      <div className="relative overflow-hidden rounded-20 bg-gmx-blue-400 p-9 lg:row-span-2">
        <IconBox>
          <ShieldIcon />
        </IconBox>
        <div className="mt-9">
          <h3 className="text-heading-4 text-white">Stay safe from liquidations</h3>
          <p className="mt-3 text-16 text-white/70">
            Avoid price wicks with transparent, sub-second Chainlink price feeds tailor-made for so4.
          </p>
        </div>
        {/* TODO(GF3-003): replace with the real protection-shield illustration */}
        <div className="mt-6 aspect-square w-3/5 rounded-full bg-white/10" aria-hidden="true" />
      </div>

      {/* Support for numerous assets — spans 2 rows */}
      <div className="rounded-20 border border-hairline border-gmx-slate-600 bg-gmx-slate-800 p-9 lg:row-span-2">
        <IconBox>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="3" y="3" width="7" height="7" rx="2" />
            <rect x="14" y="3" width="7" height="7" rx="2" />
            <rect x="3" y="14" width="7" height="7" rx="2" />
            <rect x="14" y="14" width="7" height="7" rx="2" />
          </svg>
        </IconBox>
        <div className="mt-9">
          <h3 className="text-heading-4 text-white">Support for numerous assets</h3>
          <p className="mt-3 text-description">Use your preferred token to pay and collateralize positions.</p>
        </div>
        {/* TODO(GF3-003): replace with the real chain-icon cluster illustration */}
        <div className="mt-6 flex flex-wrap gap-2" aria-hidden="true">
          {Array.from({ length: 7 }).map((_, i) => (
            <span key={i} className="size-8 rounded-full bg-gmx-slate-650" />
          ))}
        </div>
      </div>

      {/* Save on costs */}
      <div className="rounded-20 border border-hairline border-gmx-slate-600 bg-gmx-slate-800 p-9">
        <IconBox>
          <ShieldIcon />
        </IconBox>
        <div className="mt-9 border-t border-hairline border-gmx-slate-600 pt-6">
          <p className="text-12 uppercase tracking-[0.864px] text-gmx-slate-500">Keep more of what you earn</p>
          <h3 className="mt-2 text-heading-4 text-white">Save on costs</h3>
          <p className="mt-3 text-description">
            Trade at scale without worrying about thin order books or slippage.
          </p>
        </div>
      </div>

      {/* Secure & permissionless */}
      <div className="rounded-20 border border-hairline border-gmx-slate-600 bg-gmx-slate-800 p-9">
        <h3 className="text-heading-4 text-white">Secure &amp; permissionless</h3>
        <div className="mt-5 flex flex-col gap-2.5">
          {CHIPS.map((chip) => (
            <span
              key={chip}
              className="inline-flex items-center gap-2 rounded-8 bg-gmx-slate-650/50 px-3 py-2 text-14 text-white"
            >
              <Icon icon={Tick02Icon} size="sm" className="text-gmx-blue-400" />
              {chip}
            </span>
          ))}
        </div>
      </div>

      {/* Seamless trading — wide CTA card, spans 2 cols */}
      <div className="relative overflow-hidden rounded-20 bg-linear-to-br from-gmx-slate-800 to-gmx-slate-650 p-9 sm:col-span-2">
        <h3 className="text-heading-4 max-w-[420px] text-white">Seamless trading</h3>
        <p className="mt-3 max-w-[420px] text-description">
          Enjoy a frictionless trading experience with One-Click Trading and Express Trading.
        </p>
        <Link to="/trade" className="btn-landing mt-6 inline-flex rounded-8 px-4 py-2.5 text-14">
          Trade now
        </Link>
      </div>
    </div>
  )
}
