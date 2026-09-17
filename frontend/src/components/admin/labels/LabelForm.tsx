"use client";

import { FC, useEffect, useState } from "react";
import { AdminPageHeader, Button, Input, slugify } from "@/components";

export type LabelFormValues = {
  nameEn: string;
  nameKa: string;
  slug: string;
};

type Props = {
  mode: "create" | "edit";
  initialValues: LabelFormValues;
  submitting?: boolean;
  error?: string;
  onCancel: () => void;
  onSubmit: (values: LabelFormValues) => void;
  labels: {
    title: string;
    description: string;
    nameEn: string;
    nameKa: string;
    slug: string;
    cancel: string;
    submit: string;
    submitting: string;
  };
};

const LabelForm: FC<Props> = ({
  mode,
  initialValues,
  submitting = false,
  error,
  onCancel,
  onSubmit,
  labels,
}) => {
  const [nameEn, setNameEn] = useState(initialValues.nameEn);
  const [nameKa, setNameKa] = useState(initialValues.nameKa);
  const [slug, setSlug] = useState(initialValues.slug);
  const [slugTouched, setSlugTouched] = useState(mode === "edit");

  useEffect(() => {
    setNameEn(initialValues.nameEn);
    setNameKa(initialValues.nameKa);
    setSlug(initialValues.slug);
  }, [initialValues]);

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(nameEn));
  }, [nameEn, slugTouched]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      nameEn: nameEn.trim(),
      nameKa: nameKa.trim(),
      slug: slug.trim(),
    });
  };

  return (
    <>
      <AdminPageHeader title={labels.title} description={labels.description} />

      <form
        onSubmit={handleSubmit}
        className="mt-6 grid grid-cols-1 gap-4 rounded-2xl border border-border p-6 md:grid-cols-3"
      >
        <Input
          label={labels.nameEn}
          value={nameEn}
          onChange={(e) => setNameEn(e.target.value)}
          fullWidth
        />

        <Input
          label={labels.nameKa}
          value={nameKa}
          onChange={(e) => setNameKa(e.target.value)}
          fullWidth
        />

        <Input
          label={labels.slug}
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          fullWidth
        />

        {error && (
          <div className="md:col-span-3 text-sm text-destructive">{error}</div>
        )}

        <div className="md:col-span-3 flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={submitting}
          >
            {labels.cancel}
          </Button>

          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? labels.submitting : labels.submit}
          </Button>
        </div>
      </form>
    </>
  );
};

export default LabelForm;
