export default function CategoryScroller() {
  const categories = [
    { id: 1, name: "Electronics", icon: "/icons/electronics.svg" },
    { id: 2, name: "Fashion", icon: "/icons/fashion.svg" },
  ];

  return (
    <section className="w-full max-w-7xl px-4 mt-8 mx-auto">
      <div
        className="flex gap-8 overflow-x-auto no-scrollbar py-4 
                      bg-card-soft rounded-xl shadow-[0_2px_8px_var(--color-shadow)] border border-border"
      >
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex flex-col items-center min-w-20 cursor-pointer hover:opacity-80 transition"
          >
            <div className="w-14 h-14 rounded-full bg-card flex items-center justify-center border border-border">
              <img src={cat.icon} alt={cat.name} className="w-8 h-8" />
            </div>
            <p className="text-sm mt-2 text-primary">{cat.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
