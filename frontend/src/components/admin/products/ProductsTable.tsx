import { FC } from "react";
import { ProductApi } from "@/types";
import ProductRow from "./ProductRow";

type Props = {
  loading: boolean;
  products: ProductApi[];
  onDelete: (p: ProductApi) => void;
};

const ProductsTable: FC<Props> = ({ loading, products, onDelete }) => {
  if (loading) {
    return <div className="text-sm text-muted-foreground py-6">Loading...</div>;
  }

  if (!products.length) {
    return (
      <div className="text-sm text-muted-foreground py-6">
        No products found
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="grid grid-cols-12 px-4 py-3 text-xs font-medium text-muted-foreground border-b">
        <div className="col-span-5">Product</div>
        <div className="col-span-2">Price</div>
        <div className="col-span-2">Stock</div>
        <div className="col-span-3 text-right">Actions</div>
      </div>

      {products.map((p) => (
        <ProductRow key={p.id} product={p} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default ProductsTable;
