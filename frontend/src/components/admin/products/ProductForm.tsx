"use client";

import { FC, useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslations } from "next-intl";

import {
  AdminPageHeader,
  Button,
  FormInput,
  ImageUpload,
  ProductContentFields,
  ProductMetaFields,
  ProductPricingFields,
} from "@/components";

import type { ProductFormValues, ProductProps } from "@/types";
import { slugify, cleanImageUrls } from "./productUtils";
import { makeProductSchema } from "@/hooks/validation";
import { uploadImage } from "@/lib/cloudinary";

const ProductForm: FC<ProductProps> = ({
  mode,
  title,
  description,
  categories,
  stores,
  loadingCategories = false,
  loadingStores = false,
  initialValues,
  submitting = false,
  onCancel,
  onSubmit,
  labels,
}) => {
  const t = useTranslations("admin.products");
  const schema = useMemo(() => makeProductSchema(t), [t]);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    trigger,
    clearErrors,
    formState: { errors: rhfErrors },
  } = useForm<ProductFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      ...initialValues,
      images: initialValues.images ?? [],
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const [slugTouched, setSlugTouched] = useState(mode === "edit");

  useEffect(() => {
    reset({
      ...initialValues,
      images: initialValues.images ?? [],
    });
    setSlugTouched(mode === "edit");
  }, [initialValues, mode, reset]);

  const titleEn = watch("titleEn") ?? "";
  const images = watch("images") ?? [];
  const cleanImages = useMemo(() => cleanImageUrls(images), [images]);

  useEffect(() => {
    if (!slugTouched) {
      setValue("slug", slugify(titleEn), {
        shouldDirty: true,
        shouldTouch: false,
        shouldValidate: false,
      });
      clearErrors("slug");
    }
  }, [titleEn, slugTouched, setValue, clearErrors]);

  const submit: SubmitHandler<ProductFormValues> = async (values) => {
    const ok = await trigger("slug");
    if (!ok) return;

    onSubmit(values, cleanImages);
  };

  return (
    <>
      <AdminPageHeader title={title} description={description} />

      <form noValidate onSubmit={handleSubmit(submit)} className="space-y-6">
        <ProductContentFields
          control={control}
          labels={{
            boxTitle: labels.contentTitle,
            titleEn: labels.titleEn,
            descEn: labels.descEn,
            titleKa: labels.titleKa,
            descKa: labels.descKa,
          }}
        />

        <FormInput<ProductFormValues>
          name="slug"
          control={control}
          label={labels.slug}
          type="text"
          fullWidth
          onChange={() => {
            setSlugTouched(true);
            if (rhfErrors.slug) clearErrors("slug");
          }}
        />

        <ProductPricingFields
          control={control}
          setValue={setValue}
          labels={{
            price: labels.price,
            oldPrice: labels.oldPrice,
            discount: labels.discount,
          }}
        />

        <ProductMetaFields
          control={control}
          errors={rhfErrors}
          categories={categories}
          stores={stores}
          loadingCategories={loadingCategories}
          loadingStores={loadingStores}
          labels={{
            stock: labels.stock,
            category: labels.category,
            selectCategory: labels.selectCategory,
            selectedStore: labels.selectedStore,
            selectStore: labels.selectStore,
            featured: labels.featured,
            featuredHint: labels.featuredHint,
            loading: t("table.loading"),
          }}
        />

        <ImageUpload
          value={images}
          onChange={(next: string[]) =>
            setValue("images", next, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
          upload={(file) => uploadImage(file, "products")}
          maxFiles={5}
          maxSizeMb={10}
          error={
            rhfErrors.images?.message
              ? String(rhfErrors.images.message)
              : undefined
          }
          labels={{
            title: t("form.fields.imagesTitle"),
            hint: t("form.fields.imagesHint"),
            add: t("form.fields.addImage"),
            remove: t("form.fields.remove"),
            preview: t("form.fields.preview"),
            uploading: (count) => t("form.fields.uploading", { count }),
            invalidFile: t("form.fields.invalidFile"),
            tooLarge: (maxMb) => t("form.fields.tooLarge", { max: maxMb }),
            tooMany: (max) => t("form.fields.tooMany", { max }),
            uploadFailed: t("form.fields.uploadFailed"),
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
