# SO4 Design System Backlog — DS-051 to DS-075

These issues extend the original design-system backlog without duplicating
DS-001 through DS-050. Each issue is scoped as one reviewable pull request.

### DS-051: Build a shared Card composition primitive

**Context**

Earn, Pools, Referrals, and Faucet independently implement bordered surface
containers. This creates inconsistent padding, headings, separators, and
interactive states.

**Scope**

- Add `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, and
  `CardFooter` exports in `packages/ui/src/components/card.tsx`.
- Provide `default`, `subtle`, and `interactive` surface variants.
- Support compact and default padding without feature-specific props.
- Use existing semantic surface, border, radius, and typography tokens.

**Acceptance criteria**

- All parts forward refs and native HTML attributes.
- Interactive cards have visible hover, active, and keyboard-focus states.
- Static cards do not gain pointer or hover styling.
- The component works with and without header/footer sections.
- Unit tests cover composition, variants, and interactive keyboard focus.

**Out of scope**

- Migrating every existing feature card.
- Adding business-specific statistics or actions to the shared API.

### DS-052: Build Spinner and ProgressIndicator primitives

**Context**

Loading feedback currently mixes button-local spinners, skeletons, and
feature-specific indicators. The design system needs consistent indeterminate
and determinate progress visuals.

**Scope**

- Add a size-aware `Spinner` with accessible decorative and labeled modes.
- Add a determinate `ProgressIndicator` with value, minimum, and maximum props.
- Use semantic color and motion tokens.
- Provide a static reduced-motion treatment for indeterminate progress.

**Acceptance criteria**

- Determinate progress exposes correct ARIA value attributes.
- A labeled indeterminate example is announced exactly once.
- Components support neutral, accent, success, and danger tones.
- Reduced-motion mode removes continuous rotation without hiding progress.
- Tests cover ARIA semantics, clamping, sizes, and reduced-motion classes.

**Out of scope**

- Replacing Skeleton for content-shaped loading states.
- Implementing upload or transaction business logic.

### DS-053: Add a KeyboardShortcut component

**Context**

Tooltips and future command surfaces need a consistent visual representation
for shortcuts across macOS, Windows, and Linux.

**Scope**

- Add a `KeyboardShortcut` component that renders one or more semantic `<kbd>`
  elements.
- Normalize common modifier labels based on platform.
- Support compact inline and grouped chord presentation.
- Document when shortcuts must also be explained in accessible text.

**Acceptance criteria**

- `mod`, `alt`, `shift`, and `enter` have readable platform-aware labels.
- The component never claims to register the shortcut itself.
- Screen readers receive a useful text equivalent for symbolic modifiers.
- Styling uses typography, surface, border, and radius tokens.
- Tests cover platform mapping, multi-key chords, and accessible labels.

**Out of scope**

- A global shortcut registry.
- Detecting or resolving shortcut conflicts.

### DS-054: Build Avatar and AvatarGroup primitives

**Context**

Contributor, wallet, and referral identities need a reusable image/fallback
pattern that does not overlap with token-specific icons.

**Scope**

- Add `Avatar`, `AvatarImage`, and `AvatarFallback`.
- Add `AvatarGroup` with overlap, maximum-visible count, and overflow count.
- Support image-load failure and deterministic initials.
- Provide decorative and meaning-bearing accessible modes.

**Acceptance criteria**

- Broken or missing images fall back without layout shift.
- Initials are deterministic and limited to two characters.
- AvatarGroup announces hidden member count.
- Sizes align with the design-system icon and control scale.
- Tests cover load failure, initials, overflow, and accessible naming.

**Out of scope**

- Uploading or cropping profile images.
- Replacing `TokenAvatar` or token-pair visuals.

### DS-055: Build an accessible Combobox component

**Context**

Market, token, and pool selectors need searchable selection. A plain Select
does not cover large or dynamically filtered option sets.

**Scope**

- Add a Base UI-backed combobox with input, popup, list, option, empty, and
  loading parts.
- Support controlled selection, controlled search text, grouped options, and
  disabled options.
- Include clear-selection and asynchronous-loading affordances.
- Use shared Field, Popover, EmptyState, and Spinner patterns where applicable.

**Acceptance criteria**

- Arrow keys, Home/End, Enter, Escape, and typeahead behavior work.
- Input and popup have correct combobox/listbox ARIA relationships.
- Empty, loading, error, and populated states are visually distinct.
- Long labels truncate without hiding the selected value from assistive tech.
- Tests cover keyboard selection, clearing, disabled options, and async states.

**Out of scope**

- Fetching markets or tokens from an API.
- Virtualizing thousands of options.

### DS-056: Add a reusable CommandMenu shell

**Context**

SO4 will need fast keyboard navigation as product routes and actions grow. The
shell should be reusable without embedding a fixed command catalog.

**Scope**

- Build a modal command menu using the shared Dialog and Combobox primitives.
- Support groups, actions, navigation results, empty results, and shortcut hints.
- Expose a controlled API for query, open state, and result activation.
- Add a small example catalog in the design-system gallery only.

**Acceptance criteria**

- Opening the menu moves focus to search; closing restores trigger focus.
- Keyboard navigation and result activation work without a pointer.
- Results expose names, optional descriptions, icons, and shortcut hints.
- Empty and no-match states use shared feedback primitives.
- Tests cover opening, filtering, activation, Escape, and focus restoration.

**Out of scope**

- Adding a production global shortcut.
- Defining product analytics or a complete SO4 command catalog.

### DS-057: Extract a shared Accordion component

**Context**

The Referrals FAQ has a feature-local accordion. Other educational and settings
views should not reimplement disclosure behavior.

**Scope**

- Add shared single-open and multiple-open accordion modes.
- Support disabled items, heading-level configuration, and controlled state.
- Move generic animation and icon treatment into the shared component.
- Provide a migration example for the Referrals FAQ.

**Acceptance criteria**

- Triggers are real buttons inside semantic headings.
- Enter, Space, and sequential keyboard navigation work.
- Content IDs and expanded states are programmatically connected.
- Reduced-motion behavior is respected.
- Tests cover single, multiple, controlled, disabled, and keyboard states.

**Out of scope**

- Rewriting FAQ copy.
- Adding remote content loading.

### DS-058: Build a Collapsible disclosure primitive

**Context**

Dense trading screens need optional details such as fee breakdowns and advanced
settings without the structure of a multi-item accordion.

**Scope**

- Add `Collapsible`, `CollapsibleTrigger`, and `CollapsibleContent`.
- Support controlled and uncontrolled state.
- Provide compact and default trigger layouts.
- Use tokenized motion with a reduced-motion fallback.

**Acceptance criteria**

- Trigger exposes `aria-expanded` and references its content.
- State works with keyboard and pointer input.
- Content can contain focusable controls without focus loss.
- No fixed height assumption clips dynamic content.
- Tests cover both state models and accessibility relationships.

**Out of scope**

- Persisting disclosure preferences.
- Creating feature-specific advanced settings.

### DS-059: Add a responsive Dialog-to-Drawer pattern

**Context**

Centered dialogs are appropriate on desktop but can be cramped on mobile.
Transaction and wallet flows need one adaptive overlay API.

**Scope**

- Add a responsive composition that renders Dialog on desktop and Sheet/Drawer
  presentation on small screens.
- Preserve one content API and consistent title/description semantics.
- Handle mobile safe areas, virtual keyboards, and scrollable content.
- Document the breakpoint and when adaptive presentation is appropriate.

**Acceptance criteria**

- Focus management and dismissal behavior remain consistent across modes.
- Mobile actions remain visible when the virtual keyboard opens.
- Long content scrolls inside the overlay without scrolling the page behind it.
- iOS safe-area insets are respected.
- Tests cover both presentation modes and accessible naming.

**Out of scope**

- Migrating all current dialogs.
- Gesture-driven swipe-to-dismiss.

### DS-060: Build a reusable CopyButton component

**Context**

Referral codes, wallet addresses, transaction hashes, and contract IDs all need
consistent copy feedback and error handling.

**Scope**

- Add a CopyButton that uses the existing clipboard hook.
- Support icon-only and icon-with-label presentations.
- Show copied, failed, and reset states without changing control width.
- Accept the copied value separately from the visible truncated label.

**Acceptance criteria**

- Every icon-only usage requires an accessible label.
- Success feedback is announced politely and resets after a documented delay.
- Clipboard failure is visible and does not falsely show success.
- Repeated clicks do not create overlapping timers.
- Tests cover success, failure, reset, unmount cleanup, and accessible naming.

**Out of scope**

- Formatting wallet addresses or hashes.
- Sharing through the operating-system share sheet.

### DS-061: Add AddressDisplay and HashDisplay primitives

**Context**

Stellar addresses, contract IDs, and transaction hashes require consistent
truncation, monospaced typography, copy behavior, and explorer navigation.

**Scope**

- Add display primitives for full and middle-truncated identifiers.
- Compose with Numeric/Text, CopyButton, Tooltip, and explorer URL helpers.
- Support account, contract, and transaction identifier types.
- Keep the complete value available to assistive technology.

**Acceptance criteria**

- Truncation is deterministic and configurable by visible character count.
- Copy always uses the complete identifier.
- Explorer links are generated for the selected network and identifier type.
- Invalid values do not produce broken explorer links.
- Tests cover truncation, copy value, networks, identifier types, and invalid input.

**Out of scope**

- Resolving federation addresses.
- Fetching account or transaction details.

### DS-062: Build reusable Stat and StatGroup components

**Context**

Protocol metrics, portfolio summaries, pool APY, referral totals, and market
stats repeat the same label/value/change layout with inconsistent hierarchy.

**Scope**

- Add `Stat`, `StatLabel`, `StatValue`, `StatDelta`, and `StatGroup`.
- Support loading, unavailable, positive, negative, and neutral values.
- Provide compact horizontal and dashboard vertical layouts.
- Use Numeric typography for financial data.

**Acceptance criteria**

- Delta meaning is not conveyed through color alone.
- Missing data is distinguishable from a real numeric zero.
- Groups wrap predictably at narrow widths.
- Loading state does not cause major layout shift.
- Tests cover tones, absent values, loading, and responsive class variants.

**Out of scope**

- Calculating financial values or percentage changes.
- Migrating existing feature statistics.

### DS-063: Add Meter and segmented allocation primitives

**Context**

Pool composition, tier progress, utilization, health, and limits need semantic
data visualization beyond a generic progress bar.

**Scope**

- Add an accessible single-value Meter.
- Add a segmented allocation bar with labeled proportions.
- Support neutral, success, warning, and danger thresholds.
- Define behavior for zero totals, rounding, and very small segments.

**Acceptance criteria**

- Meter uses correct value semantics and an accessible text label.
- Segment widths normalize to 100% without visible rounding gaps.
- Tiny non-zero segments remain discoverable through legend or tooltip.
- Color is paired with labels or patterns.
- Tests cover normalization, zero totals, thresholds, and accessible output.

**Out of scope**

- Calculating protocol health or pool composition.
- Building full chart axes or time-series visualization.

### DS-064: Add a FormErrorSummary component

**Context**

Complex order and liquidity forms can contain multiple validation failures.
Inline errors alone are difficult to scan and navigate after submission.

**Scope**

- Add a summary component that lists form errors and links to invalid fields.
- Focus the summary after a failed submit when configured.
- Support a concise title and optional correction guidance.
- Document integration with the shared Field component.

**Acceptance criteria**

- Error links move focus to the associated field.
- Summary count and title are announced once after failed submission.
- Dynamic error changes do not cause repeated disruptive announcements.
- Works when fields are inside a scrollable dialog.
- Tests cover linking, focus movement, updates, and empty state.

**Out of scope**

- Introducing a form-state library.
- Defining business validation rules.

### DS-065: Add a user-facing appearance settings panel

**Context**

SO4 supports light, dark, and system themes, but appearance controls are limited
to a compact toggle and do not explain the active preference.

**Scope**

- Build a settings panel for Light, Dark, and System options.
- Show the resolved theme when System is selected.
- Reuse the existing theme provider and storage key.
- Add small visual previews using semantic design tokens.

**Acceptance criteria**

- Selection persists and applies without a page reload or flash.
- System changes update the resolved preview in real time.
- Options are a keyboard-accessible radio group.
- Preview cards remain readable in both themes.
- Tests cover persistence, system resolution, and keyboard selection.

**Out of scope**

- Custom user-authored color palettes.
- Changing the current storage migration strategy.

### DS-066: Add an optional high-contrast theme mode

**Context**

Light and dark modes alone do not meet every user's contrast needs. Linear's
theme approach includes contrast as a first-class dimension.

**Scope**

- Add a persisted high-contrast preference independent of light/dark choice.
- Override semantic text, border, focus, and interactive state tokens.
- Expose the option in appearance settings.
- Document which tokens may change in high-contrast mode.

**Acceptance criteria**

- Essential text and controls meet WCAG AAA contrast where practical.
- Focus indicators remain clearly visible on every surface.
- Charts and trading states remain distinguishable without oversaturation.
- Preference applies before first paint to avoid a contrast flash.
- Automated tests cover class persistence and representative contrast pairs.

**Out of scope**

- Operating-system forced-colors support, which is a separate issue.
- A free-form theme editor.

### DS-067: Support Windows forced-colors mode

**Context**

CSS gradients, translucent borders, and custom focus treatments can disappear
in Windows High Contrast/forced-colors mode.

**Scope**

- Audit core primitives under `@media (forced-colors: active)`.
- Add system-color fallbacks for borders, text, focus, selected states, and
  disabled controls.
- Ensure icons and SVG status indicators remain visible.
- Add a forced-colors fixture to the design-system gallery.

**Acceptance criteria**

- Buttons, links, fields, tabs, dialogs, menus, and alerts remain operable.
- Selected, invalid, and focused states remain distinguishable.
- No essential meaning relies on background images or gradients.
- Overrides use system colors instead of hardcoded replacement colors.
- A documented manual verification checklist is included.

**Out of scope**

- Creating a custom high-contrast palette.
- Pixel-identical rendering across browsers.

### DS-068: Standardize the application icon system

**Context**

SO4 uses Hugeicons alongside inline SVGs with inconsistent size, stroke width,
alignment, and accessible treatment.

**Scope**

- Define approved icon sizes and stroke widths for controls and data display.
- Add a lightweight shared Icon wrapper for Hugeicons.
- Audit inline SVGs and document justified exceptions such as the logo or chart art.
- Standardize decorative versus meaningful icon accessibility.

**Acceptance criteria**

- The wrapper supports the approved size scale and semantic tones.
- Decorative icons are hidden from assistive technology by default.
- Meaningful standalone icons require an accessible label.
- Icon alignment remains stable inside buttons, inputs, tabs, and badges.
- A repository check or documented audit identifies remaining exceptions.

**Out of scope**

- Replacing the SO4 logo.
- Designing a custom icon library.

### DS-069: Align toast notifications with the design system

**Context**

Sonner and the feature-local toast implementation can produce inconsistent
surfaces, status colors, actions, durations, and accessible announcements.

**Scope**

- Establish one application toast API and presentation.
- Define info, success, warning, error, and transaction-progress variants.
- Support primary action, dismiss action, and persistent critical messages.
- Apply semantic surfaces, typography, icon, motion, and status tokens.

**Acceptance criteria**

- Duplicate toast paths are removed or wrapped by one compatibility layer.
- Status is conveyed by text/icon as well as color.
- Toasts pause dismissal while hovered or keyboard-focused.
- Actions are keyboard accessible and focus is never stolen on appearance.
- Tests cover variants, actions, dismissal, duration, and live-region behavior.

**Out of scope**

- Replacing transaction history.
- Persisting toasts across reloads.

### DS-070: Add mobile safe-area and touch-target utilities

**Context**

Sticky navigation, sheets, dialogs, and bottom actions need predictable behavior
on notched devices while compact desktop controls still require usable touch targets.

**Scope**

- Add semantic safe-area inset utilities for top, right, bottom, and left.
- Add a utility for a minimum 44×44px hit area without forcing larger visuals.
- Apply utilities to shared mobile overlays and navigation examples.
- Document when compact controls may use expanded invisible hit areas.

**Acceptance criteria**

- Utilities use `env(safe-area-inset-*)` with zero-safe fallbacks.
- Expanded hit areas do not overlap neighboring controls.
- Keyboard focus outline follows the visible control.
- Gallery fixtures cover portrait, landscape, and bottom-fixed actions.
- Playwright tests verify representative mobile layout bounds.

**Out of scope**

- Redesigning individual product pages.
- Device-specific JavaScript detection.

### DS-071: Add a persisted interface-density preference

**Context**

Trading users may prefer dense tables while newer users benefit from more
breathing room. Density should be systematic rather than page-specific.

**Scope**

- Add compact, default, and comfortable density modes.
- Map density to control heights, table rows, list items, and page spacing tokens.
- Persist the preference and expose it in appearance settings.
- Keep touch targets accessible on coarse-pointer devices.

**Acceptance criteria**

- Switching density updates shared components without reloading.
- Text size does not shrink as a substitute for reduced spacing.
- Compact mode preserves keyboard focus and pointer target usability.
- Preference has a stable default and storage migration behavior.
- Tests cover persistence, token/class application, and coarse-pointer fallback.

**Out of scope**

- Per-page density overrides.
- Changing information architecture.

### DS-072: Centralize locale-aware number and date presentation

**Context**

Prices, percentages, compact values, timestamps, and dates must be consistent
and ready for users outside the default locale.

**Scope**

- Add presentation helpers built on `Intl.NumberFormat` and `Intl.DateTimeFormat`.
- Cover price, token amount, percentage, compact number, date, time, and relative time.
- Define explicit fallback behavior for invalid input and unavailable data.
- Keep raw financial calculation outside formatting helpers.

**Acceptance criteria**

- Callers can provide locale and currency without changing calculation precision.
- Negative zero is normalized for display.
- Very small values have a documented less-than display strategy.
- Server and client output remain hydration-safe for the configured locale.
- Tests cover at least two locales, large/small values, negative zero, and invalid input.

**Out of scope**

- Translating application copy.
- Currency conversion or exchange-rate fetching.

### DS-073: Audit layouts for RTL and logical CSS properties

**Context**

Directional utilities such as left/right padding, borders, and icon placement
make future right-to-left localization expensive and error-prone.

**Scope**

- Audit shared primitives and global navigation for directional CSS assumptions.
- Replace physical properties with logical equivalents where behavior is semantic.
- Add an RTL toggle/fixture to the design-system gallery.
- Document justified physical directions, such as chart time flow.

**Acceptance criteria**

- Dialogs, menus, fields, tabs, breadcrumbs, tables, and navigation remain usable in RTL.
- Leading/trailing icons and controls mirror correctly.
- Numeric financial values preserve readable direction.
- Focus order follows DOM order and remains logical.
- Visual tests cover representative LTR and RTL component fixtures.

**Out of scope**

- Translating copy into an RTL language.
- Mirroring charts where financial convention requires left-to-right time.

### DS-074: Add accessible chart summaries and data-table fallback

**Context**

The candlestick chart is visual and canvas-based, so screen-reader users cannot
discover its time range, trend, latest value, or underlying sampled data.

**Scope**

- Add a concise accessible summary linked to the chart.
- Provide an optional keyboard-reachable table of representative OHLC data.
- Announce live-price updates at a non-disruptive, throttled cadence.
- Document which chart decorations should be hidden from assistive technology.

**Acceptance criteria**

- The chart has an accessible name, description, time range, and latest value.
- Data fallback uses semantic table headers and chronological rows.
- Live updates do not announce every tick.
- Loading, empty, and error chart states have equivalent text.
- Tests cover summary content, table semantics, and announcement throttling.

**Out of scope**

- Replacing Lightweight Charts.
- Exposing every candle for very large datasets without pagination.

### DS-075: Add a design-system release checklist and change log

**Context**

As shared tokens and components evolve, contributors need a predictable way to
document visual changes, migrations, accessibility impact, and breaking APIs.

**Scope**

- Add a design-system changelog with an initial baseline entry.
- Add a pull-request checklist for token or shared-component changes.
- Define Added, Changed, Deprecated, Removed, Fixed, and Accessibility sections.
- Document deprecation and migration-note expectations.

**Acceptance criteria**

- The checklist covers light/dark, keyboard, mobile, tests, screenshots, and API compatibility.
- Changelog format includes dates and links to relevant issues/PRs.
- Breaking changes require a migration note.
- Accessibility fixes are visible rather than buried under general fixes.
- Contribution documentation links to both artifacts.

**Out of scope**

- Automating package releases.
- Publishing the UI package to a public registry.
