import { Link } from "@tanstack/react-router"

function EyebrowPill({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-8 bg-linear-to-r from-gmx-blue-400/20 to-gmx-blue-300/20 px-2.5 py-1 text-12 font-medium text-gmx-blue-300">
      {children}
    </span>
  )
}

export function ProgramCards() {
  return (
    <section className="relative w-full overflow-hidden bg-gmx-slate-900 pt-15 text-white sm:pt-30">
      {/* TODO(GF3-003): replace with the real home_program_glow.png equivalent */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,var(--color-gmx-blue-400)/0.12,transparent_70%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-300 px-4 sm:px-10">
        <h2 className="text-heading-1">
          Built for those
          <br />
          who do more.
        </h2>

        <div className="mt-9 grid grid-cols-1 gap-6 pb-20 sm:pb-30 lg:grid-cols-2">
          {/* Card 1: VIP / referrals */}
          <div className="relative overflow-hidden rounded-20 border border-hairline border-gmx-slate-600/50 bg-gmx-slate-800 p-9 shadow-[0_6px_8px_-6px_var(--color-gmx-card-shadow)]">
            <div className="flex gap-2">
              <EyebrowPill>For large traders</EyebrowPill>
              <EyebrowPill>For affiliates</EyebrowPill>
            </div>
            <h3 className="mt-6 text-heading-4">Trade size. Or refer those who do.</h3>
            <p className="mt-3 max-w-[320px] text-description">
              Up to 25% off fees for high-volume traders. Up to 25% earnings for affiliates. Plus
              personal support.
            </p>
            <Link
              to="/referrals"
              className="btn-landing mt-6 inline-flex rounded-8 px-4 py-2.5 text-14"
            >
              Explore the referrals program
            </Link>
          </div>

          {/* Card 2: developers */}
          <div className="relative overflow-hidden rounded-20 border border-hairline border-gmx-slate-600/50 bg-gmx-slate-800 p-9 shadow-[0_6px_8px_-6px_var(--color-gmx-card-shadow)]">
            <div className="flex gap-2">
              <EyebrowPill>For developers &amp; teams</EyebrowPill>
              <EyebrowPill>Integrate SO4</EyebrowPill>
            </div>
            <h3 className="mt-6 text-heading-4">Build on so4. Get paid on every trade.</h3>
            <p className="mt-3 max-w-[320px] text-description">
              Onchain revenue in stablecoins — your own builder fee plus a cut of so4&apos;s fees,
              every time someone trades through you.
            </p>
            {/* TODO(GF3-003): link to real developer docs once published */}
            <a href="#" className="btn-landing mt-6 inline-flex rounded-8 px-4 py-2.5 text-14">
              Explore the developer program
            </a>
            {/* TODO(GF3-003): replace with the real CodeSnippet panel */}
            <div className="mt-6 rounded-8 bg-gmx-slate-900 p-4 font-mono-num text-12 text-gmx-slate-400">
              sdk.execute(...)
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
