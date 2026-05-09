"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { StoreForm } from "@/components";

type StoreFormValues = {
  name: string;
  slug: string;
  logo: string;
  banner: string;
};

export default function AdminCreateStorePage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("admin.stores");

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const initialValues: StoreFormValues = {
    name: "",
    slug: "",
    logo: "",
    banner: "",
  };

  const handleSubmit = async (values: StoreFormValues) => {
    try {
      setSubmitting(true);
      setErrors({});

      await api.post("/stores", {
        name: values.name.trim(),
        slug: values.slug.trim() || undefined,
        logo: values.logo.trim() || undefined,
        banner: values.banner.trim() || undefined,
      });

      router.push(`/${locale}/admin/stores`);
    } catch (err: any) {
      const msg = err?.response?.data?.message || t("errors.create");
      setErrors({ form: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <StoreForm
      mode="create"
      initialValues={initialValues}
      submitting={submitting}
      onCancel={() => router.push(`/${locale}/admin/stores`)}
      onSubmit={handleSubmit}
      title={t("form.createTitle")}
      description={t("form.createDescription")}
      cancelLabel={t("actions.cancel")}
      submitLabel={t("actions.create")}
      submittingLabel={t("actions.saving")}
      errors={errors}
    />
  );
}
