import ProductCard from "../product/ProductCard";

export default function FeaturedProducts() {
  return (
    <section className="w-full max-w-7xl px-4 mt-10 mx-auto">
      {/* TAB BUTTONS */}
      <div className="flex gap-4 border-b border-border pb-3">
        <button className="font-semibold text-primary">Best Seller</button>
        <button className="text-secondary hover:text-primary transition">
          Keep Stylish
        </button>
        <button className="text-secondary hover:text-primary transition">
          Special Discount
        </button>
      </div>

      {/* PRODUCTS */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-5">
        {[1, 2, 3, 4, 5].map((id) => (
          <ProductCard key={id} productId={id} />
        ))}
      </div>
    </section>
  );
}
