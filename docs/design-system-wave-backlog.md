# SO4 Design System — Stellar Wave Backlog

This backlog turns the SO4 interface into a coherent, reusable design system
inspired by Linear's calm information density and Vercel's Geist foundations.
It is intentionally an adaptation, not a clone: SO4 keeps its blue market
accent, data-heavy trading character, and existing React/Tailwind architecture.

## Direction

- Use Geist Sans for interface copy and Geist Mono for prices, balances,
  addresses, percentages, timestamps, and other tabular data.
- Build hierarchy with warm-neutral tonal surfaces and restrained contrast.
- Reserve blue for interaction and selection; reserve green, red, and amber for
  financial meaning.
- Prefer compact controls, soft separators, and predictable alignment.
- Make structure felt through surface tone and spacing before adding borders.
- Support light, dark, system, reduced-motion, and high-contrast preferences.
- Keep tokens in `packages/ui`; feature code should consume semantic primitives.

Research references:

- Linear, "How we redesigned the Linear UI":
  https://linear.app/now/how-we-redesigned-the-linear-ui
- Linear, "A calmer interface for a product in motion":
  https://linear.app/now/behind-the-latest-design-refresh
- Vercel Geist typography: https://vercel.com/geist/typography
- Vercel Geist colors: https://vercel.com/geist/colors
- DESIGN.md format: https://github.com/google-labs-code/design.md

## How to use this backlog

Each item below is ready to become one GitHub issue. Add the labels
`design-system`, `frontend`, and `Stellar Wave` after the repository is approved
for the Stellar Wave Program. The complexity is a recommendation for the Drips
maintainer dashboard:

- **Trivial** — 100 points
- **Medium** — 150 points
- **High** — 200 points

Do not activate all 50 in the same Wave. Start with the Wave 1 set at the end of
this document, merge foundations first, then activate the next independent set.

---

## Foundations

### DS-001: Add a machine-readable SO4 `DESIGN.md`

**Complexity:** Medium  
**Suggested labels:** `design-system`, `documentation`, `frontend`  
**Primary files:** `DESIGN.md`, `packages/ui/src/styles/globals.css`

Document SO4's color, typography, spacing, shape, elevation, motion, and
component rules using the open DESIGN.md structure. Values must describe the
tokens that exist in code, not an aspirational second system.

**Acceptance criteria**

- `DESIGN.md` contains token frontmatter and human-readable guidance.
- Light/dark colors, typography roles, spacing, radii, and core components are covered.
- The document states when to use Geist Mono and semantic market colors.
- Every documented token maps to a CSS variable or a clearly marked planned token.

### DS-002: Define semantic surface tokens for light and dark themes

**Complexity:** Medium  
**Suggested labels:** `design-system`, `css`, `theme`  
**Primary files:** `packages/ui/src/styles/globals.css`

Replace the generic page/card/popover hierarchy with explicit canvas, sunken,
raised, overlay, and interactive surface roles using OKLCH values.

**Acceptance criteria**

- Both themes expose at least `surface-canvas`, `surface-sunken`,
  `surface-raised`, `surface-overlay`, and `surface-interactive`.
- Tailwind utilities can consume every new token.
- Existing shadcn aliases remain compatible during migration.
- A small demo or test fixture shows the five layers in both themes.

### DS-003: Define semantic text and icon color tokens

**Complexity:** Medium  
**Suggested labels:** `design-system`, `css`, `accessibility`  
**Primary files:** `packages/ui/src/styles/globals.css`

Create explicit primary, secondary, tertiary, disabled, inverse, and link roles
instead of relying on scattered opacity modifiers.

**Acceptance criteria**

- Text and icon role tokens exist in light and dark themes.
- Primary and secondary body text meet WCAG AA on their intended surfaces.
- Existing `foreground` and `muted-foreground` aliases remain compatible.
- A usage comment or documentation snippet explains each role.

