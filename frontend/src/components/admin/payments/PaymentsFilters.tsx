"use client";

import { useTranslations } from "next-intl";
import { ArrowUpDown, Search } from "lucide-react";
import { Button, Input, SelectField } from "@/components";
import type { PaymentStatus, SelectOption } from "@/types";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  provider: string;
  onProviderChange: (value: string) => void;
  sortNewest: boolean;
  onToggleSort: () => void;
  statuses: PaymentStatus[];
  providers: string[];
};

const PaymentsFilters = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  provider,
  onProviderChange,
  sortNewest,
  onToggleSort,
  statuses,
  providers,
}: Props) => {
  const t = useTranslations("admin.payments.filters");

  const statusOptions: SelectOption[] = statuses.map((item) => ({
    value: item,
    label: item,
  }));
  const providerOptions: SelectOption[] = providers.map((item) => ({
    value: item,
    label: item,
  }));

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
          label={t("statusLabel")}
          value={status}
          onChange={onStatusChange}
          options={statusOptions}
          placeholderLabel={t("allStatuses")}
        />
      </div>
      <div className="sm:w-56">
        <SelectField
          label={t("providerLabel")}
          value={provider}
          onChange={onProviderChange}
          options={providerOptions}
          placeholderLabel={t("allProviders")}
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

export default PaymentsFilters;
