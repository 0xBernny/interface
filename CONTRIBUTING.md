# Contributing to SO4 Market

Thanks for contributing. This document explains how to set up the repo, the
quality bar every change must clear, and how to get a pull request merged.

> **Working with an AI coding agent?** [`AGENTS.md`](./AGENTS.md) is the
> machine-facing contract and is mandatory reading for agents. It enforces the
> same gates described here. Humans should read this file.

---

## Table of Contents

- [Code of conduct](#code-of-conduct)
- [Getting set up](#getting-set-up)
- [The quality gate](#the-quality-gate)
- [Development workflow](#development-workflow)
- [Fixing issues properly](#fixing-issues-properly)
- [Commit conventions](#commit-conventions)
- [Pull requests](#pull-requests)
- [Project-specific gotchas](#project-specific-gotchas)
- [Reporting issues](#reporting-issues)

---

## Code of conduct

Be respectful and assume good intent. Critique code, not people. Maintainers may
remove comments, commits, and contributions that are abusive or off-topic.

---

## Getting set up

**Prerequisites**

| Tool | Version | Notes |
|---|---|---|
| [Bun](https://bun.sh) | see `packageManager` in `package.json` | Package manager and test runner |
| Node.js | >= 20 | Required by some tooling |
| [Stellar CLI](https://github.com/stellar/stellar-cli) | 27.x | Only needed to regenerate contract bindings |

```bash
git clone https://github.com/SO4-Markets/interface.git
cd interface
bun install --frozen-lockfile
```

Use `--frozen-lockfile`. It installs exactly what `bun.lock` pins and fails loudly
if `package.json` and the lockfile disagree, which is what CI does. A plain
`bun install` silently re-resolves versions and can hide dependency bugs from you
that CI will still catch. See [Project-specific gotchas](#project-specific-gotchas).

---

## The quality gate

**Every change must pass all of the following before you commit.** These are the
exact commands CI runs, in the same order. Run them from the repository root.

```bash
bun lint               # ESLint across all packages — zero errors
bun typecheck          # tsc --noEmit across all packages
bun run check:tokens   # design-token policy (no raw hex / arbitrary sizes)
bun run check:content  # docs frontmatter, nav, slug, freshness, and asset checks
bun run test           # unit tests
bun run test:coverage  # unit tests + coverage thresholds
bun run build          # production build of every package
```

If you touched the indexer or the web app, also run the
`Integration Checks` steps:

```bash
# Indexer
bun run --cwd apps/s03-indexer codegen
bun run --cwd apps/s03-indexer build
bun run --cwd apps/s03-indexer test
SO4_CONTRACTS_REPO="$PWD/apps/s03-indexer/tests/fixtures/contracts-repo" \
  bun run --cwd apps/s03-indexer sync:contracts:local
bash scripts/validate-manifest.sh apps/s03-indexer/config/contracts.local.json

# Web
bun run --cwd apps/web typecheck
bun run --cwd apps/web build
```

End-to-end tests are not part of the push CI, but run them for UI changes:

```bash
bunx playwright install --with-deps   # first time only
bun run test:e2e
```

### Non-negotiables

- **A red gate is never "unrelated".** If `main` is broken, fix it or say so
  explicitly in your PR. Do not layer changes onto a failing baseline.
- **Never silence a check to make it pass.** No `eslint-disable`, `@ts-ignore`,
  `@ts-expect-error`, `skip`/`only` on tests, lowered coverage thresholds, or
  new `check:tokens` allowlist entries *purely* to get green. Each of these is a
  legitimate tool with a legitimate use — the rule is that the justification must
  be the code, not the pipeline. If you use one, explain why in a comment and in
  the PR.
- **Warnings are not errors, but don't add them.** Lint currently passes with a
  small number of pre-existing warnings. Don't grow that number.

### Coverage thresholds

`packages/contracts` enforces: **85%** lines, **85%** branches, **80%**
statements, **65%** functions. Coverage reports land in each package's
`coverage/` directory. If your change drops coverage below the gate, add tests —
do not lower the threshold.

---

## Development workflow

### 1. Branch

Branch off `main` with a descriptive name:

```bash
git checkout -b feat/order-book-component
git checkout -b fix/chart-theme-flash
git checkout -b chore/upgrade-tanstack-query
```

### 2. Make focused changes

- Follow the existing feature-module structure (`components/`, `hooks/`,
  `lib/`, `data/`).
- One responsibility per file; keep components small.
- Prefer workspace imports (`@workspace/ui/...`) over deep relative paths.
- Use design tokens, not raw values — `check:tokens` enforces this. Text sizes
  and radii have named tokens in `packages/ui/src/styles/globals.css`.
- For docs content, run `bun run --cwd apps/docs check:content`. Use
  `bun run --cwd apps/docs check:content -- --fix` only for the mechanically
  fixable subset: `updated:` dates and manifest ordering.
- Comment non-obvious intent only. Don't restate the code.

### 3. Format

```bash
bun format
```

### 4. Run the full gate

See [The quality gate](#the-quality-gate). All of it, not a subset.

### 5. Verify in a clean checkout when touching dependencies

If you changed any `package.json`, `bun.lock`, `tsconfig.json`, or build config,
your local `node_modules` may not represent what CI installs. Verify in a clean
clone:

```bash
git clone file://$PWD /tmp/so4-cleanroom
cd /tmp/so4-cleanroom
bun install --frozen-lockfile
bun lint && bun typecheck && bun run check:content && bun run test && bun run build
```

This is not paranoia — it is how a whole class of "passes locally, fails in CI"
bugs in this repo were found. See [Project-specific gotchas](#project-specific-gotchas).

---

## Fixing issues properly

When you pick up an issue, the expectation is a complete fix, not a patch that
makes the symptom disappear.

1. **Reproduce it first.** If you cannot reproduce it, say so in the issue rather
   than guessing at a fix.
2. **Find the root cause.** Ask why the bad state was reachable at all. A `null`
   check that hides a value that should never have been `null` is not a fix.
3. **Fix the cause, not the symptom.** If the same bug class exists elsewhere in
   the codebase, fix those too or file a follow-up issue naming them.
4. **Add a regression test** that fails before your change and passes after.
   If a change genuinely cannot be tested, explain why in the PR.
5. **Address the whole issue.** If you can only complete part of it, say exactly
   what is left and why — do not quietly narrow the scope.
6. **Leave the campsite clean.** No commented-out code, stray debug logging, or
   `TODO` without an issue link.

Scope discipline matters as much as completeness: fix the issue you picked up,
and open separate PRs for unrelated cleanups you spot along the way.

---

## Commit conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add limit order confirmation dialog
fix: resolve chart flicker on theme toggle
fix(ci): pin stellar-cli action to a release tag
chore: upgrade lightweight-charts to 5.3
docs: document contract integration stubs
refactor: extract oracle normalisation into shared util
test: cover referral code storage helpers
```

**Types:** `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`, `build`, `ci`.

Write the body to explain **why**, not what — the diff already shows what. For
non-obvious fixes, state the root cause and how you verified it.

Keep commits logically scoped. Unrelated changes belong in separate commits.

---

## Pull requests

Open your PR against `main` with:

- **What** changed and **why**.
- **How you verified it** — which gate commands you ran, and their result.
- **Screenshots or recordings** for any UI change.
- **Linked issue** (`Closes #123`).
- Notes on contract-integration assumptions, if relevant.

A PR is ready for review when:

- [ ] Every command in [The quality gate](#the-quality-gate) passes locally.
- [ ] CI is green on the PR.
- [ ] New behaviour has tests.
- [ ] No check was disabled, skipped, or weakened to achieve green.
- [ ] Commits follow Conventional Commits.

Maintainers may ask for changes. Push follow-up commits rather than
force-pushing over review history, unless asked to rebase.

---

## Project-specific gotchas

These have each caused a real CI failure. Read them before debugging one.

### Do not rely on dependency hoisting

Bun's isolated linker does **not** hoist every transitive package to the root
`node_modules`. If a file imports a package, that package must be declared in
that workspace's own `package.json`.

A stale local `node_modules` can have leftovers that make an undeclared import
resolve on your machine and fail in CI. Two consequences worth knowing:

- A `declare module "x"` augmentation whose specifier does not resolve is
  **silently ignored** — TypeScript creates a new ambient module instead of
  merging, and the types you expected simply are not there.
- Hardcoded paths like `../../node_modules/<pkg>` in a `tsconfig.json` will not
  resolve. Reference the package-local `./node_modules/<pkg>` instead.

### Generated code is not always regenerable in place

- `apps/s03-indexer/src/types` is **gitignored** and produced by
  `bun run --cwd apps/s03-indexer codegen`. Any script that compiles the indexer
  must run codegen first, or it will fail on a fresh checkout.
- `packages/contracts/src/generated` is checked in but carries **hand-written
  adaptations** (camelCase fields, extra `*Args` / `*Val` helpers) that
  `src/clients` imports. Running `bun run contracts:gen:all` overwrites them and
  breaks typecheck. See `packages/contracts/contracts.json`.

### Contract IDs are committed, not environment variables

This protocol is open source and contract IDs are public on-chain identifiers.
They live in `packages/contracts/contracts.json`. Regenerating bindings needs no
secrets:

```bash
bun run contracts:gen:all                  # all bindings
bun run contracts:gen:all exchange-router  # just one
```

### Mocked network in web tests

Web tests run with MSW and `onUnhandledRequest: "error"`. Every request a test
makes needs an explicit handler — add shared ones in
`apps/web/test/msw/handlers.ts`, or per-test with `server.use(...)`. Tests must
never depend on real network calls.

---

## Reporting issues

Open a GitHub issue with:

- A clear title and description.
- Steps to reproduce, for bugs.
- Expected vs actual behaviour.
- Browser / OS / Bun version, if relevant.
- Relevant logs — the failing command's output, not a screenshot of it.

For suspected security vulnerabilities, do **not** open a public issue. Contact
the maintainers privately.
