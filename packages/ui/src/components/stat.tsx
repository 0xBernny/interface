import { NumericText } from "@workspace/ui/components/numeric"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Text } from "@workspace/ui/components/text"
import { cn } from "@workspace/ui/lib/utils"
import type { NumericRole } from "@workspace/ui/components/numeric"
import type { ComponentProps } from "react"

type StatProps = Omit<ComponentProps<"div">, "role"> & {
  label: string
  value: React.ReactNode
  /** Semantic role for the value — drives its colour. */
  role?: NumericRole
  size?: ComponentProps<typeof NumericText>["size"]
  weight?: ComponentProps<typeof NumericText>["weight"]
  isLoading?: boolean
  /** Rendered under the value (e.g. "Performance APY"). */
  hint?: string
  /** Renders the label as a small uppercase caption. */
  uppercase?: boolean
}

/**
 * Label + numeric value pair. The single place financial figures pick up
 * tabular numerals, so columns of amounts always align.
 */
function Stat({
  label,
  value,
  role = "neutral",
  size = "base",
  weight = "medium",
  isLoading = false,
  hint,
  uppercase = false,
  className,
  ...props
}: StatProps) {
  return (
    <div
      data-slot="stat"
      className={cn("flex min-w-0 flex-col gap-1", className)}
      {...props}
    >
      <Text
        size="2xs"
        tone="muted"
        weight={uppercase ? "medium" : "normal"}
        variant={uppercase ? "label" : "body"}
        render={<span />}
      >
        {label}
      </Text>
      {isLoading ? (
        <Skeleton className="h-5 w-20" />
      ) : (
        <NumericText role={role} size={size} weight={weight}>
          {value}
        </NumericText>
      )}
      {hint && (
        <Text size="2xs" tone="muted" render={<span />}>
          {hint}
        </Text>
      )}
    </div>
  )
}

export { Stat }
