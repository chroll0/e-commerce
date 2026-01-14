"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import {
  CategoryForm,
  type CategoryFormValues,
  type CategoryOption,
  DeleteCategoryModal,
} from "@/components";

type Locale = "en" | "ka";

type CategoryApi = {
  id: number;
  slug: string;
  image: string | null;
  parentId: number | null;
  translations: { locale: string; name: string }[];
};

export default function AdminEditCategoryPage() {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const t = useTranslations("admin.categories");

  const params = useParams<{ slug: string }>();
  const slugParam = params.slug;

  const [id, setId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");

  const [cats, setCats] = useState<CategoryOption[]>([]);
  const [loadingCats, setLoadingCats] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [initialValues, setInitialValues] = useState<CategoryFormValues>({
    nameEn: "",
    nameKa: "",
    slug: "",
    image: "",
    parentId: "",
  });

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      setFieldErrors({});

      const catRes = await api.get(`/categories/slug/${slugParam}`);
      const cat = catRes.data as CategoryApi;

      setId(cat.id);

      const en = cat.translations.find((x) => x.locale === "en")?.name ?? "";
      const ka = cat.translations.find((x) => x.locale === "ka")?.name ?? "";

      setInitialValues({
        nameEn: en,
        nameKa: ka,
        slug: cat.slug ?? "",
        image: cat.image ?? "",
        parentId: cat.parentId ? String(cat.parentId) : "",
      });

      setLoadingCats(true);
      const listRes = await api.get(`/categories?locale=${locale}`);
      const list = (listRes.data ?? []) as CategoryApi[];

      const normalized: CategoryOption[] = list.map((c) => ({
        id: c.id,
        parentId: c.parentId ?? null,
        name: c.translations?.[0]?.name ?? c.slug,
      }));

      setCats(normalized);
    } catch (e: any) {
      setError(e?.response?.data?.message || t("messages.loadOneError"));
    } finally {
      setLoadingCats(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!slugParam) return;
    load();
  }, [slugParam, locale]);

  const validate = (v: CategoryFormValues) => {
    const next: Record<string, string> = {};

    if (!v.nameEn.trim()) next.nameEn = t("validation.nameEnRequired");
    if (!v.nameKa.trim()) next.nameKa = t("validation.nameKaRequired");
    if (!v.slug.trim()) next.slug = t("validation.slugRequired");
    if (id && v.parentId && Number(v.parentId) === id) {
      next.parentId = t("validation.invalidParent");
    }

    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (v: CategoryFormValues) => {
    if (!id) return;
    if (!validate(v)) return;

    try {
      setSaving(true);
      setError("");

      const payload = {
        slug: v.slug.trim(),
        image: v.image.trim() || null,
        parentId: v.parentId ? Number(v.parentId) : null,
        translations: [
          { locale: "en", name: v.nameEn.trim() },
          { locale: "ka", name: v.nameKa.trim() },
        ],
      };

      await api.patch(`/categories/${id}`, payload);
      router.push(`/${locale}/admin/categories`);
    } catch (e: any) {
      setError(e?.response?.data?.message || t("messages.updateError"));
    } finally {
      setSaving(false);
    }
  };

  const openDelete = () => setDeleteOpen(true);
  const closeDelete = () => {
    if (deleting) return;
    setDeleteOpen(false);
  };

  const confirmDelete = async () => {
    if (!id) return;

    try {
      setDeleting(true);
      await api.delete(`/categories/${id}`);
      router.push(`/${locale}/admin/categories`);
    } catch (e: any) {
      setError(e?.response?.data?.message || t("messages.deleteError"));
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-sm text-muted-foreground">
        {t("table.loading")}
      </div>
    );
  }

  const displayName = initialValues.nameEn || initialValues.slug || "";

  return (
    <>
      {error && (
        <div className="max-w-3xl mx-auto mt-6 px-6">
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        </div>
      )}

      <CategoryForm
        mode="edit"
        locale={locale}
        loadingParents={loadingCats}
        parentOptions={cats}
        excludeParentId={id}
        initialValues={initialValues}
        submitting={saving}
        onCancel={() => router.push(`/${locale}/admin/categories`)}
        onSubmit={handleSubmit}
        errors={fieldErrors}
        title={t("form.editTitle")}
        description={t("form.editDescription")}
        cancelLabel={t("actions.back")}
        submitLabel={t("actions.save")}
        submittingLabel={t("form.saving")}
        parentLabel={t("fields.parent")}
        noParentLabel={t("fields.noParent")}
        loadingLabel={t("table.loading")}
        nameCardTitle={t("fields.name")}
        nameEnLabel={t("fields.nameEn")}
        nameKaLabel={t("fields.nameKa")}
        slugLabel={t("fields.slug")}
        imageLabel={t("fields.image")}
        parentHint={t("tips.parentChange")}
      />

      <div className="max-w-3xl mx-auto px-6 pb-6 flex justify-end">
        <button
          type="button"
          onClick={openDelete}
          className="text-sm text-destructive hover:opacity-80"
          disabled={deleting}
        >
          {deleting ? t("modal.deleting") : t("actions.delete")}
        </button>
      </div>

      <DeleteCategoryModal
        isOpen={deleteOpen}
        loading={deleting}
        onClose={closeDelete}
        onConfirm={confirmDelete}
        title={t("modal.deleteTitle")}
        description={t("modal.deleteDescription", { name: displayName })}
        cancelLabel={t("actions.cancel")}
        confirmLabel={
          deleting ? t("modal.deleting") : t("actions.confirmDelete")
        }
      />
    </>
  );
}
