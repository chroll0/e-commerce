"use client";

import { FC, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";

import {
  AdminPageHeader,
  Button,
  Input,
  ProductContentFields,
  ProductImagesFields,
  ProductMetaFields,
  ProductPricingFields,
} from "@/components";

import type { ProductFormValues, ProductProps } from "@/types";
import { slugify, cleanImageUrls } from "./productUtils";
import { makeProductSchema } from "@/hooks/validation";

const ProductForm: FC<ProductProps> = ({
  mode,
  title,
  description,
  categories,
  loadingCategories = false,
  initialValues,
  submitting = false,
  onCancel,
  onSubmit,
  labels,
}) => {
  const t = useTranslations("admin.products");
  const schema = useMemo(() => makeProductSchema(t), [t]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors: rhfErrors },
  } = useForm<ProductFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      ...initialValues,
      images: initialValues.images ?? [],
    },
    mode: "onSubmit",
  });

  const [slugTouched, setSlugTouched] = useState(mode === "edit");

  useEffect(() => {
    reset({
      ...initialValues,
      images: initialValues.images ?? [],
    });
    setSlugTouched(mode === "edit");
  }, [initialValues, mode, reset]);

  const titleEn = watch("titleEn");
  const images = watch("images") ?? [];
  const cleanImages = useMemo(() => cleanImageUrls(images), [images]);

  useEffect(() => {
    if (!slugTouched) {
      setValue("slug", slugify(titleEn || ""), { shouldValidate: false });
    }
  }, [titleEn, slugTouched, setValue]);

  const submit = (values: ProductFormValues) => {
    onSubmit(values, cleanImages);
  };

  const slugReg = register("slug");

  return (
    <>
      <AdminPageHeader title={title} description={description} />
      <form noValidate onSubmit={handleSubmit(submit)} className="space-y-6">
        <ProductContentFields
          register={register}
          errors={rhfErrors}
          labels={{
            boxTitle: labels.contentTitle,
            titleEn: labels.titleEn,
            descEn: labels.descEn,
            titleKa: labels.titleKa,
            descKa: labels.descKa,
          }}
        />

        <Input
          label={labels.slug}
          type="text"
          fullWidth
          {...slugReg}
          onChange={(e) => {
            setSlugTouched(true);
            slugReg.onChange(e);
          }}
          error={rhfErrors.slug?.message as string | undefined}
        />

        <ProductPricingFields
          register={register}
          errors={rhfErrors}
          watch={watch}
          setValue={setValue}
          labels={{
            price: labels.price,
            oldPrice: labels.oldPrice,
            discount: labels.discount,
          }}
        />

        <ProductMetaFields
          register={register}
          errors={rhfErrors}
          categories={categories}
          loadingCategories={loadingCategories}
          labels={{
            stock: labels.stock,
            category: labels.category,
            selectCategory: labels.selectCategory,
            featured: labels.featured,
            featuredHint: labels.featuredHint,
            loading: t("table.loading"),
          }}
        />

        <ProductImagesFields
          setValue={setValue}
          errors={rhfErrors}
          images={watch("images") ?? []}
          onRemove={(idx) => {
            const next = [...(watch("images") ?? [])];
            next.splice(idx, 1);
            setValue("images", next, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }}
          labels={{
            title: t("form.fields.imagesTitle"),
            imagesHint: t("form.fields.imagesHint"),
            add: t("form.fields.addImage"),
            remove: t("form.fields.remove"),
            preview: t("form.fields.preview"),
            uploading: (count) => t("form.fields.uploading", { count }),
          }}
        />

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onCancel}>
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

export default ProductForm;
