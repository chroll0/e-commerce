"use client";

import { FC } from "react";
import { Input } from "@/components";
import type { ProductFormValues } from "@/types";

type Props = {
  values: ProductFormValues;
  setField: <K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K]
  ) => void;
  errors: Record<string, string>;
  labels: {
    boxTitle: string;
    titleEn: string;
    descEn: string;
    titleKa: string;
    descKa: string;
  };
};

const ProductContentFields: FC<Props> = ({
  values,
  setField,
  errors,
  labels,
}) => {
  return (
    <div className="rounded-2xl border border-border p-4 space-y-4">
      <h2 className="text-base font-semibold">{labels.boxTitle}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            label={labels.titleEn}
            type="text"
            value={values.titleEn}
            onChange={(e) => setField("titleEn", e.target.value)}
            fullWidth
            required
          />
          {errors.titleEn && (
            <p className="mt-2 text-sm text-destructive">{errors.titleEn}</p>
          )}
        </div>

        <div>
          <Input
            label={labels.titleKa}
            type="text"
            value={values.titleKa}
            onChange={(e) => setField("titleKa", e.target.value)}
            fullWidth
            required
          />
          {errors.titleKa && (
            <p className="mt-2 text-sm text-destructive">{errors.titleKa}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">{labels.descEn}</label>
          <textarea
            className="mt-2 w-full min-h-[140px] rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            value={values.descEn}
            onChange={(e) => setField("descEn", e.target.value)}
          />
          {errors.descEn && (
            <p className="mt-2 text-sm text-destructive">{errors.descEn}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">{labels.descKa}</label>
          <textarea
            className="mt-2 w-full min-h-[140px] rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            value={values.descKa}
            onChange={(e) => setField("descKa", e.target.value)}
          />
          {errors.descKa && (
            <p className="mt-2 text-sm text-destructive">{errors.descKa}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductContentFields;
