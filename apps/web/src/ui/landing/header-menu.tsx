import { Link } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import {
  HamburgerButton,
  SiteLogo,
  useMobileMenu,
} from "../nav/primitives"

const NAV_LINKS: Array<{ label: string; to: "/trade" | "/pools" | "/earn" | "/referrals" }> = [
  { label: "Trade", to: "/trade" },
  { label: "Pools", to: "/pools" },
  { label: "Earn", to: "/earn" },
  { label: "Referrals", to: "/referrals" },
]

const SOCIALS = [
  { label: "X", href: "#" },
  { label: "Discord", href: "#" },
  { label: "Telegram", href: "#" },
  { label: "GitHub", href: "#" },
]

function OpenAppButton({ className }: { className?: string }) {
  return (
    <Button
      render={<Link to="/trade" />}
      variant="default"
      className={`btn-landing rounded-8 px-4 py-2.5 text-14 ${className ?? ""}`}
    >
      Open app
    </Button>
  )
}

export function HeaderMenu() {
  const { open, toggle, close } = useMobileMenu()

  return (
    <header className="fixed top-0 z-30 w-full bg-gmx-slate-900">
      <div className="mx-auto flex h-auto max-w-300 items-center justify-between px-4 py-3 sm:px-10 sm:py-4">
        <a href="/" className="flex h-5 items-center sm:h-6">
          <SiteLogo variant="landing" />
        </a>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-5.5 sm:flex">
          {NAV_LINKS.map(({ label, to }) => (
            <li key={label}>
              <Link
                to={to}
                className="text-14 font-medium tracking-[-0.448px] text-white/80 transition-colors duration-180 hover:text-white [&.active]:text-white/60"
              >
                {label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href="#"
              className="text-14 font-medium tracking-[-0.448px] text-white/80 transition-colors duration-180 hover:text-white"
            >
              Docs
            </a>
          </li>
        </ul>

        <div className="flex items-center gap-3">
          <OpenAppButton className="hidden sm:inline-flex" />
          <HamburgerButton open={open} onToggle={toggle} />
        </div>
      </div>

      {/* Mobile full-screen menu */}
      {open && (
        <div className="fixed inset-0 top-16 z-20 flex flex-col bg-gmx-slate-900 sm:hidden">
          <ul className="flex flex-1 flex-col overflow-y-auto px-4">
            {NAV_LINKS.map(({ label, to }) => (
              <li key={label} className="border-t border-hairline border-gmx-slate-600">
                <Link to={to} className="block py-4 text-16 font-medium text-white" onClick={close}>
                  {label}
                </Link>
              </li>
            ))}
            <li className="border-t border-hairline border-gmx-slate-600">
              <a href="#" className="block py-4 text-16 font-medium text-white" onClick={close}>
                Docs
              </a>
            </li>
          </ul>
          <div className="px-4 pb-2">
            <OpenAppButton className="w-full justify-center" />
          </div>
          <div className="border-t border-hairline border-gmx-slate-600 px-4 py-5">
            <p className="text-12 text-gmx-slate-500">Driven by our community</p>
            <div className="mt-3 flex gap-4">
              {SOCIALS.map(({ label, href }) => (
                <a key={label} href={href} className="text-12 text-gmx-slate-400">
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
