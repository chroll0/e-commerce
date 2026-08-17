"use client";

import { Search } from "lucide-react";
import { Input, SelectField } from "@/components";
import type { SelectOption, UserRole } from "@/types";

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
  const roleOptions: SelectOption[] = roles.map((item) => ({
    value: item,
    label: t(`roles.${item.toLowerCase()}`),
  }));

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-end">
      <div className="flex-1">
        <Input
          label={t("filters.searchLabel")}
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          leftIcon={<Search className="h-4 w-4" />}
        />
      </div>
      <div className="sm:w-56">
        <SelectField
          label={t("filters.roleLabel")}
          value={role}
          onChange={onRoleChange}
          options={roleOptions}
          placeholderLabel={t("filters.allRoles")}
        />
      </div>
    </div>
  );
};

export default AdminUsersFilters;
