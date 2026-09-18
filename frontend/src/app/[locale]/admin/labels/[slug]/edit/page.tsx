"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { LabelForm } from "@/components";
import type { LabelFormValues } from "@/components/admin/labels/LabelForm";
import { getLabels, updateLabel } from "@/lib/labelsApi";
import type { Locale, ProductLabelApi } from "@/types";

export default function AdminEditLabelPage() {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const { slug } = useParams<{ slug: string }>();
  const t = useTranslations("admin.labels");

  const [id, setId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [initialValues, setInitialValues] = useState<LabelFormValues>({
    nameEn: "",
    nameKa: "",
    slug: "",
  });

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const labels = await getLabels();
      const label = labels.find((l: ProductLabelApi) => l.slug === slug);

      if (!label) {
        setError(t("messages.loadOneError"));
        return;
      }

      setId(label.id);
      setInitialValues({
        nameEn: label.nameEn,
        nameKa: label.nameKa,
        slug: label.slug,
      });
    } catch (e: any) {
      setError(e?.response?.data?.message || t("messages.loadOneError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!slug) return;
    load();
  }, [slug]);

  const handleSubmit = async (values: LabelFormValues) => {
    if (!id) return;

    if (!values.nameEn || !values.nameKa || !values.slug) {
      setError(t("messages.required"));
      return;
    }

    try {
      setSaving(true);
      setError("");
      await updateLabel(id, values);
      router.push(`/${locale}/admin/labels`);
    } catch (e: any) {
      setError(e?.response?.data?.message || t("messages.updateError"));
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

  if (!id) {
    return (
      <div className="max-w-3xl mx-auto mt-6 px-6">
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      </div>
    );
  }

  return (
    <LabelForm
      mode="edit"
      initialValues={initialValues}
      submitting={saving}
      error={error}
      onCancel={() => router.push(`/${locale}/admin/labels`)}
      onSubmit={handleSubmit}
      labels={{
        title: t("form.editTitle"),
        description: t("form.editDescription"),
        nameEn: t("fields.nameEn"),
        nameKa: t("fields.nameKa"),
        slug: t("fields.slug"),
        cancel: t("actions.cancel"),
        submit: t("form.submitEdit"),
        submitting: t("form.saving"),
      }}
    />
  );
}
