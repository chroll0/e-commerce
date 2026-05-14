import type { ProductApi } from "@/types";
import Image from "next/image";

type Props = {
  product: ProductApi;
};

export default function ProductDetails({ product }: Props) {
  return (
    <div className="grid grid-cols-2 gap-10">
      {/* images */}
      <div>
        <Image
          src={product.images?.[0] ?? ""}
          alt={product.name}
          width={500}
          height={500}
        />
      </div>

      {/* info */}
      <div>
        <h1>{product.name}</h1>

        <p className="text-xl font-bold">${product.price}</p>

        {product.oldPrice && (
          <p className="line-through text-red-500">${product.oldPrice}</p>
        )}

        <p>Stock: {product.stock}</p>

        <p>Category ID: {product.categoryId}</p>
      </div>
    </div>
  );
}
