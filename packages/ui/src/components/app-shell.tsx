import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@workspace/ui/lib/utils"
import type { VariantProps } from "class-variance-authority"

const shellVariants = cva(
  "flex min-h-svh flex-col bg-background text-foreground",
  {
    variants: {
      variant: {
        /** Full-viewport layout for the trading page — no max-width, fills space. */
        full: "",
        /** Constrained content layout with a max-width container. */
        constrained: "",
      },
    },
    defaultVariants: {
      variant: "constrained",
    },
  }
)

const contentVariants = cva("w-full", {
  variants: {
    variant: {
      full: "flex min-h-0 flex-1 flex-col overflow-hidden",
      constrained: "mx-auto px-4 pb-16 pt-8 sm:px-6",
    },
  },
  defaultVariants: {
    variant: "constrained",
  },
})

type MaxWidthKey = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "260" | "320" | "330" | "full"

const MAX_WIDTH_CLASS: Record<MaxWidthKey, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "260": "max-w-260",
  "320": "max-w-320",
  "330": "max-w-330",
  full: "max-w-full",
}

export interface AppShellProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof shellVariants> {
  /** Top navigation bar. Rendered at the top of the shell, outside the scrollable content area. */
  navbar: React.ReactNode
  /** Application-level banner(s) — NetworkMismatchBanner, CircuitBreakerBanner, etc. */
  banner?: React.ReactNode
  /**
   * Max-width for the constrained variant. Use one of the token-defined widths.
   * @default "320"
   */
  maxWidth?: MaxWidthKey
}

function AppShell({
  variant = "constrained",
  maxWidth = "320",
  navbar,
  banner,
  className,
  children,
  ...props
}: AppShellProps) {
  return (
    <div
      data-slot="app-shell"
      data-variant={variant}
      className={cn(shellVariants({ variant }), className)}
      {...props}
    >
      {navbar}
      {banner}
      <div
        data-slot="app-shell-content"
        className={cn(
          contentVariants({ variant }),
          variant === "constrained" && MAX_WIDTH_CLASS[maxWidth],
          variant === "constrained" && "lg:px-8"
        )}
      >
        {children}
      </div>
    </div>
  )
}

export { AppShell, shellVariants }