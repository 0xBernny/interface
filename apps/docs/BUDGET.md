# Docs performance budget (DX-060)

This file documents the committed budgets for `apps/docs` and the measured baseline at the time they were set. Future changes must argue against this baseline.

## Budgets (committed)

| Asset | Budget | Measured (2026-09-01) | Headroom |
|-------|--------|-----------------------|----------|
| Initial JS (largest chunk) | 350 KB | 185 KB | 165 KB |
| Initial CSS (largest) | 80 KB | 42 KB | 38 KB |
| Largest HTML page | 120 KB | 78 KB | 42 KB |
| Search index (pagefind, lazy) | 400 KB | 185 KB | 215 KB |

*All sizes are raw bytes /1024 (uncompressed). JS/CSS are Vite chunks in `.nitro-static/assets`. HTML is max `index.html` in `.nitro-static`.*

Source of truth: `apps/docs/budgets.json`. Vite (`vite.config.ts` → `docsBudgetGuard`) enforces JS/CSS at build time; `scripts/check-budget.ts` enforces HTML and search-index and is run in CI after `build`.

## Why these numbers

- **Initial JS 350 KB** — Docs is build-time MDX + build-time Shiki/Mermaid; client JS is only sidebar, theme toggle, search dialog, reading progress, and version picker. Adding a large client library (e.g. `chart.js` ~500 KB, `lodash` full) will breach the budget and fail CI. Demonstrate by importing `chart.js` in a docs page and running `bun run --cwd apps/docs check:budget` → error names the offending chunk.
- **Initial CSS 80 KB** — Tailwind v4 + `@workspace/ui` tokens; docs defines no extra tokens (DESIGN.md).
- **Largest HTML 120 KB** — Longest concept/guide is ~1100 words + code; 120 KB headroom allows one extra long page without breach.
- **Search index 400 KB** — Pagefind index is lazily loaded (`/pagefind/pagefind.js` defer, not in initial HTML). Budget ensures index pruning before it bloats initial payload.

## Enforcement

```bash
# Vite guard (JS/CSS) — runs inside `bun run --cwd apps/docs build`
# Fails build with: [docs-budget] Initial JS budget exceeded! Chunk "..." is ... KB

# HTML + search-index guard — runs after build
bun run --cwd apps/docs check:budget
# On breach, report names offending asset, e.g.:
# - Largest HTML budget exceeded: 145.20 KB > 120 KB ... Offending asset: /concepts/risk/index.html
# - Search index in initial payload: HTML "/index.html" references pagefind in blocking script

# Lighthouse CI — mobile, representative pages
bun run --cwd apps/docs build && bunx lhci autorun --config=./lighthouserc.json
# Thresholds: performance ≥0.80, accessibility ≥0.90, best-practices ≥0.90 (mobile)
```

CI runs `check:budget` after `build` and runs Lighthouse via `lighthouserc.json`. Thresholds are currently met (see `lighthouserc.json`).

## Updating budgets

To increase a budget intentionally:

1. Measure new size: `bun run --cwd apps/docs build && bun run --cwd apps/docs check:budget` (it will report actual).
2. Edit `budgets.json` `initialJsKb` / `initialCssKb` / `maxHtmlKb` and update `measured`/`headroom` to reflect new baseline.
3. Document rationale in this file (why the growth is justified, what was measured).
4. Commit with files `budgets.json` + `BUDGET.md` + the change that grew the bundle.

Do not raise budgets to make CI green without measurement and rationale.

## Search index not in initial payload

Guaranteed by:

- No `<script src="...pagefind...">` in any `.nitro-static/**/*.html` (checked by `check-budget.ts`).
- Pagefind is loaded lazily via `pagefind --site` output and `defer` dynamic import in `SearchDialog`.

If a page imports pagefind statically, `check:budget` will fail naming the offending HTML.
