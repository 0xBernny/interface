import { useEffect, useRef, useState } from "react"

// TODO(GF3-003): swap the rotation copy for SO4-specific markets (keep GMX's
// first/last per the spec — final wording lands with GF3-003).
const ROTATING_WORDS = [
  "with 100x leverage",
  "100+ crypto tokens",
  "multiple asset classes",
  "deep liquid markets",
  "from 7 blockchains",
]

const HOLD_MS = 2500
const TRANSITION_MS = 250

export function AnimatedTitle() {
  const [index, setIndex] = useState(0)
  // "in" plays on every word change except the very first mount (no
  // entrance animation needed before the reader has seen anything yet —
  // this also keeps first paint deterministic for visual-regression tests,
  // since Playwright's animation freeze can't reliably override an inline
  // `style.animation` referencing a custom property).
  const [phase, setPhase] = useState<"idle" | "out" | "in">("idle")
  const reducedMotionRef = useRef(false)

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  }, [])

  useEffect(() => {
    if (reducedMotionRef.current) return

    const holdTimer = setInterval(() => {
      setPhase("out")
      const outTimer = setTimeout(() => {
        setIndex((i) => (i + 1) % ROTATING_WORDS.length)
        setPhase("in")
      }, TRANSITION_MS)
      return () => clearTimeout(outTimer)
    }, HOLD_MS)

    return () => clearInterval(holdTimer)
  }, [])

  return (
    <span className="relative inline-block h-[1em] overflow-hidden align-bottom">
      <span
        key={index}
        className="inline-block text-gmx-blue-400"
        style={{
          animation:
            reducedMotionRef.current || phase === "idle"
              ? "none"
              : phase === "in"
                ? "var(--animate-title-in)"
                : "var(--animate-title-out)",
        }}
      >
        {ROTATING_WORDS[index]}
      </span>
    </span>
  )
}
