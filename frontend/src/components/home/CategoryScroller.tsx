"use client";

import Image from "next/image";
import { Category } from "@/types";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { getCategoriesClient } from "@/lib/categoriesApi";
import { CategoryScrollerSkeleton } from "@/components";

export default function CategoryScroller() {
  const locale = useLocale();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    getCategoriesClient(locale)
      .then(setCategories)
      .finally(() => setLoading(false));
  }, [locale]);

  if (loading) {
    return <CategoryScrollerSkeleton />;
  }

  return (
    <section>
      <div className="flex gap-8 overflow-x-auto no-scrollbar p-3 bg-card-soft rounded-xl border border-border">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex flex-col items-center min-w-20 cursor-pointer hover:opacity-80 transition"
          >
            <div className="w-14 h-14 rounded-full overflow-hidden border border-border">
              {cat.image && (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  width={56}
                  height={56}
                  className="object-cover"
                />
              )}
            </div>

            <p className="text-sm mt-2 text-primary">{cat.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
