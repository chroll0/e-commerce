export type StatusKind = "order" | "payment";

export type StatusPresentation = {
  key: string;
  classes: string;
};

const statusClasses = {
  positive:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  pending:
    "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  failed: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300",
  shipped: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  cancelled:
    "border-slate-500/30 bg-slate-500/10 text-slate-700 dark:text-slate-300",
  unknown: "border-border bg-card-soft text-secondary",
} as const;

export function getStatusPresentation(
  status: string,
  kind: StatusKind = "order",
): StatusPresentation {
  const normalized = status.trim().toUpperCase();

  if (normalized === "PENDING") {
    return { key: "pending", classes: statusClasses.pending };
  }

  if (kind === "payment") {
    if (normalized === "SUCCESS") {
      return { key: "success", classes: statusClasses.positive };
    }

    if (normalized === "FAILED") {
      return { key: "failed", classes: statusClasses.failed };
    }

    if (normalized === "CANCELLED") {
      return { key: "cancelled", classes: statusClasses.cancelled };
    }
  } else {
    if (normalized === "PAID") {
      return { key: "paid", classes: statusClasses.positive };
    }

    if (normalized === "PAYMENT_FAILED") {
      return { key: "paymentFailed", classes: statusClasses.failed };
    }

    if (normalized === "SHIPPED") {
      return { key: "shipped", classes: statusClasses.shipped };
    }

    if (normalized === "CANCELLED") {
      return { key: "cancelled", classes: statusClasses.cancelled };
    }
  }

  return { key: "unknown", classes: statusClasses.unknown };
}