### DS-004: Add semantic trading-state color tokens

**Complexity:** Medium  
**Suggested labels:** `design-system`, `css`, `trading`  
**Primary files:** `packages/ui/src/styles/globals.css`

Define consistent positive/long, negative/short, warning/liquidation,
informational, and neutral market colors, including subtle backgrounds and
borders.

**Acceptance criteria**

- Each state has foreground, subtle background, and border tokens.
- Tokens pass WCAG AA where used for text.
- Color is not the only documented signal for long/short or success/error.
- Existing chart colors are mapped to the same semantic palette.

### DS-005: Create the SO4 typography scale

**Complexity:** Medium  
**Suggested labels:** `design-system`, `typography`, `css`  
**Primary files:** `packages/ui/src/styles/globals.css`

Add named typography roles for display, page title, section title, body, UI
label, caption, and numeric data. Each role should bundle size, line height,
weight, and tracking.

**Acceptance criteria**

- The scale includes 9–15 documented roles.
- Reusable Tailwind utilities or component classes expose every role.
- Numeric roles enable tabular figures and slashed zero.
- No role is smaller than 11px for essential information.

### DS-006: Self-host Geist Sans and Geist Mono consistently

**Complexity:** Medium  
**Suggested labels:** `design-system`, `performance`, `typography`  
**Primary files:** `packages/ui/package.json`, `packages/ui/src/styles/globals.css`, `apps/web/src/routes/__root.tsx`

Remove the runtime Google Fonts dependency for Geist Mono and serve both
families through package-managed local assets.

**Acceptance criteria**

- No Google Fonts stylesheet or font preconnect remains.
- Geist Sans and Mono render with declared fallback stacks.
- Font display behavior avoids invisible text.
- A production build succeeds and contains the expected font assets.

### DS-007: Define spacing, control-height, and layout tokens

**Complexity:** Medium  
**Suggested labels:** `design-system`, `css`, `layout`  
**Primary files:** `packages/ui/src/styles/globals.css`

Create a small spacing scale plus named compact/default/comfortable control
heights and page gutters to reduce one-off pixel values.

**Acceptance criteria**

- Tokens cover micro spacing through section spacing.
- Control heights cover compact, default, and comfortable densities.
- Responsive page gutters are documented.
- At least one shared component consumes the new tokens.

### DS-008: Define a restrained radius and shape system

**Complexity:** Trivial  
**Suggested labels:** `design-system`, `css`  
**Primary files:** `packages/ui/src/styles/globals.css`

Replace the current zero base radius and inconsistent feature radii with a
documented scale for controls, cards, dialogs, and pills.

**Acceptance criteria**

- The scale defines `sm`, `md`, `lg`, `xl`, and `full`.
- Component-to-radius mapping is documented.
- Existing Tailwind radius utilities resolve from the scale.
- No production component is unintentionally forced to square corners.

### DS-009: Add elevation, border, and focus-ring tokens

**Complexity:** Medium  
**Suggested labels:** `design-system`, `css`, `accessibility`  
**Primary files:** `packages/ui/src/styles/globals.css`

Define subtle separators, interactive borders, overlay shadows, and a clear
keyboard focus treatment that work on every surface.

**Acceptance criteria**

- Default, hover, active, and strong border roles exist.
- Overlay and floating-panel shadows work in both themes.
- Focus rings meet visible-focus guidance on all core surfaces.
- Tokens are documented with intended usage.

### DS-010: Add motion duration and easing tokens

**Complexity:** Trivial  
**Suggested labels:** `design-system`, `css`, `accessibility`  
**Primary files:** `packages/ui/src/styles/globals.css`, `apps/web/src/styles/landing.css`

Standardize micro-interaction, panel, and page-transition timing and provide
reduced-motion behavior.

**Acceptance criteria**

- Fast, normal, and slow duration tokens and two easing tokens exist.
- Existing landing animations consume the tokens where applicable.
- `prefers-reduced-motion` disables non-essential motion.
- Focus and state changes remain understandable without animation.

