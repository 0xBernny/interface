import { useEffect, useMemo, useRef, useState } from "react"
import { KeyboardShortcut } from "@workspace/ui/components/keyboard-shortcut"
import { docsPages, getPager } from "../lib/docs-pages"
import {
  docsShortcuts,
  getPlatform,
  isEditableTarget,
  matchesShortcut,
} from "../lib/shortcuts"
import type { DocsPage } from "../lib/docs-pages"

interface DocsHomeProps {
  initialSlug?: string
}

export function DocsHome({ initialSlug = "/" }: DocsHomeProps) {
  const [activeSlug, setActiveSlug] = useState(initialSlug)
  const [searchOpen, setSearchOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("typescript")
  const sidebarRef = useRef<HTMLAnchorElement>(null)
  const platform = useMemo(() => getPlatform(), [])
  const page =
    docsPages.find((item) => item.slug === activeSlug) ?? docsPages[0]
  const pager = getPager(page.slug)

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (isEditableTarget(event.target)) return

      for (const shortcut of docsShortcuts) {
        if (!matchesShortcut(event, shortcut.keys, platform)) continue
        event.preventDefault()

        if (shortcut.id === "search") setSearchOpen(true)
        if (shortcut.id === "sidebar") {
          setSidebarOpen(true)
          sidebarRef.current?.focus()
        }
        if (shortcut.id === "previous" && pager.previous)
          setActiveSlug(pager.previous.slug)
        if (shortcut.id === "next" && pager.next) setActiveSlug(pager.next.slug)
        if (shortcut.id === "list") setShortcutsOpen(true)
      }
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [pager.next, pager.previous, platform])

  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="border-b border-border bg-surface-canvas px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <a
            href="#content"
            className="sr-only focus:not-sr-only focus:text-primary"
          >
            Skip to content
          </a>
          <span className="text-lg font-semibold">SO4 Docs</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-md border border-border bg-surface-raised px-3 py-2 text-sm text-text-secondary"
              onClick={() => setSearchOpen(true)}
            >
              Search{" "}
              <KeyboardShortcut keys={["Mod", "K"]} platform={platform} />
            </button>
            <button
              type="button"
              className="rounded-md border border-border bg-surface-raised px-3 py-2 text-sm text-text-secondary"
              aria-expanded={shortcutsOpen}
              onClick={() => setShortcutsOpen(true)}
            >
              Shortcuts <KeyboardShortcut keys={["?"]} platform={platform} />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-8 lg:grid-cols-[16rem_1fr_14rem]">
        <aside
          aria-label="Docs navigation"
          className={sidebarOpen ? "block" : "hidden lg:block"}
        >
          <nav aria-label="Docs navigation" className="space-y-1">
            {docsPages.map((item, index) => (
              <a
                key={item.slug}
                ref={index === 0 ? sidebarRef : undefined}
                href={item.slug}
                className="block rounded-md px-3 py-2 text-sm text-text-secondary hover:bg-surface-raised hover:text-foreground focus:bg-surface-raised"
                aria-current={item.slug === page.slug ? "page" : undefined}
                onClick={(event) => {
                  event.preventDefault()
                  setActiveSlug(item.slug)
                }}
              >
                {item.title}
              </a>
            ))}
          </nav>
        </aside>

        <main id="content" className="min-w-0">
          <Article
            page={page}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          <nav
            aria-label="Page navigation"
            className="mt-10 grid gap-3 sm:grid-cols-2"
          >
            <PagerButton
              label="Previous"
              page={pager.previous}
              shortcut={["Alt", "ArrowLeft"]}
              onSelect={setActiveSlug}
            />
            <PagerButton
              label="Next"
              page={pager.next}
              shortcut={["Alt", "ArrowRight"]}
              onSelect={setActiveSlug}
            />
          </nav>
        </main>

        <aside aria-label="On this page" className="hidden lg:block">
          <nav
            aria-label="On this page"
            className="space-y-2 text-sm text-text-secondary"
          >
            <a className="block hover:text-foreground" href="#overview">
              Overview
            </a>
            <a className="block hover:text-foreground" href="#details">
              Details
            </a>
            <a className="block hover:text-foreground" href="#next-steps">
              Next steps
            </a>
          </nav>
        </aside>
      </div>

      {searchOpen ? (
        <SearchDialog onClose={() => setSearchOpen(false)} />
      ) : null}
      {shortcutsOpen ? (
        <ShortcutDialog
          platform={platform}
          onClose={() => setShortcutsOpen(false)}
        />
      ) : null}
    </div>
  )
}

