"use client";

import { FC, useEffect } from "react";
import type {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import type { ProductFormValues } from "@/types";
import { FormInput } from "@/components";

const sanitizeMoney = (input: string) => {
  let v = input.replace(/[^\d.]/g, "");

  const firstDot = v.indexOf(".");
  if (firstDot !== -1) {
    v = v.slice(0, firstDot + 1) + v.slice(firstDot + 1).replace(/\./g, "");
  }

  const [i, d] = v.split(".");
  if (d != null) v = `${i}.${d.slice(0, 2)}`;

  if (v.startsWith("0") && !v.startsWith("0.") && v.length > 1) {
    v = v.replace(/^0+/, "");
    if (v === "") v = "0";
  }

  return v;
};

const formatMoney = (raw: string) => {
  if (!raw) return "";
  const [i, d] = raw.split(".");
  const intFormatted = i.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return d != null && d.length ? `${intFormatted}.${d}` : intFormatted;
};

const calcDiscount = (price: number, oldPrice: number) => {
  if (!price || !oldPrice) return "";
  if (oldPrice <= 0) return "";
  if (price >= oldPrice) return "0";
  const pct = Math.round(((oldPrice - price) / oldPrice) * 100);
  return String(Math.max(0, Math.min(100, pct)));
};

type Props = {
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  watch: UseFormWatch<ProductFormValues>;
  setValue: UseFormSetValue<ProductFormValues>;
  labels: { price: string; oldPrice: string; discount: string };
};

const ProductPricingFields: FC<Props> = ({
  register,
  errors,
  watch,
  setValue,
  labels,
}) => {
  const priceRaw = watch("price") ?? "";
  const oldRaw = watch("oldPrice") ?? "";

  useEffect(() => {
    const p = Number(priceRaw);
    const op = Number(oldRaw);

    if (!priceRaw || !oldRaw || Number.isNaN(p) || Number.isNaN(op)) {
      setValue("discount", "", { shouldDirty: true });
      return;
    }

    setValue("discount", calcDiscount(p, op), { shouldDirty: true });
  }, [priceRaw, oldRaw, setValue]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FormInput<ProductFormValues>
        name="price"
        label={labels.price}
        type="text"
        inputMode="decimal"
        fullWidth
        register={register}
        errors={errors}
        transform={sanitizeMoney}
        onBlur={() => {}}
      />

      <FormInput<ProductFormValues>
        name="oldPrice"
        label={labels.oldPrice}
        type="text"
        inputMode="decimal"
        fullWidth
        register={register}
        errors={errors}
        transform={sanitizeMoney}
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
      />
    </div>
  );
};

export default ProductPricingFields;
