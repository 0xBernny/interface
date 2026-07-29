import { cva } from "class-variance-authority"

import { cn } from "@workspace/ui/lib/utils"
import type { VariantProps } from "class-variance-authority"

const cardVariants = cva("rounded-xl border", {
  variants: {
    variant: {
      /** Default raised surface — cards, panels, sidebars. */
      default: "border-border bg-card",
      /** Recessed surface for supporting information. */
      muted: "border-border bg-muted/20",
      /** Placeholder surface for "nothing here yet". */
      dashed: "border-dashed border-border bg-muted/10",
      /** Frame only — used when the body is a table that paints its own rows. */
      plain: "border-border bg-transparent overflow-hidden",
    },
    padding: {
      none: "",
      sm: "p-4",
      md: "p-5",
      lg: "p-6",
    },
  },
  defaultVariants: { variant: "default", padding: "none" },
})

function Card({
  className,
  variant,
  padding,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof cardVariants>) {
  return (
    <div
      data-slot="card"
      className={cn(cardVariants({ variant, padding }), className)}
      {...props}
    />
  )
}

/** Header strip with a bottom rule — the standard table/card caption row. */
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("border-b border-border px-5 py-3.5", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card-content" className={cn("p-5", className)} {...props} />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center gap-2 px-5 pb-5", className)}
      {...props}
    />
  )
}

export { Card, CardHeader, CardContent, CardFooter, cardVariants }
