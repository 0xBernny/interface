import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

import { cn } from '@workspace/ui/lib/utils'

const statusBadgeVariants = cva(
  'group/status-badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border px-2 py-0.5 text-10 font-medium whitespace-nowrap',
  {
    variants: {
      variant: {
        success: 'border-green-500/20 bg-green-500/10 text-green-400',
        warning: 'border-amber-500/20 bg-amber-500/10 text-amber-400',
        danger: 'border-red-500/20 bg-red-500/10 text-red-400',
        info: 'border-blue-500/20 bg-blue-500/10 text-blue-400',
        neutral: 'border-border bg-muted/60 text-muted-foreground',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  },
)

type StatusVariant = VariantProps<typeof statusBadgeVariants>['variant']

interface StatusBadgeProps {
  variant: StatusVariant
  children: React.ReactNode
  className?: string
}

function StatusBadge({ variant, children, className }: StatusBadgeProps) {
  return (
    <span
      data-slot="status-badge"
      className={cn(statusBadgeVariants({ variant }), className)}
    >
      {children}
    </span>
  )
}

export { StatusBadge, statusBadgeVariants }
export type { StatusVariant }
