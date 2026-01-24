"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { api } from "@/lib/axios";
import {
  AdminPageHeader,
  buildTree,
  CategoriesTable,
  ConfirmModal,
  flattenTree,
} from "@/components";
import { CategoryApi, Locale } from "@/types";
import { AlertTriangle } from "lucide-react";

export default function AdminCategoriesPage() {
  const locale = useLocale() as Locale;
  const t = useTranslations("admin.categories");

  const [items, setItems] = useState<CategoryApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string>("");
  const [target, setTarget] = useState<{ id: number; name: string } | null>(
    null,
  );
  const allExpanded = items.length > 0 && expanded.size >= items.length;

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
      await api.delete(`/categories/${target.id}`);
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
        addHref={`/${locale}/admin/categories/new`}
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
        onExpandAll={expandAll}
        onCollapseAll={collapseAll}
        isExpandedAll={allExpanded}
        labels={{
          name: t("table.name"),
          slug: t("table.slug"),
          actions: t("table.actions"),
          products: t("table.products"),
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

      <ConfirmModal
        isOpen={deleteOpen}
        loading={deleteLoading}
        onClose={closeDelete}
        onConfirm={confirmDelete}
        title={t("modal.deleteTitle")}
        description={
          <div className="space-y-3">
            <div>
              {t("modal.deleteDescription", { name: target?.name || "" })}
            </div>

            {deleteError ? (
              <div className="flex items-center gap-2 text-red-500 text-xs">
                <AlertTriangle className="h-4.5 w-4.5" />
                <p>{deleteError}</p>
              </div>
            ) : null}
          </div>
        }
        cancelLabel={t("actions.cancel")}
        confirmLabel={
          deleteLoading ? t("modal.deleting") : t("actions.confirmDelete")
        }
      />
    </>
  );
}
