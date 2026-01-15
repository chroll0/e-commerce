"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import type { Locale, SelectOption, ProductFormValues } from "@/types";
import { ProductForm } from "@/components";

type CategoryApi = {
  id: number;
  slug: string;
  translations: { locale: string; name: string }[];
};

export default function AdminCreateProductPage() {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const t = useTranslations("admin.products");

  const [categories, setCategories] = useState<SelectOption[]>([]);
  const [loadingCats, setLoadingCats] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // load categories
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoadingCats(true);

        const res = await api.get(`/categories?locale=${locale}`);
        if (!mounted) return;

        const data = (res.data ?? []) as CategoryApi[];
        const opts: SelectOption[] = data.map((c) => ({
          id: c.id,
          name: c.translations?.[0]?.name ?? c.slug,
        }));

        setCategories(opts);
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
      stock: "0",
      categoryId: "",
      isFeatured: false,
      images: [""],
    }),
    []
  );

  const validate = (v: ProductFormValues, cleanImages: string[]) => {
    const next: Record<string, string> = {};

    if (!v.titleEn.trim()) next.titleEn = t("errors.titleEn");
    if (!v.descEn.trim()) next.descEn = t("errors.descEn");
    if (!v.titleKa.trim()) next.titleKa = t("errors.titleKa");
    if (!v.descKa.trim()) next.descKa = t("errors.descKa");
    if (!v.slug.trim()) next.slug = t("errors.slug");

    const p = Number(v.price);
    if (!v.price || Number.isNaN(p) || p <= 0) next.price = t("errors.price");

    const s = Number(v.stock);
    if (v.stock === "" || Number.isNaN(s) || s < 0)
      next.stock = t("errors.stock");

    if (!v.categoryId) next.categoryId = t("errors.category");

    if (cleanImages.length < 1) next.images = t("errors.images");

    if (v.oldPrice) {
      const op = Number(v.oldPrice);
      if (Number.isNaN(op) || op <= 0) next.oldPrice = t("errors.oldPrice");
    }

    if (v.discount) {
      const d = Number(v.discount);
      if (Number.isNaN(d) || d < 0 || d > 100)
        next.discount = t("errors.discount");
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (v: ProductFormValues, cleanImages: string[]) => {
    if (!validate(v, cleanImages)) return;

    try {
      setSubmitting(true);
      setErrors({});

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
      const msg = err?.response?.data?.message || t("errors.saveCreate");
      setErrors((p) => ({ ...p, form: msg }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProductForm
      mode="create"
      title={t("form.createTitle")}
      description={t("form.createDescription")}
      categories={categories}
      loadingCategories={loadingCats}
      initialValues={initialValues}
      submitting={submitting}
      errors={errors}
      onCancel={() => router.push(`/${locale}/admin/products`)}
      onSubmit={handleSubmit}
      labels={{
        contentTitle: t("form.contentTitle"),
        titleEn: t("form.fields.titleEn"),
        descEn: t("form.fields.descEn"),
        titleKa: t("form.fields.titleKa"),
        descKa: t("form.fields.descKa"),
        slug: t("form.fields.slug"),
        price: t("form.fields.price"),
        oldPrice: t("form.fields.oldPrice"),
        discount: t("form.fields.discount"),
        stock: t("form.fields.stock"),
        category: t("form.fields.category"),
        selectCategory: t("form.fields.selectCategory"),
        featured: t("form.fields.featured"),
        featuredHint: t("form.fields.featuredHint"),
        imagesTitle: t("form.fields.imagesTitle"),
        addImage: t("form.fields.addImage"),
        imageUrl: t("form.fields.imageUrl"),
        remove: t("form.fields.remove"),
        cancel: t("actions.cancel"),
        submit: t("form.buttons.submitCreate"),
        submitting: t("form.buttons.submitting"),
      }}
    />
  );
}
