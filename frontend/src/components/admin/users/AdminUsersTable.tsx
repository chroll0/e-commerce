"use client";

import { FC } from "react";
import { Pencil, Trash2, Shield } from "lucide-react";
import type { UserApi } from "@/types";
import { Button } from "@/components";

type Props = {
  users: UserApi[];
  loading: boolean;
  t: (key: string) => string;
  onEdit: (u: UserApi) => void;
  onDelete: (u: UserApi) => void;
  currentUserId?: number | string | null;
  emptyMessage?: string;
};

const AdminUsersTable: FC<Props> = ({
  users,
  loading,
  t,
  onEdit,
  onDelete,
  currentUserId,
  emptyMessage,
}) => {
  if (loading) {
    return (
      <div className="text-sm text-muted-foreground py-6">
        {t("table.loading")}
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="text-sm text-muted-foreground py-6">
        {emptyMessage ?? t("table.empty")}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <div className="min-w-[760px]">
        <div className="grid grid-cols-12 gap-2 border-b border-border px-4 py-3 text-xs font-medium text-muted-foreground">
          <div className="col-span-4">{t("table.email")}</div>
          <div className="col-span-3">{t("table.name")}</div>
          <div className="col-span-2">{t("table.role")}</div>
          <div className="col-span-3 text-right">{t("table.actions")}</div>
        </div>

        {users.map((u) => {
          const isAdmin = u.role === "ADMIN";
          const isMe = currentUserId != null && u.id === Number(currentUserId);
          const showBadge = isAdmin && isMe;

          return (
            <div
              key={u.id}
              className="grid grid-cols-12 items-center gap-2 border-b border-border px-4 py-3 last:border-b-0"
            >
              <div className="col-span-4 min-w-0">
                <div className="flex min-w-0 items-center gap-2">
                  <div className="truncate text-sm font-medium">{u.email}</div>

                  {showBadge && (
                    <span
                      className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-muted/40"
                      title={t("table.youAdmin")}
                      aria-label={t("table.youAdmin")}
                    >
                      <Shield className="h-3.5 w-3.5" />
                    </span>
                  )}
                </div>

                {u.phone ? (
                  <div className="truncate text-xs text-muted-foreground">
                    {u.phone}
                  </div>
                ) : null}
              </div>

              <div className="col-span-3 truncate text-sm text-muted-foreground">
                {u.name ?? "—"}
              </div>

              <div className="col-span-2 text-sm">
                {isAdmin ? t("roles.admin") : t("roles.user")}
              </div>

              <div className="col-span-3 flex justify-end gap-2">
                <Button
                  size="xs"
                  variant="secondary"
                  onClick={() => onEdit(u)}
                  title={t("actions.edit")}
                >
                  <Pencil className="h-4 w-4" />
                </Button>

                <Button
                  size="xs"
                  variant="tertiary"
                  className="text-destructive"
                  onClick={() => onDelete(u)}
                  title={t("actions.delete")}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminUsersTable;
