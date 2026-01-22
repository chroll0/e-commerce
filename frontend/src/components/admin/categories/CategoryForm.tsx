"use client";

import { FC, useEffect, useMemo, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { useForm, SubmitHandler } from "react-hook-form";

import type { CategoryProps } from "@/types";
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
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    trigger,
    clearErrors,
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
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const [slugTouched, setSlugTouched] = useState(mode === "edit");

  useEffect(() => {
    reset({
      nameEn: initialValues.nameEn ?? "",
      nameKa: initialValues.nameKa ?? "",
      slug: initialValues.slug ?? "",
      image: initialValues.image ?? "",
      parentId: initialValues.parentId ?? "",
    });

    setSlugTouched(mode === "edit");
  }, [initialValues, mode, reset]);

  const nameEn = watch("nameEn") ?? "";

  useEffect(() => {
    if (!slugTouched) {
      setValue("slug", slugify(nameEn), {
        shouldDirty: true,
        shouldTouch: false,
        shouldValidate: false,
      });

      clearErrors("slug");
    }
  }, [nameEn, slugTouched, setValue, clearErrors]);

  const selectOptions = useMemo(() => {
    const filtered =
      excludeParentId == null
        ? parentOptions
        : parentOptions.filter((c) => c.id !== excludeParentId);

    return buildIndentedOptions(filtered);
  }, [parentOptions, excludeParentId]);

  const submit: SubmitHandler<FormValues> = async (values) => {
    const ok = await trigger("slug");
    if (!ok) return;

    onSubmit(values);
  };

  return (
    <>
      <AdminPageHeader title={title} description={description} />

      {errors.form ? (
        <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {errors.form}
        </div>
      ) : null}

      <form
        noValidate
        onSubmit={handleSubmit(submit)}
        className="space-y-6 rounded-2xl border border-border p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput<FormValues>
            name="nameEn"
            label={nameEnLabel}
            type="text"
            fullWidth
            control={control}
          />

          <FormInput<FormValues>
            name="nameKa"
            label={nameKaLabel}
            type="text"
            fullWidth
            control={control}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput<FormValues>
            name="slug"
            label={slugLabel}
            type="text"
            fullWidth
            control={control}
            onChange={() => {
              setSlugTouched(true);
              if (rhfErrors.slug) clearErrors("slug");
            }}
          />

          <div>
            <label className="text-sm font-medium">{parentLabel}</label>

            <select
              className={[
                "mt-2 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none",
                "focus-visible:ring-2 focus-visible:ring-primary/40",
                rhfErrors.parentId ? "border-destructive" : "border-border",
              ].join(" ")}
              {...register("parentId", {
                setValueAs: (v) => String(v ?? "").trim(),
              })}
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

            {rhfErrors.parentId?.message ? (
              <p className="mt-2 text-xs text-destructive">
                {String(rhfErrors.parentId.message)}
              </p>
            ) : null}

            {parentHint ? (
              <p className="mt-2 text-xs text-muted-foreground">{parentHint}</p>
            ) : null}
          </div>
        </div>

        <FormInput<FormValues>
          name="image"
          label={imageLabel}
          type="text"
          fullWidth
          control={control}
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
    </>
  );
};

export default CategoryForm;
