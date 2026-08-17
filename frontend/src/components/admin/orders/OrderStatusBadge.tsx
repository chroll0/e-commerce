import classNames from "classnames";

type Props = {
  status: string;
  kind?: "order" | "payment";
};

const OrderStatusBadge = ({ status, kind = "order" }: Props) => {
  const normalized = status.toUpperCase();
  const classes =
    normalized === "PAID" || normalized === "SUCCESS"
      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700"
      : normalized === "PENDING"
        ? "border-amber-500/20 bg-amber-500/10 text-amber-700"
        : normalized === "SHIPPED"
          ? "border-sky-500/20 bg-sky-500/10 text-sky-700"
          : "border-destructive/20 bg-destructive/10 text-destructive";

  return (
    <span
      className={classNames(
        "inline-flex whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium",
        classes,
      )}
      title={`${kind} status: ${status}`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
};

export default OrderStatusBadge;