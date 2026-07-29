import "vitest"

/**
 * vitest-axe@0.1.0 augments the legacy global `Vi` namespace, which Vitest 3 no
 * longer reads. Re-declare the matcher against the modern `vitest` module so
 * `expect(results).toHaveNoViolations()` type-checks. The matcher itself is
 * registered in ./vitest.setup.ts.
 */
declare module "vitest" {
  interface Assertion {
    toHaveNoViolations: () => void
  }
  interface AsymmetricMatchersContaining {
    toHaveNoViolations: () => void
  }
}
