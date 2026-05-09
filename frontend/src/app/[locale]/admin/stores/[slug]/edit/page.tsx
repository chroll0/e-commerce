"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";

import { api } from "@/lib/axios";
import { StoreForm, ConfirmModal } from "@/components";

import { StoreApi, Locale } from "@/types";

type StoreFormValues = {
  name: string;
  slug: string;
  logo: string;
  banner: string;
};

export default function AdminEditStorePage() {
  const router = useRouter();

  const locale = useLocale() as Locale;
  const t = useTranslations("admin.stores");

  const params = useParams<{ slug: string }>();
  const slugParam = params.slug;

  const [id, setId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [initialValues, setInitialValues] = useState<StoreFormValues>({
    name: "",
    slug: "",
    logo: "",
    banner: "",
  });

  const load = async () => {
    try {
      setLoading(true);

      setError("");
      setFieldErrors({});

      const res = await api.get(`/stores/slug/${slugParam}`);

      const store = res.data as StoreApi;

      setId(store.id);

      setInitialValues({
        name: store.name ?? "",
        slug: store.slug ?? "",
        logo: store.logo ?? "",
        banner: store.banner ?? "",
      });
    } catch (e: any) {
      setError(e?.response?.data?.message || t("messages.loadOneError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!slugParam) return;

    load();
  }, [slugParam]);

  const validate = (values: StoreFormValues) => {
    const next: Record<string, string> = {};

    if (!values.name.trim()) {
      next.name = t("validation.nameRequired");
    }

    if (!values.slug.trim()) {
      next.slug = t("validation.slugRequired");
    }

    setFieldErrors(next);

    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (values: StoreFormValues) => {
    if (!id) return;

    if (!validate(values)) return;

    try {
      setSaving(true);

      setError("");
      setFieldErrors({});

      const payload = {
        name: values.name.trim(),
        slug: values.slug.trim(),
        logo: values.logo.trim() || null,
        banner: values.banner.trim() || null,
      };

      await api.patch(`/stores/${id}`, payload);

      router.push(`/${locale}/admin/stores`);
    } catch (e: any) {
      setError(e?.response?.data?.message || t("messages.updateError"));
    } finally {
      setSaving(false);
    }
  };

  const closeDelete = () => {
    if (deleting) return;

    setDeleteOpen(false);
  };

  const confirmDelete = async () => {
    if (!id) return;

    try {
      setDeleting(true);

      await api.delete(`/stores/${id}`);

      router.push(`/${locale}/admin/stores`);
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

  const displayName = initialValues.name || initialValues.slug || "";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {error && (
        <div className="max-w-3xl mx-auto mt-6 px-6">
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        </div>
      )}

      <StoreForm
        mode="edit"
        initialValues={initialValues}
        submitting={saving}
        onCancel={() => router.push(`/${locale}/admin/stores`)}
        onSubmit={handleSubmit}
        onDelete={() => setDeleteOpen(true)}
        title={t("form.editTitle")}
        description={t("form.editDescription")}
        cancelLabel={t("actions.cancel")}
        submitLabel={t("actions.save")}
        submittingLabel={t("actions.saving")}
        deleteLabel={t("actions.delete")}
        errors={fieldErrors}
      />

      <ConfirmModal
        isOpen={deleteOpen}
        loading={deleting}
        onClose={closeDelete}
        onConfirm={confirmDelete}
        title={t("modal.deleteTitle")}
        description={t("modal.deleteDescription", {
          name: displayName,
        })}
        cancelLabel={t("actions.cancel")}
        confirmLabel={deleting ? t("modal.deleting") : t("modal.confirmDelete")}
      />
    </div>
  );
}
