# SO4 Design System Backlog — DS-076 to DS-085

These issues continue the design-system backlog without duplicating DS-001
through DS-075. Each is scoped as one independently reviewable pull request.

### DS-076: Build a shared SearchField component

**Context**

Market selectors, pool tables, command surfaces, and future transaction history
all need search input. Rebuilding clear buttons, keyboard behavior, loading
feedback, and result counts in each feature leads to inconsistent interactions.

**Scope**

- Add a `SearchField` composed from the shared Input, IconButton, and Spinner.
- Support controlled value, clear action, loading state, and optional result count.
- Provide compact and default sizes.
- Define accessible behavior for search submission and live result updates.

**Acceptance criteria**

- The control uses the native search input type and has an accessible label.
- Escape clears a non-empty query without unexpectedly closing a parent overlay.
- Clear and loading controls do not change the input width.
- Result-count announcements are debounced and do not fire on every keystroke.
- Tests cover typing, clearing, Escape, loading, disabled, and announcement behavior.

**Out of scope**

- Implementing filtering, debouncing network requests, or fetching results.
- Replacing the Combobox input for selection workflows.

### DS-077: Add VisuallyHidden and LiveRegion accessibility primitives

**Context**

Shared components need consistent utilities for screen-reader-only labels and
non-disruptive status announcements. Ad hoc `sr-only` markup and live regions
are easy to misuse or duplicate.

**Scope**

- Add a `VisuallyHidden` primitive that can wrap text or semantic elements.
- Add a `LiveRegion` with polite, assertive, and off modes.
- Support atomic announcements and an optional visually rendered fallback.
- Document appropriate use and cases where visible text is still required.

**Acceptance criteria**

- Visually hidden content remains available to assistive technology and focusable when needed.
- LiveRegion renders the correct ARIA live, atomic, and role attributes.
- Repeated identical messages can be intentionally re-announced through a documented API.
- Neither primitive affects surrounding layout.
- Tests cover semantic attributes, focusable content, modes, and message updates.

**Out of scope**

- A global notification queue.
- Replacing visible labels with hidden labels by default.

### DS-078: Add SkipLink and main-content focus handling

**Context**

Keyboard and screen-reader users currently traverse global navigation on every
route change. The application needs a reliable way to bypass repeated chrome
and reach the current page content.

**Scope**

- Add a shared SkipLink styled with design-system focus and surface tokens.
- Give the application shell a stable main-content target.
- Move focus to the page heading or main region after client-side navigation
  when appropriate.
- Prevent focus movement during query-only or tab-only state changes.

**Acceptance criteria**

- SkipLink is the first keyboard-focusable element and appears visibly on focus.
- Activating it moves focus to the main region without changing the URL unexpectedly.
- Route navigation announces the new page title once.
- Pointer navigation does not receive intrusive focus outlines or scrolling.
- Playwright tests cover skip activation and focus after route changes.

**Out of scope**

- Redesigning global navigation.
- Managing focus inside dialogs, menus, or other overlays.

### DS-079: Refine ScrollArea with overflow affordances

**Context**

Dense tables, menus, dialogs, and horizontal tab rows can overflow without a
clear visual indication that more content is available.

**Scope**

- Extend the shared ScrollArea with vertical, horizontal, and both-axis modes.
- Add optional start/end edge shadows driven by actual scroll position.
- Style scrollbars using semantic surface and border tokens.
- Preserve native scrolling, touch momentum, and keyboard access.

**Acceptance criteria**

- Edge shadows appear only when additional content exists in that direction.
- Scroll position updates do not trigger excessive React renders.
- Content remains reachable with keyboard, wheel, trackpad, and touch input.
- Scrollbars remain visible in forced-colors mode.
- Tests cover overflow detection, edge states, orientation, and resize updates.

**Out of scope**

- Virtualizing long lists or tables.
- Hiding browser scrollbars when users request visible scrollbars.

### DS-080: Standardize Divider and Separator patterns

**Context**

The interface uses borders and separators inconsistently, sometimes adding
visual noise instead of clarifying structure. Linear's calmer hierarchy depends
on using separators only where relationships require them.

**Scope**

- Refine the shared Separator with subtle, default, and strong tones.
- Support horizontal and vertical orientations with semantic or decorative modes.
- Add an optional centered-label divider for grouped forms and content.
- Document when spacing or surface contrast should replace a separator.

**Acceptance criteria**

- Semantic separators expose the correct role and orientation.
- Decorative separators are hidden from assistive technology.
- Vertical separators work in flex layouts without fixed parent heights.
- Labeled dividers preserve readable contrast in light, dark, and high-contrast themes.
- Tests cover orientations, tones, decorative semantics, and labeled content.

