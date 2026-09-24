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
  ProductLabelApi,
} from "@/types";

import { buildProductLabels } from "@/lib/productLabels";
import { getLabels, setProductLabels } from "@/lib/labelsApi";

export default function AdminCreateProductPage() {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const t = useTranslations("admin.products");

  const [categories, setCategories] = useState<ProductCategoryOption[]>([]);
  const [stores, setStores] = useState<StoreOption[]>([]);
  const [allLabels, setAllLabels] = useState<ProductLabelApi[]>([]);

  const [loadingCats, setLoadingCats] = useState(false);
  const [loadingStores, setLoadingStores] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoadingCats(true);
        setLoadingStores(true);

        const [catRes, storeRes, labelsData] = await Promise.all([
          api.get(`/categories?locale=${locale}`),
          api.get("/stores"),
          getLabels(),
        ]);

        if (!mounted) return;

        const categoryData = (catRes.data ?? []) as CategoryApi[];

        setCategories(
          categoryData.map((category) => ({
            id: category.id,
            parentId: category.parentId ?? null,
            slug: category.slug,
            translations: (category.translations ?? []).map((translation) => ({
              locale: translation.locale as "en" | "ka",
              name: translation.name,
            })),
            name: category.translations?.[0]?.name ?? category.slug,
          })),
        );

        const storeData = (storeRes.data ?? []) as StoreOption[];
        setStores(storeData);

        setAllLabels(labelsData);
      } catch {
        if (!mounted) return;
        setCategories([]);
        setStores([]);
        setAllLabels([]);
      } finally {
        if (!mounted) return;
        setLoadingCats(false);
        setLoadingStores(false);
      }
    };

    load();

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
      primaryImage: "",
      labelIds: [],
    }),
    [],
  );

  const handleSubmit = async (
    values: ProductFormValues,
    cleanImages: string[],
    primaryImage: string | null,
  ) => {
    try {
      setSubmitting(true);
      setServerError("");

      const payload = {
        slug: values.slug.trim() || undefined,
        price: Number(values.price),
        stock: Number(values.stock),
        categoryId: Number(values.categoryId),
        storeId: values.storeId ? Number(values.storeId) : undefined,
        isFeatured: values.isFeatured,
        images: cleanImages,
        primaryImage,

        ...(values.oldPrice ? { oldPrice: Number(values.oldPrice) } : {}),
        ...(values.discount ? { discount: Number(values.discount) } : {}),

        translations: [
          {
            locale: "en",
            title: values.titleEn.trim(),
            description: values.descEn.trim(),
          },
          {
            locale: "ka",
            title: values.titleKa.trim(),
            description: values.descKa.trim(),
          },
        ],
      };

      const response = await api.post("/products", payload);

      const product = response.data;

      if (!product?.id) {
        throw new Error("Created product ID was not returned");
      }

      if (values.labelIds.length > 0) {
        await setProductLabels(product.id, values.labelIds);
      }

      router.push(`/${locale}/admin/products`);
    } catch (error: any) {
      setServerError(
        error?.response?.data?.message ??
          error?.message ??
          t("errors.saveCreate"),
      );
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
        availableLabels={allLabels}
      />
    </div>
  );
}
