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
  StoreOption,
} from "@/types";
import { Controller, type Control, type FieldErrors } from "react-hook-form";

type Props = {
  control: Control<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  categories: ProductCategoryOption[];
  stores: StoreOption[];
  loadingCategories: boolean;
  loadingStores: boolean;
  labels: {
    stock: string;
    category: string;
    selectCategory: string;
    selectedStore: string;
    selectStore: string;
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
  stores,
  loadingStores,
}) => {
  const locale = useLocale();
  const localeStr = String(locale) as "en" | "ka";

  const storeOptions = useMemo(() => {
    return stores.map((s) => ({
      value: String(s.id),
      label: s.name,
    }));
  }, [stores]);

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

      {/* store */}
      <div className="w-full relative">
        <div className="absolute right-0 top-1 z-10">
          <Link
            href={`/${locale}/admin/stores/new`}
            className="inline-flex items-center gap-2 text-xs font-medium text-highlight hover:underline"
            aria-label="Add store"
            title="Add store"
          >
            <Plus className="h-4 w-4" />
          </Link>
        </div>

        <Controller
          name="storeId"
          control={control}
          render={({ field }) => (
            <SelectField
              name={field.name}
              label={labels.selectedStore}
              value={String(field.value ?? "")}
              onChange={(next) => field.onChange(String(next ?? "").trim())}
              options={storeOptions}
              placeholderLabel={
                loadingStores
                  ? (labels.loading ?? "Loading...")
                  : labels.selectStore
              }
              disabled={loadingStores}
            />
          )}
        />
      </div>
    </div>
  );
};

export default ProductMetaFields;
