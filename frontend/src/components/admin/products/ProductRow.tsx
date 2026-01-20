"use client";

import { FC } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components";
import { ProductApi } from "@/types";

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

  return (
    <div className="grid grid-cols-12 px-4 py-3 border-b last:border-b-0 items-center border-border">
      {/* Title */}
      <div className="col-span-4 flex items-center gap-3 min-w-0">
        {product.images?.[0] && (
          <img
            src={product.images[0]}
            alt={title}
            className="h-10 w-10 rounded object-cover shrink-0"
          />
        )}
        <div className="min-w-0">
          <div className="text-lg font-medium truncate mb-1">{title}</div>
          <div className="text-[10px] text-muted-foreground truncate">
            {t("slug")}: {product.slug}
          </div>
        </div>
      </div>

      {/* Category */}
      <div className="col-span-3 text-sm text-muted-foreground truncate">
        {categoryName}
      </div>

      {/* Price */}
      <div className="col-span-2 text-sm">{product.price}</div>

      {/* Stock */}
      <div className="col-span-1 text-sm">{product.stock}</div>

      {/* Actions */}
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
