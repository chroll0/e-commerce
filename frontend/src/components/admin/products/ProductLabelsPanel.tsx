"use client";

import { FC, useState } from "react";
import { Button } from "@/components";
import { setProductLabels } from "@/lib/labelsApi";
import type { ProductLabelApi } from "@/types";

type Props = {
  productId: number;
  allLabels: ProductLabelApi[];
  initialLabelIds: number[];
  labelsText: {
    title: string;
    empty: string;
    save: string;
    saving: string;
    saved: string;
    error: string;
  };
};

const ProductLabelsPanel: FC<Props> = ({
  productId,
  allLabels,
  initialLabelIds,
  labelsText,
}) => {
  const [selected, setSelected] = useState<Set<number>>(
    new Set(initialLabelIds),
  );
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

  const toggle = (id: number) => {
    setStatus("idle");
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setStatus("idle");
      await setProductLabels(productId, Array.from(selected));
      setStatus("saved");
    } catch {
      setStatus("error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border p-6 space-y-4">
      <h2 className="text-base font-semibold">{labelsText.title}</h2>

      {allLabels.length === 0 ? (
        <p className="text-sm text-muted-foreground">{labelsText.empty}</p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {allLabels.map((label) => (
            <label
              key={label.id}
              className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm"
            >
              <input
                type="checkbox"
                checked={selected.has(label.id)}
                onChange={() => toggle(label.id)}
              />
              {label.nameEn}
            </label>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="secondary"
          disabled={saving || allLabels.length === 0}
          onClick={handleSave}
        >
          {saving ? labelsText.saving : labelsText.save}
        </Button>

        {status === "saved" && (
          <span className="text-sm text-primary">{labelsText.saved}</span>
        )}
        {status === "error" && (
          <span className="text-sm text-destructive">{labelsText.error}</span>
        )}
      </div>
    </div>
  );
};

export default ProductLabelsPanel;
