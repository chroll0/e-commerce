"use client";

import { FC, useMemo } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import {
  Tooltip,
  FormInput,
  SelectField,
  buildIndentedOptions,
} from "@/components";
import { Info, Plus } from "lucide-react";
import type {
  ProductFormValues,
  ProductCategoryOption,
  CategoryOption,
} from "@/types";
import { Controller, type Control, type FieldErrors } from "react-hook-form";

type Props = {
  control: Control<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  categories: ProductCategoryOption[];
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
  const localeStr = String(locale) as "en" | "ka";

  const categoryError = errors.categoryId?.message
    ? String(errors.categoryId.message)
    : undefined;

  const options = useMemo(() => {
    const localized: CategoryOption[] = categories.map((c) => ({
      id: c.id,
      parentId: c.parentId ?? null,
      name:
        c.translations?.find((t) => t.locale === localeStr)?.name ??
        c.translations?.[0]?.name ??
        c.name ??
        String(c.id),
    }));

    const indented = buildIndentedOptions(localized);

    return indented.map((x) => ({
      value: String(x.id),
      label: x.label,
    }));
  }, [categories, localeStr]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* stock */}
      <FormInput<ProductFormValues>
        name="stock"
        label={labels.stock}
        type="text"
        size="lg"
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
        <div className="absolute right-0 top-1 z-10">
          <Link
            href={`/${locale}/admin/categories/new`}
            className="inline-flex items-center gap-2 text-xs font-medium text-highlight hover:underline"
            aria-label="Add category"
            title="Add category"
          >
            <Plus className="h-4 w-4" />
          </Link>
        </div>

        <Controller
          name="categoryId"
          control={control}
          render={({ field }) => (
            <SelectField
              name={field.name}
              label={labels.category}
              value={String(field.value ?? "")}
              onChange={(next) => field.onChange(String(next ?? "").trim())}
              options={options}
              placeholderLabel={
                loadingCategories
                  ? (labels.loading ?? "Loading...")
                  : labels.selectCategory
              }
              disabled={loadingCategories}
              error={categoryError}
            />
          )}
        />
      </div>

      {/* featured */}
      <div className="w-full relative">
        <span className="text-xs font-medium text-secondary">
          {labels.featured}
        </span>

        <Controller
          name="isFeatured"
          control={control}
          render={({ field }) => {
            const id = field.name;

            return (
              <label
                htmlFor={id}
                className={[
                  "relative flex items-center gap-2",
                  "mt-2 pb-2 px-1",
                  "border-b-2 border-border transition-colors duration-200",
                  "cursor-pointer select-none",
                  "focus-within:border-blue-500",
                ].join(" ")}
              >
                <input
                  id={id}
                  type="checkbox"
                  checked={Boolean(field.value)}
                  onChange={(e) => field.onChange(e.target.checked)}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                  className="sr-only peer"
                />

                {/* custom checkbox */}
                <span
                  className={[
                    "relative inline-flex h-5 w-5 items-center justify-center",
                    "rounded-full border border-border bg-transparent",
                    "transition-colors duration-200",
                    "peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500/30",
                    "peer-checked:border-blue-500 peer-checked:bg-blue-500",
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

                {/* text */}
                <span className="text-sm text-secondary">
                  {labels.featured}
                </span>

                <span onClick={(e) => e.preventDefault()} className="ml-auto">
                  <Tooltip
                    side="top"
                    className="w-60 max-w-none"
                    content={labels.featuredHint}
                  >
                    <Info className="h-4 w-4 text-muted hover:text-foreground" />
                  </Tooltip>
                </span>
              </label>
            );
          }}
        />
      </div>
    </div>
  );
};

export default ProductMetaFields;
