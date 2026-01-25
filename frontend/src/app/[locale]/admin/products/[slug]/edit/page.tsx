"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import type {
  Locale,
  SelectOption,
  ProductApi,
  ProductFormValues,
} from "@/types";
import { ProductForm } from "@/components";
import { buildProductLabels } from "@/lib/productLabels";

type CategoryApi = {
  id: number;
  slug: string;
  translations: { locale: string; name: string }[];
};

export default function AdminEditProductPage() {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const { slug } = useParams<{ slug: string }>();
  const t = useTranslations("admin.products");

  const [id, setId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [categories, setCategories] = useState<SelectOption[]>([]);
  const [loadingCats, setLoadingCats] = useState(false);

  const [initialValues, setInitialValues] = useState<ProductFormValues>({
    titleEn: "",
    descEn: "",
    titleKa: "",
    descKa: "",
    slug: "",
    price: "",
    oldPrice: "",
    discount: "",
    stock: "0",
    categoryId: "",
    isFeatured: false,
    images: [""],
  });

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      // 1) product by slug
      const productRes = await api.get(`/products/slug/${slug}`);
      const product = productRes.data as ProductApi;

      setId(product.id);

      const en = product.translations.find((x) => x.locale === "en");
      const ka = product.translations.find((x) => x.locale === "ka");

      setInitialValues({
        titleEn: en?.title ?? "",
        descEn: en?.description ?? "",
        titleKa: ka?.title ?? "",
        descKa: ka?.description ?? "",

        slug: product.slug ?? "",
        price: String(product.price ?? ""),
        oldPrice: product.oldPrice != null ? String(product.oldPrice) : "",
        discount: product.discount != null ? String(product.discount) : "",

        stock: String(product.stock ?? "0"),
        categoryId: String(product.categoryId ?? ""),
        isFeatured: !!product.isFeatured,

        images: product.images?.length ? product.images : [""],
      });

      // 2) categories for dropdown
      setLoadingCats(true);

      const catRes = await api.get(`/categories?locale=${locale}`);
      const data = (catRes.data ?? []) as CategoryApi[];

      setCategories(
        data.map((c) => ({
          id: c.id,
          name: c.translations?.[0]?.name ?? c.slug,
        })),
      );
    } catch (e: any) {
      setError(e?.response?.data?.message || t("errors.loadEdit"));
    } finally {
      setLoadingCats(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!slug) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, locale]);

  const handleSubmit = async (v: ProductFormValues, cleanImages: string[]) => {
    if (!id) return;

    try {
      setSaving(true);
      setError("");

      const payload = {
        slug: v.slug.trim(),
        price: Number(v.price),
        stock: Number(v.stock),
        categoryId: Number(v.categoryId),
        isFeatured: v.isFeatured,
        images: cleanImages,
        oldPrice: v.oldPrice ? Number(v.oldPrice) : null,
        discount: v.discount ? Number(v.discount) : null,
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

      await api.patch(`/products/${id}`, payload);
      router.push(`/${locale}/admin/products`);
    } catch (e: any) {
      setError(e?.response?.data?.message || t("errors.saveEdit"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-sm text-muted-foreground">
        {t("table.loading")}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {error && (
        <div className="max-w-3xl mx-auto mt-6 px-6">
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        </div>
      )}

      <ProductForm
        mode="edit"
        title={t("form.editTitle")}
        description={t("form.editDescription")}
        categories={categories}
        loadingCategories={loadingCats}
        initialValues={initialValues}
        submitting={saving}
        onCancel={() => router.push(`/${locale}/admin/products`)}
        onSubmit={handleSubmit}
        labels={buildProductLabels(t)}
      />
    </div>
  );
}
