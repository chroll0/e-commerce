"use client";

import { FC, useEffect, useMemo, useState } from "react";
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

const ProductForm: FC<ProductProps> = ({
  mode,
  title,
  description,
  categories,
  loadingCategories = false,
  initialValues,
  submitting = false,
  errors = {},
  onCancel,
  onSubmit,
  labels,
}) => {
  const [v, setV] = useState<ProductFormValues>(initialValues);
  const [slugTouched, setSlugTouched] = useState(mode === "edit");

  useEffect(() => {
    setV(initialValues);
    setSlugTouched(mode === "edit");
  }, [initialValues, mode]);

  // auto slug from EN title
  useEffect(() => {
    if (!slugTouched) {
      setV((p) => ({ ...p, slug: slugify(p.titleEn) }));
    }
  }, [v.titleEn, slugTouched]);

  const cleanImages = useMemo(() => cleanImageUrls(v.images), [v.images]);

  const setField = <K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K]
  ) => {
    setV((p) => ({ ...p, [key]: value }));
  };

  const updateImage = (idx: number, value: string) => {
    setV((p) => ({
      ...p,
      images: p.images.map((x, i) => (i === idx ? value : x)),
    }));
  };

  const addImageField = () =>
    setV((p) => ({ ...p, images: [...p.images, ""] }));
  const removeImageField = (idx: number) =>
    setV((p) => ({ ...p, images: p.images.filter((_, i) => i !== idx) }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(v, cleanImages);
  };

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

      <form onSubmit={submit} className="space-y-5">
        <ProductContentFields
          values={v}
          setField={setField}
          errors={errors}
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
          <Input
            label={labels.slug}
            type="text"
            value={v.slug}
            onChange={(e) => {
              setSlugTouched(true);
              setField("slug", e.target.value);
            }}
            fullWidth
            required
          />
          {errors.slug && (
            <p className="mt-2 text-sm text-destructive">{errors.slug}</p>
          )}
        </div>

        <ProductPricingFields
          values={v}
          setField={setField}
          errors={errors}
          labels={{
            price: labels.price,
            oldPrice: labels.oldPrice,
            discount: labels.discount,
          }}
        />

        <ProductMetaFields
          values={v}
          setField={setField}
          categories={categories}
          loadingCategories={loadingCategories}
          errors={errors}
          labels={{
            stock: labels.stock,
            category: labels.category,
            selectCategory: labels.selectCategory,
            featured: labels.featured,
            featuredHint: labels.featuredHint,
          }}
        />

        <ProductImagesFields
          images={v.images}
          onAdd={addImageField}
          onRemove={removeImageField}
          onChange={updateImage}
          error={errors.images}
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
