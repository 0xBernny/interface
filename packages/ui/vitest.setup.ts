import "@testing-library/jest-dom/vitest"
// vitest-axe@0.1.0 ships an empty `extend-expect` entry, so the matcher has to
// be registered by hand (its typings live in ./axe-matchers.d.ts).
import * as axeMatchers from "vitest-axe/matchers"
import { afterEach, expect } from "vitest"
import { cleanup } from "@testing-library/react"

expect.extend(axeMatchers)

afterEach(() => {
  cleanup()
})
