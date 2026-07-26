import { cva } from "class-variance-authority"

import { cn } from "@workspace/ui/lib/utils"
import type { VariantProps } from "class-variance-authority"

const alertVariants = cva(
  "flex w-full items-start gap-3 rounded-lg border px-4 py-3 [&>svg]:mt-px [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        info: "border-info/20 bg-info/[0.07] text-info",
        success: "border-success/20 bg-success/[0.07] text-success",
        warning: "border-warning/30 bg-warning/10 text-warning",
        danger: "border-destructive/30 bg-destructive/10 text-destructive",
        muted: "border-border bg-muted/30 text-muted-foreground",
      },
    },
    defaultVariants: { variant: "info" },
  }
)

type AlertProps = React.ComponentProps<"div"> &
  VariantProps<typeof alertVariants>

function Alert({ className, variant = "info", role, ...props }: AlertProps) {
  return (
    <div
      data-slot="alert"
      role={role ?? (variant === "danger" ? "alert" : "status")}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="alert-title"
      className={cn("text-[0.8125rem] font-semibold", className)}
      {...props}
    />
  )
}

function AlertDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="alert-description"
      className={cn("text-xs leading-relaxed opacity-90", className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, alertVariants }
