"use client";

import { useTranslations } from "next-intl";
import { ArrowUpDown, Search } from "lucide-react";
import { Button, Input, SelectField } from "@/components";
import type { OrderStatus, PaymentStatus, SelectOption } from "@/types";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  orderStatus: string;
  onOrderStatusChange: (value: string) => void;
  paymentStatus: string;
  onPaymentStatusChange: (value: string) => void;
  sortNewest: boolean;
  onToggleSort: () => void;
  orderStatuses: OrderStatus[];
  paymentStatuses: PaymentStatus[];
};

const OrdersFilters = ({
  search,
  onSearchChange,
  orderStatus,
  onOrderStatusChange,
  paymentStatus,
  onPaymentStatusChange,
  sortNewest,
  onToggleSort,
  orderStatuses,
  paymentStatuses,
}: Props) => {
  const t = useTranslations("admin.orders.filters");

  const orderStatusOptions: SelectOption[] = orderStatuses.map((status) => ({
    value: status,
    label: status,
  }));
  const paymentStatusOptions: SelectOption[] = paymentStatuses.map(
    (status) => ({ value: status, label: status }),
  );

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-end">
      <div className="flex-1">
        <Input
          label={t("searchLabel")}
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          leftIcon={<Search className="h-4 w-4" />}
        />
      </div>
      <div className="sm:w-56">
        <SelectField
          label={t("orderStatusLabel")}
          value={orderStatus}
          onChange={onOrderStatusChange}
          options={orderStatusOptions}
          placeholderLabel={t("allStatuses")}
        />
      </div>
      <div className="sm:w-56">
        <SelectField
          label={t("paymentStatusLabel")}
          value={paymentStatus}
          onChange={onPaymentStatusChange}
          options={paymentStatusOptions}
          placeholderLabel={t("allStatuses")}
        />
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onToggleSort}
        leftIcon={<ArrowUpDown className="h-4 w-4" />}
      >
        {sortNewest ? t("sortNewest") : t("sortOldest")}
      </Button>
    </div>
  );
};

export default OrdersFilters;
