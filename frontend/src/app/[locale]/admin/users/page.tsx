"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { api } from "@/lib/axios";
import type { UserApi } from "@/types";
import {
  AdminPageHeader,
  Button,
  ConfirmModal,
  UserEditModal,
  AdminUsersTable,
} from "@/components";
import { RefreshCw } from "lucide-react";
import { useAuthStore } from "@/state/useAuthStore";

export default function AdminUsersPage() {
  const t = useTranslations("admin.users");
  const { user } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserApi[]>([]);
  const [error, setError] = useState<string>("");

  // delete
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<UserApi | null>(null);
  const [deleting, setDeleting] = useState(false);

  // edit
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<UserApi | null>(null);
  const [saving, setSaving] = useState(false);

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
      setTimeout(() => {
        setLoading(false);
      }, 700);
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

  const openEdit = (u: UserApi) => {
    setEditing(u);
    setEditOpen(true);
  };

  const closeEdit = () => {
    if (saving) return;
    setEditOpen(false);
    setEditing(null);
  };

  const saveEdit = async (next: {
    name?: string;
    phone?: string;
    role?: string;
  }) => {
    if (!editing) return;

    try {
      setSaving(true);
      setError("");

      const res = await api.patch<UserApi>(`/users/${editing.id}`, next);
      const updated = res.data;

      setUsers((prev) =>
        prev.map((u) => (u.id === editing.id ? { ...u, ...updated } : u)),
      );

      setEditOpen(false);
      setEditing(null);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to update user";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <AdminPageHeader
        title={t("title")}
        description={t("description")}
        actions={
          <Button
            variant="secondary"
            size="sm"
            iconOnly
            onClick={load}
            disabled={loading}
            title={t("table.refresh")}
            aria-label={t("table.refresh")}
          >
            <RefreshCw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              style={loading ? { animationDuration: "1.4s" } : undefined}
            />
          </Button>
        }
      />

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <AdminUsersTable
        users={users}
        loading={loading}
        t={t}
        onEdit={openEdit}
        onDelete={openDelete}
        currentUserId={user?.id}
      />

      <UserEditModal
        isOpen={editOpen}
        user={editing}
        saving={saving}
        onClose={closeEdit}
        onSave={saveEdit}
      />

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
