export default function BestStores() {
  return (
    <section className="w-full max-w-7xl px-4 mt-12 mb-16 mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-primary">
        Best Selling Store
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((store) => (
          <div
            key={store}
            className="bg-card shadow-[0_2px_12px_var(--color-shadow)] p-4 rounded-xl border border-border"
          >
            <div className="w-full h-20 bg-card-soft rounded border border-border"></div>
            <p className="mt-2 font-medium text-primary">Store #{store}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
