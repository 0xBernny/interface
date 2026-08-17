import { useLocation } from "@tanstack/react-router"
import { Button } from "@workspace/ui/components/button"
import { ThemeToggle } from "../theme-toggle"
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
} from "../nav/primitives"
import { ConnectButton } from "@/features/wallet/components/ConnectButton"

const NAV_LINKS = [
  { label: "Trade", href: "/trade" },
  { label: "Earn", href: "/earn" },
  { label: "Stats", href: "#" },
  { label: "Docs", href: "#" },
  { label: "Governance", href: "#" },
]

export function Nav() {
  const { open, toggle, close } = useMobileMenu()
  const { pathname } = useLocation()
  const isActive = (href: string) => href !== "#" && pathname === href

  return (
    <nav className={navOuterClass}>
      <div className={`${containerClass} h-16 max-w-330`}>
        <SiteLogo variant="landing" />

        {/* Desktop nav links */}
        <ul className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                className={isActive(href) ? desktopActiveLinkClass : desktopLinkClass}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <ConnectButton />
          <HamburgerButton open={open} onToggle={toggle} />
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="border-t border-border bg-background px-4 pb-4 md:hidden">
          <ul className="flex flex-col gap-1 pt-2">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className={isActive(href) ? mobileActiveLinkClass : mobileLinkClass}
                  onClick={close}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <Button variant="default" className="mt-3 w-full gap-2">
            Launch app →
          </Button>
        </div>
      )}
    </nav>
  )
}
