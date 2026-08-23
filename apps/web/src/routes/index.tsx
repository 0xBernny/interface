import { createFileRoute } from "@tanstack/react-router"

import "../styles/landing.css"

import { Navbar } from "../ui/Navbar"
import { Hero } from "../ui/landing/hero"
import { Stats } from "../ui/landing/stats"
import { Features } from "../ui/landing/features"
import { Markets } from "../ui/landing/markets"
import { HowItWorks } from "../ui/landing/how-it-works"
import { Infrastructure } from "../ui/landing/infrastructure"
import { FinalCTA } from "../ui/landing/final-cta"
import { Footer } from "../ui/landing/footer"

export const Route = createFileRoute("/")({ component: LandingPage })

function LandingPage() {
  return (
    // GMX's landing is dark-only — force the `.dark` token scope on this
    // subtree regardless of the user's theme setting (docs/gf_3/001_theme_update.md §7),
    // without touching <html> so /trade, /pools, etc. keep honoring it.
    <div className="dark font-landing-sans min-h-svh bg-background text-foreground antialiased">
      <Navbar variant="landing" />
      <Hero />
      <Stats />
      <Features />
      <Markets />
      <HowItWorks />
      <Infrastructure />
      <FinalCTA />
      <Footer />
    </div>
  )
}
