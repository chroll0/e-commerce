"use client";

import { FC } from "react";
import { Button, Input } from "@/components";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { ProductFormValues } from "@/types";

type Props = {
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  images: string[];
  onAdd: () => void;
  onRemove: (idx: number) => void;
  labels: { title: string; add: string; imageUrl: string; remove: string };
};

const ProductImagesFields: FC<Props> = ({
  register,
  errors,
  images,
  onAdd,
  onRemove,
  labels,
}) => {
  const imagesError =
    (errors.images?.message as string | undefined) ?? undefined;

  return (
    <div className="rounded-2xl border border-border p-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base font-semibold">{labels.title}</h2>
        <Button type="button" variant="secondary" size="sm" onClick={onAdd}>
          {labels.add}
        </Button>
      </div>

      {imagesError && (
        <p className="mt-2 text-xs text-destructive leading-tight">
          {imagesError}
        </p>
      )}

      <div className="mt-4 space-y-3">
        {images.map((_, idx) => {
          const fieldName = `images.${idx}` as const;
          const fieldError = (errors.images?.[idx] as any)?.message as
            | string
            | undefined;

          return (
            <div key={idx} className="flex items-center gap-2">
              <div className="flex-1">
                <Input
                  label={idx === 0 ? labels.imageUrl : undefined}
                  type="text"
                  placeholder="https://..."
                  fullWidth
                  {...register(fieldName)}
                  error={fieldError}
                />
              </div>

              {images.length > 1 && (
                <Button
                  type="button"
                  variant="text"
                  className="text-destructive"
                  onClick={() => onRemove(idx)}
                >
                  {labels.remove}
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductImagesFields;
