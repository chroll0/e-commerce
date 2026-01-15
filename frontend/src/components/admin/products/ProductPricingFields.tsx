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
  labels: { price: string; oldPrice: string; discount: string };
};

const ProductPricingFields: FC<Props> = ({
  values,
  setField,
  errors,
  labels,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <Input
          label={labels.price}
          type="number"
          value={values.price}
          onChange={(e) => setField("price", e.target.value)}
          fullWidth
          required
        />
      </div>

      <div>
        <Input
          label={labels.oldPrice}
          type="number"
          value={values.oldPrice}
          onChange={(e) => setField("oldPrice", e.target.value)}
          fullWidth
        />
      </div>

      <div>
        <Input
          label={labels.discount}
          type="number"
          value={values.discount}
          onChange={(e) => setField("discount", e.target.value)}
          fullWidth
        />
      </div>

      {(errors.price || errors.oldPrice || errors.discount) && (
        <div className="md:col-span-3 space-y-1">
          {errors.price && (
            <p className="text-sm text-destructive">{errors.price}</p>
          )}
          {errors.oldPrice && (
            <p className="text-sm text-destructive">{errors.oldPrice}</p>
          )}
          {errors.discount && (
            <p className="text-sm text-destructive">{errors.discount}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductPricingFields;
