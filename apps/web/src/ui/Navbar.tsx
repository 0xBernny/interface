import { Link } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import { ThemeToggle } from "./theme-toggle"
import {
  HamburgerButton,
  SiteLogo,
  containerClass,
  desktopActiveLinkClass,
  desktopLinkClass,
  mobileActiveLinkClass,
  mobileLinkClass,
  navOuterClass,
  useMobileMenu,
} from "./nav/primitives"
import { ConnectButton } from "@/features/wallet/components/ConnectButton"

const LANDING_LINKS = [
  { label: "Trade", href: "/trade" },
  { label: "Earn", href: "/earn" },
  { label: "Stats", href: "#" },
  { label: "Docs", href: "#" },
  { label: "Governance", href: "#" },
]

const APP_LINKS: Array<{ label: string; to: "/trade" | "/pools" | "/earn" | "/referrals" | "/faucet" | null }> = [
  { label: "Trade", to: "/trade" },
  { label: "Pools", to: "/pools" },
  { label: "Earn", to: "/earn" },
  { label: "Referrals", to: "/referrals" },
  { label: "Faucet", to: "/faucet" },
  { label: "Stats", to: null },
  { label: "Docs", to: null },
]

type Props = {
  variant: "landing" | "app"
}

export function Navbar({ variant }: Props) {
  const { open, toggle, close } = useMobileMenu()
  const isApp = variant === "app"

  return (
    <nav className={navOuterClass}>
      <div
        className={`${containerClass} ${
          isApp ? "h-14 max-w-full" : "h-16 max-w-330"
        }`}
      >
        <div className="min-w-0 shrink">
          <SiteLogo variant={variant} />
        </div>

        {/* Desktop links */}
        <ul className="hidden items-center gap-7 md:flex">
          {isApp
            ? APP_LINKS.map(({ label, to }) => (
                <li key={label}>
                  {to ? (
                    <Link
                      to={to}
                      className={desktopLinkClass}
                      activeOptions={{ exact: true }}
                      activeProps={{ className: desktopActiveLinkClass }}
                    >
                      {label}
                    </Link>
                  ) : (
                    <span className="cursor-default text-13-5 text-muted-foreground/40">
                      {label}
                    </span>
                  )}
                </li>
              ))
            : LANDING_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className={desktopLinkClass}>
                    {label}
                  </a>
                </li>
              ))}
        </ul>

        {/* Actions */}
        <div className="flex min-w-0 shrink-0 items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
          <ConnectButton />
          {!isApp && (
            <Button
              variant="default"
              className="btn-landing hidden h-9.5 gap-2 px-4 text-13-5 sm:inline-flex"
            >
              Launch app
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </Button>
          )}
          <HamburgerButton open={open} onToggle={toggle} />
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="border-t border-border bg-background px-4 pb-4 md:hidden">
          <ul className="flex flex-col gap-1 pt-2">
            {isApp
              ? APP_LINKS.map(({ label, to }) => (
                  <li key={label}>
                    {to ? (
                      <Link
                        to={to}
                        className={mobileLinkClass}
                        activeOptions={{ exact: true }}
                        activeProps={{ className: mobileActiveLinkClass }}
                        onClick={close}
                      >
                        {label}
                      </Link>
                    ) : (
                      <span className="block rounded py-2 text-sm text-muted-foreground/40">
                        {label}
                      </span>
                    )}
                  </li>
                ))
              : LANDING_LINKS.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="block rounded py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                      onClick={close}
                    >
                      {label}
                    </a>
                  </li>
                ))}
          </ul>
          {!isApp && (
            <Button variant="default" className="btn-landing mt-3 w-full gap-2">
              Launch app →
            </Button>
          )}
        </div>
      )}
    </nav>
  )
}
