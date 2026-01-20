"use client";

import { FC } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { ProductFormValues } from "@/types";
import { FormInput, FormTextarea } from "@/components";

type Props = {
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  labels: {
    boxTitle: string;
    titleEn: string;
    descEn: string;
    titleKa: string;
    descKa: string;
  };
};

const ProductContentFields: FC<Props> = ({ register, errors, labels }) => {
  return (
    <div className="rounded-2xl border border-border p-4 space-y-4">
      <h2 className="text-base font-semibold">{labels.boxTitle}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput<ProductFormValues>
          name="titleEn"
          label={labels.titleEn}
          type="text"
          fullWidth
          register={register}
          errors={errors}
        />

        <FormInput<ProductFormValues>
          name="titleKa"
          label={labels.titleKa}
          type="text"
          fullWidth
          register={register}
          errors={errors}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormTextarea<ProductFormValues>
          name="descEn"
          label={labels.descEn}
          fullWidth
          register={register}
          errors={errors}
        />

        <FormTextarea<ProductFormValues>
          name="descKa"
          label={labels.descKa}
          fullWidth
          register={register}
          errors={errors}
        />
      </div>
    </div>
  );
};

export default ProductContentFields;
