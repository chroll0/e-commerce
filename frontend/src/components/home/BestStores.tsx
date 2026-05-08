export default function BestStores() {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4 text-primary">
        Best Selling Store
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((store) => (
          <div
            key={store}
            className="group bg-card shadow-[0_2px_12px_var(--color-shadow)] p-4 rounded-xl border border-border transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_var(--color-shadow)] cursor-pointer"
          >
            {/* LOGO */}
            <div className="w-full h-20 bg-card-soft rounded-lg border border-border flex items-center justify-center overflow-hidden">
              <span className="text-xs text-muted">Store Logo</span>
            </div>

            {/* INFO */}
            <p className="mt-2 font-medium text-primary">Store #{store}</p>

            <div className="flex items-center gap-1 text-xs text-muted">
              ⭐ 4.8 <span>•</span> <span>120 sales</span>
            </div>

            {/* CTA */}
            <button className="mt-3 w-full text-xs font-medium py-2 rounded-lg bg-card-soft border border-border hover:bg-border transition">
              View Store
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
