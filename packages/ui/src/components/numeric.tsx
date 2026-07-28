import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

import { cn } from '@workspace/ui/lib/utils'

const numericVariants = cva('font-mono tabular-nums', {
  variants: {
    role: {
      positive: 'text-green-500',
      negative: 'text-red-500',
      neutral: 'text-muted-foreground',
      danger: 'text-red-500 font-bold',
      'brand-long': 'text-green-500',
      'brand-short': 'text-red-500',
    },
  },
  defaultVariants: {
    role: 'neutral',
  },
})

type LegacyNumericRole = VariantProps<typeof numericVariants>['role']

interface NumericProps {
  value: number | null | undefined
  format?: 'usd' | 'token' | 'pct' | 'number'
  role?: LegacyNumericRole
  decimals?: number
  compact?: boolean
  fallback?: string
  className?: string
}

function formatUsd(value: number, compact?: boolean): string {
  if (compact) {
    if (Math.abs(value) >= 1_000_000_000) {
      return `$${(value / 1_000_000_000).toFixed(1)}B`
    }
    if (Math.abs(value) >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(1)}M`
    }
    if (Math.abs(value) >= 1_000) {
      return `$${(value / 1_000).toFixed(1)}K`
    }
  }
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatToken(value: number, decimals?: number): string {
  const maxDecimals = decimals ?? 4
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDecimals,
  })
}

function formatPct(value: number): string {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}

function formatNumber(value: number): string {
  return value.toLocaleString('en-US')
}

/**
 * Semantic tone for a numeric value already formatted by the caller.
 *
 * Unlike `Numeric` below, this primitive does not format or round its
 * children — it only supplies the tabular-figure font treatment and the
 * approved positive/negative/warning/accent/muted tones (DS-012).
 */
const numericTextVariants = cva("font-mono tabular-nums slashed-zero", {
  variants: {
    role: {
      neutral: "text-foreground",
      positive: "text-success",
      negative: "text-destructive",
      warning: "text-warning",
      accent: "text-primary",
      muted: "text-muted-foreground",
    },
    size: {
      "2xs": "text-[0.625rem] leading-4",
      xs: "text-[0.6875rem] leading-4",
      sm: "text-xs leading-5",
      md: "text-[0.8125rem] leading-5",
      base: "text-sm leading-5",
      lg: "text-base leading-6",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
  },
  defaultVariants: {
    role: "neutral",
    size: "base",
    weight: "normal",
  },
})

type NumericRole = VariantProps<typeof numericTextVariants>['role']

type NumericTextProps = React.ComponentProps<'span'> &
  VariantProps<typeof numericTextVariants>

function NumericText({ role, size, weight, className, ...props }: NumericTextProps) {
  return (
    <span
      data-slot="numeric-text"
      className={cn(numericTextVariants({ role, size, weight }), className)}
      {...props}
    />
  )
}

/** Derives a positive/negative/neutral role from a signed value's sign. */
function numericRoleForValue(
  value: number
): Extract<NumericRole, 'positive' | 'negative' | 'neutral'> {
  if (value > 0) return 'positive'
  if (value < 0) return 'negative'
  return 'neutral'
}

function Numeric({
  value,
  format = 'number',
  role = 'neutral',
  decimals,
  compact = false,
  fallback = '\u2014',
  className,
}: NumericProps) {
  const display = (() => {
    if (value === null || value === undefined || Number.isNaN(value)) {
      return fallback
    }
    switch (format) {
      case 'usd':
        return formatUsd(value, compact)
      case 'token':
        return formatToken(value, decimals)
      case 'pct':
        return formatPct(value)
      case 'number':
        return formatNumber(value)
    }
  })()

  return (
    <span
      data-slot="numeric"
      className={cn(numericVariants({ role }), className)}
    >
      {display}
    </span>
  )
}

export { Numeric, numericVariants, NumericText, numericTextVariants, numericRoleForValue }
export type { NumericRole, NumericProps, LegacyNumericRole, NumericTextProps }
