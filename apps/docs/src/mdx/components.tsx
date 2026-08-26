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
          "font-mono text-[0.875em] bg-surface-sunken px-1.5 py-0.5 rounded text-text-primary",
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
          className="text-primary hover:underline font-medium"
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
        className="text-primary hover:underline font-medium inline-flex items-center gap-0.5"
        {...props}
      >
        {children}
        <Icon icon={ArrowUpRight01Icon} size="sm" className="inline-block text-text-tertiary ml-0.5" />
      </a>
    )
  },
  ul: (props) => (
    <ul className="list-disc pl-6 mb-4 space-y-2 text-text-primary text-sm" {...props} />
  ),
  ol: (props) => (
    <ol className="list-decimal pl-6 mb-4 space-y-2 text-text-primary text-sm" {...props} />
  ),
  li: (props) => <li {...props} />,
  hr: (props) => <hr className="my-8 border-border" {...props} />,
  img: (props) => (
    <img className="rounded-lg border border-border my-6 max-w-full h-auto" {...props} />
  ),
}
