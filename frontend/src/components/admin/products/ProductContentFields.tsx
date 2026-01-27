"use client";

import { FC } from "react";
import type { Control } from "react-hook-form";
import type { ProductFormValues } from "@/types";
import { FormInput, FormTextarea } from "@/components";

type Props = {
  control: Control<ProductFormValues>;
  labels: {
    boxTitle: string;
    titleEn: string;
    descEn: string;
    titleKa: string;
    descKa: string;
  };
};

const ProductContentFields: FC<Props> = ({ control, labels }) => {
  return (
    <div className="rounded-2xl border border-border p-4 space-y-4">
      <h2 className="text-base font-semibold">{labels.boxTitle}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput<ProductFormValues>
          name="titleEn"
          label={labels.titleEn}
          size="lg"
          type="text"
          fullWidth
          control={control}
        />

        <FormInput<ProductFormValues>
          name="titleKa"
          label={labels.titleKa}
          size="lg"
          type="text"
          fullWidth
          control={control}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormTextarea<ProductFormValues>
          name="descEn"
          label={labels.descEn}
          fullWidth
          control={control}
        />

        <FormTextarea<ProductFormValues>
          name="descKa"
          label={labels.descKa}
          fullWidth
          control={control}
        />
      </div>
    </div>
  );
};

export default ProductContentFields;