---

## Core components

### DS-011: Add a typography primitive

**Complexity:** Medium  
**Suggested labels:** `design-system`, `react`, `typography`  
**Primary files:** `packages/ui/src/components/text.tsx`

Create a polymorphic `Text` component that exposes the approved typography and
color roles without encouraging arbitrary class strings.

**Acceptance criteria**

- Supports semantic elements through an `as` prop.
- Supports documented typography and tone variants.
- Forwards refs and native element attributes.
- Includes tests for variants and semantic rendering.

### DS-012: Add a numeric data primitive

**Complexity:** Trivial  
**Suggested labels:** `design-system`, `react`, `trading`  
**Primary files:** `packages/ui/src/components/numeric.tsx`

Create a small primitive for prices, percentages, balances, and addresses using
Geist Mono, tabular figures, and semantic positive/negative tones.

**Acceptance criteria**

- Supports neutral, positive, negative, and warning tones.
- Uses tabular figures and slashed zero.
- Does not format or round values internally.
- Includes rendering and class-variant tests.

### DS-013: Align Button variants with the new system

**Complexity:** Medium  
**Suggested labels:** `design-system`, `react`, `accessibility`  
**Primary files:** `packages/ui/src/components/button.tsx`

Refine primary, secondary, outline, ghost, destructive, and link buttons to use
the new surface, border, height, radius, typography, and motion tokens.

**Acceptance criteria**

- Every variant has default, hover, active, focus, and disabled states.
- Icon-only buttons retain accessible-name requirements.
- Existing public props remain backward compatible.
- Component tests cover all variants and sizes.

### DS-014: Add loading state support to Button

**Complexity:** Trivial  
**Suggested labels:** `design-system`, `react`, `accessibility`  
**Primary files:** `packages/ui/src/components/button.tsx`

Add a loading API that preserves button width, blocks duplicate actions, and
announces progress correctly.

**Acceptance criteria**

- Loading buttons are disabled and expose `aria-busy`.
- Label width does not jump when the spinner appears.
- Spinner respects reduced motion.
- Tests cover loading with text and icon-only buttons.

### DS-015: Build a shared IconButton component

**Complexity:** Trivial  
**Suggested labels:** `design-system`, `react`, `accessibility`  
**Primary files:** `packages/ui/src/components/icon-button.tsx`

Wrap the button primitive with a strict icon-only API and consistent tooltip,
size, and accessible-label behavior.

**Acceptance criteria**

- Requires an accessible label.
- Supports the approved button tones and sizes.
- Tooltip appears for mouse and keyboard users.
- Tests cover label, tooltip, focus, and disabled behavior.

### DS-016: Align Input and NumberInput with field tokens

**Complexity:** Medium  
**Suggested labels:** `design-system`, `react`, `forms`  
**Primary files:** `packages/ui/src/components/input.tsx`, `apps/web/src/shared/components/NumberInput.tsx`

Unify text and numeric input surfaces, typography, heights, focus, invalid, and
disabled states.

**Acceptance criteria**

- Both inputs use the same semantic field tokens.
- Number input keeps its numeric filtering behavior.
- Invalid and disabled states are visually and programmatically exposed.
- Existing tests pass and new state tests are added.

### DS-017: Build a reusable Field component

**Complexity:** Medium  
**Suggested labels:** `design-system`, `react`, `forms`, `accessibility`  
**Primary files:** `packages/ui/src/components/field.tsx`

Create a field wrapper for label, description, required indicator, error, and
character count with automatic ID relationships.

**Acceptance criteria**

- Label and help/error text are linked to the control.
- Error messages use `aria-describedby` and an appropriate live region.
- Layout supports leading and trailing controls.
- Tests cover normal, required, disabled, and invalid states.

### DS-018: Build a shared Textarea component

