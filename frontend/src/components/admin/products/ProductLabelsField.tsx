"use client";

import { FC } from "react";
import { Control, Controller } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import type { ProductFormValues, ProductLabelApi } from "@/types";

type Props = {
  control: Control<ProductFormValues>;
  allLabels: ProductLabelApi[];
  title: string;
  empty: string;
};

const ProductLabelsField: FC<Props> = ({
  control,
  allLabels,
  title,
  empty,
}) => {
  const locale = useLocale();
  const t = useTranslations("admin.products");
  const labelName = (label: ProductLabelApi) =>
    locale === "ka" ? label.nameKa : label.nameEn;

  return (
    <div className="rounded-2xl border border-border p-6 space-y-4">
      <h2 className="text-base font-semibold">{title}</h2>

      {allLabels.length === 0 ? (
        <p className="text-sm text-muted-foreground">{empty}</p>
      ) : (
        <Controller
          name="labelIds"
          control={control}
          render={({ field }) => {
            const selected = field.value ?? [];

            const toggle = (id: number) => {
              const next = selected.includes(id)
                ? selected.filter((value) => value !== id)
                : [...selected, id];

              field.onChange(next);
            };

            return (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {t.rich("form.fields.selectLabels", {
                    createNew: (chunks) => (
                      <Link
                        href={`/${locale}/admin/labels/new`}
                        className="text-primary underline hover:no-underline"
                      >
                        {chunks}
                      </Link>
                    ),
                  })}
                </p>

                <div className="flex flex-wrap gap-3">
                  {allLabels.map((label) => (
                    <label
                      key={label.id}
                      className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={selected.includes(label.id)}
                        onChange={() => toggle(label.id)}
                      />

                      <span>{labelName(label)}</span>
                    </label>
                  ))}
                </div>
              </div>
            );
          }}
        />
      )}
    </div>
  );
};

export default ProductLabelsField;
