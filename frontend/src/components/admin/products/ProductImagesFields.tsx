"use client";

import { FC } from "react";
import { Button, Input } from "@/components";
import type {
  FieldErrors,
  FieldArrayWithId,
  UseFormRegister,
} from "react-hook-form";
import type { ProductFormValues } from "@/types";
import { Trash2 } from "lucide-react";

type Props = {
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  images: string[];
  imageFields: FieldArrayWithId<any, any, "id">[];
  onAdd: () => void;
  onRemove: (idx: number) => void;
  labels: { title: string; add: string; imageUrl: string; remove: string };
};

const ProductImagesFields: FC<Props> = ({
  register,
  errors,
  images,
  imageFields,
  onAdd,
  onRemove,
  labels,
}) => {
  const imagesError = errors.images?.message as string | undefined;

  const lastValue = images?.[images.length - 1];
  const canAdd = Boolean(lastValue && lastValue.trim());

  return (
    <div className="rounded-2xl border border-border p-4">
      {imagesError && (
        <p className="mt-2 text-xs text-red-500 leading-tight">{imagesError}</p>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="w-full space-y-3">
          {imageFields.map((field, idx) => {
            const fieldName = `images.${idx}` as const;
            const fieldError = (errors.images?.[idx] as any)?.message as
              | string
              | undefined;

            return (
              <div key={field.id} className="w-full flex items-end gap-2">
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

                {idx > 0 && (
                  <Button
                    type="button"
                    variant="text"
                    iconOnly
                    size="sm"
                    onClick={() => onRemove(idx)}
                    aria-label={labels.remove}
                    title={labels.remove}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAdd}
          disabled={!canAdd}
          className="min-w-[120px]"
        >
          {labels.add}
        </Button>
      </div>
    </div>
  );
};

export default ProductImagesFields;