**Complexity:** Trivial  
**Suggested labels:** `design-system`, `react`, `forms`  
**Primary files:** `packages/ui/src/components/textarea.tsx`

Add a textarea matching Input and Field, including fixed and user-resizable
options.

**Acceptance criteria**

- Uses shared field tokens and forwards native props/ref.
- Supports disabled and invalid states.
- Works inside the Field component.
- Includes focused component tests.

### DS-019: Build a shared Select component

**Complexity:** Medium  
**Suggested labels:** `design-system`, `react`, `forms`, `accessibility`  
**Primary files:** `packages/ui/src/components/select.tsx`

Add an accessible Base UI select with compact sizing, keyboard navigation,
groups, disabled items, and selected indicators.

**Acceptance criteria**

- Trigger, popup, item, group, and separator parts are exported.
- Arrow keys, Enter, Escape, and typeahead work.
- Popup uses overlay surface/elevation tokens.
- Tests cover selection, keyboard use, and disabled items.

### DS-020: Build Checkbox and Radio primitives

**Complexity:** Medium  
**Suggested labels:** `design-system`, `react`, `forms`, `accessibility`  
**Primary files:** `packages/ui/src/components/checkbox.tsx`, `packages/ui/src/components/radio-group.tsx`

Add accessible compact selection controls with consistent label spacing and all
interaction states.

**Acceptance criteria**

- Checkbox supports checked and indeterminate states.
- Radio group supports keyboard navigation.
- Both expose visible focus and disabled states.
- Tests cover mouse and keyboard interaction.

### DS-021: Build a Switch component

**Complexity:** Trivial  
**Suggested labels:** `design-system`, `react`, `forms`  
**Primary files:** `packages/ui/src/components/switch.tsx`

Add a compact switch for binary preferences, using semantic state tokens and a
label-friendly API.

**Acceptance criteria**

- Works controlled and uncontrolled.
- Exposes checked, focus, and disabled states.
- Has a 44px minimum touch target without visually oversized chrome.
- Includes interaction tests.

### DS-022: Refine Tabs into line and segmented variants

**Complexity:** Medium  
**Suggested labels:** `design-system`, `react`, `navigation`  
**Primary files:** `packages/ui/src/components/tabs.tsx`

Support compact underline tabs for page navigation and segmented tabs for local
mode switching, following predictable sizing and hierarchy.

**Acceptance criteria**

- `line` and `segmented` variants are available.
- Keyboard navigation and focus behavior remain correct.
- Active state does not rely only on color.
- Existing call sites remain compatible.

### DS-023: Expand Badge into semantic StatusBadge variants

**Complexity:** Trivial  
**Suggested labels:** `design-system`, `react`, `trading`  
**Primary files:** `packages/ui/src/components/badge.tsx`

Add neutral, info, success, warning, danger, long, and short variants using the
semantic state palette.

**Acceptance criteria**

- Every variant uses semantic tokens.
- Long and short include text/icon cues in documented examples.
- Small and default sizes are supported.
- Snapshot or class-variant tests cover every variant.

### DS-024: Build a Tooltip with consistent delay and shortcut hints

**Complexity:** Trivial  
**Suggested labels:** `design-system`, `react`, `accessibility`  
**Primary files:** `packages/ui/src/components/tooltip.tsx`

Standardize tooltip delay, placement, maximum width, rich descriptions, and
optional keyboard-shortcut display.

**Acceptance criteria**

- Works on hover and keyboard focus.
- Supports an optional shortcut hint.
- Uses overlay surface and elevation tokens.
- Does not trap pointer interaction or obscure the trigger on small screens.

### DS-025: Build a Popover component

**Complexity:** Medium  
**Suggested labels:** `design-system`, `react`, `overlay`  
**Primary files:** `packages/ui/src/components/popover.tsx`

Add a shared non-modal overlay for filters, small forms, and contextual details.

**Acceptance criteria**

