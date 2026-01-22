"use client";

import { FC } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Tooltip, FormInput } from "@/components";
import { ChevronDown, Info, Plus } from "lucide-react";
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
  const locale = useLocale();
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
      <div className="w-full relative">
        <Controller
          name="categoryId"
          control={control}
          render={({ field }) => {
            const hasValue = String(field.value ?? "").trim() !== "";

            return (
              <>
                <div
                  className={[
                    "w-5 absolute left-0 right-0 flex items-center justify-between gap-2",
                    "transition-all duration-200",
                    hasValue
                      ? "top-0 translate-y-0"
                      : "top-[42%] -translate-y-1/2",
                    "pt-1 z-10",
                  ].join(" ")}
                >
                  <label
                    className={`font-medium text-secondary ${hasValue ? "text-xs" : "text-sm"}`}
                  >
                    {labels.category}
                  </label>

                  <Link
                    href={`/${locale}/admin/categories/new`}
                    className="inline-flex items-center gap-2 text-xs font-medium text-highlight hover:underline mr-3"
                    aria-label="Add category"
                    title="Add category"
                  >
                    <Plus className="h-4 w-4" />
                  </Link>
                </div>

                {/* select */}
                <div className="relative mt-2">
                  <div
                    className={[
                      "relative flex items-center gap-2 bg-transparent border-b-2 transition-colors duration-200",
                      categoryError
                        ? "border-red-500"
                        : "border-border focus-within:border-blue-500",
                    ].join(" ")}
                  >
                    <select
                      className={[
                        "w-full bg-card outline-none appearance-none pr-10 cursor-text",
                        "pt-5 pb-2 text-base",
                        hasValue ? "text-foreground" : "text-secondary",
                      ].join(" ")}
                      disabled={loadingCategories}
                      value={String(field.value ?? "")}
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

                    <ChevronDown className="pointer-events-none absolute right-3 top-3/5 h-4 w-4 -translate-y-1/2 text-muted" />
                  </div>

                  {categoryError ? (
                    <p className="mt-2 text-xs text-red-500 leading-tight">
                      {categoryError}
                    </p>
                  ) : null}
                </div>
              </>
            );
          }}
        />
      </div>

      {/* featured */}
      <label
        className={[
          "relative flex items-center gap-2",
          "border-b-2 border-border transition-colors duration-200",
          "px-1 pb-5 cursor-pointer",
          "focus-within:border-blue-500",
        ].join(" ")}
      >
        <Controller
          name="isFeatured"
          control={control}
          render={({ field }) => (
            <>
              <input
                type="checkbox"
                checked={Boolean(field.value)}
                onChange={(e) => field.onChange(e.target.checked)}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
                className="sr-only peer"
              />
              <span
                className={[
                  "relative inline-flex h-5 w-5 items-center justify-center",
                  "rounded-full border border-border bg-transparent",
                  "transition-colors duration-200",
                  // focus ring like inputs
                  "peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500/30",
                  // checked state
                  "peer-checked:border-blue-500 peer-checked:bg-blue-500",
                  // disabled state (optional)
                  "peer-disabled:opacity-50 peer-disabled:cursor-not-allowed",
                ].join(" ")}
              >
                <span
                  className={[
                    "h-2.5 w-2.5 rounded-full bg-white",
                    "scale-0 transition-transform duration-150",
                    "peer-checked:scale-100",
                  ].join(" ")}
                />
              </span>
            </>
          )}
        />
        <span className="text-sm text-foreground">{labels.featured}</span>
        <Tooltip
          side="top"
          className="w-60 max-w-none"
          content={labels.featuredHint}
        >
          <Info className="h-4 w-4 text-muted hover:text-foreground" />
        </Tooltip>
      </label>
    </div>
  );
};

export default ProductMetaFields;
