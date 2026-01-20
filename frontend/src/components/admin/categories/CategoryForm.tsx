"use client";

import { FC, useEffect, useMemo } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { CategoryProps } from "@/types";
import { useForm } from "react-hook-form";
import { makeCategorySchema } from "@/hooks/validation";
import { buildIndentedOptions, slugify } from "./formOptions";
import { Button, AdminPageHeader, FormInput } from "@/components";

type FormValues = {
  nameEn: string;
  nameKa: string;
  slug: string;
  image: string;
  parentId: string;
};

const CategoryForm: FC<CategoryProps> = ({
  mode,
  loadingParents = false,
  parentOptions,
  excludeParentId = null,
  initialValues,
  submitting = false,
  onCancel,
  onSubmit,
  title,
  description,
  cancelLabel,
  submitLabel,
  submittingLabel,
  parentLabel,
  noParentLabel,
  loadingLabel,
  nameCardTitle,
  nameEnLabel,
  nameKaLabel,
  slugLabel,
  imageLabel,
  parentHint,
  errors = {},
}) => {
  const t = useTranslations("admin.categories");
  const schema = useMemo(() => makeCategorySchema(t), [t]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors: rhfErrors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      nameEn: initialValues.nameEn ?? "",
      nameKa: initialValues.nameKa ?? "",
      slug: initialValues.slug ?? "",
      image: initialValues.image ?? "",
      parentId: initialValues.parentId ?? "",
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    reset({
      nameEn: initialValues.nameEn ?? "",
      nameKa: initialValues.nameKa ?? "",
      slug: initialValues.slug ?? "",
      image: initialValues.image ?? "",
      parentId: initialValues.parentId ?? "",
    });
  }, [initialValues, mode, reset]);

  const nameEn = watch("nameEn");
  const slugTouched = mode === "edit";

  useEffect(() => {
    if (!slugTouched) {
      setValue("slug", slugify(nameEn || ""), { shouldValidate: false });
    }
  }, [nameEn, slugTouched, setValue]);

  const selectOptions = useMemo(() => {
    const filtered =
      excludeParentId == null
        ? parentOptions
        : parentOptions.filter((c) => c.id !== excludeParentId);

    return buildIndentedOptions(filtered);
  }, [parentOptions, excludeParentId]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6">
        <AdminPageHeader title={title} description={description} />
      </div>
      {errors.form && (
        <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {errors.form}
        </div>
      )}

      <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput<FormValues>
            name="nameEn"
            label={nameEnLabel}
            type="text"
            fullWidth
            register={register}
            errors={rhfErrors}
          />

          <FormInput<FormValues>
            name="nameKa"
            label={nameKaLabel}
            type="text"
            fullWidth
            register={register}
            errors={rhfErrors}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput<FormValues>
            name="slug"
            label={slugLabel}
            type="text"
            fullWidth
            register={register}
            errors={rhfErrors}
          />

          <div>
            <label className="text-sm font-medium">{parentLabel}</label>

            <select
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              {...register("parentId")}
              disabled={loadingParents}
            >
              <option value="">
                {loadingParents ? loadingLabel : noParentLabel}
              </option>

              {selectOptions.map((opt) => (
                <option key={opt.id} value={String(opt.id)}>
                  {opt.label}
                </option>
              ))}
            </select>

            {rhfErrors.parentId?.message && (
              <p className="mt-2 text-xs text-destructive">
                {rhfErrors.parentId.message as string}
              </p>
            )}

            {parentHint && (
              <p className="mt-2 text-xs text-muted-foreground">{parentHint}</p>
            )}
          </div>
        </div>

        <FormInput<FormValues>
          name="image"
          label={imageLabel}
          type="text"
          fullWidth
          register={register}
          errors={rhfErrors}
        />

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>

          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? submittingLabel : submitLabel}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