- Trigger, content, title, description, and close parts are exported.
- Escape and outside click dismiss correctly.
- Focus behavior and accessible naming are tested.
- Placement avoids viewport clipping.

### DS-026: Build a DropdownMenu component

**Complexity:** Medium  
**Suggested labels:** `design-system`, `react`, `navigation`  
**Primary files:** `packages/ui/src/components/dropdown-menu.tsx`

Create a compact menu supporting items, checkbox items, radio items, groups,
separators, destructive actions, icons, and shortcut hints.

**Acceptance criteria**

- Full keyboard navigation and typeahead work.
- Destructive items are visually distinct but not selected by default.
- Nested content is not required for this issue.
- Tests cover item activation and selection variants.

### DS-027: Add a reusable EmptyState component

**Complexity:** Trivial  
**Suggested labels:** `design-system`, `react`, `ux`  
**Primary files:** `packages/ui/src/components/empty-state.tsx`

Create a quiet empty state with optional icon, title, description, primary
action, and secondary action.

**Acceptance criteria**

- Supports compact and page variants.
- Action slots accept links or buttons.
- Layout works without an icon or actions.
- Includes examples/tests for no-data and filtered-empty states.

### DS-028: Add InlineAlert and Banner components

**Complexity:** Medium  
**Suggested labels:** `design-system`, `react`, `feedback`, `accessibility`  
**Primary files:** `packages/ui/src/components/alert.tsx`

Create semantic info, success, warning, and error feedback for inline sections
and full-width application banners.

**Acceptance criteria**

- Inline and banner layouts share one API.
- Error and urgent warning variants use appropriate live-region semantics.
- Optional action and dismiss controls are supported.
- Tests cover semantics and dismissal.

### DS-029: Unify Modal and Dialog implementations

**Complexity:** High  
**Suggested labels:** `design-system`, `react`, `refactor`, `accessibility`  
**Primary files:** `packages/ui/src/components/dialog.tsx`, `apps/web/src/shared/components/Modal.tsx`

Migrate the application to one accessible dialog primitive and deprecate the
duplicate shared Modal without breaking existing flows.

**Acceptance criteria**

- One implementation owns overlay, focus trap, Escape, title, and description.
- Existing modal call sites are migrated or supported through a compatibility wrapper.
- Mobile sizing and scroll behavior are verified.
- Existing and new accessibility tests pass.

### DS-030: Standardize Skeleton variants

**Complexity:** Trivial  
**Suggested labels:** `design-system`, `react`, `loading`  
**Primary files:** `packages/ui/src/components/skeleton.tsx`, `apps/web/src/shared/components/skeleton`

Consolidate duplicate skeletons and add text, avatar, control, card, and table-row
presets.

**Acceptance criteria**

- Feature code imports skeletons from `@workspace/ui`.
- Presets use the radius and motion tokens.
- Reduced-motion users see a static treatment.
- Duplicate implementation is removed after call-site migration.

---

## Product patterns

### DS-031: Build AppShell and PageHeader primitives

**Complexity:** High  
**Suggested labels:** `design-system`, `react`, `layout`  
**Primary files:** `packages/ui/src/components/app-shell.tsx`, `packages/ui/src/components/page-header.tsx`

Create reusable global chrome and page header slots for title, breadcrumbs,
tabs, metadata, and actions with stable alignment across product routes.

**Acceptance criteria**

- Supports full-width trading and constrained content layouts.
- Header actions remain reachable on mobile.
- Slots do not impose route-specific content.
- Demo/tests cover both layout modes.

### DS-032: Refactor Navbar onto shared navigation primitives

**Complexity:** Medium  
**Suggested labels:** `design-system`, `react`, `navigation`  
**Primary files:** `apps/web/src/ui/Navbar.tsx`, `apps/web/src/ui/landing/nav.tsx`

Remove duplicated landing/app navigation styles and use compact shared controls,
tokens, and consistent active states.

**Acceptance criteria**

