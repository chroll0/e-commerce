"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { LabelForm } from "@/components";
import type { LabelFormValues } from "@/components/admin/labels/LabelForm";
import { createLabel } from "@/lib/labelsApi";
import type { Locale } from "@/types";

export default function AdminNewLabelPage() {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const t = useTranslations("admin.labels");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (values: LabelFormValues) => {
    if (!values.nameEn || !values.nameKa || !values.slug) {
      setError(t("messages.required"));
      return;
    }

    try {
      setSaving(true);
      setError("");
      await createLabel(values);
      router.push(`/${locale}/admin/labels`);
    } catch (e: any) {
      setError(e?.response?.data?.message || t("messages.createError"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <LabelForm
      mode="create"
      initialValues={{ nameEn: "", nameKa: "", slug: "" }}
      submitting={saving}
      error={error}
      onCancel={() => router.push(`/${locale}/admin/labels`)}
      onSubmit={handleSubmit}
      labels={{
        title: t("form.createTitle"),
        description: t("form.createDescription"),
        nameEn: t("fields.nameEn"),
        nameKa: t("fields.nameKa"),
        slug: t("fields.slug"),
        cancel: t("actions.cancel"),
        submit: t("form.submitCreate"),
        submitting: t("form.saving"),
      }}
    />
  );
}
