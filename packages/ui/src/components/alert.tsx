import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@workspace/ui/lib/utils"
import type { VariantProps } from "class-variance-authority"

// ---------------------------------------------------------------------------
// ARIA live-region semantics
//
//  severity  | role    | aria-live  | aria-atomic
//  ----------|---------|------------|------------
//  info      | status  | polite     | false   – supplemental, non-urgent
//  success   | status  | polite     | false
//  warning   | alert   | assertive  | true    – demands attention
//  error     | alert   | assertive  | true    – must be announced immediately
// ---------------------------------------------------------------------------

type Severity = "info" | "success" | "warning" | "error"

const SEVERITY_ROLE: Record<Severity, "status" | "alert"> = {
  info: "status",
  success: "status",
  warning: "alert",
  error: "alert",
}

const SEVERITY_LIVE: Record<Severity, "polite" | "assertive"> = {
  info: "polite",
  success: "polite",
  warning: "assertive",
  error: "assertive",
}

// ---------------------------------------------------------------------------
// Layout variants
// ---------------------------------------------------------------------------

const alertVariants = cva(
  // Base – shared by both layouts
  "relative flex w-full gap-3 border text-sm transition-colors [&_svg]:shrink-0",
  {
    variants: {
      severity: {
        info: [
          "border-primary/20 bg-primary/5 text-primary",
          "dark:border-primary/30 dark:bg-primary/10",
        ],
        success: [
          "border-emerald-500/20 bg-emerald-500/5 text-emerald-700",
          "dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-400",
        ],
        warning: [
          "border-amber-500/20 bg-amber-500/5 text-amber-700",
          "dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-400",
        ],
        error: [
          "border-destructive/20 bg-destructive/5 text-destructive",
          "dark:border-destructive/30 dark:bg-destructive/10",
        ],
      },
      layout: {
        /** Sits inline inside a form, card, or section. */
        inline: "items-start rounded-md px-3.5 py-3",
        /** Stretches edge-to-edge as an application-level banner. */
        banner: "items-center rounded-none border-x-0 px-4 py-3",
      },
    },
    defaultVariants: {
      severity: "info",
      layout: "inline",
    },
  }
)

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AlertProps
  extends
    Omit<React.ComponentProps<"div">, "role" | "title">,
    VariantProps<typeof alertVariants> {
  /** Severity level – controls colour, icon defaults, and ARIA semantics. */
  severity?: Severity
  /** Leading icon. Pass any SVG or icon component. */
  icon?: React.ReactNode
  /** Bold label / headline rendered before the message. */
  title?: React.ReactNode
  /** Main message content. */
  description?: React.ReactNode
  /**
   * Action element(s) – a button or link rendered at the end of the content
   * area. Pass your own styled `<button>` or `<a>`.
   */
  action?: React.ReactNode
  /**
   * Dismiss callback. When provided a close button is rendered. The caller
   * is responsible for removing/hiding the alert from the tree.
   */
  onDismiss?: () => void
  /** Accessible label for the dismiss button (defaults to "Dismiss"). */
  dismissLabel?: string
}

// ---------------------------------------------------------------------------
// Default icons (simple inline SVGs – no extra dep required)
// ---------------------------------------------------------------------------

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="currentColor"
      className={cn("size-4", className)}
    >
      <path
        fillRule="evenodd"
        d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm8-2a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 018 6zm0-2.5a1 1 0 110 2 1 1 0 010-2z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function SuccessIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="currentColor"
      className={cn("size-4", className)}
    >
      <path
        fillRule="evenodd"
        d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm11.03-2.22a.75.75 0 010 1.06l-4 4a.75.75 0 01-1.06 0l-2-2a.75.75 0 011.06-1.06l1.47 1.47 3.47-3.47a.75.75 0 011.06 0z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function WarningIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="currentColor"
      className={cn("size-4", className)}
    >
      <path
        fillRule="evenodd"
        d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0114.082 15H1.918a1.75 1.75 0 01-1.543-2.575zM8 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 5zm0 7.5a1 1 0 110-2 1 1 0 010 2z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function ErrorIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="currentColor"
      className={cn("size-4", className)}
    >
      <path
        fillRule="evenodd"
        d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm5.22-2.78a.75.75 0 011.06 0L8 6.94l1.72-1.72a.75.75 0 111.06 1.06L9.06 8l1.72 1.72a.75.75 0 11-1.06 1.06L8 9.06l-1.72 1.72a.75.75 0 01-1.06-1.06L6.94 8 5.22 6.28a.75.75 0 010-1.06z"
        clipRule="evenodd"
      />
    </svg>
  )
}

const DEFAULT_ICONS: Record<Severity, React.ReactElement> = {
  info: <InfoIcon />,
  success: <SuccessIcon />,
  warning: <WarningIcon />,
  error: <ErrorIcon />,
}

// Small ✕ used for the dismiss button
function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="currentColor"
      className="size-3.5"
    >
      <path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function Alert({
  severity = "info",
  layout = "inline",
  icon,
  title,
  description,
  action,
  onDismiss,
  dismissLabel = "Dismiss",
  className,
  children,
  ...props
}: AlertProps) {
  const role = SEVERITY_ROLE[severity]
  const ariaLive = SEVERITY_LIVE[severity]
  const ariaAtomic = role === "alert"

  // Resolve icon: explicit prop > severity default
  const resolvedIcon = icon !== undefined ? icon : DEFAULT_ICONS[severity]

  // Content: prefer explicit title/description props; fall back to children
  const hasStructured = title != null || description != null

  return (
    <div
      data-slot="alert"
      data-severity={severity}
      data-layout={layout}
      role={role}
      aria-live={ariaLive}
      aria-atomic={ariaAtomic}
      className={cn(alertVariants({ severity, layout }), className)}
      {...props}
    >
      {/* Leading icon */}
      {resolvedIcon != null && (
        <span data-slot="alert-icon" className="mt-0.5 shrink-0">
          {resolvedIcon}
        </span>
      )}

      {/* Body */}
      <div data-slot="alert-body" className="min-w-0 flex-1">
        {hasStructured ? (
          <>
            {title != null && (
              <p data-slot="alert-title" className="leading-snug font-semibold">
                {title}
              </p>
            )}
            {description != null && (
              <p
                data-slot="alert-description"
                className={cn(
                  "leading-snug",
                  title != null && "mt-0.5 opacity-90"
                )}
              >
                {description}
              </p>
            )}
          </>
        ) : (
          children
        )}

        {/* Inline action */}
        {action != null && (
          <div data-slot="alert-action" className="mt-2">
            {action}
          </div>
        )}
      </div>

      {/* Dismiss button */}
      {onDismiss != null && (
        <button
          type="button"
          data-slot="alert-dismiss"
          aria-label={dismissLabel}
          onClick={onDismiss}
          className={cn(
            "ml-auto shrink-0 self-start rounded-sm p-0.5 opacity-60",
            "transition-opacity hover:opacity-100",
            "focus-visible:ring-2 focus-visible:ring-current/40 focus-visible:outline-none"
          )}
        >
          <CloseIcon />
        </button>
      )}
    </div>
  )
}

export { Alert, alertVariants }
export type { Severity as AlertSeverity }