**Out of scope**

- Automatically removing existing page borders.
- Adding ornamental separators to marketing artwork.

### DS-081: Build an accessible Toolbar component

**Context**

Chart controls, table actions, filters, and editor-like command rows need a
compact grouped-control pattern with predictable keyboard navigation.

**Scope**

- Add Toolbar root, group, button, link, and separator parts.
- Support horizontal and vertical orientation.
- Implement roving tabindex with arrow-key, Home, and End navigation.
- Support disabled controls and optional accessible group labels.

**Acceptance criteria**

- Only one enabled toolbar control participates in the tab order at a time.
- Arrow keys follow orientation and skip disabled controls.
- Home and End move to the first and last enabled control.
- Buttons, links, and separators retain correct native semantics.
- Tests cover orientations, disabled controls, focus movement, and dynamic items.

**Out of scope**

- Defining chart or table business actions.
- Implementing a rich-text editor.

### DS-082: Build a transaction Stepper component

**Context**

Stellar actions often move through approval, signing, submission, confirmation,
and completion. A single status badge does not communicate multi-step progress
or which stages remain.

**Scope**

- Add Stepper, Step, StepIndicator, StepTitle, and StepDescription parts.
- Support pending, current, complete, error, and skipped states.
- Provide compact horizontal and detailed vertical layouts.
- Use semantic transaction colors without relying on color alone.

**Acceptance criteria**

- Ordered-list semantics communicate sequence to assistive technology.
- Current, completed, failed, and skipped steps have textual or icon cues.
- Long labels wrap without breaking connector alignment.
- Compact mode becomes vertical or scroll-safe on small screens.
- Tests cover every state, orientation, accessible current step, and dynamic progression.

**Out of scope**

- Submitting transactions or polling Stellar RPC.
- Persisting transaction progress across sessions.

### DS-083: Add a reusable ErrorState with retry support

**Context**

Empty states and alerts do not fully cover failed data regions. Tables, cards,
charts, and full pages need consistent recovery guidance without always invoking
the application-level ErrorBoundary.

**Scope**

- Add inline, section, and page ErrorState layouts.
- Support title, safe description, retry action, secondary action, and optional error reference.
- Define recoverable, permission, offline, and unavailable presentation variants.
- Ensure internal error details are not exposed to users by default.

**Acceptance criteria**

- Retry supports loading and disabled states and prevents duplicate activation.
- Error reference can be copied without exposing stack traces.
- Offline and permission variants provide specific, actionable guidance.
- Inline layout works inside tables, cards, and dialogs.
- Tests cover variants, retry lifecycle, copy action, and accessible alert semantics.

**Out of scope**

- Replacing React ErrorBoundary for render crashes.
- Logging errors or selecting an observability provider.

### DS-084: Add container-query layout utilities and examples

**Context**

Reusable dashboard components currently respond mostly to viewport width.
Cards, tables, and stat groups also need to adapt when placed in narrow panels
within a wide desktop viewport.

**Scope**

- Define named container utilities for inline-size containment.
- Add documented component breakpoints for compact, standard, and wide containers.
- Demonstrate Card, StatGroup, toolbar, and table-toolbar adaptation in the gallery.
- Provide graceful fallback behavior for unsupported or uncontained usage.

**Acceptance criteria**

- Components respond to their parent container rather than only viewport media queries.
- Container names avoid collisions when components are nested.
- Layout changes do not alter document reading order.
- Examples cover narrow sidebar, half-width panel, and full-width content placement.
- Visual tests verify representative container widths in both themes.

**Out of scope**

- Replacing every existing responsive utility.
- JavaScript ResizeObserver-based layout switching.

### DS-085: Synchronize browser chrome colors with the active theme

**Context**

The root document currently declares a fixed theme color even though SO4
supports light, dark, system, and future high-contrast preferences. Mobile
browser chrome and installed-app surfaces can therefore clash with the page.

**Scope**

- Define light and dark browser theme-color values from approved canvas tokens.
- Emit appropriate theme-color metadata for supported color schemes.
- Keep manifest background and theme colors aligned with the design system.
- Document limitations for runtime theme changes and installed PWA behavior.

**Acceptance criteria**

- Light and dark browser chrome use matching semantic canvas colors.
- System preference resolves correctly before hydration.
- Theme metadata does not introduce a flash or hydration mismatch.
- Manifest colors match the default launch appearance.
- Tests verify generated metadata and theme-resolution behavior.

**Out of scope**

- Rebuilding PWA icons or splash-screen artwork.
- Adding service-worker or offline caching functionality.
