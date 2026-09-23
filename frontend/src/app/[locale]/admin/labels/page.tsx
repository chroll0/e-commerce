"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  AdminPageHeader,
  ConfirmModal,
  LabelsFilters,
  LabelsTable,
} from "@/components";
import { deleteLabel, getLabels } from "@/lib/labelsApi";
import type { Locale, ProductLabelApi } from "@/types";

export default function AdminLabelsPage() {
  const locale = useLocale() as Locale;
  const t = useTranslations("admin.labels");

  const [labels, setLabels] = useState<ProductLabelApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [target, setTarget] = useState<{ id: number; name: string } | null>(
    null,
  );

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getLabels();
      setLabels(data);
    } catch (e: any) {
      setError(e?.response?.data?.message || t("messages.loadError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filteredLabels = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return labels;

    return labels.filter(
      (label) =>
        label.nameEn.toLowerCase().includes(q) ||
        label.nameKa.toLowerCase().includes(q) ||
        label.slug.toLowerCase().includes(q),
    );
  }, [labels, search]);

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
      await deleteLabel(target.id);
      closeDelete();
      await load();
    } catch (e: any) {
      setDeleteError(e?.response?.data?.message || t("messages.deleteError"));
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <AdminPageHeader
        title={t("title")}
        description={t("description")}
        addHref={`/${locale}/admin/labels/new`}
        addLabel={t("actions.add")}
      />

      {error && (
        <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <LabelsFilters
        search={search}
        onSearchChange={setSearch}
        searchLabel={t("filters.searchLabel")}
      />

      <LabelsTable
        locale={locale}
        loading={loading}
        labels={filteredLabels}
        onRequestDelete={onRequestDelete}
        labelsText={{
          name: t("table.name"),
          slug: t("table.slug"),
          actions: t("table.actions"),
          products: t("table.products"),
          loading: t("table.loading"),
          empty: t("table.empty"),
          delete: t("actions.delete"),
        }}
      />

      <ConfirmModal
        isOpen={deleteOpen}
        loading={deleteLoading}
        title={t("modal.deleteTitle")}
        description={
          deleteError ||
          t("modal.deleteDescription", { name: target?.name ?? "" })
        }
        cancelLabel={t("actions.cancel")}
        confirmLabel={t("actions.delete")}
        onClose={closeDelete}
        onConfirm={confirmDelete}
      />
    </>
  );
}
