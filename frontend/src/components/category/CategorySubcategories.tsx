import Image from "next/image";
import Link from "next/link";
import { Package } from "lucide-react";
import type { Category } from "@/types";

type Props = {
  categories: Category[];
  locale: string;
  activeSlug?: string;
};

export default function CategorySubcategories({
  categories,
  locale,
  activeSlug,
}: Props) {
  if (!categories.length) return null;

  return (
    <div className="mb-8">
      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => {
          const isActive = cat.slug === activeSlug;

          return (
            <Link
              key={cat.id}
              href={`/${locale}/category/${cat.slug}`}
              className="group shrink-0"
            >
              <div
                className={[
                  "flex w-24 flex-col items-center rounded-xl p-2",
                  "transition-all duration-200",
                  isActive ? "bg-primary/5" : "hover:bg-card-soft",
                ].join(" ")}
              >
                <div
                  className={[
                    "relative h-16 w-16 overflow-hidden rounded-full border-2",
                    "bg-card-soft transition-all duration-200",
                    isActive
                      ? "border-primary shadow-sm"
                      : "border-border group-hover:border-primary/40",
                  ].join(" ")}
                >
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="64px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Package className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <p
                  className={[
                    "mt-2 w-full truncate text-center text-xs",
                    "transition-colors duration-200",
                    isActive
                      ? "font-semibold text-primary"
                      : "font-medium text-secondary group-hover:text-primary",
                  ].join(" ")}
                >
                  {cat.name}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
