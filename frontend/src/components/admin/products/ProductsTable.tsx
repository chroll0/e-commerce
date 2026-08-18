"use client";

import { FC } from "react";
import { useTranslations } from "next-intl";
import { ProductApi } from "@/types";
import ProductRow from "./ProductRow";
import Link from "next/link";

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
      <div className="flex gap-1 text-sm text-foreground/70 py-6">
        <p>{t("empty")}</p>
        <Link
          href={`/admin/products/new`}
          className="inline-flex text-sm font-medium text-foreground hover:underline"
        >
          {t("add")}
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <div className="min-w-[820px]">
        <div className="grid grid-cols-12 gap-2 border-b border-border px-4 py-3 text-xs font-medium text-muted-foreground">
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
    </div>
  );
};

export default ProductsTable;
