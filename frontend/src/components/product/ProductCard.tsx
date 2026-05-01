import type { ProductApi } from "@/types";

type Props = {
  productId?: number;
  product?: Pick<
    ProductApi,
    "id" | "name" | "price" | "oldPrice" | "discount" | "stock" | "images"
  >;
};

export default function ProductCard({ productId, product }: Props) {
  const title = product?.name ?? `Sample Product ${productId ?? ""}`.trim();
  const price = product?.price ?? 99;
  const oldPrice = product?.oldPrice ?? 150;
  const stock = product?.stock ?? 10;
  const sold = Math.max(0, Math.floor(stock * 0.6));
  const progress =
    stock > 0 ? Math.min(100, Math.round((sold / stock) * 100)) : 0;
  const image = product?.images?.[0];

  return (
    <div className="bg-card rounded-xl shadow-[0_2px_12px_var(--color-shadow)] p-4 border border-border hover:shadow-[0_4px_18px_var(--color-shadow)] transition cursor-pointer">
      {/* Product Image */}
      <div className="relative w-full h-40 bg-card-soft rounded-lg overflow-hidden border border-border">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : null}
      </div>

      {/* Product Title */}
      <p className="mt-3 text-sm text-primary font-medium">{title}</p>

      {/* Price + Old Price */}
      <div className="flex gap-2 items-center mt-1">
        <span className="text-primary font-semibold">${price.toFixed(2)}</span>
        {oldPrice ? (
          <span className="line-through text-secondary text-sm">
            ${oldPrice.toFixed(2)}
          </span>
        ) : null}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-border h-2 rounded-full mt-2 overflow-hidden">
        <div
          className="bg-primary h-2 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Sold Info */}
      <p className="text-xs text-muted mt-1">
        {sold}/{stock} Sold
      </p>
    </div>
  );
}
