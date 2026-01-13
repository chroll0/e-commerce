"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { api } from "@/lib/axios";
import {
  buildTree,
  CategoriesHeader,
  CategoriesTable,
  CategoryApi,
  DeleteCategoryModal,
  flattenTree,
} from "@/components";

type Locale = "en" | "ka";

export default function AdminCategoriesPage() {
  const locale = useLocale() as Locale;

  const [items, setItems] = useState<CategoryApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  // modal state
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
      setError(
        e?.response?.data?.message || "Failed to load categories. Try again."
      );
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
      alert(e?.response?.data?.message || "Delete failed");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <CategoriesHeader
        locale={locale}
        onExpandAll={expandAll}
        onCollapseAll={collapseAll}
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
      />

      <div className="mt-3 text-xs text-muted-foreground">
        Tip: Create a parent category first (e.g. Electronics), then add
        subcategories under it.
      </div>

      <DeleteCategoryModal
        isOpen={deleteOpen}
        loading={deleteLoading}
        categoryName={target?.name}
        onClose={closeDelete}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
