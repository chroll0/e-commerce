export default function CategoryScroller() {
  const categories = [
    // Sample categories; replace with API data later
    { id: 1, name: "Electronics", icon: "/icons/electronics.svg" },
    { id: 2, name: "Fashion", icon: "/icons/fashion.svg" },
  ];
  return (
    <section className="w-full max-w-7xl px-4 mt-8">
      <div className="flex gap-8 overflow-x-auto no-scrollbar py-3 bg-white rounded-xl shadow-sm">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex flex-col items-center min-w-20 cursor-pointer"
          >
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
              <img src={cat.icon} alt={cat.name} className="w-8 h-8" />
            </div>
            <p className="text-sm mt-2">{cat.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
