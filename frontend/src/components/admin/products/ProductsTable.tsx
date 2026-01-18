"use client";

import { FC } from "react";
import { useTranslations } from "next-intl";
import { ProductApi } from "@/types";
import ProductRow from "./ProductRow";

type Props = {
  loading: boolean;
  products: ProductApi[];
  onDelete: (p: ProductApi) => void;
};

const ProductsTable: FC<Props> = ({ loading, products, onDelete }) => {
  const t = useTranslations("admin.products.table");

  if (loading) {
    return (
      <div className="text-sm text-muted-foreground py-6">{t("loading")}</div>
    );
  }

  if (!products.length) {
    return (
      <div className="text-sm text-muted-foreground py-6">{t("empty")}</div>
    );
  }

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="grid grid-cols-12 px-4 py-3 text-xs font-medium text-muted-foreground border-b">
        <div className="col-span-4">{t("title")}</div>
        <div className="col-span-3">{t("category")}</div>
        <div className="col-span-2">{t("price")}</div>
        <div className="col-span-1">{t("stock")}</div>
        <div className="col-span-2 text-right">{t("actions")}</div>
      </div>

      {products.map((p) => (
        <ProductRow key={p.id} product={p} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default ProductsTable;
