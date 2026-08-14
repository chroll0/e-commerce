"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { Package } from "lucide-react";
import { Category } from "@/types";
import { getCategoriesClient } from "@/lib/categoriesApi";
import { CategoryScrollerSkeleton } from "@/components";

export default function CategoryScroller() {
  const locale = useLocale();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    getCategoriesClient(locale)
      .then((data) => {
        if (!active) return;
        setCategories(data ?? []);
      })
      .catch((err) => {
        if (!active) return;
        console.error("Failed to fetch categories:", err);
        setError("failed_to_load");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [locale]);

  const handleClick = (slug: string) => {
    router.push(`/${locale}/category/${slug}`);
  };

  if (loading) {
    return <CategoryScrollerSkeleton />;
  }

  if (error || !categories.length) {
    return null;
  }

  return (
    <section>
      <div className="my-10 flex gap-4 overflow-x-auto rounded-xl border border-border bg-card-soft p-3 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleClick(cat.slug)}
            className="flex min-w-20 flex-col items-center transition hover:opacity-80"
          >
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-border bg-card-soft">
              {cat.image ? (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  width={56}
                  height={56}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Package className="h-5.5 w-5.5 text-muted-foreground" />
              )}
            </div>

            <p className="mt-2 text-sm text-primary">{cat.name}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