- Landing and app variants share logo and control primitives.
- Active navigation is programmatically indicated.
- Mobile menu closes on navigation and Escape.
- Keyboard order and visible focus are verified.

### DS-033: Build a Breadcrumb component

**Complexity:** Trivial  
**Suggested labels:** `design-system`, `react`, `navigation`, `accessibility`  
**Primary files:** `packages/ui/src/components/breadcrumb.tsx`

Add compact breadcrumbs for nested pool, market, and settings views with
collapse behavior for small widths.

**Acceptance criteria**

- Uses a semantic `nav` label and ordered list.
- Current page is announced with `aria-current`.
- Long paths can collapse into an ellipsis menu/slot.
- Tests cover semantics and truncation.

### DS-034: Build a responsive DataTable shell

**Complexity:** High  
**Suggested labels:** `design-system`, `react`, `data-display`  
**Primary files:** `packages/ui/src/components/data-table.tsx`

Create visual table primitives for headers, rows, numeric alignment, loading,
empty, selected, and interactive states without coupling to a data library.

**Acceptance criteria**

- Proper native table semantics are retained.
- Numeric columns align right and use the numeric type role.
- Horizontal overflow is usable on small screens.
- Examples/tests cover loading, empty, selected, and clickable rows.

### DS-035: Build compact TableToolbar and FilterChip patterns

**Complexity:** Medium  
**Suggested labels:** `design-system`, `react`, `data-display`  
**Primary files:** `packages/ui/src/components/table-toolbar.tsx`, `packages/ui/src/components/filter-chip.tsx`

Add reusable search, filter, view, count, and clear-all patterns for tables.

**Acceptance criteria**

- Toolbar wraps without overlapping at narrow widths.
- Active filters are removable with accessible names.
- Clear-all appears only when filters are active.
- Keyboard focus order follows visual order.

### DS-036: Restyle Pools tables with DataTable primitives

**Complexity:** Medium  
**Suggested labels:** `design-system`, `react`, `pools`  
**Primary files:** `apps/web/src/features/pools/components/gm-pools-table.tsx`, `apps/web/src/features/pools/components/gm-pool-row.tsx`

Adopt the shared typography, status, table, empty, loading, and responsive
patterns on the Pools view.

**Acceptance criteria**

- No pool data behavior changes.
- All numeric columns use the numeric type role.
- Hover, keyboard focus, loading, and empty states are present.
- Existing pool tests pass.

### DS-037: Restyle Earn tables and cards with shared primitives

**Complexity:** Medium  
**Suggested labels:** `design-system`, `react`, `earn`  
**Primary files:** `apps/web/src/features/earn/components`

Migrate Earn surfaces, headings, rewards, opportunity lists, and distributions
to the new tokens and shared components.

**Acceptance criteria**

- Feature-local one-off text sizes are reduced.
- Rewards and financial values use semantic numeric roles.
- Loading, empty, and error treatments use shared primitives.
- Existing Earn behavior and tests remain intact.

### DS-038: Restyle Referrals tables and cards with shared primitives

**Complexity:** Medium  
**Suggested labels:** `design-system`, `react`, `referrals`  
**Primary files:** `apps/web/src/features/referrals/components`

Migrate referral tabs, stat cards, distributions, code display, progress, FAQ,
and sidebar surfaces to shared tokens and components.

**Acceptance criteria**

- Existing referral workflows do not change.
- Tabs, badges, buttons, and numeric text use shared primitives.
- Mobile layout is verified at 375px.
- Existing referral tests pass.

### DS-039: Restyle Faucet states with shared primitives

**Complexity:** Medium  
**Suggested labels:** `design-system`, `react`, `faucet`  
**Primary files:** `apps/web/src/features/faucet/components/faucet-page.tsx`

Replace one-off cards, pills, alerts, and loading styles in every faucet state.

**Acceptance criteria**

