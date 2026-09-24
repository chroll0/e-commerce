"use client";

import { FC, useEffect, useMemo, useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";

import { AdminPageHeader, Button, Input, slugify } from "@/components";
import { makeLabelSchema } from "@/hooks";

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
  const t = useTranslations("admin.labels");
  const schema = useMemo(() => makeLabelSchema(t), [t]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LabelFormValues>({
    resolver: yupResolver(schema),
    defaultValues: initialValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const [slugTouched, setSlugTouched] = useState(mode === "edit");

  const nameEn = watch("nameEn");

  useEffect(() => {
    reset(initialValues);
    setSlugTouched(mode === "edit");
  }, [initialValues, mode, reset]);

  useEffect(() => {
    if (!slugTouched) {
      setValue("slug", slugify(nameEn ?? ""), {
        shouldDirty: true,
        shouldValidate: false,
      });
    }
  }, [nameEn, slugTouched, setValue]);

  const handleFormSubmit = (values: LabelFormValues) => {
    onSubmit({
      nameEn: values.nameEn.trim(),
      nameKa: values.nameKa.trim(),
      slug: values.slug.trim(),
    });
  };

  return (
    <>
      <AdminPageHeader title={labels.title} description={labels.description} />

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        noValidate
        className="mt-6 space-y-6 rounded-2xl border border-border p-6"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label={labels.nameEn}
            {...register("nameEn")}
            fullWidth
            error={errors.nameEn?.message}
          />

          <Input
            label={labels.nameKa}
            {...register("nameKa")}
            fullWidth
            error={errors.nameKa?.message}
          />

          <Input
            label={labels.slug}
            {...register("slug", {
              onChange: () => {
                setSlugTouched(true);
              },
            })}
            fullWidth
            error={errors.slug?.message}
          />
        </div>

        {error && <div className="text-sm text-destructive">{error}</div>}

        <div className="flex justify-end gap-2 border-t border-border pt-4">
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
