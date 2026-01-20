"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { api } from "@/lib/axios";
import { Trash2 } from "lucide-react";
import { UserApi } from "@/types";
import { AdminPageHeader, Button, ConfirmModal } from "@/components";

export default function AdminUsersPage() {
  const t = useTranslations("admin.users");

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserApi[]>([]);
  const [error, setError] = useState<string>("");

  // modal state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<UserApi | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    try {
      setError("");
      setLoading(true);

      const res = await api.get<UserApi[]>("/users");
      setUsers(res.data ?? []);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to load users";
      setError(msg);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openDelete = (u: UserApi) => {
    setSelected(u);
    setDeleteOpen(true);
  };

  const closeDelete = () => {
    if (deleting) return;
    setDeleteOpen(false);
    setSelected(null);
  };

  const confirmDelete = async () => {
    if (!selected) return;

    try {
      setDeleting(true);
      setError("");

      await api.delete(`/users/${selected.id}`);

      setUsers((prev) => prev.filter((x) => x.id !== selected.id));
      setDeleteOpen(false);
      setSelected(null);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to delete user";
      setError(msg);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <AdminPageHeader
        title={t("title")}
        description={t("description")}
        actions={
          <Button variant="secondary" onClick={load} disabled={loading}>
            {t("table.refresh")}
          </Button>
        }
      />

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-sm text-muted-foreground py-6">
          {t("table.loading")}
        </div>
      ) : users.length === 0 ? (
        <div className="text-sm text-muted-foreground py-6">
          {t("table.empty")}
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="grid grid-cols-12 px-4 py-3 text-xs font-medium text-muted-foreground border-b">
            <div className="col-span-4">{t("table.email")}</div>
            <div className="col-span-3">{t("table.name")}</div>
            <div className="col-span-2">{t("table.role")}</div>
            <div className="col-span-3 text-right">{t("table.actions")}</div>
          </div>

          {users.map((u) => (
            <div
              key={u.id}
              className="grid grid-cols-12 px-4 py-3 border-b last:border-b-0 items-center"
            >
              <div className="col-span-4 min-w-0">
                <div className="text-sm font-medium truncate">{u.email}</div>
                {u.phone ? (
                  <div className="text-xs text-muted-foreground truncate">
                    {u.phone}
                  </div>
                ) : null}
              </div>

              <div className="col-span-3 text-sm text-muted-foreground truncate">
                {u.name ?? "—"}
              </div>

              <div className="col-span-2 text-sm">
                {u.role === "ADMIN" ? t("roles.admin") : t("roles.user")}
              </div>

              <div className="col-span-3 flex justify-end">
                <Button
                  size="xs"
                  variant="tertiary"
                  className="text-destructive"
                  onClick={() => openDelete(u)}
                  title={t("actions.delete")}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={deleteOpen}
        onClose={closeDelete}
        title={t("confirm.title")}
        description={
          <div className="space-y-2">
            {selected && (
              <div className="font-semibold text-destructive">
                {selected.email}
              </div>
            )}
            <div className="text-sm text-muted-foreground">
              {t("confirm.description")}
            </div>
          </div>
        }
        confirmLabel={t("actions.delete")}
        cancelLabel={t("actions.cancel")}
        loading={deleting}
        onConfirm={confirmDelete}
      />
    </>
  );
}
