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
} from "@/types";
import { buildProductLabels } from "@/lib/productLabels";

export default function AdminCreateProductPage() {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const t = useTranslations("admin.products");

  const [categories, setCategories] = useState<ProductCategoryOption[]>([]);
  const [loadingCats, setLoadingCats] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoadingCats(true);
        const res = await api.get(`/categories?locale=${locale}`);
        if (!mounted) return;

        const data = (res.data ?? []) as CategoryApi[];
        setCategories(
          data.map((c) => ({
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
      } catch {
        if (!mounted) return;
        setCategories([]);
      } finally {
        if (!mounted) return;
        setLoadingCats(false);
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
        loadingCategories={loadingCats}
        initialValues={initialValues}
        submitting={submitting}
        onCancel={() => router.push(`/${locale}/admin/products`)}
        onSubmit={handleSubmit}
        labels={buildProductLabels(t)}
      />
    </div>
  );
}
