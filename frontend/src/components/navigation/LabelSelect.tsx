"use client";

import { api } from "@/lib/axios";
import { Tag } from "lucide-react";
import { SelectField } from "@/components";
import { FC, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { ProductLabelApi, SelectOption } from "@/types";

type Props = {
  value: string;
  onChange: (v: string) => void;
  label?: string;
  placeholderLabel?: string;
  loadingLabel?: string;
};

const LabelSelect: FC<Props> = ({
  value,
  onChange,
  label,
  placeholderLabel,
  loadingLabel,
}) => {
  const locale = useLocale();
  const t = useTranslations("admin.labels.table");

  const [loading, setLoading] = useState(false);
  const [labels, setLabels] = useState<ProductLabelApi[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        const res = await api.get("/labels");

        setLabels((res.data ?? []) as ProductLabelApi[]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const options: SelectOption[] = labels.map((label) => {
    const name = locale === "ka" ? label.nameKa : label.nameEn;

    return {
      value: String(label.id),
      label: name,
      cleanLabel: name,
    };
  });

  return (
    <SelectField
      label={label ?? t("label")}
      value={value}
      onChange={(next) => {
        onChange(String(next ?? "").trim());
      }}
      options={options}
      placeholderLabel={
        loading
          ? (loadingLabel ?? t("loading"))
          : (placeholderLabel ?? t("allLabels"))
      }
      disabled={loading}
      labelIcon={<Tag />}
    />
  );
};

export default LabelSelect;
