"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { api } from "@/lib/axios";
import type { ProductApi } from "@/types";
import {
  ProductsFilters,
  ProductsTable,
  DeleteProductModal,
  AdminPageHeader,
} from "@/components";

const AdminProductsPage = () => {
  const t = useTranslations("admin.products");
  const locale = useLocale();

  const [products, setProducts] = useState<ProductApi[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<ProductApi | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products", {
        params: { search, categoryId },
      });
      setProducts(res.data ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [search, categoryId]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={t("title")}
        description={t("description")}
        addHref={`/${locale}/admin/products/new`}
        addLabel={t("actions.add")}
      />

      <ProductsFilters
        search={search}
        onSearchChange={setSearch}
        categoryId={categoryId}
        onCategoryChange={setCategoryId}
      />

      <ProductsTable
        loading={loading}
        products={products}
        onDelete={setDeleteTarget}
      />

      <DeleteProductModal
        isOpen={!!deleteTarget}
        loading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) return;
          setDeleting(true);
          await api.delete(`/products/${deleteTarget.id}`);
          setDeleting(false);
          setDeleteTarget(null);
          load();
        }}
        title={t("modal.deleteTitle")}
        description={t("modal.deleteDescription", {
          name:
            deleteTarget?.translations[0]?.title ?? deleteTarget?.slug ?? "",
        })}
        cancelLabel={t("actions.cancel")}
        confirmLabel={t("actions.delete")}
      />
    </div>
  );
};

export default AdminProductsPage;
