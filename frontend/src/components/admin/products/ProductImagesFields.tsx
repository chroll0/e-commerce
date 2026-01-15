"use client";
import { FC } from "react";
import { Button, Input } from "@/components";

type Props = {
  images: string[];
  onAdd: () => void;
  onRemove: (idx: number) => void;
  onChange: (idx: number, value: string) => void;
  error?: string;
  labels: { title: string; add: string; imageUrl: string; remove: string };
};

const ProductImagesFields: FC<Props> = ({
  images,
  onAdd,
  onRemove,
  onChange,
  error,
  labels,
}) => {
  return (
    <div className="rounded-2xl border border-border p-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base font-semibold">{labels.title}</h2>
        <Button type="button" variant="secondary" size="sm" onClick={onAdd}>
          {labels.add}
        </Button>
      </div>

      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}

      <div className="mt-4 space-y-3">
        {images.map((img, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className="flex-1">
              <Input
                label={idx === 0 ? labels.imageUrl : (undefined as any)}
                type="text"
                placeholder="https://..."
                value={img}
                onChange={(e) => onChange(idx, e.target.value)}
                fullWidth
                required={idx === 0}
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
        ))}
      </div>
    </div>
  );
};

export default ProductImagesFields;
