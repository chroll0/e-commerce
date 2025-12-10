export default function BestStores() {
  return (
    <section className="w-full max-w-7xl px-4 mt-12 mb-16">
      <h2 className="text-xl font-semibold mb-4">Best Selling Store</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((store) => (
          <div key={store} className="bg-white shadow-sm p-4 rounded-xl">
            <div className="w-full h-20 bg-gray-100 rounded"></div>
            <p className="mt-2 font-medium">Store #{store}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
