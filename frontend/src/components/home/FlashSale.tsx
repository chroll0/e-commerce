import ProductCard from "../product/ProductCard";

export default function FlashSale() {
  return (
    <section className="w-full max-w-7xl px-4 mt-10">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Flash Sale</h2>

        <div className="flex gap-2 text-red-600 font-bold">
          <span>08</span>:<span>17</span>:<span>56</span>
        </div>
      </div>

      {/* PRODUCT LIST */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
        {[1, 2, 3, 4, 5].map((id) => (
          <ProductCard key={id} productId={id} />
        ))}
      </div>
    </section>
  );
}
