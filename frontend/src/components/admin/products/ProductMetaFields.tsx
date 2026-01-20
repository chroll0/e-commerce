"use client";

import { FC } from "react";
import { Tooltip } from "@/components";
import { Info } from "lucide-react";
import type { SelectOption, ProductFormValues } from "@/types";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { FormInput } from "@/components";

type Props = {
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  categories: SelectOption[];
  loadingCategories: boolean;
  labels: {
    stock: string;
    category: string;
    selectCategory: string;
    featured: string;
    featuredHint: string;
    loading?: string;
  };
};

const ProductMetaFields: FC<Props> = ({
  register,
  errors,
  categories,
  loadingCategories,
  labels,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
      <FormInput<ProductFormValues>
        name="stock"
        label={labels.stock}
        type="text"
        inputMode="numeric"
        fullWidth
        register={register}
        errors={errors}
      />

      <div className="w-full">
        <label className="text-sm font-medium">{labels.category}</label>

        <select
          className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          {...register("categoryId")}
          disabled={loadingCategories}
        >
          <option value="">
            {loadingCategories
              ? (labels.loading ?? "Loading...")
              : labels.selectCategory}
          </option>

          {categories.map((c) => (
            <option key={c.id} value={String(c.id)}>
              {c.name}
            </option>
          ))}
        </select>

        {errors.categoryId?.message && (
          <p className="mt-1 text-xs text-red-500 leading-tight">
            {String(errors.categoryId.message)}
          </p>
        )}
      </div>

      <label className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2">
        <input type="checkbox" {...register("isFeatured")} />
        <span className="text-sm">{labels.featured}</span>

        <Tooltip
          side="top"
          className="w-60 max-w-none"
          content={labels.featuredHint}
        >
          <Info className="h-4 w-4 hover:text-foreground" />
        </Tooltip>
      </label>
    </div>
  );
};

export default ProductMetaFields;
