import {
  Breadcrumbs,
  CategorySubcategories,
  ProductSearchFilters,
} from "@/components";
import { getCategoryBySlug } from "@/lib/categoriesApi";

type Props = {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
};
export const dynamic = "force-dynamic";

export default async function Page({ params }: Props) {
  const { slug, locale } = await params;
  const category = await getCategoryBySlug(slug, locale);
  const categoryId = category?.id ? String(category.id) : "";
  const categoryName = category?.name ?? slug;
  const children = category?.children ?? [];
  const ancestors = category?.ancestors ?? [];

  return (
    <main className="w-full max-w-7xl px-4 mt-10 mx-auto">
      <Breadcrumbs
        items={[
          { label: "eShop", href: `/${locale}` },
          { label: "Category" },
          ...ancestors.map((a) => ({
            label: a.name,
            href: `/${locale}/category/${a.slug}`,
          })),
          { label: categoryName },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">{categoryName}</h1>
      </div>

      {children.length > 0 && (
        <CategorySubcategories
          categories={children}
          locale={locale}
          activeSlug={slug}
        />
      )}

      <ProductSearchFilters
        initialCategoryId={categoryId}
        keepCategoryOnClear
        syncCategoryWithRoute
        contextCategorySlug={slug}
      />
    </main>
  );
}
