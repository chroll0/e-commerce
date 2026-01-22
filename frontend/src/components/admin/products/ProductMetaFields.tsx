"use client";

import { FC } from "react";
import { Tooltip, FormInput } from "@/components";
import { Info } from "lucide-react";
import type { SelectOption, ProductFormValues } from "@/types";
import type { Control, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";

type Props = {
  control: Control<ProductFormValues>;
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
  control,
  errors,
  categories,
  loadingCategories,
  labels,
}) => {
  const categoryError = errors.categoryId?.message
    ? String(errors.categoryId.message)
    : undefined;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
      {/* stock */}
      <FormInput<ProductFormValues>
        name="stock"
        label={labels.stock}
        type="text"
        inputMode="numeric"
        fullWidth
        control={control}
        transform={(v) =>
          String(v ?? "")
            .replace(/[^\d]/g, "")
            .trim()
        }
      />

      {/* category */}
      <div className="w-full">
        <label className="text-sm font-medium">{labels.category}</label>

        <Controller
          name="categoryId"
          control={control}
          render={({ field }) => (
            <select
              className={[
                "mt-2 w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none",
                "focus-visible:ring-2 focus-visible:ring-primary/40",
                categoryError ? "border-red-500" : "border-border",
              ].join(" ")}
              disabled={loadingCategories}
              value={field.value ?? ""}
              onChange={(e) =>
                field.onChange(String(e.target.value ?? "").trim())
              }
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
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
          )}
        />

        {categoryError ? (
          <p className="mt-1 text-xs text-red-500 leading-tight">
            {categoryError}
          </p>
        ) : null}
      </div>

      {/* featured */}
      <label className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2">
        <Controller
          name="isFeatured"
          control={control}
          render={({ field }) => (
            <input
              type="checkbox"
              checked={Boolean(field.value)}
              onChange={(e) => field.onChange(e.target.checked)}
              onBlur={field.onBlur}
              name={field.name}
              ref={field.ref}
            />
          )}
        />
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
