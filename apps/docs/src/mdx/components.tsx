import type { MDXComponents } from "mdx/types"
import { Link } from "@tanstack/react-router"
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons"
import { Icon } from "@workspace/ui/components/icon"

import { cn } from "@workspace/ui/lib/utils"
import { Heading, Text } from "@workspace/ui/components/text"
import { Callout } from "@workspace/ui/components/callout"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@workspace/ui/components/table"
import { CodeGroup } from "./CodeGroup"
import { Tab, Tabs } from "./Tabs"

export const components: MDXComponents = {
  h1: (props) => <Heading level={1} {...props} />,
  h2: (props) => <Heading level={2} {...props} />,
  h3: (props) => <Heading level={3} {...props} />,
  h4: (props) => <Heading level={4} {...props} />,
  h5: (props) => <Text weight="bold" {...props} />,
  h6: (props) => <Text weight="medium" {...props} />,
  p: (props) => <Text className={cn("mb-4", props.className)} {...props} />,
  code: (props) => {
    // Let Shiki handle block styles
    if (props.className?.includes("shiki")) {
      return <code {...props} />
    }
    return (
      <code
        {...props}
        className={cn(
          "rounded bg-surface-sunken px-1.5 py-0.5 font-mono text-sm text-text-primary",
          props.className
        )}
      />
    )
  },
  blockquote: ({ children, ...props }) => (
    <div className="my-6">
      <Callout variant="note" {...props}>
        {children}
      </Callout>
    </div>
  ),
  table: (props) => (
    <div className="my-6 w-full">
      <Table {...props} />
    </div>
  ),
  thead: TableHeader,
  tbody: TableBody,
  tr: TableRow,
  th: TableHead,
  td: TableCell,
  a: ({ href, children, ...props }) => {
    if (href?.startsWith("/")) {
      return (
        <Link
          to={href}
          preload="intent"
          className="font-medium text-primary hover:underline"
          {...props}
        >
          {children}
        </Link>
      )
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-0.5 font-medium text-primary hover:underline"
        {...props}
      >
        {children}
        <Icon
          icon={ArrowUpRight01Icon}
          size="sm"
          className="ml-0.5 inline-block text-text-tertiary"
        />
      </a>
    )
  },
  ul: (props) => (
    <ul
      className="mb-4 list-disc space-y-2 pl-6 text-sm text-text-primary"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="mb-4 list-decimal space-y-2 pl-6 text-sm text-text-primary"
      {...props}
    />
  ),
  li: (props) => <li {...props} />,
  hr: (props) => <hr className="my-8 border-border" {...props} />,
  img: (props) => (
    <img
      className="my-6 h-auto max-w-full rounded-lg border border-border"
      {...props}
    />
  ),
  Tabs,
  Tab,
  CodeGroup,
}
