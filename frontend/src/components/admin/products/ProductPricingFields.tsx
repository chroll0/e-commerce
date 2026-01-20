"use client";

import { FC, useEffect, useMemo } from "react";
import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import type { ProductFormValues } from "@/types";
import { FormInput } from "@/components";

type Props = {
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  watch: UseFormWatch<ProductFormValues>;
  setValue: UseFormSetValue<ProductFormValues>;
  labels: { price: string; oldPrice: string; discount: string };
};

const onlyDigits = (v: string) => v.replace(/[^\d]/g, "");

const calcDiscount = (price: number, oldPrice: number) => {
  if (!price || !oldPrice) return "";
  if (oldPrice <= 0) return "";
  if (price >= oldPrice) return "0";
  const pct = Math.round(((oldPrice - price) / oldPrice) * 100);
  return String(Math.max(0, Math.min(100, pct)));
};

const ProductPricingFields: FC<Props> = ({
  register,
  errors,
  watch,
  setValue,
  labels,
}) => {
  const price = watch("price");
  const oldPrice = watch("oldPrice");

  useEffect(() => {
    const p = Number(price);
    const op = Number(oldPrice);
    if (!price || !oldPrice || Number.isNaN(p) || Number.isNaN(op)) {
      setValue("discount", "", { shouldValidate: true, shouldDirty: true });
      return;
    }

    setValue("discount", calcDiscount(p, op), {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [price, oldPrice, setValue]);

  const priceReg = register("price");
  const oldPriceReg = register("oldPrice");
  const discountReg = register("discount");

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
        onChange={(e) => {
          e.target.value = onlyDigits(e.target.value);
          priceReg.onChange(e);
        }}
      />

      <FormInput<ProductFormValues>
        name="oldPrice"
        label={labels.oldPrice}
        type="text"
        inputMode="numeric"
        fullWidth
        register={register}
        errors={errors}
        onChange={(e) => {
          e.target.value = onlyDigits(e.target.value);
          oldPriceReg.onChange(e);
        }}
      />

      <FormInput<ProductFormValues>
        name="discount"
        label={labels.discount}
        type="text"
        inputMode="numeric"
        fullWidth
        register={register}
        errors={errors}
        readOnly
        onChange={(e) => {
          e.target.value = onlyDigits(e.target.value);
          discountReg.onChange(e);
        }}
      />
    </div>
  );
};

export default ProductPricingFields;
