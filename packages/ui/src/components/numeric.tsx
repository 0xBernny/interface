import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva } from "class-variance-authority"

import { cn } from "@workspace/ui/lib/utils"
import type { VariantProps } from "class-variance-authority"

/**
 * Semantic roles for financial figures.
 *
 * - `neutral`   — a plain amount (balance, TVL, volume)
 * - `muted`     — a de-emphasised amount (secondary column, placeholder)
 * - `positive`  — yield, APR, rewards, gains, long side
 * - `negative`  — losses, short side
 * - `warning`   — at-risk values (liquidation price, cooldown)
 * - `accent`    — brand-highlighted figures (commissions, tier rates)
 */
export type NumericRole =
  | "neutral"
  | "muted"
  | "positive"
  | "negative"
  | "warning"
  | "accent"

const numericVariants = cva("font-mono tabular-nums", {
  variants: {
    role: {
      neutral: "text-foreground",
      muted: "text-muted-foreground",
      positive: "text-success",
      negative: "text-destructive",
      warning: "text-warning",
      accent: "text-primary",
    },
    size: {
      "2xs": "text-[0.625rem] leading-4",
      xs: "text-[0.6875rem] leading-4",
      sm: "text-xs leading-5",
      md: "text-[0.8125rem] leading-5",
      base: "text-sm leading-5",
      lg: "text-base leading-6",
      xl: "text-[1.375rem] leading-7 tracking-tight",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
  },
  defaultVariants: { role: "neutral", size: "sm", weight: "normal" },
})

function NumericText({
  className,
  role,
  size,
  weight,
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof numericVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      { className: cn(numericVariants({ role, size, weight }), className) },
      props
    ),
    render,
    state: { slot: "numeric", role },
  })
}

/** Maps a signed value onto the matching numeric role. */
function numericRoleForValue(value: number): NumericRole {
  if (value > 0) return "positive"
  if (value < 0) return "negative"
  return "neutral"
}

export { NumericText, numericRoleForValue, numericVariants }
