import { NewsletterForm } from "./newsletter-form"
import { SocialSlider } from "./social-slider"

// TODO(GF3-003): real counts + URLs once socials are set up.
const SOCIAL_STATS = [
  { name: "Discord", value: "-", href: "#" },
  { name: "X", value: "-", href: "#" },
  { name: "Telegram", value: "-", href: "#" },
  { name: "GitHub", value: "Join", href: "#" },
]

const FOOTER_LINKS = [
  { label: "Referral terms", href: "#" },
  { label: "Media kit", href: "#" },
  { label: "Terms and conditions", href: "#" },
]

export function SocialSection() {
  return (
    <section className="border-t border-hairline border-gmx-slate-600 bg-gmx-slate-900 sm:border-t">
      <div className="py-20 sm:py-30">
        <SocialSlider />
      </div>

      <div className="mx-auto max-w-300 px-4 sm:px-10">
        <h2 className="text-heading-1 text-white">
          Driven by
          <br />
          our community.
        </h2>

        <div className="mt-9 flex flex-col gap-9 border-t border-hairline border-gmx-slate-600 pt-9 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-wrap gap-9">
            {SOCIAL_STATS.map(({ name, value, href }) => (
              <a key={name} href={href} className="group">
                <div className="text-14 text-gmx-slate-500 transition-all duration-180 group-hover:translate-x-0.5 group-hover:text-gmx-blue-300">
                  {name}
                </div>
                <div className="mt-1 text-40 font-medium text-white">{value}</div>
              </a>
            ))}
          </div>

          <NewsletterForm />
        </div>

        <div className="flex flex-col items-center gap-3 border-t border-hairline border-gmx-slate-600 py-5 sm:flex-row sm:justify-center sm:gap-3">
          {FOOTER_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-12 font-medium text-gmx-slate-500 transition-colors duration-180 hover:text-white active:text-white/80"
            >
              {label}
            </a>
          ))}
          <span className="flex items-center gap-1 text-12 font-medium text-gmx-slate-500">
            Charts by TradingView
          </span>
        </div>
      </div>
    </section>
  )
}
