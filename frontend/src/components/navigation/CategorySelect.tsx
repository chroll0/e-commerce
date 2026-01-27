"use client";

import { FC, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/axios";
import { useLocale, useTranslations } from "next-intl";
import { buildIndentedOptions, SelectField } from "@/components";
import type { CategoryApi, CategoryOption, SelectOption } from "@/types";

type Props = {
  value: string;
  onChange: (v: string) => void;
  label?: string;
  placeholderLabel?: string;
  loadingLabel?: string;
};

const CategorySelect: FC<Props> = ({
  value,
  onChange,
  label,
  placeholderLabel,
  loadingLabel,
}) => {
  const locale = useLocale();
  const t = useTranslations("admin.categories.table");

  const [loading, setLoading] = useState(false);
  const [cats, setCats] = useState<CategoryOption[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const res = await api.get("/categories");
        const data = (res.data ?? []) as CategoryApi[];

        const normalized: CategoryOption[] = data.map((c) => {
          const name =
            c.translations?.find((t) => t.locale === locale)?.name ??
            c.translations?.[0]?.name ??
            c.slug;

          return {
            id: c.id,
            parentId: c.parentId ?? null,
            name,
          };
        });

        setCats(normalized);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [locale]);

  const options: SelectOption[] = useMemo(() => {
    const indented = buildIndentedOptions(cats);
    return indented.map((x) => ({
      value: String(x.id),
      label: x.label,
      cleanLabel: x.label
        .replace(/^[\s\u00A0]*(?:[└├]─\s*)/g, "")
        .replace(/^(?:—\s*)+/g, "")
        .trim(),
    }));
  }, [cats]);

  return (
    <SelectField
      label={label ?? t("category")}
      value={value}
      onChange={(next) => onChange(String(next ?? "").trim())}
      options={options}
      placeholderLabel={
        loading
          ? (loadingLabel ?? t("loading"))
          : (placeholderLabel ?? t("allCategory"))
      }
      disabled={loading}
    />
  );
};

export default CategorySelect;
