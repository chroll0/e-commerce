import { useTranslations } from "next-intl";
import type { Locale, StoreApi } from "@/types";
import { StoreFilters, StoreProductGrid } from "@/components";

export type TranslationFn = ReturnType<typeof useTranslations>;

type StoreProductsSectionProps = {
  products?: StoreApi["products"];
  filterT: TranslationFn;
  locale: Locale;
  activeSearch: string;
  activeCategoryId: string;
  onFilterChange: (filters: { search: string; categoryId: string }) => void;
  onClearFilters: () => void;
  loading?: boolean;
};

export default function StoreProductsSection({
  products,
  filterT,
  locale,
  activeSearch,
  activeCategoryId,
  onFilterChange,
  onClearFilters,
  loading,
}: StoreProductsSectionProps) {
  return (
    <section className="border-b border-border pb-8">
      <StoreFilters
        initialSearch={activeSearch}
        initialCategoryId={activeCategoryId}
        locale={locale}
        filterT={filterT}
        onFilterChange={onFilterChange}
        onClearFilters={onClearFilters}
      />

      <StoreProductGrid
        products={products}
        filterT={filterT}
        loading={loading}
      />
    </section>
  );
}
