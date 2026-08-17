"use client";

import { useTranslations } from "next-intl";
import { ArrowUpDown, Search } from "lucide-react";
import { Button } from "@/components";
import type { PaymentStatus } from "@/types";

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

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-end">
      <label className="flex-1 text-sm font-medium">
        {t("searchLabel")}
        <span className="relative mt-1 block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full rounded border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
          />
        </span>
      </label>
      <label className="text-sm font-medium">
        {t("statusLabel")}
        <select
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
          className="mt-1 block w-full rounded border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="">{t("allStatuses")}</option>
          {statuses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm font-medium">
        {t("providerLabel")}
        <select
          value={provider}
          onChange={(event) => onProviderChange(event.target.value)}
          className="mt-1 block w-full rounded border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="">{t("allProviders")}</option>
          {providers.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
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
