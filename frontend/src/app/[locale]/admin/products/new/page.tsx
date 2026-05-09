"use client";

import { api } from "@/lib/axios";
import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ProductForm } from "@/components";
import type {
  Locale,
  ProductFormValues,
  ProductCategoryOption,
  CategoryApi,
  StoreOption,
} from "@/types";
import { buildProductLabels } from "@/lib/productLabels";

export default function AdminCreateProductPage() {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const t = useTranslations("admin.products");

  const [categories, setCategories] = useState<ProductCategoryOption[]>([]);
  const [stores, setStores] = useState<StoreOption[]>([]);
  const [loadingCats, setLoadingCats] = useState(false);
  const [loadingStores, setLoadingStores] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoadingCats(true);
        setLoadingStores(true);

        const [catRes, storeRes] = await Promise.all([
          api.get(`/categories?locale=${locale}`),
          api.get(`/stores`),
        ]);

        if (!mounted) return;

        const categoryData = (catRes.data ?? []) as CategoryApi[];
        setCategories(
          categoryData.map((c) => ({
            id: c.id,
            parentId: c.parentId ?? null,
            slug: c.slug,
            translations: (c.translations ?? []).map((t) => ({
              locale: t.locale as "en" | "ka",
              name: t.name,
            })),
            name: c.translations?.[0]?.name ?? c.slug,
          })),
        );

        const storeData = (storeRes.data ?? []) as StoreOption[];
        setStores(storeData);
      } catch {
        if (!mounted) return;
        setCategories([]);
        setStores([]);
      } finally {
        if (!mounted) return;
        setLoadingCats(false);
        setLoadingStores(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [locale]);

  const initialValues: ProductFormValues = useMemo(
    () => ({
      titleEn: "",
      descEn: "",
      titleKa: "",
      descKa: "",
      slug: "",
      price: "",
      oldPrice: "",
      discount: "",
      stock: "",
      categoryId: "",
      storeId: "",
      isFeatured: false,
      images: [""],
    }),
    [],
  );

  const handleSubmit = async (v: ProductFormValues, cleanImages: string[]) => {
    try {
      setSubmitting(true);
      setServerError("");

      const payload = {
        slug: v.slug.trim() || undefined,
        price: Number(v.price),
        stock: Number(v.stock),
        categoryId: Number(v.categoryId),
        storeId: v.storeId ? Number(v.storeId) : undefined,
        isFeatured: v.isFeatured,
        images: cleanImages,
        ...(v.oldPrice ? { oldPrice: Number(v.oldPrice) } : {}),
        ...(v.discount ? { discount: Number(v.discount) } : {}),
        translations: [
          {
            locale: "en",
            title: v.titleEn.trim(),
            description: v.descEn.trim(),
          },
          {
            locale: "ka",
            title: v.titleKa.trim(),
            description: v.descKa.trim(),
          },
        ],
      };

      await api.post("/products", payload);
      router.push(`/${locale}/admin/products`);
    } catch (err: any) {
      setServerError(err?.response?.data?.message || t("errors.saveCreate"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {serverError && (
        <div className="mt-6 px-6">
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {serverError}
          </div>
        </div>
      )}

      <ProductForm
        mode="create"
        title={t("form.createTitle")}
        description={t("form.createDescription")}
        categories={categories}
        stores={stores}
        loadingCategories={loadingCats}
        loadingStores={loadingStores}
        initialValues={initialValues}
        submitting={submitting}
        onCancel={() => router.push(`/${locale}/admin/products`)}
        onSubmit={handleSubmit}
        labels={buildProductLabels(t)}
      />
    </div>
  );
}
