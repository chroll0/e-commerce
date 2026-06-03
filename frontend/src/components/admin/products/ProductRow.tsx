"use client";

import { FC } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Pencil, Trash2, ImageIcon } from "lucide-react";
import { Button } from "@/components";
import { ProductApi } from "@/types";
import Image from "next/image";

type Props = {
  product: ProductApi;
  onDelete: (p: ProductApi) => void;
};

const ProductRow: FC<Props> = ({ product, onDelete }) => {
  const locale = useLocale() as "en" | "ka";
  const t = useTranslations("admin.products.table");

  const title =
    product.translations?.find((tr) => tr.locale === locale)?.title ??
    product.translations?.[0]?.title ??
    product.slug ??
    "—";

  const categoryName =
    product.category?.translations?.find((tr) => tr.locale === locale)?.name ??
    product.category?.translations?.[0]?.name ??
    "—";

  const image = product.images?.[0];

  return (
    <div className="grid grid-cols-12 items-center gap-2 border-b border-border px-4 py-3 last:border-b-0 hover:bg-muted/30 transition">
      {/* PRODUCT */}
      <div className="col-span-4 flex min-w-0 items-center gap-3">
        {/* IMAGE */}
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded border border-border bg-muted/10">
          {image ? (
            <div className="relative h-full w-full">
              <Image src={image} alt={title} fill className="object-cover" />
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <ImageIcon className="h-4 w-4" />
            </div>
          )}
        </div>

        {/* TEXT */}
        <div className="min-w-0">
          <div className="truncate text-sm font-medium text-foreground">
            {title}
          </div>

          <div className="truncate text-[11px] text-muted-foreground">
            {t("slug")}: {product.slug}
          </div>
        </div>
      </div>

      {/* CATEGORY */}
      <div className="col-span-3 truncate text-sm text-muted-foreground">
        {categoryName}
      </div>

      {/* PRICE */}
      <div className="col-span-2 text-sm text-foreground">{product.price}</div>

      {/* STOCK */}
      <div className="col-span-1 text-sm text-muted-foreground">
        {product.stock}
      </div>

      {/* ACTIONS */}
      <div className="col-span-2 flex justify-end gap-2">
        <Button asChild size="xs" variant="secondary">
          <Link href={`/${locale}/admin/products/${product.slug}/edit`}>
            <Pencil className="h-4 w-4" />
          </Link>
        </Button>

        <Button
          size="xs"
          variant="tertiary"
          className="text-destructive"
          onClick={() => onDelete(product)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ProductRow;
