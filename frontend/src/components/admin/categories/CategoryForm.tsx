"use client";

import { FC, useEffect, useMemo, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";
import { useForm, SubmitHandler } from "react-hook-form";
import { ChevronDown } from "lucide-react";

import type { CategoryProps } from "@/types";
import { makeCategorySchema } from "@/hooks/validation";
import { buildIndentedOptions, slugify } from "./formOptions";
import { Button, AdminPageHeader, FormInput, ImageUpload } from "@/components";
import { uploadImage } from "@/lib/cloudinary";

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
  parentHint,
  errors = {},
}) => {
  const t = useTranslations("admin.categories");
  const schema = useMemo(() => makeCategorySchema(t), [t]);

  const safeParentId = useMemo(
    () => String(initialValues.parentId ?? "").trim(),
    [initialValues.parentId],
  );

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
      parentId: safeParentId,
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
      parentId: safeParentId,
    });

    setSlugTouched(mode === "edit");
  }, [initialValues, mode, reset, safeParentId]);

  const nameEn = watch("nameEn") ?? "";
  const image = watch("image") ?? "";

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

  useEffect(() => {
    if (!safeParentId) return;
    const exists = selectOptions.some((opt) => String(opt.id) === safeParentId);
    if (!exists) return;

    setValue("parentId", safeParentId, {
      shouldDirty: true,
      shouldTouch: false,
      shouldValidate: false,
    });
  }, [safeParentId, selectOptions, setValue]);

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

          <div className="w-full relative">
            <label className="text-sm font-medium text-secondary">
              {parentLabel}
            </label>

            <div className="relative mt-2">
              <div
                className={[
                  "relative flex items-center gap-2 bg-transparent border-b-2 transition-colors duration-200",
                  rhfErrors.parentId
                    ? "border-destructive"
                    : "border-border focus-within:border-blue-500",
                ].join(" ")}
              >
                <select
                  className={[
                    "w-full bg-card outline-none appearance-none pr-10",
                    "pb-2 text-base",
                    "text-secondary text-base",
                    "disabled:opacity-60 disabled:cursor-not-allowed",
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

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              </div>

              {rhfErrors.parentId?.message ? (
                <p className="mt-1 text-xs text-destructive leading-tight">
                  {String(rhfErrors.parentId.message)}
                </p>
              ) : null}

              {parentHint ? (
                <p className="mt-2 text-xs text-muted-foreground">
                  {parentHint}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <ImageUpload
            value={image}
            onChange={(next: string) =>
              setValue("image", next, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            upload={(file) => uploadImage(file, "categories")}
            maxFiles={1}
            maxSizeMb={10}
            error={
              rhfErrors.image?.message
                ? String(rhfErrors.image.message)
                : undefined
            }
            labels={{
              title: t("fields.imageTitle"),
              hint: t("fields.imageHint"),
              add: t("fields.addImage"),
              remove: t("fields.remove"),
              preview: t("fields.preview"),
              uploading: (count) => t("fields.uploading", { count }),
              invalidFile: t("fields.invalidFile"),
              tooLarge: (maxMb) => t("fields.tooLarge", { max: maxMb }),
              tooMany: (maxFiles) => t("fields.tooMany", { max: maxFiles }),
              uploadFailed: t("fields.uploadFailed"),
            }}
          />
        </div>

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