- Connected, disconnected, cooldown, mismatch, loading, and error states are covered.
- Claim actions use shared loading buttons.
- Token amounts use numeric typography.
- Existing faucet tests pass unchanged or with presentation-only updates.

### DS-040: Tokenize trading chart colors

**Complexity:** Medium  
**Suggested labels:** `design-system`, `react`, `trade`, `chart`  
**Primary files:** `apps/web/src/features/trade/components/chart/TVChartContainer.tsx`

Replace hardcoded chart colors with a typed adapter derived from CSS semantic
tokens for light and dark themes.

**Acceptance criteria**

- Chart background, grid, text, crosshair, borders, candles, and position lines use tokens.
- Theme changes update the chart without a reload.
- Long/short/warning colors match the rest of the app.
- Unit tests cover both generated palettes.

### DS-041: Refine the trade order panel hierarchy

**Complexity:** High  
**Suggested labels:** `design-system`, `react`, `trade`, `ux`  
**Primary files:** `apps/web/src/features/trade/components`

Apply compact segmented controls, Fields, numeric roles, separators, and
semantic trade states to the order-entry panel without changing trading logic.

**Acceptance criteria**

- Long/Short/Swap and order-type navigation use shared tab variants.
- Labels, values, fees, and primary action have clear visual hierarchy.
- Disabled, invalid, disconnected, and submitting states are visible.
- Existing trade tests and transaction behavior remain intact.

### DS-042: Refine positions, orders, trades, and claims tables

**Complexity:** High  
**Suggested labels:** `design-system`, `react`, `trade`, `data-display`  
**Primary files:** `apps/web/src/features/trade/components`

Migrate lower trade panels to DataTable, StatusBadge, Numeric, EmptyState, and
loading patterns.

**Acceptance criteria**

- All four tabs have intentional loading, empty, and populated states.
- PnL, liquidation, long, and short states use semantic roles.
- Tables remain usable at narrow desktop widths.
- Row actions are keyboard accessible.

### DS-043: Add a TokenPair and TokenAvatar primitive

**Complexity:** Medium  
**Suggested labels:** `design-system`, `react`, `trading`  
**Primary files:** `packages/ui/src/components/token-avatar.tsx`, `apps/web/src/shared/components/TokenIcon.tsx`

Create reusable single-token and overlapping token-pair visuals with fallback
initials and accessible labeling.

**Acceptance criteria**

- Supports image, fallback initials, and two-token overlap.
- Sizes align with the icon/control scale.
- Decorative and meaningful usage are both supported accessibly.
- Existing TokenIcon call sites can migrate without visual regressions.

### DS-044: Add a TransactionStatus pattern

**Complexity:** Medium  
**Suggested labels:** `design-system`, `react`, `stellar`, `feedback`  
**Primary files:** `apps/web/src/shared/components/TxStatus.tsx`, `packages/ui/src/components/transaction-status.tsx`

Standardize signing, submitting, confirming, success, and failure states for
Stellar transactions, including explorer links and retry actions.

**Acceptance criteria**

- All five transaction states have semantic labels and icons.
- Explorer links use the existing Stellar explorer helper.
- Progress is announced without noisy repeated live-region updates.
- Tests cover transitions, explorer action, and retry action.

---

## Quality, tooling, and documentation

### DS-045: Add a design-system development gallery route

**Complexity:** High  
**Suggested labels:** `design-system`, `tooling`, `react`  
**Primary files:** `apps/web/src/routes/design-system.tsx`

Create a development-only gallery showing tokens and every shared component in
light, dark, compact, disabled, loading, invalid, and empty states.

**Acceptance criteria**

- Route is unavailable in production builds.
- Theme switching works inside the gallery.
- Component sections are linkable.
- Gallery includes viewport stress cases and long-content examples.

### DS-046: Add accessibility tests for all UI primitives

**Complexity:** Medium  
**Suggested labels:** `design-system`, `testing`, `accessibility`  
**Primary files:** `packages/ui/src/components/*.test.tsx`

