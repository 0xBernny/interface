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

type NumericRole = VariantProps<typeof numericVariants>['role']

interface NumericProps {
  value: number | null | undefined
  format?: 'usd' | 'token' | 'pct' | 'number'
  role?: NumericRole
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

export { Numeric, numericVariants }
export type { NumericRole, NumericProps }
