"use client";

import { FC, useEffect } from "react";
import type { Control, UseFormSetValue } from "react-hook-form";
import { useWatch } from "react-hook-form";
import type { ProductFormValues } from "@/types";
import { FormInput } from "@/components";

const sanitizeMoney = (input: string) => {
  let v = input.replace(/[^\d.]/g, "");

  const firstDot = v.indexOf(".");
  if (firstDot !== -1) {
    v = v.slice(0, firstDot + 1) + v.slice(firstDot + 1).replace(/\./g, "");
  }

  if (v.startsWith(".")) v = `0${v}`;
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

  const hasDot = raw.includes(".");
  const endsWithDot = raw.endsWith(".");

  const [iRaw, dRaw = ""] = raw.split(".");
  const i = iRaw === "" ? "0" : iRaw;

  const intFormatted = i.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  if (endsWithDot) return `${intFormatted}.`;
  if (hasDot) return `${intFormatted}.${dRaw}`;

  return intFormatted;
};

const calcDiscount = (price: number, oldPrice: number) => {
  if (!price || !oldPrice) return "";
  if (oldPrice <= 0) return "";
  if (price >= oldPrice) return "0";
  const pct = Math.round(((oldPrice - price) / oldPrice) * 100);
  return String(Math.max(0, Math.min(100, pct)));
};

type Props = {
  control: Control<ProductFormValues>;
  setValue: UseFormSetValue<ProductFormValues>;
  labels: { price: string; oldPrice: string; discount: string };
};

const ProductPricingFields: FC<Props> = ({ control, setValue, labels }) => {
  const priceRaw = useWatch({ control, name: "price" }) ?? "";
  const oldRaw = useWatch({ control, name: "oldPrice" }) ?? "";
  const currentDiscount = useWatch({ control, name: "discount" }) ?? "";

  useEffect(() => {
    const p = Number(priceRaw);
    const op = Number(oldRaw);

    const next =
      !priceRaw || !oldRaw || Number.isNaN(p) || Number.isNaN(op)
        ? ""
        : calcDiscount(p, op);

    if (next !== currentDiscount) {
      setValue("discount", next, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [priceRaw, oldRaw, currentDiscount, setValue]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FormInput<ProductFormValues>
        name="price"
        label={labels.price}
        type="text"
        inputMode="decimal"
        fullWidth
        size="lg"
        control={control}
        transform={sanitizeMoney}
        format={formatMoney}
      />

      <FormInput<ProductFormValues>
        name="oldPrice"
        label={labels.oldPrice}
        type="text"
        inputMode="decimal"
        fullWidth
        size="lg"
        control={control}
        transform={sanitizeMoney}
        format={formatMoney}
      />

      <FormInput<ProductFormValues>
        name="discount"
        label={labels.discount}
        type="text"
        size="lg"
        inputMode="numeric"
        fullWidth
        control={control}
        readOnly
      />
    </div>
  );
};

export default ProductPricingFields;
