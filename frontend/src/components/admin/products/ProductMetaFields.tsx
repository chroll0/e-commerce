"use client";

import { FC } from "react";
import { Input, Tooltip } from "@/components";
import { Info } from "lucide-react";
import type { SelectOption, ProductFormValues } from "@/types";

type Props = {
  values: ProductFormValues;
  setField: <K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K]
  ) => void;
  categories: SelectOption[];
  loadingCategories: boolean;
  errors: Partial<Record<keyof ProductFormValues | "form", string>>;
  labels: {
    stock: string;
    category: string;
    selectCategory: string;
    featured: string;
    featuredHint: string;
  };
};

const ProductMetaFields: FC<Props> = ({
  values,
  setField,
  categories,
  loadingCategories,
  errors,
  labels,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
      <div>
        <Input
          label={labels.stock}
          type="number"
          value={values.stock}
          onChange={(e) => setField("stock", e.target.value)}
          fullWidth
          required
        />
      </div>

      <div className="w-full">
        <label className="text-sm font-medium">{labels.category}</label>
        <select
          className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          value={values.categoryId}
          onChange={(e) => setField("categoryId", e.target.value)}
          disabled={loadingCategories}
          required
        >
          <option value="">
            {loadingCategories ? "Loading..." : labels.selectCategory}
          </option>
          {categories.map((c) => (
            <option key={c.id} value={String(c.id)}>
              {c.name}
            </option>
          ))}
        </select>

        {errors.categoryId && (
          <p className="mt-2 text-sm text-destructive">{errors.categoryId}</p>
        )}
      </div>

      <label className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2">
        <input
          type="checkbox"
          checked={values.isFeatured}
          onChange={(e) => setField("isFeatured", e.target.checked)}
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

      {errors.stock && (
        <p className="md:col-span-3 -mt-2 text-sm text-destructive">
          {errors.stock}
        </p>
      )}
    </div>
  );
};

export default ProductMetaFields;
