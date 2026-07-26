// The shared `@repo/vitest-config/react` config expects `./vitest.setup.ts`.
// Import the existing setup module so its side-effects (jest-dom matchers,
// afterEach cleanup) still run when vitest resolves this path.
import "./setup-tests"
