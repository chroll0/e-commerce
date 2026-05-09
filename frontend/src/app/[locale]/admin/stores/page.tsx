"use client";

import { api } from "@/lib/axios";
import { StoreApi, Locale } from "@/types";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AdminPageHeader, ConfirmModal, StoresTable } from "@/components";

export default function AdminStoresPage() {
  const locale = useLocale() as Locale;
  const t = useTranslations("admin.stores");

  const [stores, setStores] = useState<StoreApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string>("");
  const [target, setTarget] = useState<{ id: number; name: string } | null>(
    null,
  );

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/stores");
      setStores(res.data ?? []);
    } catch (e: any) {
      setError(e?.response?.data?.message || t("messages.loadError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onRequestDelete = (payload: { id: number; name: string }) => {
    setTarget(payload);
    setDeleteError("");
    setDeleteOpen(true);
  };

  const closeDelete = () => {
    if (deleteLoading) return;
    setDeleteOpen(false);
    setTarget(null);
    setDeleteError("");
  };

  const confirmDelete = async () => {
    if (!target) return;

    try {
      setDeleteLoading(true);
      setDeleteError("");
      await api.delete(`/stores/${target.id}`);
      closeDelete();
      await load();
    } catch (e: any) {
      const code = e?.response?.data?.code;
      setDeleteError(
        code ? t(`messages.errors.${code}`) : t("messages.deleteError"),
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <AdminPageHeader
        title={t("title")}
        description={t("description")}
        addHref={`/${locale}/admin/stores/new`}
        addLabel={t("actions.add")}
      />

      {error && (
        <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <StoresTable
        locale={locale}
        loading={loading}
        stores={stores}
        onRequestDelete={onRequestDelete}
        labels={{
          name: t("table.name"),
          slug: t("table.slug"),
          products: t("table.products"),
          actions: t("table.actions"),
          loading: t("table.loading"),
          empty: t("table.empty"),
          edit: t("actions.edit"),
          delete: t("actions.delete"),
        }}
      />

      <ConfirmModal
        isOpen={deleteOpen}
        loading={deleteLoading}
        onClose={closeDelete}
        onConfirm={confirmDelete}
        title={t("modal.deleteTitle")}
        description={
          <>
            {t("modal.deleteDescription", { name: target?.name || "" })}
            {deleteError && (
              <div className="mt-2 text-sm text-destructive">{deleteError}</div>
            )}
          </>
        }
        confirmLabel={t("modal.confirmDelete")}
        cancelLabel={t("actions.cancel")}
      />
    </>
  );
}
