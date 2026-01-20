"use client";

import { FC } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { ProductFormValues } from "@/types";
import { FormInput } from "@/components";

type Props = {
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  labels: { price: string; oldPrice: string; discount: string };
};

const ProductPricingFields: FC<Props> = ({ register, errors, labels }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FormInput<ProductFormValues>
        name="price"
        label={labels.price}
        type="text"
        inputMode="numeric"
        fullWidth
        register={register}
        errors={errors}
      />

      <FormInput<ProductFormValues>
        name="oldPrice"
        label={labels.oldPrice}
        type="text"
        inputMode="numeric"
        fullWidth
        register={register}
        errors={errors}
      />

      <FormInput<ProductFormValues>
        name="discount"
        label={labels.discount}
        type="text"
        inputMode="numeric"
        fullWidth
        register={register}
        errors={errors}
      />
    </div>
  );
};

export default ProductPricingFields;
