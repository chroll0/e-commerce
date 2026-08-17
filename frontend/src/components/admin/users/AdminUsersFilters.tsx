"use client";

import { Search } from "lucide-react";
import type { UserRole } from "@/types";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  role: string;
  onRoleChange: (value: string) => void;
  roles: UserRole[];
  t: (key: string) => string;
};

const AdminUsersFilters = ({
  search,
  onSearchChange,
  role,
  onRoleChange,
  roles,
  t,
}: Props) => {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-end">
      <label className="flex-1 text-sm font-medium">
        {t("filters.searchLabel")}
        <span className="relative mt-1 block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={t("filters.searchPlaceholder")}
            className="w-full rounded border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
          />
        </span>
      </label>
      <label className="text-sm font-medium">
        {t("filters.roleLabel")}
        <select
          value={role}
          onChange={(event) => onRoleChange(event.target.value)}
          className="mt-1 block w-full rounded border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="">{t("filters.allRoles")}</option>
          {roles.map((item) => (
            <option key={item} value={item}>
              {t(`roles.${item.toLowerCase()}`)}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default AdminUsersFilters;
