import Image from "next/image";

export default function ProductCard({ productId }: { productId: number }) {
  return (
    <div className="bg-card rounded-xl shadow-[0_2px_12px_var(--color-shadow)] p-4 border border-border hover:shadow-[0_4px_18px_var(--color-shadow)] transition cursor-pointer">
      {/* Product Image */}
      <div className="relative w-full h-40 bg-card-soft rounded-lg overflow-hidden border border-border">
        <Image
          src="/placeholder-product.jpg"
          alt="Product"
          fill
          className="object-cover rounded-lg"
        />

        {/* Favorite Heart Icon */}
        <div className="absolute top-2 right-2 bg-card rounded-full p-1 shadow-[0_2px_6px_var(--color-shadow)] border border-border">
          ❤️
        </div>
      </div>

      {/* Product Title */}
      <p className="mt-3 text-sm text-primary font-medium">
        Sample Product {productId}
      </p>

      {/* Price + Old Price */}
      <div className="flex gap-2 items-center mt-1">
        <span className="text-primary font-semibold">$99.00</span>
        <span className="line-through text-secondary text-sm">$150.00</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-border h-2 rounded-full mt-2 overflow-hidden">
        <div className="bg-primary h-2 rounded-full w-3/5"></div>
      </div>

      {/* Sold Info */}
      <p className="text-xs text-muted mt-1">6/10 Sold</p>
    </div>
  );
}
