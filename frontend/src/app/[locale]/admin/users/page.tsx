"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { api } from "@/lib/axios";
import { Button } from "@/components";
import { Trash2 } from "lucide-react";

type UserRole = "USER" | "ADMIN";

type UserApi = {
  id: number;
  name: string | null;
  email: string;
  phone: string | null;
  role: UserRole;
  createdAt?: string;
};

export default function AdminUsersPage() {
  const locale = useLocale();
  const t = useTranslations("admin.users");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserApi[]>([]);
  const [error, setError] = useState<string>("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = async () => {
    try {
      setError("");
      setLoading(true);

      // NOTE: დარწმუნდი რომ ეს endpoint აბრუნებს user list-ს (admin only)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDelete = async (u: UserApi) => {
    const ok = confirm(
      `Delete user "${u.email}"? This action cannot be undone.`,
    );
    if (!ok) return;

    try {
      setDeletingId(u.id);
      setError("");

      await api.delete(`/users/${u.id}`);

      // optimistic remove
      setUsers((prev) => prev.filter((x) => x.id !== u.id));
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to delete user";
      setError(msg);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{t?.("title") ?? "Users"}</h1>
          <p className="text-sm text-muted-foreground">
            {t?.("description") ?? "Manage users of your store."}
          </p>
        </div>

        <Button variant="secondary" onClick={load} disabled={loading}>
          {t?.("table.refresh") ?? "Refresh"}
        </Button>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-sm text-muted-foreground py-6">
          {t?.("table.loading") ?? "Loading..."}
        </div>
      ) : users.length === 0 ? (
        <div className="text-sm text-muted-foreground py-6">
          {t?.("table.empty") ?? "No users found."}
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="grid grid-cols-12 px-4 py-3 text-xs font-medium text-muted-foreground border-b">
            <div className="col-span-4">{t?.("table.email") ?? "Email"}</div>
            <div className="col-span-3">{t?.("table.name") ?? "Name"}</div>
            <div className="col-span-2">{t?.("table.role") ?? "Role"}</div>
            <div className="col-span-3 text-right">
              {t?.("table.actions") ?? "Actions"}
            </div>
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

              <div className="col-span-2 text-sm">{u.role}</div>

              <div className="col-span-3 flex justify-end">
                <Button
                  size="xs"
                  variant="tertiary"
                  className="text-destructive"
                  onClick={() => onDelete(u)}
                  disabled={deletingId === u.id}
                  title={t?.("actions.delete") ?? "Delete"}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
