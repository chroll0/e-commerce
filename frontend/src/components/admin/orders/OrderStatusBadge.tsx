import classNames from "classnames";
import { useTranslations } from "next-intl";
import { getStatusPresentation, StatusKind } from "@/lib/orderStatus";

type Props = {
  status: string;
  kind?: StatusKind;
};

const OrderStatusBadge = ({ status, kind = "order" }: Props) => {
  const t = useTranslations("admin.orders.statuses");
  const presentation = getStatusPresentation(status, kind);

  return (
    <span
      className={classNames(
        "inline-flex whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium",
        presentation.classes,
      )}
      title={`${kind} status: ${status}`}
    >
      {t(presentation.key)}
    </span>
  );
};

export default OrderStatusBadge;
