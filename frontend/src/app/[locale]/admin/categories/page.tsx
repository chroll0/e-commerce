"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { api } from "@/lib/axios";
import {
  buildTree,
  CategoriesHeader,
  CategoriesTable,
  type CategoryApi,
  DeleteCategoryModal,
  flattenTree,
} from "@/components";

type Locale = "en" | "ka";

export default function AdminCategoriesPage() {
  const locale = useLocale() as Locale;
  const t = useTranslations("admin.categories");

  const [items, setItems] = useState<CategoryApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [target, setTarget] = useState<{ id: number; name: string } | null>(
    null
  );

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get(`/categories?locale=${locale}`);
      setItems(res.data ?? []);
    } catch (e: any) {
      setError(e?.response?.data?.message || t("messages.loadError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [locale]);

  const tree = useMemo(() => buildTree(items), [items]);
  const rows = useMemo(() => flattenTree(tree, expanded), [tree, expanded]);

  const toggle = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const expandAll = () => setExpanded(new Set(items.map((x) => x.id)));
  const collapseAll = () => setExpanded(new Set());

  const onRequestDelete = (payload: { id: number; name: string }) => {
    setTarget(payload);
    setDeleteOpen(true);
  };

  const closeDelete = () => {
    if (deleteLoading) return;
    setDeleteOpen(false);
    setTarget(null);
  };

  const confirmDelete = async () => {
    if (!target) return;

    try {
      setDeleteLoading(true);
      await api.delete(`/categories/${target.id}`);
      closeDelete();
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.message || t("messages.deleteError"));
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <CategoriesHeader
        locale={locale}
        onExpandAll={expandAll}
        onCollapseAll={collapseAll}
        title={t("title")}
        description={t("description")}
        expandAllLabel={t("actions.expandAll")}
        collapseAllLabel={t("actions.collapseAll")}
        addLabel={t("actions.add")}
      />

      {error && (
        <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <CategoriesTable
        locale={locale}
        loading={loading}
        rows={rows}
        expanded={expanded}
        onToggle={toggle}
        onRequestDelete={onRequestDelete}
        labels={{
          name: t("table.name"),
          slug: t("table.slug"),
          actions: t("table.actions"),
          empty: t("table.empty"),
          loading: t("table.loading"),
          addSub: t("actions.addSub"),
          edit: t("actions.edit"),
          delete: t("actions.delete"),
        }}
      />

      <div className="mt-3 pl-2 text-xs text-muted-foreground">
        {t("tips.hierarchy")}
      </div>

      <DeleteCategoryModal
        isOpen={deleteOpen}
        loading={deleteLoading}
        categoryName={target?.name}
        onClose={closeDelete}
        onConfirm={confirmDelete}
        title={t("modal.deleteTitle")}
        description={t("modal.deleteDescription", { name: target?.name || "" })}
        cancelLabel={t("actions.cancel")}
        confirmLabel={
          deleteLoading ? t("modal.deleting") : t("actions.confirmDelete")
        }
      />
    </div>
  );
}
