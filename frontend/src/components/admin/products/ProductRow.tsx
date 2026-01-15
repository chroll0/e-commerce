import { FC } from "react";
import Link from "next/link";
import { Button } from "@/components";
import { Pencil, Trash2 } from "lucide-react";
import { ProductApi } from "@/types";
import { useLocale } from "next-intl";

type Props = {
  product: ProductApi;
  onDelete: (p: ProductApi) => void;
};

const ProductRow: FC<Props> = ({ product, onDelete }) => {
  const locale = useLocale();

  const title =
    product.translations.find((t) => t.locale === locale)?.title ||
    product.translations[0]?.title;

  return (
    <div className="grid grid-cols-12 px-4 py-3 border-b last:border-b-0 items-center">
      <div className="col-span-5 flex items-center gap-3">
        {product.images?.[0] && (
          <img
            src={product.images[0]}
            alt={title}
            className="h-10 w-10 rounded object-cover"
          />
        )}
        <span className="font-medium truncate">{title}</span>
      </div>

      <div className="col-span-2 text-sm">{product.price}</div>

      <div className="col-span-2 text-sm">{product.stock}</div>

      <div className="col-span-3 flex justify-end gap-2">
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
