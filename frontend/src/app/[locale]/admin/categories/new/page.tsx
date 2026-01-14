"use client";

import { api } from "@/lib/axios";
import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { CategoryForm } from "@/components";
import {
  CategoryApi,
  CategoryFormValues,
  CategoryOption,
  Locale,
} from "@/types";

export default function AdminCreateCategoryPage() {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const t = useTranslations("admin.categories");

  const searchParams = useSearchParams();
  const parentIdParam = searchParams.get("parentId");

  const [cats, setCats] = useState<CategoryOption[]>([]);
  const [loadingCats, setLoadingCats] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoadingCats(true);

        const res = await api.get(`/categories?locale=${locale}`);
        if (!mounted) return;

        const data = (res.data ?? []) as CategoryApi[];
        const normalized: CategoryOption[] = data.map((c) => ({
          id: c.id,
          parentId: c.parentId ?? null,
          name: c.translations?.[0]?.name ?? c.slug,
        }));

        setCats(normalized);
      } catch {
        if (!mounted) return;
        setCats([]);
      } finally {
        if (!mounted) return;
        setLoadingCats(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [locale]);

  const initialValues: CategoryFormValues = useMemo(() => {
    const parsed = parentIdParam ? Number(parentIdParam) : NaN;
    return {
      nameEn: "",
      nameKa: "",
      slug: "",
      image: "",
      parentId: Number.isFinite(parsed) ? String(parsed) : "",
    };
  }, [parentIdParam]);

  const validate = (v: CategoryFormValues) => {
    const next: Record<string, string> = {};

    if (!v.nameEn.trim()) next.nameEn = t("validation.nameEnRequired");
    if (!v.nameKa.trim()) next.nameKa = t("validation.nameKaRequired");
    if (!v.slug.trim()) next.slug = t("validation.slugRequired");

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (v: CategoryFormValues) => {
    if (!validate(v)) return;

    try {
      setSubmitting(true);
      setErrors({});

      const payload = {
        slug: v.slug.trim() || undefined,
        image: v.image.trim() || undefined,
        parentId: v.parentId ? Number(v.parentId) : undefined,
        translations: [
          { locale: "en", name: v.nameEn.trim() },
          { locale: "ka", name: v.nameKa.trim() },
        ],
      };

      await api.post("/categories", payload);
      router.push(`/${locale}/admin/categories`);
    } catch (err: any) {
      const msg = err?.response?.data?.message || t("messages.createError");
      setErrors((p) => ({ ...p, form: msg }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CategoryForm
      mode="create"
      locale={locale}
      loadingParents={loadingCats}
      parentOptions={cats}
      initialValues={initialValues}
      submitting={submitting}
      onCancel={() => router.push(`/${locale}/admin/categories`)}
      onSubmit={handleSubmit}
      errors={errors}
      title={t("form.createTitle")}
      description={t("form.createDescription")}
      cancelLabel={t("actions.cancel")}
      submitLabel={t("actions.create")}
      submittingLabel={t("form.saving")}
      parentLabel={t("fields.parent")}
      noParentLabel={t("fields.noParent")}
      loadingLabel={t("table.loading")}
      nameCardTitle={t("fields.name")}
      nameEnLabel={t("fields.nameEn")}
      nameKaLabel={t("fields.nameKa")}
      slugLabel={t("fields.slug")}
      imageLabel={t("fields.image")}
      parentHint={t("tips.parentExample")}
    />
  );
}