Create a consistent test harness and axe checks for interactive shared
components, including keyboard behavior where relevant.

**Acceptance criteria**

- Every interactive primitive has an automated accessibility check.
- Keyboard behavior is tested for menus, tabs, dialogs, selects, and fields.
- Tests fail on detectable serious/critical axe violations.
- Test command is documented in the UI package.

### DS-047: Add visual regression coverage for light and dark themes

**Complexity:** High  
**Suggested labels:** `design-system`, `testing`, `playwright`  
**Primary files:** `e2e/design-system-visual.spec.ts`, `playwright.config.ts`

Add deterministic screenshots for core components and main routes at desktop
and mobile widths in both themes.

**Acceptance criteria**

- Screenshots cover gallery, landing, trade, pools, earn, referrals, and faucet.
- Animations and volatile network data are stabilized.
- Both themes and at least two viewport sizes are covered.
- Updating baselines is documented.

### DS-048: Add a token-usage lint/check script

**Complexity:** Medium  
**Suggested labels:** `design-system`, `tooling`, `css`  
**Primary files:** `scripts/check-design-tokens.ts`, `package.json`

Detect newly introduced raw hex colors, disallowed arbitrary font sizes, and
unapproved radius values in production TSX/CSS while allowing documented
exceptions such as SVG art.

**Acceptance criteria**

- Script reports file, line, and offending value.
- Existing exceptions are captured in a small explicit allowlist.
- New violations exit non-zero.
- Root package exposes a documented command for local and CI use.

### DS-049: Write a component contribution guide

**Complexity:** Trivial  
**Suggested labels:** `design-system`, `documentation`, `good first issue`  
**Primary files:** `packages/ui/CONTRIBUTING.md`

Explain how to add, test, export, document, and consume a shared component in
this monorepo.

**Acceptance criteria**

- Includes file naming, API, accessibility, testing, and export guidance.
- Includes commands for typecheck, lint, unit tests, and visual checks.
- Explains when a component belongs in `packages/ui` versus a feature.
- Links to `DESIGN.md` and the gallery route.

### DS-050: Audit and migrate arbitrary design values

**Complexity:** High  
**Suggested labels:** `design-system`, `refactor`, `css`  
**Primary files:** `apps/web/src`, `packages/ui/src`

After the new tokens and primitives land, replace unjustified arbitrary text
sizes, radii, colors, and opacity-based hierarchy across production UI.

**Acceptance criteria**

- Each remaining arbitrary value has a code comment or lint allowlist reason.
- Feature behavior and responsive layouts do not regress.
- Token-usage check passes.
- Light/dark visual regression suite passes.

---

## Recommended Wave activation

Activate at most 10–15 issues in one seven-day Wave. A safe first set is:

1. DS-001 — `DESIGN.md`
2. DS-006 — self-host fonts
3. DS-008 — radius system
4. DS-010 — motion tokens
5. DS-012 — Numeric primitive
6. DS-014 — Button loading state
7. DS-015 — IconButton
8. DS-018 — Textarea
9. DS-021 — Switch
10. DS-023 — StatusBadge
11. DS-024 — Tooltip
12. DS-027 — EmptyState
13. DS-033 — Breadcrumb
14. DS-049 — contribution guide

Keep DS-002 through DS-005 with one maintainer or one experienced contributor
because their token decisions affect most later issues. Activate migration
issues only after their required primitives merge.

## Maintainer review checklist

- The contributor was assigned through Drips before work began.
- The PR says `Closes #<issue-number>`.
- The PR changes presentation only unless behavior changes are explicitly scoped.
- Both light and dark themes were checked.
- Keyboard navigation and visible focus were checked.
- Mobile behavior was checked where relevant.
- Tests were added in proportion to the component's interaction complexity.
- No new raw colors or arbitrary type sizes were introduced without a reason.