function Article({
  page,
  activeTab,
  onTabChange,
}: {
  page: DocsPage
  activeTab: string
  onTabChange: (tab: string) => void
}) {
  return (
    <article className="prose prose-invert max-w-none">
      <h1 className="text-4xl font-semibold tracking-normal text-foreground">
        {page.title}
      </h1>
      <p className="mt-4 text-lg text-text-secondary">{page.description}</p>
      <section aria-labelledby="overview" className="mt-8">
        <h2 id="overview" className="text-2xl font-semibold text-foreground">
          Overview
        </h2>
        <p className="mt-3 text-text-secondary">
          SO4 Docs gives readers a separate, lightweight documentation surface.
        </p>
      </section>
      <section aria-labelledby="details" className="mt-8">
        <h2 id="details" className="text-2xl font-semibold text-foreground">
          Details
        </h2>
        {page.kind === "long" ? <LongPageContent /> : null}
        {page.kind === "tabs" ? (
          <TabsContent activeTab={activeTab} onTabChange={onTabChange} />
        ) : null}
        {page.kind !== "long" && page.kind !== "tabs" ? (
          <p className="mt-3 text-text-secondary">
            This placeholder route keeps the docs build emitting real HTML.
          </p>
        ) : null}
      </section>
      <section aria-labelledby="next-steps" className="mt-8">
        <h2 id="next-steps" className="text-2xl font-semibold text-foreground">
          Next steps
        </h2>
        <p className="mt-3 text-text-secondary">
          Content, MDX rendering, and styling arrive in follow-up DX issues.
        </p>
      </section>
    </article>
  )
}

function LongPageContent() {
  return (
    <div className="mt-3 space-y-5 text-text-secondary">
      <h3 className="text-xl font-semibold text-foreground">Runtime split</h3>
      <p>
        Docs readers avoid downloading the trading runtime, wallet providers,
        and market data clients.
      </p>
      <h3 className="text-xl font-semibold text-foreground">Static output</h3>
      <p>
        The docs workspace is ready for prerendered HTML and independent
        deployment at docs.so4.market.
      </p>
      <h3 className="text-xl font-semibold text-foreground">Validation</h3>
      <p>
        Content checks run separately so prose problems report as content
        errors, not trading app regressions.
      </p>
    </div>
  )
}

function TabsContent({
  activeTab,
  onTabChange,
}: {
  activeTab: string
  onTabChange: (tab: string) => void
}) {
  return (
    <div className="mt-4">
      <div role="tablist" aria-label="Code language" className="flex gap-2">
        {["typescript", "bash"].map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            className="rounded-md border border-border bg-surface-raised px-3 py-2 text-sm text-text-secondary capitalize aria-selected:text-foreground"
            onClick={() => onTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <pre className="mt-3 overflow-x-auto rounded-md border border-border bg-surface-sunken p-4 text-sm text-text-secondary">
        <code>
          {activeTab === "typescript"
            ? 'export const docs = "SO4 Docs"'
            : "bun run --cwd apps/docs dev"}
        </code>
      </pre>
    </div>
  )
}

function PagerButton({
  label,
  page,
  shortcut,
  onSelect,
}: {
  label: string
  page?: DocsPage
  shortcut: Array<string>
  onSelect: (slug: string) => void
}) {
  if (!page) return <span aria-hidden="true" />

  return (
    <button
      type="button"
      className="rounded-md border border-border bg-surface-raised p-4 text-left text-sm text-text-secondary hover:text-foreground"
      onClick={() => onSelect(page.slug)}
    >
      <span className="block">{label}</span>
      <span className="mt-1 block font-medium text-foreground">
        {page.title}
      </span>
      <KeyboardShortcut keys={shortcut} />
    </button>
  )
}

function SearchDialog({ onClose }: { onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="docs-search-title"
      className="fixed inset-0 bg-surface-overlay/80 p-6"
    >
      <div className="mx-auto max-w-xl rounded-lg border border-border bg-surface-canvas p-5 shadow-lg">
        <div className="flex items-center justify-between gap-4">
          <h2
            id="docs-search-title"
            className="text-xl font-semibold text-foreground"
          >
            Search docs
          </h2>
          <button
            type="button"
            className="text-sm text-text-secondary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <label
          className="mt-4 block text-sm text-text-secondary"
          htmlFor="docs-search-input"
        >
          Query
        </label>
        <input
          id="docs-search-input"
          className="mt-2 w-full rounded-md border border-border bg-surface-sunken px-3 py-2 text-foreground"
          autoFocus
        />
        <ul className="mt-4 space-y-2">
          {docsPages.slice(0, 3).map((page) => (
            <li key={page.slug} className="rounded-md border border-border p-3">
              <span className="font-medium text-foreground">{page.title}</span>
              <span className="block text-sm text-text-secondary">
                {page.description}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function ShortcutDialog({
  platform,
  onClose,
}: {
  platform: "mac" | "windows" | "linux"
  onClose: () => void
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="docs-shortcuts-title"
      className="fixed inset-0 bg-surface-overlay/80 p-6"
    >
      <div className="mx-auto max-w-lg rounded-lg border border-border bg-surface-canvas p-5 shadow-lg">
        <div className="flex items-center justify-between gap-4">
          <h2
            id="docs-shortcuts-title"
            className="text-xl font-semibold text-foreground"
          >
            Keyboard shortcuts
          </h2>
          <button
            type="button"
            className="text-sm text-text-secondary"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <dl className="mt-4 space-y-3">
          {docsShortcuts.map((shortcut) => (
            <div
              key={shortcut.id}
              className="flex items-center justify-between gap-4"
            >
              <dt className="text-sm text-text-secondary">{shortcut.label}</dt>
              <dd>
                <KeyboardShortcut keys={shortcut.keys} platform={platform} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
