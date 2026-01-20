"use client";

import { FC, useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";

import {
  AdminPageHeader,
  Button,
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
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors: rhfErrors },
  } = useForm<ProductFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      ...initialValues,
      images: initialValues.images?.length ? initialValues.images : [""],
    },
    mode: "onSubmit",
  });

  const { append, remove } = useFieldArray<ProductFormValues>({
    control,
    name: "images" as never,
  });

  const [slugTouched, setSlugTouched] = useState(mode === "edit");

  useEffect(() => {
    reset({
      ...initialValues,
      images: initialValues.images?.length ? initialValues.images : [""],
    });
    setSlugTouched(mode === "edit");
  }, [initialValues, mode, reset]);

  const titleEn = watch("titleEn");
  const images = watch("images");

  const cleanImages = useMemo(() => cleanImageUrls(images ?? []), [images]);

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
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <AdminPageHeader title={title} description={description} />
      </div>

      <form noValidate onSubmit={handleSubmit(submit)} className="space-y-5">
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

        {/* slug */}
        <div>
          <label className="text-sm font-medium text-secondary">
            {labels.slug}
          </label>

          <input
            className="mt-2 w-full border-b-2 border-border bg-transparent py-2 outline-none focus:border-blue-500"
            {...slugReg}
            onChange={(e) => {
              setSlugTouched(true);
              slugReg.onChange(e);
            }}
          />

          {rhfErrors.slug?.message && (
            <p className="text-xs text-red-500 mt-1 leading-tight">
              {String(rhfErrors.slug.message)}
            </p>
          )}
        </div>

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
          register={register}
          errors={rhfErrors}
          images={images ?? [""]}
          onAdd={() => append("")}
          onRemove={(idx) => remove(idx)}
          labels={{
            title: labels.imagesTitle,
            add: labels.addImage,
            imageUrl: labels.imageUrl,
            remove: labels.remove,
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
    </div>
  );
};

export default ProductForm;
